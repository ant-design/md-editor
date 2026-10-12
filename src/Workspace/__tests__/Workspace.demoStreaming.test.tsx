import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import WorkspaceDemo, {
  reportContent,
} from '../../../docs/demos/workspace-demo';
import WorkspaceRealtimeDemo from '../../../docs/demos/workspace-realtime-demo';

// Keep button wave/ripple timers out of the demo lifecycle assertions.
vi.mock('antd', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd')>();
  return {
    ...actual,
    Button: ({
      children,
      onClick,
      disabled,
    }: {
      children?: React.ReactNode;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
      disabled?: boolean;
    }) => (
      <button type="button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
  };
});

vi.mock('@ant-design/agentic-ui', () => {
  const Workspace = Object.assign(
    ({
      children,
      headerExtra,
    }: {
      children?: React.ReactNode;
      headerExtra?: React.ReactNode;
    }) => (
      <div>
        {headerExtra}
        {children}
      </div>
    ),
    {
      Realtime: ({ data }: { data: { type: string; content?: string } }) => (
        <div data-testid={`stream-${data.type}`}>{data.content}</div>
      ),
      Custom: ({ children }: { children?: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Task: () => null,
      Browser: () => null,
      File: () => null,
    },
  );
  return {
    Workspace,
    ActionIconBox: ({ children }: { children?: React.ReactNode }) => (
      <span>{children}</span>
    ),
  };
});

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('Workspace demo streaming', () => {
  it('captures each shell command before React executes queued state updates', () => {
    render(<WorkspaceRealtimeDemo />);
    fireEvent.click(screen.getByRole('button', { name: '重新演示' }));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByTestId('stream-shell').textContent).toBe(
      '```bash\n$ npm install @ant-design/agentic-ui\nadded 156 packages in 2.3s\n$ npm run build\nwebpack compiled successfully\n```',
    );
  });

  it('cancels all realtime demo timers before the HTML timeout fires', () => {
    const { unmount } = render(<WorkspaceRealtimeDemo />);
    fireEvent.click(screen.getByRole('button', { name: '重新演示' }));
    act(() => vi.advanceTimersByTime(500));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('shows a complete document without starting a timer on first render', () => {
    render(<WorkspaceDemo />);
    expect(screen.getByTestId('stream-md').textContent).toBe(reportContent);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('replays on demand and restores the same full document', () => {
    render(<WorkspaceDemo />);
    fireEvent.click(screen.getByRole('button', { name: '重新演示' }));
    act(() => vi.advanceTimersByTime(40));
    expect(screen.getByTestId('stream-md').textContent).toBe(
      reportContent.slice(0, 8),
    );
    act(() => vi.advanceTimersByTime(Math.ceil(reportContent.length / 8) * 40));
    expect(screen.getByTestId('stream-md').textContent).toBe(reportContent);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('can finish a replay immediately and stop its pending work', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    render(<WorkspaceDemo />);
    fireEvent.click(screen.getByRole('button', { name: '重新演示' }));
    const streamTimer = setIntervalSpy.mock.results[0].value;
    act(() => vi.advanceTimersByTime(80));
    fireEvent.click(screen.getByRole('button', { name: '显示完整结果' }));
    expect(screen.getByTestId('stream-md').textContent).toBe(reportContent);
    expect(clearIntervalSpy).toHaveBeenCalledWith(streamTimer);
  });

  it('stops the document stream immediately on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const { unmount } = render(<WorkspaceDemo />);
    fireEvent.click(screen.getByRole('button', { name: '重新演示' }));
    const streamTimer = setIntervalSpy.mock.results[0].value;
    act(() => vi.advanceTimersByTime(80));
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalledWith(streamTimer);
  });
});
