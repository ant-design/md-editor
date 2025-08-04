/**
 * Paragraph 组件测试文件
 *
 * 测试覆盖范围：
 * - 基本渲染功能
 * - 对齐方式
 * - 边界情况处理
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Paragraph } from '../../../../src/MarkdownEditor/editor/elements/Paragraph';

// Mock 依赖
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: () => ({
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
  }),
}));

vi.mock('../../../../src/MarkdownEditor/hooks/editor', () => ({
  useSelStatus: () => [false, [0, 0]],
}));

vi.mock('../../../../src/MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => <div data-testid="drag-handle" />,
}));

vi.mock('slate', () => ({
  Node: {
    string: vi.fn(() => 'test content'),
  },
}));

describe('Paragraph Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  const defaultProps = {
    element: {
      type: 'paragraph',
      align: 'left',
      children: [{ text: 'test content' }],
    },
    attributes: {},
    children: <span>test content</span>,
  };

  describe('基本渲染功能', () => {
    it('应该正确渲染 Paragraph 组件', () => {
      const { container } = renderWithProvider(<Paragraph {...defaultProps} />);

      const paragraphElement = container.querySelector('[data-be="paragraph"]');
      expect(paragraphElement).toBeInTheDocument();
      expect(paragraphElement).toHaveTextContent('test content');
    });

    it('应该显示拖拽手柄', () => {
      const { getByTestId } = renderWithProvider(
        <Paragraph {...defaultProps} />,
      );

      const dragHandle = getByTestId('drag-handle');
      expect(dragHandle).toBeInTheDocument();
    });

    it('应该显示内容', () => {
      const { container } = renderWithProvider(<Paragraph {...defaultProps} />);

      expect(container).toHaveTextContent('test content');
    });
  });

  describe('对齐方式处理', () => {
    it('应该处理左对齐', () => {
      const propsWithLeftAlign = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          align: 'left',
        },
      };

      const { container } = renderWithProvider(
        <Paragraph {...propsWithLeftAlign} />,
      );

      const paragraphElement = container.querySelector('[data-be="paragraph"]');
      expect(paragraphElement).toHaveAttribute('data-align', 'left');
    });

    it('应该处理居中对齐', () => {
      const propsWithCenterAlign = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          align: 'center',
        },
      };

      const { container } = renderWithProvider(
        <Paragraph {...propsWithCenterAlign} />,
      );

      const paragraphElement = container.querySelector('[data-be="paragraph"]');
      expect(paragraphElement).toHaveAttribute('data-align', 'center');
    });

    it('应该处理右对齐', () => {
      const propsWithRightAlign = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          align: 'right',
        },
      };

      const { container } = renderWithProvider(
        <Paragraph {...propsWithRightAlign} />,
      );

      const paragraphElement = container.querySelector('[data-be="paragraph"]');
      expect(paragraphElement).toHaveAttribute('data-align', 'right');
    });
  });

  describe('边界情况处理', () => {
    it('应该处理空的 attributes', () => {
      const propsWithEmptyAttributes = {
        ...defaultProps,
        attributes: {},
      };

      const { container } = renderWithProvider(
        <Paragraph {...propsWithEmptyAttributes} />,
      );

      const paragraphElement = container.querySelector('[data-be="paragraph"]');
      expect(paragraphElement).toBeInTheDocument();
    });

    it('应该处理自定义 attributes', () => {
      const customAttributes = {
        'data-test': 'test-value',
      };

      const propsWithCustomAttributes = {
        ...defaultProps,
        attributes: customAttributes,
      };

      const { container } = renderWithProvider(
        <Paragraph {...propsWithCustomAttributes} />,
      );

      const paragraphElement = container.querySelector('[data-be="paragraph"]');
      expect(paragraphElement).toHaveAttribute('data-test', 'test-value');
    });

    it('应该处理空的 children', () => {
      const propsWithEmptyChildren = {
        ...defaultProps,
        children: null,
      };

      const { container } = renderWithProvider(
        <Paragraph {...propsWithEmptyChildren} />,
      );

      const paragraphElement = container.querySelector('[data-be="paragraph"]');
      expect(paragraphElement).toBeInTheDocument();
    });
  });

  describe('样式处理', () => {
    it('应该应用正确的类名', () => {
      const { container } = renderWithProvider(<Paragraph {...defaultProps} />);

      const paragraphElement = container.querySelector('[data-be="paragraph"]');
      expect(paragraphElement).toHaveClass('ant-md-editor-drag-el');
    });
  });

  describe('内容渲染', () => {
    it('应该渲染复杂的 children', () => {
      const complexChildren = (
        <div>
          <span>复杂内容</span>
          <strong>粗体文本</strong>
        </div>
      );

      const propsWithComplexChildren = {
        ...defaultProps,
        children: complexChildren,
      };

      const { container } = renderWithProvider(
        <Paragraph {...propsWithComplexChildren} />,
      );

      expect(container).toHaveTextContent('复杂内容');
      expect(container).toHaveTextContent('粗体文本');
    });

    it('应该处理多个 children', () => {
      const multipleChildren = [
        <span key="1">第一个</span>,
        <span key="2">第二个</span>,
        <span key="3">第三个</span>,
      ];

      const propsWithMultipleChildren = {
        ...defaultProps,
        children: multipleChildren,
      };

      const { container } = renderWithProvider(
        <Paragraph {...propsWithMultipleChildren} />,
      );

      expect(container).toHaveTextContent('第一个');
      expect(container).toHaveTextContent('第二个');
      expect(container).toHaveTextContent('第三个');
    });
  });
});
