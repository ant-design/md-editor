import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ChartListDemo from '../../docs/demos/chart-list';
import DocCardsStreamingDemo from '../../docs/demos/charts/doc-cards/doc-cards-streaming';
import HistogramDemo from '../../docs/demos/charts/histogram/histogram';
import HistogramCustomBinsDemo from '../../docs/demos/charts/histogram/histogram-custom-bins';
import HistogramDarkDemo from '../../docs/demos/charts/histogram/histogram-dark';
import HistogramFrequencyDemo from '../../docs/demos/charts/histogram/histogram-frequency';
import HistogramMultiSeriesDemo from '../../docs/demos/charts/histogram/histogram-multi-series';
import HistogramWithFilterDemo from '../../docs/demos/charts/histogram/histogram-with-filter';
import QuadrantStreamingDemo from '../../docs/demos/charts/quadrant/quadrant-streaming';

interface ChartProps {
  columns?: unknown[];
  data?: { value?: number }[];
  width?: string | number;
}

const chartState = vi.hoisted(() => ({
  props: new Map<string, ChartProps>(),
}));

vi.mock('@ant-design/agentic-ui', () => {
  const chart = (name: string) => (props: ChartProps) => {
    chartState.props.set(name, props);
    return <div data-testid={name}>{props.data?.length ?? 0}</div>;
  };
  return {
    DocCards: chart('DocCards'),
    HistogramChart: chart('HistogramChart'),
    MarkdownEditor: chart('MarkdownEditor'),
    QuadrantChart: chart('QuadrantChart'),
  };
});

vi.mock('antd', () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
}));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  chartState.props.clear();
});

describe('chart demos', () => {
  it.each([
    ['基础', HistogramDemo, 200],
    ['自定义分箱', HistogramCustomBinsDemo, 500],
    ['暗色', HistogramDarkDemo, 200],
    ['频率', HistogramFrequencyDemo, 500],
    ['多系列', HistogramMultiSeriesDemo, 300],
    ['分类筛选', HistogramWithFilterDemo, 600],
  ] as const)('%s直方图在父级重渲染时保留样本', (_, Demo, count) => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    const { rerender } = render(<Demo />);
    const data = chartState.props.get('HistogramChart')?.data;
    const generatedCount = random.mock.calls.length;

    expect(data).toHaveLength(count);
    expect(data?.every((row) => Number.isFinite(row.value))).toBe(true);
    rerender(<Demo />);
    expect(chartState.props.get('HistogramChart')?.data).toBe(data);
    expect(random).toHaveBeenCalledTimes(generatedCount);
  });

  it.each([
    ['文档卡片', DocCardsStreamingDemo, 'DocCards', 6, 1200],
    ['象限', QuadrantStreamingDemo, 'QuadrantChart', 4, 1100],
  ] as const)(
    '%s流式演示完成后停止更新，并支持重播和卸载',
    (_, Demo, name, total, delay) => {
      vi.useFakeTimers();
      const { unmount } = render(
        <React.StrictMode>
          <Demo />
        </React.StrictMode>,
      );
      const columns = chartState.props.get(name)?.columns;
      const replay = screen.getByRole('button', { name: '重新播放' });
      expect(screen.getByTestId(name)).toHaveTextContent('1');
      expect(replay).toBeDisabled();

      for (let count = 2; count <= total; count += 1) {
        act(() => vi.advanceTimersByTime(delay));
        expect(screen.getByTestId(name)).toHaveTextContent(String(count));
        expect(chartState.props.get(name)?.columns).toBe(columns);
      }

      expect(replay).toBeEnabled();
      expect(vi.getTimerCount()).toBe(0);
      act(() => vi.advanceTimersByTime(delay * 10));
      expect(screen.getByTestId(name)).toHaveTextContent(String(total));

      fireEvent.click(replay);
      expect(screen.getByTestId(name)).toHaveTextContent('1');
      expect(vi.getTimerCount()).toBe(1);
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it('图表集合宽度跟随演示容器', () => {
    render(<ChartListDemo />);
    expect(chartState.props.get('MarkdownEditor')?.width).toBe('100%');
  });
});
