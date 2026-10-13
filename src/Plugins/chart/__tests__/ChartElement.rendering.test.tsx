import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import type { RenderElementProps } from 'slate-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const chartCalls = vi.hoisted(() => vi.fn());
const broadSlateSubscription = vi.hoisted(() => vi.fn(() => ({})));
const containerRef = { current: document.createElement('div') };
Object.defineProperty(containerRef.current, 'clientWidth', { value: 800 });
const editorContext = {
  store: { dragStart: vi.fn(), isLatestNode: () => true },
  readonly: true,
  markdownContainerRef: { current: document.createElement('div') },
  rootContainer: containerRef,
};

vi.mock('../../../MarkdownEditor/editor/store', () => ({
  useEditorStore: () => editorContext,
}));
vi.mock('slate-react', () => ({ useSlate: broadSlateSubscription }));
vi.mock('../../../MarkdownEditor/hooks/editor', () => ({
  useMEditor: () => [undefined, vi.fn()],
}));
vi.mock('../../../MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => null,
}));
vi.mock('../../../MarkdownEditor/editor/elements/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: React.PropsWithChildren) => children,
}));
vi.mock('../ChartRender', () => ({
  ChartRender: (props: { loading: boolean; columnLength: number }) => {
    chartCalls(props);
    return (
      <div
        data-testid="chart"
        data-loading={String(props.loading)}
        data-columns={props.columnLength}
      />
    );
  },
}));

import { ChartElement } from '../index';

const attributes = {
  'data-slate-node': 'element',
} as RenderElementProps['attributes'];
const makeElement = () =>
  ({
    type: 'chart',
    otherProps: {
      finished: false,
      dataSource: [{ name: 'A', value: 10 }],
      columns: [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Value', dataIndex: 'value' },
      ],
      config: [
        { chartType: 'bar', x: 'name', y: 'value' },
        { chartType: 'line', x: 'name', y: 'value' },
      ],
    },
    children: [],
  }) as RenderElementProps['element'];

class TestResizeObserver {
  static instances: TestResizeObserver[] = [];
  observed: Element | undefined;
  disconnected = false;
  constructor(readonly callback: ResizeObserverCallback) {
    TestResizeObserver.instances.push(this);
  }
  observe(target: Element) {
    this.observed = target;
  }
  disconnect() {
    this.disconnected = true;
  }
  emit() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

describe('ChartElement rendering', () => {
  beforeEach(() => {
    chartCalls.mockClear();
    broadSlateSubscription.mockClear();
    TestResizeObserver.instances = [];
    vi.stubGlobal('ResizeObserver', TestResizeObserver);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('forwards the measured element and unmount to Slate attributes.ref', () => {
    const slateRef = vi.fn();
    const { container, unmount } = render(
      <ChartElement
        attributes={{ ...attributes, ref: slateRef }}
        element={makeElement()}
      >
        <span />
      </ChartElement>,
    );
    expect(slateRef).toHaveBeenCalledWith(
      container.querySelector('[data-be="chart"]'),
    );
    unmount();
    expect(slateRef).toHaveBeenLastCalledWith(null);
  });

  it('updates Slate children without rebuilding unchanged chart content', () => {
    const element = makeElement();
    const { rerender } = render(
      <ChartElement attributes={attributes} element={element}>
        <span>first leaf</span>
      </ChartElement>,
    );
    const renderCount = chartCalls.mock.calls.length;
    rerender(
      <ChartElement attributes={attributes} element={element}>
        <span>updated leaf</span>
      </ChartElement>,
    );
    expect(screen.queryByText('first leaf')).not.toBeInTheDocument();
    expect(screen.getByText('updated leaf')).toBeInTheDocument();
    expect(chartCalls).toHaveBeenCalledTimes(renderCount);
    expect(broadSlateSubscription).not.toHaveBeenCalled();
  });

  it('clears loading when the same chart data finishes streaming', () => {
    const element = makeElement();
    const { rerender } = render(
      <ChartElement attributes={attributes} element={element}>
        <span />
      </ChartElement>,
    );
    expect(screen.getAllByTestId('chart')[0]).toHaveAttribute(
      'data-loading',
      'true',
    );
    rerender(
      <ChartElement
        attributes={attributes}
        element={{
          ...element,
          otherProps: { ...element.otherProps, finished: true },
        }}
      >
        <span />
      </ChartElement>,
    );
    expect(screen.getAllByTestId('chart')[0]).toHaveAttribute(
      'data-loading',
      'false',
    );
  });

  it('measures the actual chart container when it resizes without a window event', () => {
    const { container, unmount } = render(
      <ChartElement attributes={attributes} element={makeElement()}>
        <span />
      </ChartElement>,
    );
    const chartContainer = container.querySelector('[data-be="chart"]')!;
    const observer = TestResizeObserver.instances.at(-1)!;
    expect(observer.observed).toBe(chartContainer);
    expect(screen.getAllByTestId('chart')[0]).toHaveAttribute(
      'data-columns',
      '2',
    );
    Object.defineProperty(chartContainer, 'clientWidth', {
      configurable: true,
      value: 300,
    });
    act(() => {
      observer.emit();
    });
    expect(screen.getAllByTestId('chart')[0]).toHaveAttribute(
      'data-columns',
      '1',
    );
    expect(chartCalls.mock.lastCall?.[0].config.height).toBe(300);
    unmount();
    expect(observer.disconnected).toBe(true);
  });

  it('keeps a narrow container at one column and its actual height', () => {
    const { container } = render(
      <ChartElement attributes={attributes} element={makeElement()}>
        <span />
      </ChartElement>,
    );
    const chartContainer = container.querySelector('[data-be="chart"]')!;
    Object.defineProperty(chartContainer, 'clientWidth', {
      configurable: true,
      value: 180,
    });
    act(() => {
      TestResizeObserver.instances.at(-1)!.emit();
    });
    expect(screen.getAllByTestId('chart')[0]).toHaveAttribute(
      'data-columns',
      '1',
    );
    expect(chartCalls.mock.lastCall?.[0].config.height).toBe(180);
  });
});
