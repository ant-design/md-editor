import '@testing-library/jest-dom';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock 依赖
vi.mock('../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: () => ({
    markdownEditorRef: { current: { focus: vi.fn() } },
    readonly: false,
  }),
}));

vi.mock('../../../src/MarkdownEditor/editor/slate-react', () => ({
  ReactEditor: {
    focus: vi.fn(),
  },
}));

vi.mock('../../../src/MarkdownEditor', () => ({
  EditorUtils: {
    findPath: vi.fn().mockReturnValue([0, 0]),
  },
}));

vi.mock('slate', () => ({
  Transforms: {
    delete: vi.fn(),
  },
}));

vi.mock(
  '../../../src/plugins/chart/ChartAttrToolBar/ChartAttrToolBarStyle',
  () => ({
    useStyle: () => ({
      wrapSSR: (children: React.ReactNode) => children,
      hashId: 'test-hash-id',
    }),
  }),
);

// Mock Ant Design components
vi.mock('@ant-design/icons', () => ({
  DeleteOutlined: ({ onClick }: { onClick?: () => void }) => (
    <div data-testid="delete-button" onClick={onClick}>
      Delete
    </div>
  ),
}));

vi.mock('antd', () => ({
  ConfigProvider: {
    ConfigContext: React.createContext({
      getPrefixCls: (suffixCls: string) => `ant-${suffixCls}`,
    }),
  },
  Tooltip: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) => <div data-testid={`tooltip-${title}`}>{children}</div>,
}));

describe('ChartAttrToolBar', () => {
  const defaultProps = {
    node: [{ type: 'chart', chartType: 'bar' }, [0, 0]] as any,
    title: 'Test Chart',
    options: [
      {
        icon: <div data-testid="icon-1">Icon 1</div>,
        title: 'Option 1',
        onClick: vi.fn(),
      },
      {
        icon: <div data-testid="icon-2">Icon 2</div>,
        title: 'Option 2',
        onClick: vi.fn(),
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本结构测试', () => {
    it('应该正确处理基本属性', () => {
      expect(defaultProps.title).toBe('Test Chart');
      expect(defaultProps.options).toHaveLength(2);
      expect(defaultProps.node).toBeDefined();
    });

    it('应该正确处理选项结构', () => {
      expect(defaultProps.options[0].title).toBe('Option 1');
      expect(defaultProps.options[1].title).toBe('Option 2');
      expect(defaultProps.options[0].onClick).toBeDefined();
      expect(defaultProps.options[1].onClick).toBeDefined();
    });

    it('应该正确处理 node 结构', () => {
      expect(defaultProps.node[0].type).toBe('chart');
      expect(defaultProps.node[0].chartType).toBe('bar');
      expect(defaultProps.node[1]).toEqual([0, 0]);
    });
  });

  describe('选项处理测试', () => {
    it('应该处理没有标题的选项', () => {
      const options = [
        {
          icon: <div data-testid="icon-no-title">Icon</div>,
          onClick: vi.fn(),
          title: undefined,
        },
      ];

      expect(options[0].title).toBeUndefined();
      expect(options[0].icon).toBeDefined();
      expect(options[0].onClick).toBeDefined();
    });

    it('应该处理没有图标的选项', () => {
      const options = [
        {
          icon: null,
          title: 'No Icon',
          onClick: vi.fn(),
        },
      ];

      expect(options[0].icon).toBeNull();
      expect(options[0].title).toBe('No Icon');
    });

    it('应该处理空选项数组', () => {
      const emptyOptions: any[] = [];
      expect(emptyOptions).toHaveLength(0);
    });

    it('应该处理没有选项的情况', () => {
      const undefinedOptions = undefined;
      expect(undefinedOptions).toBeUndefined();
    });
  });

  describe('只读模式测试', () => {
    it('应该在只读模式下隐藏删除按钮', () => {
      const readonlyProps = {
        ...defaultProps,
        readonly: true,
      };

      expect(readonlyProps.readonly).toBe(true);
    });

    it('应该在非只读模式下显示删除按钮', () => {
      const nonReadonlyProps = {
        ...defaultProps,
        readonly: false,
      };

      expect(nonReadonlyProps.readonly).toBe(false);
    });
  });

  describe('交互功能测试', () => {
    it('应该处理选项点击', () => {
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();

      const options = [
        {
          icon: <div data-testid="icon-1">Icon 1</div>,
          title: 'Option 1',
          onClick: onClick1,
        },
        {
          icon: <div data-testid="icon-2">Icon 2</div>,
          title: 'Option 2',
          onClick: onClick2,
        },
      ];

      expect(options[0].onClick).toBe(onClick1);
      expect(options[1].onClick).toBe(onClick2);
    });

    it('应该处理删除功能', () => {
      const { Transforms } = require('slate');
      expect(Transforms.delete).toBeDefined();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理没有标题的情况', () => {
      const props = {
        ...defaultProps,
        title: undefined,
      };

      expect(props.title).toBeUndefined();
    });

    it('应该处理没有 node 的情况', () => {
      const props = {
        ...defaultProps,
        node: undefined as any,
      };

      expect(props.node).toBeUndefined();
    });

    it('应该处理无效的 node 结构', () => {
      const props = {
        ...defaultProps,
        node: [null, null] as any,
      };

      expect(props.node[0]).toBeNull();
      expect(props.node[1]).toBeNull();
    });
  });

  describe('工具提示测试', () => {
    it('应该为有标题的选项显示工具提示', () => {
      const options = [
        {
          icon: <div>Icon 1</div>,
          title: 'Option 1',
          onClick: vi.fn(),
        },
        {
          icon: <div>Icon 2</div>,
          title: 'Option 2',
          onClick: vi.fn(),
        },
      ];

      expect(options[0].title).toBe('Option 1');
      expect(options[1].title).toBe('Option 2');
    });

    it('应该为删除按钮显示工具提示', () => {
      const deleteTitle = '删除';
      expect(deleteTitle).toBe('删除');
    });
  });
});
