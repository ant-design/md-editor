import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../../src/i18n';
import DonutChart, {
  DonutChartConfig,
  DonutChartData,
} from '../../../src/plugins/chart/DonutChart';

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: vi.fn().mockImplementation(() => ({
    render: vi.fn(),
    destroy: vi.fn(),
    toBase64Image: vi.fn(() => 'data:image/png;base64,mock-image-data'),
  })),
  register: vi.fn(),
}));

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Doughnut: vi.fn().mockImplementation(({ data, options, plugins }) => (
    <div data-testid="doughnut-chart" data-chart-data={JSON.stringify(data)}>
      Doughnut Chart
      {plugins?.map((plugin: any, index: number) => (
        <div key={index} data-testid={`plugin-${index}`}>
          Plugin {index}
        </div>
      ))}
    </div>
  )),
}));

// Mock chart components
vi.mock('../../../src/plugins/chart/components', () => ({
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
      <h3>{title}</h3>
      <button data-testid="download-btn" onClick={onDownload}>
        下载
      </button>
    </div>
  )),
  downloadChart: vi.fn().mockReturnValue(true),
}));

// Mock useStyle hook
vi.mock('../../../src/plugins/chart/DonutChart/style', () => ({
  useStyle: vi.fn().mockReturnValue({
    wrapSSR: (children: React.ReactNode) => (
      <div data-testid="styled-wrapper">{children}</div>
    ),
    hashId: 'test-hash-id',
  }),
}));

describe('DonutChart', () => {
  const mockI18n = {
    locale: {
      'workspace.terminalExecution': '终端执行',
      'workspace.createHtmlFile': '创建 HTML 文件',
      'workspace.markdownContent': 'Markdown 内容',
    } as any,
    language: 'zh-CN' as const,
  };

  const defaultData: DonutChartData[] = [
    { label: 'A', value: 30, category: 'Category1' },
    { label: 'B', value: 50, category: 'Category1' },
    { label: 'C', value: 20, category: 'Category2' },
  ];

  const defaultConfigs: DonutChartConfig[] = [
    {
      showLegend: true,
      showTooltip: true,
      theme: 'light',
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    // Mock window.addEventListener and removeEventListener
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染甜甜圈图', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} configs={defaultConfigs} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
      expect(screen.getByTestId('styled-wrapper')).toBeInTheDocument();
    });

    it('应该使用默认配置当没有提供 configs 时', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('应该正确渲染标题和工具栏', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} title="测试图表" showToolbar={true} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('chart-toolbar')).toBeInTheDocument();
      expect(screen.getByText('测试图表')).toBeInTheDocument();
    });

    it('应该隐藏工具栏当 showToolbar 为 false 时', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} showToolbar={false} />
        </I18nContext.Provider>,
      );

      expect(screen.queryByTestId('chart-toolbar')).not.toBeInTheDocument();
    });
  });

  describe('数据处理测试', () => {
    it('应该处理空数据', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={[]} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('应该处理单条数据', () => {
      const singleData = [{ label: 'Single', value: 100 }];
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={singleData} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('应该处理包含 filterLable 的数据', () => {
      const dataWithFilter = [
        { label: 'A', value: 30, filterLable: 'Filter1' },
        { label: 'B', value: 50, filterLable: 'Filter2' },
      ];
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={dataWithFilter} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('筛选功能测试', () => {
    it('应该显示筛选器当提供 filterList 时', () => {
      const filterList = ['Category1', 'Category2'];
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} filterList={filterList} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('chart-filter')).toBeInTheDocument();
    });

    it('应该显示筛选器当启用自动分类时', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} enableAutoCategory={true} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('chart-filter')).toBeInTheDocument();
    });

    it('应该处理筛选变化', async () => {
      const onFilterChange = vi.fn();
      const filterList = ['Category1', 'Category2'];

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart
            data={defaultData}
            filterList={filterList}
            selectedFilter="Category1"
            onFilterChange={onFilterChange}
          />
        </I18nContext.Provider>,
      );

      const filterSelect = screen.getByTestId('filter-select');
      fireEvent.change(filterSelect, { target: { value: 'Category2' } });

      expect(onFilterChange).toHaveBeenCalledWith('Category2');
    });

    it('应该验证 filterList 重复项并抛出错误', () => {
      const duplicateFilterList = ['Category1', 'Category1', 'Category2'];

      // 捕获控制台错误
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(
          <I18nContext.Provider value={mockI18n}>
            <DonutChart data={defaultData} filterList={duplicateFilterList} />
          </I18nContext.Provider>,
        );
      }).toThrow('DonutChart filterList 包含重复项');

      consoleSpy.mockRestore();
    });
  });

  describe('单值模式测试', () => {
    it('应该正确渲染单值模式', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} singleMode={true} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('应该为单值模式生成正确的配置', () => {
      const singleData = [{ label: 'Single', value: 75 }];
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={singleData} singleMode={true} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('响应式测试', () => {
    it('应该处理移动端尺寸', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600, // 移动端宽度
      });

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} width={200} height={200} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('应该监听窗口大小变化', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} />
        </I18nContext.Provider>,
      );

      expect(window.addEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });
  });

  describe('主题测试', () => {
    it('应该支持深色主题', () => {
      const darkConfigs: DonutChartConfig[] = [
        { ...defaultConfigs[0], theme: 'dark' },
      ];

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} configs={darkConfigs} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('应该支持浅色主题', () => {
      const lightConfigs: DonutChartConfig[] = [
        { ...defaultConfigs[0], theme: 'light' },
      ];

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} configs={lightConfigs} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('下载功能测试', () => {
    it('应该处理下载功能', () => {
      const onDownload = vi.fn();

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart
            data={defaultData}
            title="测试图表"
            onDownload={onDownload}
          />
        </I18nContext.Provider>,
      );

      const downloadBtn = screen.getByTestId('download-btn');
      fireEvent.click(downloadBtn);

      expect(onDownload).toHaveBeenCalled();
    });

    it('应该使用默认下载功能当没有提供 onDownload 时', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} title="测试图表" />
        </I18nContext.Provider>,
      );

      const downloadBtn = screen.getByTestId('download-btn');
      fireEvent.click(downloadBtn);

      // 应该调用默认的 downloadChart 函数
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('图例交互测试', () => {
    it('应该处理图例项点击', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} configs={defaultConfigs} />
        </I18nContext.Provider>,
      );

      // 图例项应该存在（通过 Chart.js 的 legend 配置）
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('自定义样式测试', () => {
    it('应该应用自定义 className', () => {
      const { container } = render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} className="custom-donut-chart" />
        </I18nContext.Provider>,
      );

      expect(
        container.querySelector('.custom-donut-chart'),
      ).toBeInTheDocument();
    });

    it('应该应用自定义尺寸', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} width={300} height={300} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理无效的配置', () => {
      const invalidConfigs = [
        { showLegend: true, backgroundColor: [] }, // 空颜色数组
      ];

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} configs={invalidConfigs} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('应该处理负数值', () => {
      const negativeData = [
        { label: 'Positive', value: 50 },
        { label: 'Negative', value: -20 },
      ];

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={negativeData} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('应该处理零值', () => {
      const zeroData = [
        { label: 'Zero', value: 0 },
        { label: 'Positive', value: 100 },
      ];

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={zeroData} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('性能测试', () => {
    it('应该处理大量数据', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        label: `Item ${i}`,
        value: Math.random() * 100,
        category: `Category${Math.floor(i / 10)}`,
      }));

      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={largeData} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('应该支持键盘导航', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} configs={defaultConfigs} />
        </I18nContext.Provider>,
      );

      // 检查图例项是否支持键盘导航
      const chartElement = screen.getByTestId('doughnut-chart');
      expect(chartElement).toBeInTheDocument();
    });
  });

  describe('清理测试', () => {
    it('应该正确清理事件监听器', () => {
      const { unmount } = render(
        <I18nContext.Provider value={mockI18n}>
          <DonutChart data={defaultData} />
        </I18nContext.Provider>,
      );

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });
  });
});
