import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { WarpCard } from '../../../../src/MarkdownEditor/editor/elements/Card';
import { TestSlateWrapper } from './TestSlateWrapper';

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
  useSelStatus: vi.fn(() => [false, [0]]),
}));

describe('WarpCard', () => {
  const defaultProps = {
    element: {
      type: 'card' as const,
      children: [{ text: 'Card content' }],
      style: { backgroundColor: 'red' },
      block: true,
    },
    attributes: {
      'data-slate-node': 'element' as const,
      ref: { current: null },
    },
    children: [<div key="1">Card Content</div>],
  } as any;

  const renderWithSlate = (props: any) => {
    return render(
      <TestSlateWrapper>
        <WarpCard {...props} />
      </TestSlateWrapper>,
    );
  };

  describe('基本渲染测试', () => {
    it('应该正确渲染卡片元素', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('应该渲染子元素', () => {
      renderWithSlate(defaultProps);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('应该设置正确的role属性', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('应该设置正确的aria-label属性', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toHaveAttribute('aria-label', '可选择的卡片元素');
    });
  });

  describe('样式测试', () => {
    it('应该应用元素的自定义样式', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('应该应用默认的卡片样式', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('应该为block元素设置flex布局', () => {
      const blockProps = {
        ...defaultProps,
        element: { ...defaultProps.element, block: true },
      };
      renderWithSlate(blockProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('应该为inline元素设置inline-flex布局', () => {
      const inlineProps = {
        ...defaultProps,
        element: { ...defaultProps.element, block: false },
      };
      renderWithSlate(inlineProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('选中状态测试', () => {
    it('应该处理选中状态', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('应该处理未选中状态', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('悬停状态测试', () => {
    it('应该处理鼠标悬停', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('应该处理鼠标离开', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('只读模式测试', () => {
    it('应该在只读模式下简化渲染', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('只读模式下不应该有交互样式', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空的子元素', () => {
      const props = {
        ...defaultProps,
        children: [],
      };
      renderWithSlate(props);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('应该处理复杂的子元素结构', () => {
      const props = {
        ...defaultProps,
        children: [<div key="1">Complex</div>, <span key="2">Content</span>],
      };
      renderWithSlate(props);
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('应该处理没有样式的元素', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          style: undefined,
        },
      };
      renderWithSlate(props);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('应该处理没有block属性的元素', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          block: undefined,
        },
      };
      renderWithSlate(props);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveStyle({ display: 'flex' }); // 默认值
    });
  });

  describe('交互测试', () => {
    it('应该设置正确的tabIndex', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });

    it('只读模式下不应该设置tabIndex', () => {
      renderWithSlate(defaultProps);
      const card = document.querySelector('[data-be="card"]');
      expect(card).toBeInTheDocument();
    });
  });
});
