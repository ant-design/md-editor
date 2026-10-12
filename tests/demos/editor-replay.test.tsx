import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CodeDemo from '../../docs/demos/li-code';
import SameRenderDemo from '../../docs/demos/same-render';

const mocks = vi.hoisted(() => ({
  update: vi.fn(),
  parse: vi.fn((markdown: string) => ({ schema: [{ text: markdown }] })),
}));

vi.mock('@ant-design/agentic-ui', async () => {
  const React = await import('react');
  return {
    parserMarkdownToSlateNode: mocks.parse,
    parserMdToSchema: mocks.parse,
    MarkdownEditor: ({
      editorRef,
      initValue,
    }: {
      editorRef?: React.RefObject<unknown>;
      initValue?: string;
    }) => {
      React.useEffect(() => {
        if (!editorRef) return;
        editorRef.current = { store: { updateNodeList: mocks.update } };
        return () => {
          editorRef.current = null;
        };
      }, [editorRef]);
      return <pre data-testid="editor">{initValue}</pre>;
    },
  };
});

vi.mock('antd', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
  Space: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

describe('editor demo replay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('leaves the editable document untouched while idle and reapplies only on request', () => {
    render(<SameRenderDemo />);
    act(() => vi.advanceTimersByTime(5000));
    expect(mocks.update).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: '重新应用相同正文' }));
    expect(mocks.update).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(5000));
    expect(mocks.update).toHaveBeenCalledTimes(1);
  });

  it('shows complete code initially and finishes an explicitly requested replay', () => {
    render(<CodeDemo />);
    const initialContent = screen.getAllByTestId('editor')[0].textContent;
    expect(initialContent?.length).toBeGreaterThan(1000);
    expect(mocks.parse).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: '重新演示流式代码' }));
    act(() => vi.runAllTimers());
    expect(mocks.parse.mock.lastCall?.[0]).toBe(initialContent);
    expect(screen.getByRole('button', { name: '停止演示' })).toBeDisabled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('replaces a previous replay and stops future parsing immediately on cancellation', () => {
    render(<CodeDemo />);
    const replay = screen.getByRole('button', { name: '重新演示流式代码' });
    fireEvent.click(replay);
    fireEvent.click(replay);
    expect(mocks.update).toHaveBeenCalledTimes(2);
    act(() => vi.advanceTimersByTime(80));
    expect(mocks.update).toHaveBeenCalledTimes(3);
    fireEvent.click(screen.getByRole('button', { name: '停止演示' }));
    act(() => vi.advanceTimersByTime(1000));
    expect(mocks.update).toHaveBeenCalledTimes(3);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels scheduled code updates when the demo unmounts', () => {
    const view = render(<CodeDemo />);
    fireEvent.click(screen.getByRole('button', { name: '重新演示流式代码' }));
    expect(mocks.update).toHaveBeenCalledTimes(1);
    view.unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(mocks.update).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
