import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LazyRenderDemo from '../../docs/demos/lazy-render-demo';
import {
  ForceLoadPlaceholder,
  scrollToAndLoadParagraph,
} from '../../docs/demos/lazy-render-pdf-jump-utils';
import MarkdownStreamingDemo from '../../docs/demos/markdown-renderer-streaming';
import SetMDContentDemo, {
  generateVeryLongContent,
} from '../../docs/demos/setmd-content-demo';
import ToolThinkDemo from '../../docs/demos/tool-use-bar-think-playground';

const store = vi.hoisted(() => ({
  setMDContent: vi.fn(),
  cancelSetMDContent: vi.fn(),
}));

vi.mock('@ant-design/agentic-ui', () => ({
  BaseMarkdownEditor: ({
    editorRef,
    initValue,
  }: {
    editorRef?: React.Ref<{ store: typeof store }>;
    initValue?: string;
  }) => {
    React.useImperativeHandle(editorRef, () => ({ store }), []);
    return <div data-testid="editor">{initValue}</div>;
  },
  MarkdownRenderer: ({ content }: { content: string }) => (
    <div data-testid="markdown">{content}</div>
  ),
  ToolUseBarThink: ({ thinkContent }: { thinkContent: string }) => (
    <div data-testid="think">{thinkContent}</div>
  ),
}));

vi.mock('antd', () => {
  const Container = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  );
  return {
    Button: ({
      children,
      onClick,
      disabled,
    }: React.ComponentProps<'button'>) => (
      <button type="button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
    Card: Container,
    Space: Container,
    Tag: Container,
    Divider: () => null,
    Typography: { Title: Container, Paragraph: Container, Text: Container },
    Progress: ({ percent }: { percent: number }) => (
      <div role="progressbar" aria-valuenow={percent} />
    ),
    Switch: ({
      checked,
      onChange,
    }: {
      checked: boolean;
      onChange: (checked: boolean) => void;
    }) => (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      />
    ),
    Input: ({ value, onChange }: React.ComponentProps<'input'>) => (
      <input value={value} onChange={onChange} />
    ),
    InputNumber: () => <input type="number" />,
    Select: () => <select />,
  };
});

let nextFrameId = 1;
const frames = new Map<number, FrameRequestCallback>();

const flushFrame = () => {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(performance.now()));
};
const finishGeneration = async () => {
  await act(async () => {
    for (let step = 0; frames.size && step < 20; step++) flushFrame();
    await Promise.resolve();
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  frames.clear();
  nextFrameId = 1;
  store.setMDContent.mockReset();
  store.cancelSetMDContent.mockReset();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = nextFrameId++;
    frames.set(id, callback);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
});
afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('editor demo loading lifecycle', () => {
  it('cancels generated content before it can reach the editor', async () => {
    render(<SetMDContentDemo />);
    expect(frames.size).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: '使用优化加载' }));
    act(flushFrame);
    fireEvent.click(screen.getByRole('button', { name: '取消加载' }));
    await finishGeneration();
    expect(frames.size).toBe(0);
    expect(store.setMDContent).not.toHaveBeenCalled();
    expect(store.cancelSetMDContent).toHaveBeenCalledOnce();
    expect(
      screen.getByRole('button', { name: '使用优化加载' }),
    ).not.toBeDisabled();
  });

  it('does not let a cancelled load finish the following operation', async () => {
    let finishOld: (() => void) | undefined;
    let finishCurrent: (() => void) | undefined;
    store.setMDContent
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            finishOld = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            finishCurrent = resolve;
          }),
      );
    render(<SetMDContentDemo />);
    fireEvent.click(screen.getByRole('button', { name: '使用优化加载' }));
    await finishGeneration();
    expect(store.setMDContent).toHaveBeenCalledTimes(1);
    const oldProgress = store.setMDContent.mock.calls[0][2].onProgress;
    fireEvent.click(screen.getByRole('button', { name: '取消加载' }));
    fireEvent.click(screen.getByRole('button', { name: '使用优化加载' }));
    await finishGeneration();
    expect(store.setMDContent).toHaveBeenCalledTimes(2);
    await act(async () => {
      oldProgress(1);
      finishOld?.();
    });
    expect(screen.getByRole('button', { name: '使用优化加载' })).toBeDisabled();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
    await act(async () => finishCurrent?.());
    expect(
      screen.getByRole('button', { name: '使用优化加载' }),
    ).not.toBeDisabled();
  });

  it('stops generation and editor work when unmounted', async () => {
    const { unmount } = render(<SetMDContentDemo />);
    fireEvent.click(screen.getByRole('button', { name: '使用优化加载' }));
    unmount();
    await finishGeneration();
    expect(frames.size).toBe(0);
    expect(store.setMDContent).not.toHaveBeenCalled();
    expect(store.cancelSetMDContent).toHaveBeenCalledOnce();
  });

  it('generates a complete bounded document and rejects aborted work', async () => {
    const controller = new AbortController();
    const content = generateVeryLongContent(controller.signal);
    await finishGeneration();
    await expect(content).resolves.toContain('# 第 200 章');
    await expect(content).resolves.not.toContain('# 第 201 章');
    const cancelledController = new AbortController();
    const cancelled = generateVeryLongContent(cancelledController.signal);
    const rejection = expect(cancelled).rejects.toMatchObject({
      name: 'AbortError',
    });
    cancelledController.abort();
    await rejection;
    expect(frames.size).toBe(0);
  });

  it('keeps only the latest rendering measurement and cancels it on unmount', () => {
    const { unmount } = render(<LazyRenderDemo />);
    const originalContent = screen.getByTestId('editor').textContent;
    fireEvent.click(screen.getByRole('switch'));
    fireEvent.click(screen.getByRole('switch'));
    expect(frames.size).toBe(1);
    expect(screen.getByTestId('editor').textContent).toBe(originalContent);
    unmount();
    expect(frames.size).toBe(0);
  });
});

const createParagraph = (container: HTMLElement, id: string) => {
  const paragraph = document.createElement('div');
  paragraph.dataset.contentId = id;
  paragraph.dataset.placeholder = 'true';
  container.append(paragraph);
  return paragraph;
};
const createScrollContainer = () => {
  const container = document.createElement('div');
  container.scrollTo = vi.fn();
  document.body.append(container);
  return container;
};

describe('PDF jump demo operations', () => {
  it('targets the requested demo when multiple demos contain the same paragraph', () => {
    const other = createScrollContainer();
    const current = createScrollContainer();
    const otherTarget = createParagraph(other, 'para-1');
    const currentTarget = createParagraph(current, 'para-1');
    const otherLoad = vi.fn();
    const currentLoad = vi.fn();
    otherTarget.addEventListener('forceLoad', otherLoad);
    currentTarget.addEventListener('forceLoad', currentLoad);
    expect(
      scrollToAndLoadParagraph('para-1', {
        containerRef: { current },
        enableScrollJitter: false,
      }),
    ).toBe(true);
    vi.runAllTimers();
    expect(currentLoad).toHaveBeenCalledOnce();
    expect(otherLoad).not.toHaveBeenCalled();
  });

  it('cancels a pending earlier paragraph jump when another paragraph is selected', () => {
    const container = createScrollContainer();
    const first = createParagraph(container, 'para-1');
    const second = createParagraph(container, 'para-2');
    const firstLoad = vi.fn();
    const secondLoad = vi.fn();
    first.addEventListener('forceLoad', firstLoad);
    second.addEventListener('forceLoad', secondLoad);
    scrollToAndLoadParagraph('para-1', {
      containerRef: { current: container },
    });
    scrollToAndLoadParagraph('para-2', {
      containerRef: { current: container },
      enableScrollJitter: false,
    });
    vi.runAllTimers();
    expect(firstLoad).not.toHaveBeenCalled();
    expect(secondLoad).toHaveBeenCalledOnce();
    expect(container.scrollTo).toHaveBeenCalledTimes(2);
  });

  it('clears loading and jitter timers when its owner aborts', () => {
    const container = createScrollContainer();
    createParagraph(container, 'para-1');
    const controller = new AbortController();
    const onLoad = vi.fn();
    scrollToAndLoadParagraph('para-1', {
      containerRef: { current: container },
      signal: controller.signal,
      onLoad,
    });
    controller.abort();
    expect(vi.getTimerCount()).toBe(0);
    vi.runAllTimers();
    expect(onLoad).not.toHaveBeenCalled();
    expect(container.scrollTo).toHaveBeenCalledOnce();
  });

  it('does not dispatch delayed work to detached content', () => {
    const container = createScrollContainer();
    const paragraph = createParagraph(container, 'para-1');
    const onLoad = vi.fn();
    scrollToAndLoadParagraph('para-1', {
      containerRef: { current: container },
      onLoad,
    });
    paragraph.remove();
    vi.runAllTimers();
    expect(onLoad).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('replaces a placeholder loading timer and clears it when unmounted', () => {
    const { container, unmount } = render(
      <ForceLoadPlaceholder
        paragraphId="para-1"
        paragraphIndex={0}
        height={120}
        isIntersecting={false}
        style={{}}
      />,
    );
    const placeholder = container.querySelector('[data-content-id]')!;
    act(() => {
      placeholder.dispatchEvent(
        new CustomEvent('forceLoad', { detail: { paragraphId: 'para-1' } }),
      );
      placeholder.dispatchEvent(
        new CustomEvent('forceLoad', { detail: { paragraphId: 'para-1' } }),
      );
    });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('streaming playground lifecycle', () => {
  it('shows complete Markdown initially and restarts only one stream on replay', () => {
    const { unmount } = render(<MarkdownStreamingDemo />);
    const complete = screen.getByTestId('markdown').textContent;
    expect(complete).toContain('| 选项 | 含义 |');
    expect(vi.getTimerCount()).toBe(0);
    const replay = screen.getByRole('button', { name: '重新播放' });
    fireEvent.click(replay);
    act(() => vi.advanceTimersByTime(80));
    expect(screen.getByTestId('markdown').textContent!.length).toBeLessThan(
      complete!.length,
    );
    fireEvent.click(replay);
    expect(screen.getByTestId('markdown').textContent).toBe('');
    expect(vi.getTimerCount()).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: '显示完整结果' }));
    expect(screen.getByTestId('markdown').textContent).toBe(complete);
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(replay);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps a single ToolUseBarThink stream and resets when the source changes', () => {
    const { unmount } = render(<ToolThinkDemo />);
    expect(screen.getAllByTestId('think')[0].textContent).toContain(
      '优化建议汇总',
    );
    expect(vi.getTimerCount()).toBe(0);
    const replay = screen.getByRole('button', { name: '重放流式输出' });
    fireEvent.click(replay);
    act(() => vi.advanceTimersByTime(160));
    fireEvent.click(replay);
    expect(screen.getAllByTestId('think')[0].textContent).toBe('');
    expect(vi.getTimerCount()).toBe(1);
    fireEvent.click(screen.getAllByRole('switch')[1]);
    act(() => vi.advanceTimersByTime(80));
    expect(screen.getAllByTestId('think')[0].textContent).toContain('（示例）');
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
