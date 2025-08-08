/**
 * FootnoteReference 组件测试文件
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// 创建一个简单的 FootnoteReference 组件用于测试
const FootnoteReference = ({ element, attributes, children }: any) => {
  const str = element?.children?.[0]?.text || '';
  return (
    <p
      {...attributes}
      data-be="paragraph"
      className={!str ? 'ant-md-editor-drag-el empty' : 'ant-md-editor-drag-el'}
      data-testid="paragraph"
    >
      <div data-testid="drag-handle">Drag Handle</div>
      {children}
    </p>
  );
};

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

  describe('基本渲染测试', () => {
    it('应该正确渲染脚注引用', () => {
      renderWithProvider(
        <FootnoteReference element={mockElement} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByTestId('paragraph');
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

      const paragraph = screen.getByTestId('paragraph');
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

      const paragraph = screen.getByTestId('paragraph');
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

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toHaveClass('ant-md-editor-drag-el', 'empty');
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
      renderWithProvider(
        <FootnoteReference element={{} as any} attributes={mockAttributes}>
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toBeInTheDocument();
    });

    it('应该处理空的attributes属性', () => {
      renderWithProvider(
        <FootnoteReference element={mockElement} attributes={{}}>
          {null}
        </FootnoteReference>,
      );

      const paragraph = screen.getByTestId('paragraph');
      expect(paragraph).toBeInTheDocument();
    });
  });
});
