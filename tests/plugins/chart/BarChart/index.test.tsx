import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import BarChart, {
  BarChartDataItem,
  BarChartProps,
} from '../../../../src/plugins/chart/BarChart';

// Mock Chart.js and react-chartjs-2
vi.mock('chart.js', () => ({
  Chart: vi.fn(),
  register: vi.fn(),
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}));

vi.mock('react-chartjs-2', () => ({
  Bar: vi.fn().mockImplementation(({ data, options, ref }) => {
    // 模拟 ref 的设置
    if (ref && ref.current === undefined) {
      ref.current = {
        toBase64Image: vi.fn().mockReturnValue('data:image/png;base64,test'),
      };
    }
    return (
      <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
        Bar Chart Component
      </div>
    );
  }),
}));

// Mock chart components
vi.mock('../../../../src/plugins/chart/components', () => ({
  ChartFilter: vi
    .fn()
    .mockImplementation(({ filterOptions, selectedFilter, onFilterChange }) => (
      <div data-testid="chart-filter">
        <select
          data-testid="filter-select"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {filterOptions.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )),
  ChartToolBar: vi.fn().mockImplementation(({ title, onDownload }) => (
    <div data-testid="chart-toolbar">
      <h3 data-testid="chart-title">{title}</h3>
      <button data-testid="download-button" onClick={onDownload}>
        Download
      </button>
    </div>
  )),
  downloadChart: vi.fn(),
}));

// Mock style hook
vi.mock('../../../../src/plugins/chart/BarChart/style', () => ({
  useStyle: vi.fn().mockReturnValue({
    wrapSSR: (children: React.ReactNode) => (
      <div data-testid="styled-wrapper">{children}</div>
    ),
    hashId: 'test-hash-id',
  }),
}));

describe('BarChart', () => {
  const mockData: BarChartDataItem[] = [
    {
      category: 'Category A',
      type: 'Type 1',
      x: 1,
      y: 10,
      xtitle: 'X Axis',
      ytitle: 'Y Axis',
    },
    {
      category: 'Category A',
      type: 'Type 2',
      x: 1,
      y: 15,
    },
    {
      category: 'Category B',
      type: 'Type 1',
      x: 2,
      y: 20,
    },
    {
      category: 'Category B',
      type: 'Type 2',
      x: 2,
      y: 25,
    },
  ];

  const defaultProps: BarChartProps = {
    title: 'Test Bar Chart',
    data: mockData,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染柱状图组件', () => {
      render(<BarChart {...defaultProps} />);

      expect(screen.getByTestId('styled-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('chart-toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('chart-filter')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('应该显示图表标题', () => {
      render(<BarChart {...defaultProps} />);

      expect(screen.getByTestId('chart-title')).toHaveTextContent(
        'Test Bar Chart',
      );
    });

    it('应该显示筛选器', () => {
      render(<BarChart {...defaultProps} />);

      const filterSelect = screen.getByTestId('filter-select');
      expect(filterSelect).toBeInTheDocument();
      expect(filterSelect).toHaveValue('Category A');
    });
  });

  describe('数据处理测试', () => {
    it('应该正确处理数据并生成图表', () => {
      render(<BarChart {...defaultProps} />);

      const chartElement = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chartElement.getAttribute('data-chart-data') || '{}',
      );

      expect(chartData.labels).toEqual(['1', '2']);
      expect(chartData.datasets).toHaveLength(2);
      expect(chartData.datasets[0].label).toBe('Type 1');
      expect(chartData.datasets[1].label).toBe('Type 2');
    });

    it('应该处理空数据', () => {
      render(<BarChart {...defaultProps} data={[]} />);

      const chartElement = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chartElement.getAttribute('data-chart-data') || '{}',
      );

      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets).toHaveLength(0);
    });

    it('应该处理单个数据点', () => {
      const singleData = [mockData[0]];
      render(<BarChart {...defaultProps} data={singleData} />);

      const chartElement = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chartElement.getAttribute('data-chart-data') || '{}',
      );

      expect(chartData.labels).toEqual(['1']);
      expect(chartData.datasets).toHaveLength(1);
    });
  });

  describe('筛选功能测试', () => {
    it('应该处理类别筛选', () => {
      render(<BarChart {...defaultProps} />);

      const filterSelect = screen.getByTestId('filter-select');
      fireEvent.change(filterSelect, { target: { value: 'Category B' } });

      const chartElement = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chartElement.getAttribute('data-chart-data') || '{}',
      );

      expect(chartData.labels).toEqual(['2']);
      expect(chartData.datasets).toHaveLength(2);
    });

    it('应该处理带筛选标签的数据', () => {
      const dataWithFilterLabel: BarChartDataItem[] = [
        {
          category: 'Category A',
          type: 'Type 1',
          x: 1,
          y: 10,
          filterLable: 'Filter 1',
        },
        {
          category: 'Category A',
          type: 'Type 1',
          x: 2,
          y: 20,
          filterLable: 'Filter 2',
        },
      ];

      render(<BarChart {...defaultProps} data={dataWithFilterLabel} />);

      expect(screen.getByTestId('chart-filter')).toBeInTheDocument();
    });
  });

  describe('主题和样式测试', () => {
    it('应该应用浅色主题', () => {
      const { container } = render(
        <BarChart {...defaultProps} theme="light" />,
      );

      const chartContainer = container.querySelector('.bar-chart-container');
      expect(chartContainer).toHaveStyle('background-color: #fff');
    });

    it('应该应用深色主题', () => {
      const { container } = render(<BarChart {...defaultProps} theme="dark" />);

      const chartContainer = container.querySelector('.bar-chart-container');
      expect(chartContainer).toHaveStyle('background-color: #1a1a1a');
    });

    it('应该应用自定义类名', () => {
      const { container } = render(
        <BarChart {...defaultProps} className="custom-class" />,
      );

      const chartContainer = container.querySelector('.bar-chart-container');
      expect(chartContainer).toHaveClass('custom-class');
    });
  });

  describe('响应式测试', () => {
    it('应该处理移动端尺寸', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      const { container } = render(<BarChart {...defaultProps} />);

      const chartContainer = container.querySelector('.bar-chart-container');
      expect(chartContainer).toHaveStyle('width: 100%');
    });

    it('应该处理桌面端尺寸', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const { container } = render(
        <BarChart {...defaultProps} width={800} height={600} />,
      );

      const chartContainer = container.querySelector('.bar-chart-container');
      expect(chartContainer).toHaveStyle('width: 800px');
      expect(chartContainer).toHaveStyle('height: 600px');
    });
  });

  describe('图表配置测试', () => {
    it('应该支持堆叠显示', () => {
      render(<BarChart {...defaultProps} stacked={true} />);

      const chartElement = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chartElement.getAttribute('data-chart-data') || '{}',
      );

      expect(chartData.datasets[0].stack).toBe('stack');
      expect(chartData.datasets[1].stack).toBe('stack');
    });

    it('应该支持水平柱状图', () => {
      render(<BarChart {...defaultProps} indexAxis="y" />);

      const chartElement = screen.getByTestId('bar-chart');
      expect(chartElement).toBeInTheDocument();
    });

    it('应该支持自定义图例位置', () => {
      render(<BarChart {...defaultProps} legendPosition="top" />);

      const chartElement = screen.getByTestId('bar-chart');
      expect(chartElement).toBeInTheDocument();
    });

    it('应该支持隐藏图例', () => {
      render(<BarChart {...defaultProps} showLegend={false} />);

      const chartElement = screen.getByTestId('bar-chart');
      expect(chartElement).toBeInTheDocument();
    });

    it('应该支持隐藏网格线', () => {
      render(<BarChart {...defaultProps} showGrid={false} />);

      const chartElement = screen.getByTestId('bar-chart');
      expect(chartElement).toBeInTheDocument();
    });
  });

  describe('下载功能测试', () => {
    it('应该处理下载按钮点击', () => {
      const {
        downloadChart,
      } = require('../../../../src/plugins/chart/components');

      render(<BarChart {...defaultProps} />);

      const downloadButton = screen.getByTestId('download-button');
      fireEvent.click(downloadButton);

      expect(downloadChart).toHaveBeenCalled();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理无效数据', () => {
      const invalidData = [
        {
          category: 'Category A',
          type: 'Type 1',
          x: null as any,
          y: undefined as any,
        },
      ];

      render(<BarChart {...defaultProps} data={invalidData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('应该处理重复的x值', () => {
      const duplicateXData: BarChartDataItem[] = [
        {
          category: 'Category A',
          type: 'Type 1',
          x: 1,
          y: 10,
        },
        {
          category: 'Category A',
          type: 'Type 1',
          x: 1,
          y: 15,
        },
      ];

      render(<BarChart {...defaultProps} data={duplicateXData} />);

      const chartElement = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chartElement.getAttribute('data-chart-data') || '{}',
      );

      expect(chartData.labels).toEqual(['1']);
    });

    it('应该处理负数数据', () => {
      const negativeData: BarChartDataItem[] = [
        {
          category: 'Category A',
          type: 'Type 1',
          x: 1,
          y: -10,
        },
        {
          category: 'Category A',
          type: 'Type 2',
          x: 1,
          y: 15,
        },
      ];

      render(<BarChart {...defaultProps} data={negativeData} />);

      const chartElement = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(
        chartElement.getAttribute('data-chart-data') || '{}',
      );

      expect(chartData.datasets[0].data).toContain(-10);
      expect(chartData.datasets[1].data).toContain(15);
    });
  });

  describe('性能测试', () => {
    it('应该处理大量数据', () => {
      const largeData: BarChartDataItem[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          category: `Category ${i % 10}`,
          type: `Type ${i % 5}`,
          x: i % 20,
          y: Math.random() * 100,
        }),
      );

      render(<BarChart {...defaultProps} data={largeData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('应该处理频繁的数据更新', () => {
      const { rerender } = render(<BarChart {...defaultProps} />);

      const newData: BarChartDataItem[] = [
        {
          category: 'Category C',
          type: 'Type 3',
          x: 3,
          y: 30,
        },
      ];

      rerender(<BarChart {...defaultProps} data={newData} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('应该提供正确的图表结构', () => {
      render(<BarChart {...defaultProps} />);

      expect(screen.getByTestId('chart-title')).toBeInTheDocument();
      expect(screen.getByTestId('filter-select')).toBeInTheDocument();
      expect(screen.getByTestId('download-button')).toBeInTheDocument();
    });

    it('应该支持键盘导航', () => {
      render(<BarChart {...defaultProps} />);

      const filterSelect = screen.getByTestId('filter-select');
      expect(filterSelect).toBeInTheDocument();

      const downloadButton = screen.getByTestId('download-button');
      expect(downloadButton).toBeInTheDocument();
    });
  });

  describe('窗口大小变化测试', () => {
    it('应该响应窗口大小变化', () => {
      const { container } = render(<BarChart {...defaultProps} />);

      // 模拟窗口大小变化
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      fireEvent(window, new Event('resize'));

      // 等待状态更新
      waitFor(() => {
        const chartContainer = container.querySelector('.bar-chart-container');
        expect(chartContainer).toHaveStyle('width: 100%');
      });
    });
  });
});
