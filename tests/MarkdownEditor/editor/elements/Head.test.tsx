import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Head } from '../../../../src/MarkdownEditor/editor/elements/Head';

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

vi.mock('../../../../src/utils/dom', () => ({
  slugify: vi.fn((text: string) => text.toLowerCase().replace(/\s+/g, '-')),
}));

describe('Head', () => {
  const defaultProps = {
    element: {
      type: 'head' as const,
      level: 1,
      children: [{ text: 'Test Heading' }],
      align: 'left',
    },
    attributes: {
      'data-slate-node': 'element' as const,
      ref: { current: null },
    },
    children: [<div key="1">Test Content</div>],
  } as any;

  describe('基本渲染测试', () => {
    it('应该正确渲染标题元素', () => {
      render(<Head {...defaultProps} />);
      const heading = document.querySelector('h1');
      expect(heading).toBeInTheDocument();
    });

    it('应该应用正确的样式类', () => {
      render(<Head {...defaultProps} />);
      const heading = document.querySelector('h1');
      expect(heading).toHaveClass('ant-md-editor-drag-el');
    });

    it('应该渲染子元素', () => {
      render(<Head {...defaultProps} />);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('应该设置正确的对齐属性', () => {
      render(<Head {...defaultProps} />);
      const heading = document.querySelector('h1');
      expect(heading).toHaveAttribute('data-align', 'left');
    });

    it('应该包含拖拽手柄', () => {
      render(<Head {...defaultProps} />);
      expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
    });
  });

  describe('不同级别标题测试', () => {
    it('应该渲染 h1 标题', () => {
      render(<Head {...defaultProps} />);
      const heading = document.querySelector('h1');
      expect(heading).toBeInTheDocument();
    });

    it('应该渲染 h2 标题', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, level: 2 },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h2');
      expect(heading).toBeInTheDocument();
    });

    it('应该渲染 h3 标题', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, level: 3 },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h3');
      expect(heading).toBeInTheDocument();
    });

    it('应该渲染 h4 标题', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, level: 4 },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h4');
      expect(heading).toBeInTheDocument();
    });

    it('应该渲染 h5 标题', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, level: 5 },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h5');
      expect(heading).toBeInTheDocument();
    });

    it('应该渲染 h6 标题', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, level: 6 },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h6');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('对齐测试', () => {
    it('应该支持居中对齐', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, align: 'center' },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h1');
      expect(heading).toHaveAttribute('data-align', 'center');
    });

    it('应该支持右对齐', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, align: 'right' },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h1');
      expect(heading).toHaveAttribute('data-align', 'right');
    });

    it('应该支持两端对齐', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, align: 'justify' },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h1');
      expect(heading).toHaveAttribute('data-align', 'justify');
    });
  });

  describe('空标题测试', () => {
    it('应该处理空标题', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, children: [{ text: '' }] },
        children: [<div key="1"></div>],
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h1');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理无效的标题级别', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, level: 7 },
      };
      render(<Head {...props} />);
      const heading = document.querySelector('h7');
      expect(heading).toBeInTheDocument();
    });

    it('应该处理复杂的子元素结构', () => {
      const props = {
        ...defaultProps,
        children: [<div key="1">Complex</div>, <span key="2">Content</span>],
      };
      render(<Head {...props} />);
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
