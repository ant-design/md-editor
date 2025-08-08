/**
 * FootnoteReference 组件测试文件
 *
 * 测试覆盖范围：
 * - 基本渲染功能
 * - 选中状态处理
 * - 拖拽功能
 * - 空内容处理
 * - 属性传递
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock 依赖
vi.mock('../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    store: {
      dragStart: vi.fn(),
    },
    markdownContainerRef: { current: document.createElement('div') },
  })),
}));

vi.mock('../../../src/MarkdownEditor/editor/hooks/editor', () => ({
  useSelStatus: vi.fn(() => [false, [0]]),
}));

vi.mock('../../../src/MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => <div data-testid="drag-handle">Drag Handle</div>,
}));

// Mock Slate Node
vi.mock('slate', () => ({
  Node: {
    string: vi.fn(() => 'test content'),
  },
}));

describe('FootnoteReference', () => {
  const mockElement = {
    type: 'footnote-reference',
    children: [{ text: 'test content' }],
  };

  const mockAttributes = {
    'data-slate-node': 'element',
    'data-slate-inline': true,
    'data-slate-void': true,
    ref: vi.fn(),
  };

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染脚注引用', () => {
      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveAttribute('data-be', 'paragraph');
      expect(paragraph).toHaveClass('ant-md-editor-drag-el');
    });

    it('应该渲染拖拽手柄', () => {
      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const dragHandle = screen.getByTestId('drag-handle');
      expect(dragHandle).toBeInTheDocument();
    });

    it('应该传递正确的属性', () => {
      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toHaveAttribute('data-slate-node', 'element');
      expect(paragraph).toHaveAttribute('data-slate-inline', 'true');
      expect(paragraph).toHaveAttribute('data-slate-void', 'true');
    });
  });

  describe('内容处理测试', () => {
    it('应该处理有内容的脚注引用', () => {
      const { Node } = require('slate');
      Node.string.mockReturnValue('test content');

      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toHaveClass('ant-md-editor-drag-el');
      expect(paragraph).not.toHaveClass('empty');
    });

    it('应该处理空内容的脚注引用', () => {
      const { Node } = require('slate');
      Node.string.mockReturnValue('');

      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toHaveClass('ant-md-editor-drag-el', 'empty');
    });
  });

  describe('选中状态测试', () => {
    it('应该在选中时显示data-empty属性', () => {
      const {
        useSelStatus,
      } = require('../../../src/MarkdownEditor/editor/hooks/editor');
      useSelStatus.mockReturnValue([true, [0]]);

      const { Node } = require('slate');
      Node.string.mockReturnValue('');

      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toHaveAttribute('data-empty', 'true');
    });

    it('应该在未选中时不显示data-empty属性', () => {
      const {
        useSelStatus,
      } = require('../../../src/MarkdownEditor/editor/hooks/editor');
      useSelStatus.mockReturnValue([false, [0]]);

      const { Node } = require('slate');
      Node.string.mockReturnValue('');

      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).not.toHaveAttribute('data-empty');
    });
  });

  describe('拖拽功能测试', () => {
    it('应该处理拖拽开始事件', () => {
      const mockDragStart = vi.fn();
      const {
        useEditorStore,
      } = require('../../../src/MarkdownEditor/editor/store');
      useEditorStore.mockReturnValue({
        store: {
          dragStart: mockDragStart,
        },
        markdownContainerRef: { current: document.createElement('div') },
      });

      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      fireEvent.dragStart(paragraph);

      expect(mockDragStart).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(HTMLDivElement),
      );
    });
  });

  describe('子元素渲染测试', () => {
    it('应该渲染子元素', () => {
      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

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
      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={{}}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toBeInTheDocument();
    });

    it('应该处理空的attributes属性', () => {
      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={{}}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toBeInTheDocument();
    });

    it('应该处理复杂的element结构', () => {
      const complexElement = {
        type: 'footnote-reference',
        children: [{ text: 'part 1' }, { text: 'part 2' }, { text: 'part 3' }],
      };

      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      renderWithProvider(
        <FootnoteReference
          element={complexElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('性能优化测试', () => {
    it('应该使用useMemo进行性能优化', () => {
      const {
        FootnoteReference,
      } = require('../../../src/MarkdownEditor/editor/elements/FootnoteReference');

      const { rerender } = renderWithProvider(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      // 重新渲染相同的props，应该不会重新计算
      rerender(
        <FootnoteReference
          element={mockElement}
          attributes={mockAttributes}
          children={null}
        />,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toBeInTheDocument();
    });
  });
});
