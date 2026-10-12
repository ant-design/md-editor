import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MarkdownEditorProps } from '../../../MarkdownEditor';

const mocks = vi.hoisted(() => ({
  parse: vi.fn(() => ({ schema: [{ type: 'paragraph' }] })),
  updateNodeList: vi.fn(),
  scrollToBottom: vi.fn(),
  editor: vi.fn(),
}));

vi.mock('../../../MarkdownEditor', () => ({
  MarkdownEditor: (props: MarkdownEditorProps) => {
    mocks.editor(props);
    React.useImperativeHandle(
      props.editorRef,
      () =>
        ({
          store: { plugins: [], updateNodeList: mocks.updateNodeList },
        }) as never,
    );
    return <div data-testid="document">{props.initValue}</div>;
  },
}));

vi.mock('../../../MarkdownEditor/editor/parser/parserMdToSchema', () => ({
  parserMdToSchema: mocks.parse,
}));
vi.mock('../../../Hooks/useAutoScroll', () => ({
  default: () => ({
    containerRef: React.useRef(null),
    scrollToBottom: mocks.scrollToBottom,
  }),
}));
vi.mock('../style', () => ({
  useRealtimeFollowStyle: () => ({ hashId: '' }),
}));

import { RealtimeFollow } from '../index';

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.clearAllMocks();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('RealtimeFollow rendering', () => {
  it('updates readonly streaming through the lightweight view once, without forcing scroll', () => {
    const { rerender } = render(
      <RealtimeFollow
        data={{ type: 'markdown', content: '# Draft', streaming: true }}
      />,
    );
    expect(mocks.editor.mock.lastCall?.[0]).toMatchObject({
      renderMode: 'markdown',
      readonly: true,
      initValue: '# Draft',
    });

    rerender(
      <RealtimeFollow
        data={{ type: 'markdown', content: '# Finished', streaming: true }}
      />,
    );
    expect(screen.getByTestId('document')).toHaveTextContent('# Finished');
    act(() => vi.advanceTimersByTime(500));
    expect(mocks.parse).not.toHaveBeenCalled();
    expect(mocks.updateNodeList).not.toHaveBeenCalled();
    expect(mocks.scrollToBottom).not.toHaveBeenCalled();
  });

  it('keeps the default readonly content at natural height inside the realtime scroller', () => {
    const { rerender } = render(
      <RealtimeFollow data={{ type: 'markdown', content: 'Long document' }} />,
    );
    expect(mocks.editor.mock.lastCall?.[0]).toMatchObject({
      height: 'auto',
      style: { maxHeight: 'none' },
      contentStyle: { height: 'auto', maxHeight: 'none' },
    });

    rerender(
      <RealtimeFollow
        data={{
          type: 'markdown',
          content: 'Long document',
          markdownEditorProps: {
            height: 320,
            style: { maxHeight: 400 },
            contentStyle: { height: 280, maxHeight: 300 },
          },
        }}
      />,
    );
    expect(mocks.editor.mock.lastCall?.[0]).toMatchObject({
      height: 320,
      style: { maxHeight: 400 },
      contentStyle: { height: 280, maxHeight: 300 },
    });

    rerender(
      <RealtimeFollow
        data={{
          type: 'markdown',
          content: 'Slate document',
          markdownEditorProps: { renderMode: 'slate' },
        }}
      />,
    );
    expect(mocks.editor.mock.lastCall?.[0].height).toBe('100%');
    expect(mocks.editor.mock.lastCall?.[0].style.maxHeight).toBeUndefined();

    rerender(
      <RealtimeFollow
        data={{
          type: 'markdown',
          content: 'Editable document',
          markdownEditorProps: { readonly: false },
        }}
      />,
    );
    expect(mocks.editor.mock.lastCall?.[0].height).toBe('100%');
  });

  it('preserves the explicit Slate renderType and editable content synchronization', () => {
    const { rerender } = render(
      <RealtimeFollow
        data={{
          type: 'markdown',
          content: 'first',
          markdownEditorProps: { renderType: 'slate' },
        }}
      />,
    );
    expect(mocks.editor.mock.lastCall?.[0].renderMode).toBe('slate');
    expect(mocks.parse).not.toHaveBeenCalled();

    rerender(
      <RealtimeFollow
        data={{
          type: 'markdown',
          content: 'editable',
          markdownEditorProps: { readonly: false },
        }}
      />,
    );
    expect(mocks.parse).toHaveBeenCalledWith('editable', []);
    expect(mocks.updateNodeList).toHaveBeenCalledTimes(1);
  });

  it('does not render empty or error callbacks while content is loading', () => {
    const emptyRender = vi.fn();
    const errorRender = vi.fn();
    const loadingRender = vi.fn(() => 'Loading document');
    render(
      <RealtimeFollow
        data={{
          type: 'markdown',
          content: 'partial',
          status: 'loading',
          emptyRender,
          errorRender,
          loadingRender,
        }}
      />,
    );
    expect(screen.getByText('Loading document')).toBeInTheDocument();
    expect(loadingRender).toHaveBeenCalledTimes(1);
    expect(emptyRender).not.toHaveBeenCalled();
    expect(errorRender).not.toHaveBeenCalled();
  });

  it('renders missing content as an empty document during loading', () => {
    render(<RealtimeFollow data={{ type: 'shell', status: 'loading' }} />);
    expect(screen.getByTestId('document')).toBeEmptyDOMElement();
  });
});
