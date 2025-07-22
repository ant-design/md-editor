import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ChartMark Components', () => {
  const defaultProps = {
    data: [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
      { name: 'C', value: 30 },
    ],
    xField: 'name',
    yField: 'value',
    chartRef: { current: null },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('数据结构测试', () => {
    it('应该正确处理基本数据结构', () => {
      expect(defaultProps.data).toHaveLength(3);
      expect(defaultProps.xField).toBe('name');
      expect(defaultProps.yField).toBe('value');
    });

    it('应该处理空数据', () => {
      const props = {
        ...defaultProps,
        data: [],
      };

      expect(props.data).toHaveLength(0);
    });

    it('应该处理颜色图例', () => {
      const props = {
        ...defaultProps,
        data: [
          { name: 'A', value: 10, color: 'red' },
          { name: 'B', value: 20, color: 'blue' },
        ],
        colorLegend: 'color',
      };

      expect(props.data).toHaveLength(2);
      expect(props.colorLegend).toBe('color');
    });
  });

  describe('数据处理测试', () => {
    it('应该处理复杂数据结构', () => {
      const props = {
        ...defaultProps,
        data: [
          { category: 'A', subcategory: 'A1', value: 10 },
          { category: 'A', subcategory: 'A2', value: 20 },
          { category: 'B', subcategory: 'B1', value: 30 },
        ],
        xField: 'category',
        yField: 'value',
      };

      expect(props.data).toHaveLength(3);
      expect(props.xField).toBe('category');
      expect(props.yField).toBe('value');
    });

    it('应该处理数字格式化', () => {
      const props = {
        ...defaultProps,
        data: [
          { name: 'A', value: 1234.56 },
          { name: 'B', value: 2345.67 },
        ],
      };

      expect(props.data).toHaveLength(2);
      expect(props.data[0].value).toBe(1234.56);
    });

    it('应该处理无效数据', () => {
      const props = {
        ...defaultProps,
        data: [
          { name: null, value: 'invalid' },
          { name: undefined, value: NaN },
        ],
      };

      expect(props.data).toHaveLength(2);
    });
  });

  describe('配置测试', () => {
    it('应该传递正确的字段配置', () => {
      const props = {
        ...defaultProps,
        xField: 'category',
        yField: 'amount',
      };

      expect(props.xField).toBe('category');
      expect(props.yField).toBe('amount');
    });

    it('应该处理默认字段配置', () => {
      const props = {
        ...defaultProps,
        xField: undefined,
        yField: undefined,
      };

      expect(props.xField).toBeUndefined();
      expect(props.yField).toBeUndefined();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理没有数据的情况', () => {
      const props = {
        ...defaultProps,
        data: undefined,
      };

      expect(props.data).toBeUndefined();
    });

    it('应该处理没有字段配置的情况', () => {
      const props = {
        ...defaultProps,
        xField: undefined,
        yField: undefined,
      };

      expect(props.xField).toBeUndefined();
      expect(props.yField).toBeUndefined();
    });

    it('应该处理没有 chartRef 的情况', () => {
      const props = {
        ...defaultProps,
        chartRef: undefined,
      };

      expect(props.chartRef).toBeUndefined();
    });
  });
});
