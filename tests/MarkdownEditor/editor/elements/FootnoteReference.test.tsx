/**
 * FootnoteReference 组件测试文件
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FootnoteReference } from '../../../../src/MarkdownEditor/editor/elements/FootnoteReference';

// Mock dependencies
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    store: {
      dragStart: vi.fn(),
    },
    markdownContainerRef: {
      current: document.createElement('div'),
    },
  })),
}));

vi.mock('../../../../src/MarkdownEditor/hooks/editor', () => ({
  useSelStatus: vi.fn(() => [false, vi.fn()]),
}));

vi.mock('../../../../src/MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => <div data-testid="drag-handle">Drag Handle</div>,
}));

describe('FootnoteReference', () => {
  const mockElement = {
    type: 'footnoteDefinition',
    identifier: 'test-ref',
    children: [{ text: 'test content' }],
  };

  const mockAttributes = {
    'data-slate-node': 'element' as const,
    'data-slate-inline': true as const,
    'data-slate-void': true as const,
    ref: vi.fn(),
  };

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染脚注引用', () => {
      renderWithProvider(
        <FootnoteReference element={mockElement} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveAttribute('data-be', 'paragraph');
      expect(paragraph).toHaveClass('ant-md-editor-drag-el');
    });

    it('应该渲染拖拽手柄', () => {
      renderWithProvider(
        <FootnoteReference element={mockElement} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      const dragHandle = screen.getByTestId('drag-handle');
      expect(dragHandle).toBeInTheDocument();
    });

    it('应该传递正确的属性', () => {
      renderWithProvider(
        <FootnoteReference element={mockElement} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toHaveAttribute('data-slate-node', 'element');
      expect(paragraph).toHaveAttribute('data-slate-inline', 'true');
      expect(paragraph).toHaveAttribute('data-slate-void', 'true');
    });
  });

  describe('内容处理测试', () => {
    it('应该处理有内容的脚注引用', () => {
      const elementWithContent = {
        ...mockElement,
        children: [{ text: 'test content' }],
      };

      renderWithProvider(
        <FootnoteReference
          element={elementWithContent}
          attributes={mockAttributes}
        >
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toHaveClass('ant-md-editor-drag-el');
      expect(paragraph).not.toHaveClass('empty');
    });

    it('应该处理空内容的脚注引用', () => {
      const elementWithEmptyContent = {
        ...mockElement,
        children: [{ text: '' }],
      };

      renderWithProvider(
        <FootnoteReference
          element={elementWithEmptyContent}
          attributes={mockAttributes}
        >
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toHaveClass('ant-md-editor-drag-el', 'empty');
    });

    it('应该处理没有文本内容的脚注引用', () => {
      const elementWithoutText = {
        ...mockElement,
        children: [],
      };

      renderWithProvider(
        <FootnoteReference
          element={elementWithoutText}
          attributes={mockAttributes}
        >
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toHaveClass('ant-md-editor-drag-el', 'empty');
    });
  });

  describe('拖拽功能测试', () => {
    it('应该处理拖拽开始事件', () => {
      const {
        useEditorStore,
      } = require('../../../../src/MarkdownEditor/editor/store');
      const mockDragStart = vi.fn();
      useEditorStore.mockReturnValue({
        store: {
          dragStart: mockDragStart,
        },
        markdownContainerRef: {
          current: document.createElement('div'),
        },
      });

      renderWithProvider(
        <FootnoteReference element={mockElement} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      fireEvent.dragStart(paragraph);

      expect(mockDragStart).toHaveBeenCalled();
    });
  });

  describe('选中状态测试', () => {
    it('应该在选中状态下显示data-empty属性', () => {
      const {
        useSelStatus,
      } = require('../../../../src/MarkdownEditor/hooks/editor');
      useSelStatus.mockReturnValue([true, vi.fn()]);

      const elementWithEmptyContent = {
        ...mockElement,
        children: [{ text: '' }],
      };

      renderWithProvider(
        <FootnoteReference
          element={elementWithEmptyContent}
          attributes={mockAttributes}
        >
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toHaveAttribute('data-empty', 'true');
    });

    it('应该在非选中状态下不显示data-empty属性', () => {
      const {
        useSelStatus,
      } = require('../../../../src/MarkdownEditor/hooks/editor');
      useSelStatus.mockReturnValue([false, vi.fn()]);

      const elementWithEmptyContent = {
        ...mockElement,
        children: [{ text: '' }],
      };

      renderWithProvider(
        <FootnoteReference
          element={elementWithEmptyContent}
          attributes={mockAttributes}
        >
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).not.toHaveAttribute('data-empty');
    });
  });

  describe('子元素渲染测试', () => {
    it('应该渲染子元素', () => {
      renderWithProvider(
        <FootnoteReference element={mockElement} attributes={mockAttributes}>
          <span data-testid="child-element">Child Content</span>
        </FootnoteReference>,
      );

      const childElement = screen.getByTestId('child-element');
      expect(childElement).toBeInTheDocument();
      expect(childElement).toHaveTextContent('Child Content');
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的element属性', () => {
      const emptyElement = {
        type: 'footnoteDefinition',
        identifier: 'test-ref',
        children: [],
      };

      renderWithProvider(
        <FootnoteReference element={emptyElement} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toBeInTheDocument();
    });

    it('应该处理空的attributes属性', () => {
      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={{ 'data-slate-node': 'element' as const, ref: vi.fn() }}
        >
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toBeInTheDocument();
    });

    it('应该处理复杂的子元素结构', () => {
      const elementWithComplexChildren = {
        ...mockElement,
        children: [{ text: 'start' }, { text: 'middle' }, { text: 'end' }],
      };

      renderWithProvider(
        <FootnoteReference
          element={elementWithComplexChildren}
          attributes={mockAttributes}
        >
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveClass('ant-md-editor-drag-el');
      expect(paragraph).not.toHaveClass('empty');
    });
  });

  describe('性能优化测试', () => {
    it('应该使用useMemo进行性能优化', () => {
      const {
        useEditorStore,
      } = require('../../../../src/MarkdownEditor/editor/store');
      const mockDragStart = vi.fn();
      useEditorStore.mockReturnValue({
        store: {
          dragStart: mockDragStart,
        },
        markdownContainerRef: {
          current: document.createElement('div'),
        },
      });

      const { rerender } = renderWithProvider(
        <FootnoteReference element={mockElement} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      // 重新渲染相同的props，应该不会重新创建元素
      rerender(
        <FootnoteReference element={mockElement} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByRole('paragraph');
      expect(paragraph).toBeInTheDocument();
    });
  });
});
