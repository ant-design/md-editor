import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStyle } from '../../../src/plugins/chart/DonutChart/style';

// Mock useEditorStyleRegister
const mockUseEditorStyleRegister = vi.fn();
vi.mock('../../../src/hooks/useStyle', () => ({
  useEditorStyleRegister: mockUseEditorStyleRegister,
}));

describe('DonutChart Style', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useStyle hook', () => {
    it('应该正确调用 useEditorStyleRegister', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      const result = useStyle('test-prefix');

      expect(mockUseEditorStyleRegister).toHaveBeenCalledWith(
        'DonutChart',
        expect.any(Function),
      );
      expect(result).toEqual({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });
    });

    it('应该使用默认前缀当没有提供时', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle();

      expect(mockUseEditorStyleRegister).toHaveBeenCalledWith(
        'DonutChart',
        expect.any(Function),
      );
    });

    it('应该传递正确的样式生成函数', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);

      expect(styles).toBeDefined();
      expect(Array.isArray(styles)).toBe(true);
      expect(styles).toHaveLength(1);
    });
  });

  describe('样式生成函数', () => {
    it('应该生成正确的样式对象', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];

      // 检查主要样式属性
      expect(styleObject).toHaveProperty('.test-prefix');
      expect(styleObject['.test-prefix']).toHaveProperty('display', 'grid');
      expect(styleObject['.test-prefix']).toHaveProperty('gap', 16);
      expect(styleObject['.test-prefix']).toHaveProperty('gridTemplateColumns');
    });

    it('应该包含工具栏包装器样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];

      expect(styleObject['.test-prefix']).toHaveProperty('&-toolbar-wrapper');
      expect(styleObject['.test-prefix']['&-toolbar-wrapper']).toHaveProperty(
        'marginBottom',
        8,
      );
    });

    it('应该包含图表包装器样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];

      expect(styleObject['.test-prefix']).toHaveProperty('&-chart-wrapper');
      expect(styleObject['.test-prefix']).toHaveProperty('&-row');
      expect(styleObject['.test-prefix']).toHaveProperty('&-chart');
    });

    it('应该包含图例样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];

      expect(styleObject['.test-prefix']).toHaveProperty('&-legend');
      expect(styleObject['.test-prefix']).toHaveProperty('&-legend-item');
      expect(styleObject['.test-prefix']).toHaveProperty('&-legend-color');
      expect(styleObject['.test-prefix']).toHaveProperty('&-legend-label');
      expect(styleObject['.test-prefix']).toHaveProperty('&-legend-value');
      expect(styleObject['.test-prefix']).toHaveProperty('&-legend-percent');
    });

    it('应该包含响应式媒体查询', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];

      // 检查媒体查询
      expect(styleObject['.test-prefix']).toHaveProperty(
        '@media (max-width: 768px)',
      );
      expect(styleObject['.test-prefix']).toHaveProperty(
        '@media (max-width: 480px)',
      );
    });

    it('应该包含单值模式样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];

      expect(styleObject['.test-prefix']).toHaveProperty('&-single');
    });
  });

  describe('样式属性验证', () => {
    it('应该包含正确的网格布局属性', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const mainStyle = styleObject['.test-prefix'];

      expect(mainStyle.display).toBe('grid');
      expect(mainStyle.gap).toBe(16);
      expect(mainStyle.gridTemplateColumns).toContain(
        'repeat(auto-fit, minmax(var(--donut-item-min-width, 200px), 1fr))',
      );
    });

    it('应该包含正确的图例项样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendItemStyle = styleObject['.test-prefix']['&-legend-item'];

      expect(legendItemStyle.display).toBe('flex');
      expect(legendItemStyle.alignItems).toBe('center');
      expect(legendItemStyle.fontSize).toBe(12);
      expect(legendItemStyle.marginBottom).toBe(6);
      expect(legendItemStyle.padding).toBe('6px 0');
    });

    it('应该包含正确的图例颜色样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendColorStyle = styleObject['.test-prefix']['&-legend-color'];

      expect(legendColorStyle.display).toBe('inline-block');
      expect(legendColorStyle.width).toBe(12);
      expect(legendColorStyle.height).toBe(12);
      expect(legendColorStyle.borderRadius).toBe(4);
      expect(legendColorStyle.background).toBe(
        'var(--donut-legend-color, #ccc)',
      );
      expect(legendColorStyle.marginRight).toBe(6);
      expect(legendColorStyle.flexShrink).toBe(0);
    });

    it('应该包含正确的图例标签样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendLabelStyle = styleObject['.test-prefix']['&-legend-label'];

      expect(legendLabelStyle.flex).toBe(1);
      expect(legendLabelStyle.color).toBe('#767E8B');
      expect(legendLabelStyle.fontSize).toBe(13);
      expect(legendLabelStyle.whiteSpace).toBe('nowrap');
      expect(legendLabelStyle.overflow).toBe('hidden');
      expect(legendLabelStyle.textOverflow).toBe('ellipsis');
    });

    it('应该包含正确的图例值样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendValueStyle = styleObject['.test-prefix']['&-legend-value'];

      expect(legendValueStyle.color).toBe('#343A45');
      expect(legendValueStyle.fontSize).toBe(13);
      expect(legendValueStyle.fontWeight).toBe(500);
      expect(legendValueStyle.marginLeft).toBe(15);
      expect(legendValueStyle.display).toBe('flex');
      expect(legendValueStyle.flexDirection).toBe('column');
      expect(legendValueStyle.alignItems).toBe('flex-end');
    });

    it('应该包含正确的图例百分比样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendPercentStyle =
        styleObject['.test-prefix']['&-legend-percent'];

      expect(legendPercentStyle.marginLeft).toBe(8);
      expect(legendPercentStyle.fontSize).toBe(12);
      expect(legendPercentStyle.color).toBe('#343A45');
    });
  });

  describe('响应式样式测试', () => {
    it('应该包含移动端媒体查询样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const mobileMediaQuery =
        styleObject['.test-prefix']['@media (max-width: 768px)'];

      expect(mobileMediaQuery).toBeDefined();
      expect(mobileMediaQuery.gap).toBe(12);
      expect(mobileMediaQuery.gridTemplateColumns).toBe('1fr');
    });

    it('应该包含小屏幕媒体查询样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const smallScreenMediaQuery =
        styleObject['.test-prefix']['@media (max-width: 480px)'];

      expect(smallScreenMediaQuery).toBeDefined();
      expect(smallScreenMediaQuery.gap).toBe(8);
    });

    it('应该包含移动端图例项样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendItemMobileStyle =
        styleObject['.test-prefix']['&-legend-item'][
          '@media (max-width: 768px)'
        ];

      expect(legendItemMobileStyle).toBeDefined();
      expect(legendItemMobileStyle.fontSize).toBe(11);
      expect(legendItemMobileStyle.marginBottom).toBe(4);
      expect(legendItemMobileStyle.padding).toBe('4px 0');
      expect(legendItemMobileStyle.minHeight).toBe('24px');
    });

    it('应该包含移动端图例颜色样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendColorMobileStyle =
        styleObject['.test-prefix']['&-legend-color'][
          '@media (max-width: 768px)'
        ];

      expect(legendColorMobileStyle).toBeDefined();
      expect(legendColorMobileStyle.width).toBe(10);
      expect(legendColorMobileStyle.height).toBe(10);
      expect(legendColorMobileStyle.borderRadius).toBe(4);
      expect(legendColorMobileStyle.marginRight).toBe(4);
    });

    it('应该包含移动端图例标签样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendLabelMobileStyle =
        styleObject['.test-prefix']['&-legend-label'][
          '@media (max-width: 768px)'
        ];

      expect(legendLabelMobileStyle).toBeDefined();
      expect(legendLabelMobileStyle.fontSize).toBe(11);
      expect(legendLabelMobileStyle.flex).toBe('0 1 auto');
      expect(legendLabelMobileStyle.minWidth).toBe('60px');
    });

    it('应该包含移动端图例值样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendValueMobileStyle =
        styleObject['.test-prefix']['&-legend-value'][
          '@media (max-width: 768px)'
        ];

      expect(legendValueMobileStyle).toBeDefined();
      expect(legendValueMobileStyle.fontSize).toBe(11);
      expect(legendValueMobileStyle.fontWeight).toBe(400);
      expect(legendValueMobileStyle.marginLeft).toBe(8);
    });

    it('应该包含移动端图例百分比样式', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const mockToken = {
        componentCls: '.test-prefix',
      };

      const styles = styleGenerator(mockToken);
      const styleObject = styles[0];
      const legendPercentMobileStyle =
        styleObject['.test-prefix']['&-legend-percent'][
          '@media (max-width: 768px)'
        ];

      expect(legendPercentMobileStyle).toBeDefined();
      expect(legendPercentMobileStyle.marginLeft).toBe(0);
      expect(legendPercentMobileStyle.fontSize).toBe(10);
      expect(legendPercentMobileStyle.marginTop).toBe(1);
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空的 token 对象', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const emptyToken = {};

      expect(() => {
        styleGenerator(emptyToken);
      }).not.toThrow();
    });

    it('应该处理 undefined 的 componentCls', () => {
      const mockWrapSSR = vi.fn((children) => children);
      const mockHashId = 'test-hash-id';

      mockUseEditorStyleRegister.mockReturnValue({
        wrapSSR: mockWrapSSR,
        hashId: mockHashId,
      });

      useStyle('test-prefix');

      const styleGenerator = mockUseEditorStyleRegister.mock.calls[0][1];
      const tokenWithoutCls = { componentCls: undefined };

      expect(() => {
        styleGenerator(tokenWithoutCls);
      }).not.toThrow();
    });
  });
});
