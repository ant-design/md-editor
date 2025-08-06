/**
 * Schema 组件测试文件
 *
 * 测试覆盖范围：
 * - 基本渲染功能
 * - agentar-card 渲染
 * - 边界情况处理
 * - 样式处理
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Schema } from '../../../../src/MarkdownEditor/editor/elements/Schema';

// Mock 依赖
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    editorProps: {
      apaasify: {
        enable: false,
        render: null,
      },
    },
  })),
}));

vi.mock('@ant-design/md-editor/schema', () => ({
  SchemaRenderer: ({
    schema,
    values,
    debug,
    fallbackContent,
    useDefaultValues,
  }: any) => (
    <div
      data-testid="schema-renderer"
      data-schema={JSON.stringify(schema)}
      data-values={JSON.stringify(values)}
    >
      Schema Renderer
    </div>
  ),
}));

describe('Schema Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  const defaultProps = {
    element: {
      type: 'code',
      language: 'json',
      value: { test: 'value' },
      attributes: {},
    },
    children: <span>测试内容</span>,
  };

  describe('基本渲染功能', () => {
    it('应该正确渲染 Schema 组件', () => {
      const { container } = renderWithProvider(<Schema {...defaultProps} />);

      const element = container.querySelector('[data-be="code"]');
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent('{ "test": "value" }');
    });

    it('应该渲染隐藏的子内容', () => {
      const { container } = renderWithProvider(<Schema {...defaultProps} />);

      const hiddenSpan = container.querySelector('span');
      expect(hiddenSpan).toBeInTheDocument();
      expect(hiddenSpan).toHaveStyle('display: none');
      expect(hiddenSpan).toHaveTextContent('测试内容');
    });
  });

  describe('agentar-card 渲染', () => {
    it('应该为 agentar-card 语言渲染 SchemaRenderer', () => {
      const agentarProps = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'agentar-card',
          value: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
            initialValues: { name: '测试' },
          },
        },
      };

      const { getByTestId } = renderWithProvider(<Schema {...agentarProps} />);

      const schemaRenderer = getByTestId('schema-renderer');
      expect(schemaRenderer).toBeInTheDocument();
      expect(schemaRenderer).toHaveTextContent('Schema Renderer');
    });

    it('应该为 agentar-card 添加正确的样式类', () => {
      const agentarProps = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'agentar-card',
          value: { test: 'value' },
        },
      };

      const { container } = renderWithProvider(<Schema {...agentarProps} />);

      const cardElement = container.querySelector('.md-editor-agentar-card');
      expect(cardElement).toBeInTheDocument();
    });
  });

  describe('边界情况处理', () => {
    it('应该处理空的 value', () => {
      const emptyValueProps = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: null,
        },
      };

      const { container } = renderWithProvider(<Schema {...emptyValueProps} />);

      const element = container.querySelector('[data-be="code"]');
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent('null');
    });

    it('应该处理复杂的 value 对象', () => {
      const complexValueProps = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: {
            nested: {
              array: [1, 2, 3],
              object: { key: 'value' },
            },
          },
        },
      };

      const { container } = renderWithProvider(
        <Schema {...complexValueProps} />,
      );

      const element = container.querySelector('[data-be="code"]');
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent('"nested"');
    });

    it('应该处理空的 children', () => {
      const emptyChildrenProps = {
        ...defaultProps,
        children: null,
      };

      const { container } = renderWithProvider(
        <Schema {...emptyChildrenProps} />,
      );

      const element = container.querySelector('[data-be="code"]');
      expect(element).toBeInTheDocument();
    });
  });

  describe('样式处理', () => {
    it('应该应用正确的样式', () => {
      const { container } = renderWithProvider(<Schema {...defaultProps} />);

      const element = container.querySelector(
        '[data-be="code"]',
      ) as HTMLElement;
      expect(element).toHaveStyle('padding: 8px');
      expect(element).toHaveStyle('width: 100%');
      expect(element).toHaveStyle('cursor: pointer');
    });

    it('应该传递 attributes', () => {
      const propsWithAttributes = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          attributes: {
            'data-testid': 'schema-element',
            className: 'custom-class',
          },
        },
      };

      const { getByTestId } = renderWithProvider(
        <Schema {...propsWithAttributes} />,
      );

      const element = getByTestId('schema-element');
      expect(element).toHaveClass('custom-class');
    });
  });
});
