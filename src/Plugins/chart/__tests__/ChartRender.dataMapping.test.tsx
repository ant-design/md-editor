import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChartRender } from '../ChartRender';

const runtimeCalls = vi.hoisted(() => ({
  barData: [] as any[][],
  radarData: [] as any[][],
  barMounts: 0,
  barUnmounts: 0,
}));

vi.mock('../../../Hooks/useIntersectionOnce', () => ({
  useIntersectionOnce: () => true,
}));

const createRuntimeChart =
  (testId: string, calls: any[][]) => (props: { data: any[] }) => {
    calls.push(props.data);
    React.useEffect(() => {
      if (testId !== 'bar-chart') return;
      runtimeCalls.barMounts += 1;
      return () => {
        runtimeCalls.barUnmounts += 1;
      };
    }, []);
    return <div data-testid={testId} />;
  };

const createUnusedRuntimeChart = (testId: string) => () => (
  <div data-testid={testId} />
);

vi.mock('../loadChartRuntime', () => ({
  loadChartRuntime: vi.fn(async () => ({
    AreaChart: createUnusedRuntimeChart('area-chart'),
    BarChart: createRuntimeChart('bar-chart', runtimeCalls.barData),
    BoxPlotChart: createUnusedRuntimeChart('boxplot-chart'),
    DonutChart: createUnusedRuntimeChart('donut-chart'),
    FunnelChart: createUnusedRuntimeChart('funnel-chart'),
    HistogramChart: createUnusedRuntimeChart('histogram-chart'),
    LineChart: createUnusedRuntimeChart('line-chart'),
    RadarChart: createRuntimeChart('radar-chart', runtimeCalls.radarData),
    ScatterChart: createUnusedRuntimeChart('scatter-chart'),
  })),
}));

describe('ChartRender data mapping', () => {
  const baseProps = {
    chartData: [] as Record<string, unknown>[],
    columnLength: 3,
    config: {
      columns: [
        { title: 'Stage', dataIndex: 'stage' },
        { title: 'Value', dataIndex: 'value' },
      ],
      height: 300,
      rest: {},
      x: 'stage',
      y: 'value',
    },
    isChartList: false,
    node: {},
    onColumnLengthChange: vi.fn(),
    title: 'Data Mapping Chart',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    runtimeCalls.barData.length = 0;
    runtimeCalls.radarData.length = 0;
    runtimeCalls.barMounts = 0;
    runtimeCalls.barUnmounts = 0;
    process.env.NODE_ENV = 'test-chart';
    Object.defineProperty(window, 'notRenderChart', {
      configurable: true,
      value: false,
      writable: true,
    });
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
    vi.restoreAllMocks();
  });

  it('maps escaped explicit sortBy fields into runtime flat data', async () => {
    render(
      <ChartRender
        {...baseProps}
        chartType="bar"
        chartData={[
          { stage: 'Mar', value: '100', sort_order: '2' },
          { stage: 'Jan', value: '80', sort_order: '1' },
          { stage: 'Feb', value: '90', sort_order: '' },
        ]}
        config={{
          ...baseProps.config,
          sortBy: 'sort\\_order',
        }}
      />,
    );

    await screen.findByTestId('bar-chart');

    await waitFor(() => {
      expect(runtimeCalls.barData.at(-1)).toEqual([
        {
          sortBy: 2,
          x: 'Mar',
          xtitle: 'Stage',
          y: '100',
          ytitle: 'Value',
        },
        {
          sortBy: 1,
          x: 'Jan',
          xtitle: 'Stage',
          y: '80',
          ytitle: 'Value',
        },
        {
          x: 'Feb',
          xtitle: 'Stage',
          y: '90',
          ytitle: 'Value',
        },
      ]);
    });
  });

  it('auto-detects index as the runtime sort key when sortBy is omitted', async () => {
    render(
      <ChartRender
        {...baseProps}
        chartType="bar"
        chartData={[
          { stage: 'Second', value: 20, index: 2 },
          { stage: 'First', value: 10, index: 1 },
        ]}
      />,
    );

    await screen.findByTestId('bar-chart');

    await waitFor(() => {
      expect(runtimeCalls.barData.at(-1)?.map((item) => item.sortBy)).toEqual([
        2, 1,
      ]);
    });
  });

  it('passes radar runtime data with x and y fields', async () => {
    render(
      <ChartRender
        {...baseProps}
        chartType="radar"
        groupBy="category"
        colorLegend="type"
        filterBy="filter"
        chartData={[
          {
            category: 'Product',
            filter: 'Shown',
            name: 'Coverage',
            type: 'Actual',
            value: '95',
          },
          { name: '', value: '', category: 'Fallback' },
        ]}
        config={{
          ...baseProps.config,
          columns: [
            { title: 'Name', dataIndex: 'name' },
            { title: 'Value', dataIndex: 'value' },
          ],
          x: 'name',
          y: 'value',
        }}
      />,
    );

    await screen.findByTestId('radar-chart');

    await waitFor(() => {
      expect(runtimeCalls.radarData.at(-1)).toEqual([
        {
          category: 'Product',
          filterLabel: 'Shown',
          type: 'Actual',
          x: 'Coverage',
          y: 95,
        },
        {
          category: 'Fallback',
          x: '2',
          y: 0,
        },
      ]);
    });
  });
  it('updates a cell value without changing the row count or field names', async () => {
    const { rerender } = render(
      <ChartRender
        {...baseProps}
        chartType="bar"
        chartData={[{ stage: 'A', value: 10 }]}
      />,
    );
    await screen.findByTestId('bar-chart');
    expect(runtimeCalls.barData.at(-1)?.[0].y).toBe(10);

    rerender(
      <ChartRender
        {...baseProps}
        chartType="bar"
        chartData={[{ stage: 'A', value: 35 }]}
      />,
    );
    expect(runtimeCalls.barData.at(-1)?.[0].y).toBe(35);
  });

  it('uses updated axis fields and column titles from the parent configuration', async () => {
    const chartData = [{ stage: 'A', value: 10, revised: 45 }];
    const { rerender } = render(
      <ChartRender {...baseProps} chartType="bar" chartData={chartData} />,
    );
    await screen.findByTestId('bar-chart');

    rerender(
      <ChartRender
        {...baseProps}
        chartType="bar"
        chartData={chartData}
        config={{
          ...baseProps.config,
          y: 'revised',
          columns: [
            { title: 'Updated stage', dataIndex: 'stage' },
            { title: 'Revised value', dataIndex: 'revised' },
          ],
        }}
      />,
    );
    await waitFor(() => {
      expect(runtimeCalls.barData.at(-1)?.[0]).toMatchObject({
        x: 'A',
        y: 45,
        xtitle: 'Updated stage',
        ytitle: 'Revised value',
      });
    });
  });

  it('updates axis labels when only column titles change', async () => {
    const chartData = [{ stage: 'A', value: 10 }];
    const { rerender } = render(
      <ChartRender {...baseProps} chartType="bar" chartData={chartData} />,
    );
    await screen.findByTestId('bar-chart');
    rerender(
      <ChartRender
        {...baseProps}
        chartType="bar"
        chartData={chartData}
        config={{
          ...baseProps.config,
          columns: [
            { title: 'Renamed stage', dataIndex: 'stage' },
            { title: 'Renamed value', dataIndex: 'value' },
          ],
        }}
      />,
    );
    await waitFor(() =>
      expect(runtimeCalls.barData.at(-1)?.[0]).toMatchObject({
        xtitle: 'Renamed stage',
        ytitle: 'Renamed value',
      }),
    );
  });

  it('keeps the runtime mounted after streaming updates settle', async () => {
    const { rerender } = render(
      <ChartRender
        {...baseProps}
        chartType="bar"
        chartData={[{ stage: 'A', value: 10 }]}
      />,
    );
    await screen.findByTestId('bar-chart');
    expect(runtimeCalls.barMounts).toBe(1);
    vi.useFakeTimers();
    rerender(
      <ChartRender
        {...baseProps}
        chartType="bar"
        chartData={[
          { stage: 'A', value: 10 },
          { stage: 'B', value: 20 },
        ]}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(runtimeCalls.barData.at(-1)).toHaveLength(2);
    expect(runtimeCalls.barMounts).toBe(1);
    expect(runtimeCalls.barUnmounts).toBe(0);
    vi.useRealTimers();
  });
});
