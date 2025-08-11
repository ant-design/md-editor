/**
 * Description 组件测试文件
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Description } from '../../../../src/MarkdownEditor/editor/elements/Description';
import { TestSlateWrapper } from './TestSlateWrapper';

// Mock dependencies
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    store: {
      dragStart: vi.fn(),
    },
    markdownContainerRef: {
      current: {
        clientWidth: 800,
      },
    },
  })),
}));

vi.mock(
  '../../../../src/MarkdownEditor/editor/elements/Description/style',
  () => ({
    useStyle: vi.fn(() => ({
      wrapSSR: (component: React.ReactElement) => component,
      hashId: 'test-hash-id',
    })),
  }),
);

describe('Description', () => {
  const mockElement = {
    type: 'description',
    children: [
      { type: 'description-item', children: [{ text: 'Item 1' }] },
      { type: 'description-item', children: [{ text: 'Item 2' }] },
      { type: 'description-item', children: [{ text: 'Item 3' }] },
      { type: 'description-item', children: [{ text: 'Item 4' }] },
    ],
  };

  const mockAttributes = {
    'data-slate-node': 'element' as const,
    ref: vi.fn(),
  };

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <ConfigProvider>
        <TestSlateWrapper>{component}</TestSlateWrapper>
      </ConfigProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染 Description 组件', () => {
      renderWithProvider(
        <Description element={mockElement} attributes={mockAttributes}>
          <td>Item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
          <td>Item 4</td>
        </Description>,
      );

      const descriptionElement = screen.getByTestId('description-container');
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement).toHaveAttribute('data-be', 'table');
    });

    it('应该渲染表格结构', () => {
      renderWithProvider(
        <Description element={mockElement} attributes={mockAttributes}>
          <td>Item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
          <td>Item 4</td>
        </Description>,
      );

      const tableElement = screen.getByTestId('description-table');
      expect(tableElement).toBeInTheDocument();
      expect(tableElement.tagName).toBe('TABLE');
    });
  });

  describe('样式和类名测试', () => {
    it('应该应用正确的类名', () => {
      renderWithProvider(
        <Description element={mockElement} attributes={mockAttributes}>
          <td>Item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
          <td>Item 4</td>
        </Description>,
      );

      const descriptionElement = screen.getByTestId('description-container');
      expect(descriptionElement).toHaveClass('ant-md-editor-description');
      expect(descriptionElement).toHaveClass('ant-md-editor-drag-el');
      expect(descriptionElement).toHaveClass('test-hash-id');
    });

    it('应该应用表格类名', () => {
      renderWithProvider(
        <Description element={mockElement} attributes={mockAttributes}>
          <td>Item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
          <td>Item 4</td>
        </Description>,
      );

      const tableElement = screen.getByTestId('description-table');
      expect(tableElement).toHaveClass('ant-md-editor-description-table');
      expect(tableElement).toHaveClass('test-hash-id');
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的子元素数组', () => {
      const emptyElement = {
        ...mockElement,
        children: [],
      };

      renderWithProvider(
        <Description element={emptyElement} attributes={mockAttributes}>
          {[]}
        </Description>,
      );

      const rows = screen.queryAllByTestId('description-row');
      expect(rows).toHaveLength(0);
    });

    it('应该处理复杂的子元素', () => {
      const complexElement = {
        ...mockElement,
        children: [
          { type: 'description-item', children: [{ text: 'Complex Item 1' }] },
          { type: 'description-item', children: [{ text: 'Complex Item 2' }] },
        ],
      };

      renderWithProvider(
        <Description element={complexElement} attributes={mockAttributes}>
          <td>
            <div>
              <span>Complex Item 1</span>
              <strong>Bold Text</strong>
            </div>
          </td>
          <td>
            <div>
              <span>Complex Item 2</span>
              <em>Italic Text</em>
            </div>
          </td>
        </Description>,
      );

      const rows = screen.getAllByTestId('description-row');
      expect(rows).toHaveLength(1);
      expect(screen.getByText('Complex Item 1')).toBeInTheDocument();
      expect(screen.getByText('Complex Item 2')).toBeInTheDocument();
    });

    it('应该处理不同类型的子元素', () => {
      const mixedElement = {
        ...mockElement,
        children: [
          { type: 'description-item', children: [{ text: 'String Item' }] },
          { type: 'description-item', children: [{ text: '123' }] },
          { type: 'description-item', children: [{ text: 'true' }] },
        ],
      };

      renderWithProvider(
        <Description element={mixedElement} attributes={mockAttributes}>
          <td>String Item</td>
          <td>123</td>
          <td>true</td>
        </Description>,
      );

      expect(screen.getByText('String Item')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByText('true')).toBeInTheDocument();
    });
  });
});
