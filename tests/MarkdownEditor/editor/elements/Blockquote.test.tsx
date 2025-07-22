import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Blockquote } from '../../../../src/MarkdownEditor/editor/elements/Blockquote';

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

vi.mock('../../../../src/MarkdownEditor/editor/hooks/editor', () => ({
  useSelStatus: vi.fn(() => [false, [0]]),
}));

vi.mock('../../../../src/MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => <div data-testid="drag-handle">Drag Handle</div>,
}));

describe('Blockquote', () => {
  const defaultProps = {
    element: {
      type: 'blockquote' as const,
      children: [{ text: 'Test content' }],
    },
    attributes: {
      'data-slate-node': 'element' as const,
      ref: { current: null },
    },
    children: [<div key="1">Test Content</div>],
  } as any;

  describe('基本渲染测试', () => {
    it('应该正确渲染引用块元素', () => {
      render(<Blockquote {...defaultProps} />);
      const blockquote = document.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
    });

    it('应该应用正确的样式类', () => {
      render(<Blockquote {...defaultProps} />);
      const blockquote = document.querySelector('blockquote');
      expect(blockquote).toHaveAttribute('data-be', 'blockquote');
    });

    it('应该渲染子元素', () => {
      render(<Blockquote {...defaultProps} />);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空内容', () => {
      const props = {
        ...defaultProps,
        element: { ...defaultProps.element, children: [{ text: '' }] },
        children: [<div key="1"></div>],
      };
      render(<Blockquote {...props} />);
      const blockquote = document.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
    });

    it('应该处理复杂的子元素结构', () => {
      const props = {
        ...defaultProps,
        children: [<div key="1">Complex</div>, <span key="2">Content</span>],
      };
      render(<Blockquote {...props} />);
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
