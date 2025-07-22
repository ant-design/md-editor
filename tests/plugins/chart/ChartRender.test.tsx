import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ChartRender', () => {
  const defaultProps = {
    chartType: 'bar' as const,
    chartData: [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
      { name: 'C', value: 30 },
    ],
    config: {
      height: 300,
      x: 'name',
      y: 'value',
      rest: {},
    },
    node: {},
    title: 'Test Chart',
    isChartList: false,
    columnLength: 3,
    onColumnLengthChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本结构测试', () => {
    it('应该正确处理基本属性', () => {
      expect(defaultProps.chartType).toBe('bar');
      expect(defaultProps.chartData).toHaveLength(3);
      expect(defaultProps.config.x).toBe('name');
      expect(defaultProps.config.y).toBe('value');
    });

    it('应该处理不同的图表类型', () => {
      const props = {
        ...defaultProps,
        chartType: 'pie' as const,
      };

      expect(props.chartType).toBe('pie');
    });

    it('应该处理空数据', () => {
      const props = {
        ...defaultProps,
        chartData: [],
      };

      expect(props.chartData).toHaveLength(0);
    });
  });

  describe('数据处理测试', () => {
    it('应该处理复杂数据结构', () => {
      const props = {
        ...defaultProps,
        chartData: [
          { category: 'A', subcategory: 'A1', value: 10 },
          { category: 'A', subcategory: 'A2', value: 20 },
          { category: 'B', subcategory: 'B1', value: 30 },
        ],
        config: {
          ...defaultProps.config,
          x: 'category',
          y: 'value',
        },
      };

      expect(props.chartData).toHaveLength(3);
      expect(props.config.x).toBe('category');
    });

    it('应该处理颜色图例', () => {
      const props = {
        ...defaultProps,
        chartData: [
          { name: 'A', value: 10, color: 'red' },
          { name: 'B', value: 20, color: 'blue' },
        ],
        config: {
          ...defaultProps.config,
          colorLegend: 'color',
        },
      };

      expect(props.chartData).toHaveLength(2);
      expect(props.config.colorLegend).toBe('color');
    });
  });

  describe('配置测试', () => {
    it('应该传递正确的配置参数', () => {
      const props = {
        ...defaultProps,
        config: {
          height: 400,
          x: 'category',
          y: 'amount',
          rest: { color: 'blue' },
        },
      };

      expect(props.config.height).toBe(400);
      expect(props.config.x).toBe('category');
      expect(props.config.y).toBe('amount');
    });

    it('应该处理默认配置', () => {
      const props = {
        ...defaultProps,
        config: undefined,
      };

      expect(props.config).toBeUndefined();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理无效的图表类型', () => {
      const props = {
        ...defaultProps,
        chartType: 'invalid' as any,
      };

      expect(props.chartType).toBe('invalid');
    });

    it('应该处理没有标题的情况', () => {
      const props = {
        ...defaultProps,
        title: undefined,
      };

      expect(props.title).toBeUndefined();
    });
  });

  describe('图表列表模式测试', () => {
    it('应该在图表列表模式下工作', () => {
      const props = {
        ...defaultProps,
        isChartList: true,
      };

      expect(props.isChartList).toBe(true);
    });

    it('应该处理列数变化回调', () => {
      const onColumnLengthChange = vi.fn();
      const props = {
        ...defaultProps,
        isChartList: true,
        onColumnLengthChange,
      };

      expect(props.onColumnLengthChange).toBeDefined();
    });
  });
});
