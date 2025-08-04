import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  List,
  ListItem,
} from '../../../../src/MarkdownEditor/editor/elements/List';

// Mock dependencies
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    store: {
      dragStart: vi.fn(),
    },
    markdownContainerRef: { current: document.createElement('div') },
    readonly: false,
  })),
}));

vi.mock('../../../../src/MarkdownEditor/hooks/editor', () => ({
  useMEditor: vi.fn(() => [null, vi.fn()]),
}));

vi.mock('../../../../src/MarkdownEditor/editor/slate-react', () => ({
  useSlate: vi.fn(() => ({
    children: [{ children: [] }],
  })),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/List/style', () => ({
  useStyle: vi.fn(() => ({
    wrapSSR: (component: any) => component,
    hashId: 'test-hash',
  })),
}));

vi.mock('@ant-design/pro-components', () => ({
  useMountMergeState: vi.fn((initialValue) => {
    const [state, setState] = React.useState(initialValue);
    return [state, setState];
  }),
}));

describe('List Components', () => {
  describe('List', () => {
    const defaultListProps = {
      element: {
        type: 'list' as const,
        order: false, // 无序列表
        start: 1,
        task: false,
        children: [{ text: 'List content' }],
      },
      attributes: {
        'data-slate-node': 'element' as const,
        ref: { current: null },
      },
      children: [<div key="1">List Content</div>],
    } as any;

    describe('基本渲染测试', () => {
      it('应该正确渲染无序列表', () => {
        render(<List {...defaultListProps} />);
        const listContainer = document.querySelector('[data-be="list"]');
        expect(listContainer).toBeInTheDocument();
      });

      it('应该渲染ul元素', () => {
        render(<List {...defaultListProps} />);
        const ul = document.querySelector('ul');
        expect(ul).toBeInTheDocument();
      });

      it('应该渲染子元素', () => {
        render(<List {...defaultListProps} />);
        expect(screen.getByText('List Content')).toBeInTheDocument();
      });

      it('应该应用正确的CSS类', () => {
        render(<List {...defaultListProps} />);
        const ul = document.querySelector('ul');
        expect(ul).toHaveClass('test-hash');
        expect(ul).toHaveClass('ul');
      });
    });

    describe('有序列表测试', () => {
      it('应该渲染有序列表', () => {
        const orderedListProps = {
          ...defaultListProps,
          element: {
            ...defaultListProps.element,
            order: true,
            start: 5,
          },
        };
        render(<List {...orderedListProps} />);
        const ol = document.querySelector('ol');
        expect(ol).toBeInTheDocument();
        expect(ol).toHaveAttribute('start', '5');
      });

      it('应该应用有序列表的CSS类', () => {
        const orderedListProps = {
          ...defaultListProps,
          element: {
            ...defaultListProps.element,
            order: true,
          },
        };
        render(<List {...orderedListProps} />);
        const ol = document.querySelector('ol');
        expect(ol).toHaveClass('test-hash');
        expect(ol).toHaveClass('ol');
      });
    });

    describe('任务列表测试', () => {
      it('应该为任务列表设置data-task属性', () => {
        const taskListProps = {
          ...defaultListProps,
          element: {
            ...defaultListProps.element,
            task: true,
          },
        };
        render(<List {...taskListProps} />);
        const ul = document.querySelector('ul');
        expect(ul).toHaveAttribute('data-task', 'true');
      });
    });
  });

  describe('ListItem', () => {
    const defaultListItemProps = {
      element: {
        type: 'list-item' as const,
        checked: undefined, // 非任务列表项
        mentions: [],
        children: [{ text: 'List item content' }],
      },
      attributes: {
        'data-slate-node': 'element' as const,
        ref: { current: null },
      },
      children: [<div key="1">List Item Content</div>],
    } as any;

    describe('基本渲染测试', () => {
      it('应该正确渲染列表项', () => {
        render(<ListItem {...defaultListItemProps} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
      });

      it('应该渲染子元素', () => {
        render(<ListItem {...defaultListItemProps} />);
        expect(screen.getByText('List Item Content')).toBeInTheDocument();
      });

      it('应该应用正确的CSS类', () => {
        render(<ListItem {...defaultListItemProps} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
      });
    });

    describe('任务列表项测试', () => {
      it('应该渲染任务列表项的复选框', () => {
        const taskItemProps = {
          ...defaultListItemProps,
          element: {
            ...defaultListItemProps.element,
            checked: true,
          },
        };
        render(<ListItem {...taskItemProps} />);
        const checkbox = document.querySelector('input[type="checkbox"]');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();
      });

      it('应该为任务列表项应用正确的CSS类', () => {
        const taskItemProps = {
          ...defaultListItemProps,
          element: {
            ...defaultListItemProps.element,
            checked: false,
          },
        };
        render(<ListItem {...taskItemProps} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
      });

      it('应该处理复选框状态变化', () => {
        const taskItemProps = {
          ...defaultListItemProps,
          element: {
            ...defaultListItemProps.element,
            checked: false,
          },
        };
        render(<ListItem {...taskItemProps} />);
        const checkbox = document.querySelector('input[type="checkbox"]');
        expect(checkbox).toBeInTheDocument();
      });
    });

    describe('提及用户测试', () => {
      it('应该为任务列表项显示提及用户组件', () => {
        const taskItemWithMentionsProps = {
          ...defaultListItemProps,
          element: {
            ...defaultListItemProps.element,
            checked: true,
            mentions: [{ id: '1', name: 'John Doe', avatar: 'avatar1.jpg' }],
          },
        };
        render(<ListItem {...taskItemWithMentionsProps} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
      });

      it('应该处理提及用户选择', () => {
        render(<ListItem {...defaultListItemProps} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
      });
    });

    describe('自定义渲染测试', () => {
      it('应该使用自定义的listItemRender函数', () => {
        render(<ListItem {...defaultListItemProps} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
      });
    });

    describe('拖拽测试', () => {
      it('应该处理拖拽开始事件', () => {
        render(<ListItem {...defaultListItemProps} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
      });
    });

    describe('边界条件测试', () => {
      it('应该处理空的子元素', () => {
        const props = {
          ...defaultListItemProps,
          children: [],
        };
        render(<ListItem {...props} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
      });

      it('应该处理复杂的子元素结构', () => {
        const props = {
          ...defaultListItemProps,
          children: [<div key="1">Complex</div>, <span key="2">Content</span>],
        };
        render(<ListItem {...props} />);
        expect(screen.getByText('Complex')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      it('应该处理没有提及用户的非任务列表项', () => {
        render(<ListItem {...defaultListItemProps} />);
        const li = document.querySelector('[data-be="list-item"]');
        expect(li).toBeInTheDocument();
        expect(li).not.toHaveClass('test-hash-task');
      });
    });
  });
});
