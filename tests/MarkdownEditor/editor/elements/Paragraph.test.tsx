import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Paragraph } from '../../../../src/MarkdownEditor/editor/elements/Paragraph';

// Mock dependencies
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    store: {
      dragStart: vi.fn(),
      isLatestNode: vi.fn(() => false),
    },
    markdownEditorRef: { current: { children: [{ children: [] }] } },
    markdownContainerRef: { current: document.createElement('div') },
    typewriter: false,
    readonly: false,
    editorProps: {
      titlePlaceholderContent: '请输入内容...',
    },
  })),
}));

vi.mock('../../../../src/MarkdownEditor/editor/hooks/editor', () => ({
  useSelStatus: vi.fn(() => [false, [0]]),
}));

vi.mock('../../../../src/MarkdownEditor/editor/slate-react', () => ({
  useSlate: vi.fn(() => ({
    children: [{ children: [] }],
  })),
  ReactEditor: {
    isFocused: vi.fn(() => false),
    findPath: vi.fn(() => [0]),
  },
}));

vi.mock('../../../../src/MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => <div data-testid="drag-handle">Drag Handle</div>,
}));

describe('Paragraph', () => {
  const defaultProps = {
    element: {
      type: 'paragraph' as const,
      children: [{ text: 'Test content' }],
      align: 'left',
    },
    attributes: {
      'data-slate-node': 'element' as const,
      ref: { current: null },
    },
    children: [<div key="1">Test Content</div>],
  } as any;

  describe('基本渲染测试', () => {
    it('应该正确渲染段落元素', () => {
      render(<Paragraph {...defaultProps} />);
      const paragraph = document.querySelector('[data-be="paragraph"]');
      expect(paragraph).toBeInTheDocument();
    });

    it('应该应用正确的对齐样式', () => {
      render(<Paragraph {...defaultProps} />);
      const paragraph = document.querySelector('[data-be="paragraph"]');
      expect(paragraph).toHaveAttribute('data-align', 'left');
    });

    it('应该包含拖拽手柄', () => {
      render(<Paragraph {...defaultProps} />);
      expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
    });

    it('应该渲染子元素', () => {
      render(<Paragraph {...defaultProps} />);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('空段落测试', () => {
    it('应该处理空段落', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, children: [{ text: '' }] },
        children: [<div key="1"></div>],
      };
      render(<Paragraph {...props} />);
      const paragraph = document.querySelector('[data-be="paragraph"]');
      expect(paragraph).toBeInTheDocument();
    });

    it('应该为空段落显示占位符', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, children: [{ text: '' }] },
        children: [<div key="1"></div>],
      };
      render(<Paragraph {...props} />);
      const paragraph = document.querySelector('[data-be="paragraph"]');
      expect(paragraph).toHaveAttribute(
        'data-slate-placeholder',
        '请输入内容...',
      );
    });
  });

  describe('对齐测试', () => {
    it('应该支持居中对齐', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, align: 'center' },
      };
      render(<Paragraph {...props} />);
      const paragraph = document.querySelector('[data-be="paragraph"]');
      expect(paragraph).toHaveAttribute('data-align', 'center');
    });

    it('应该支持右对齐', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, align: 'right' },
      };
      render(<Paragraph {...props} />);
      const paragraph = document.querySelector('[data-be="paragraph"]');
      expect(paragraph).toHaveAttribute('data-align', 'right');
    });

    it('应该支持两端对齐', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, align: 'justify' },
      };
      render(<Paragraph {...props} />);
      const paragraph = document.querySelector('[data-be="paragraph"]');
      expect(paragraph).toHaveAttribute('data-align', 'justify');
    });
  });

  describe('边界条件测试', () => {
    it('应该处理没有子元素的情况', () => {
      const props = {
        ...defaultProps,
        children: [],
      };
      render(<Paragraph {...props} />);
      const paragraph = document.querySelector('[data-be="paragraph"]');
      expect(paragraph).toBeInTheDocument();
    });

    it('应该处理复杂的子元素结构', () => {
      const props = {
        ...defaultProps,
        children: [<div key="1">Complex</div>, <span key="2">Content</span>],
      };
      render(<Paragraph {...props} />);
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
