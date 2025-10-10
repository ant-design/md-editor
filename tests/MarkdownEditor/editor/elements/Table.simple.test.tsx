import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Td, Th } from '../../../../src/MarkdownEditor/editor/elements/Table';

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

vi.mock('slate-react', () => ({
  useSlateSelection: vi.fn(),
  useSlateStatic: vi.fn(() => ({
    children: [{ children: [] }],
  })),
  useSlate: vi.fn(() => ({
    children: [{ children: [] }],
  })),
}));

vi.mock('../../../../src/MarkdownEditor/utils/slate-table', () => ({
  TableCursor: {
    isSelected: vi.fn(() => false),
  },
}));

describe('Table Components - Simple Tests', () => {
  describe('Th (表头单元格)', () => {
    const defaultThProps = {
      element: {
        type: 'header-cell' as const,
        children: [{ text: 'Header Cell' }],
      },
      attributes: {
        'data-slate-node': 'element' as const,
        ref: { current: null },
      },
      children: [<div key="1">Header Content</div>],
    } as any;

    it('应该正确渲染表头单元格', () => {
      render(<Th {...defaultThProps} />);
      const th = document.querySelector('th');
      expect(th).toBeInTheDocument();
    });

    it('应该显示表头内容', () => {
      render(<Th {...defaultThProps} />);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('应该处理错误的元素类型', () => {
      const invalidProps = {
        ...defaultThProps,
        element: { type: 'invalid-type' },
      };
      expect(() => render(<Th {...invalidProps} />)).toThrow(
        'Element "Th" must be of type "header-cell"',
      );
    });
  });

  describe('Td (表格单元格)', () => {
    const defaultTdProps = {
      element: {
        type: 'table-cell' as const,
        children: [{ text: 'Cell Content' }],
        align: 'center',
        width: '100px',
        rowSpan: 2,
        colSpan: 3,
      },
      attributes: {
        'data-slate-node': 'element' as const,
        ref: { current: null },
      },
      children: [<div key="1">Cell Content</div>],
    } as any;

    it('应该正确渲染表格单元格', () => {
      render(<Td {...defaultTdProps} />);
      const td = document.querySelector('td');
      expect(td).toBeInTheDocument();
    });

    it('应该显示单元格内容', () => {
      render(<Td {...defaultTdProps} />);
      expect(screen.getByText('Cell Content')).toBeInTheDocument();
    });

    it('应该应用对齐样式', () => {
      render(<Td {...defaultTdProps} />);
      const td = document.querySelector('td');
      expect(td).toHaveStyle({ textAlign: 'center' });
    });

    it('应该应用宽度样式', () => {
      render(<Td {...defaultTdProps} />);
      const td = document.querySelector('td');
      expect(td).toHaveStyle({ width: '100px' });
    });

    it('应该设置rowSpan和colSpan属性', () => {
      render(<Td {...defaultTdProps} />);
      const td = document.querySelector('td');
      expect(td).toHaveAttribute('rowSpan', '2');
      expect(td).toHaveAttribute('colSpan', '3');
    });

    it('应该处理隐藏的单元格', () => {
      const hiddenProps = {
        ...defaultTdProps,
        element: {
          ...defaultTdProps.element,
          hidden: true,
        },
      };
      render(<Td {...hiddenProps} />);
      const td = document.querySelector('td');
      expect(td).toHaveStyle({ display: 'none' });
    });

    it('应该处理错误的元素类型', () => {
      const invalidProps = {
        ...defaultTdProps,
        element: { type: 'invalid-type' },
      };
      expect(() => render(<Td {...invalidProps} />)).toThrow(
        'Element "Td" must be of type "table-cell"',
      );
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空的子元素', () => {
      const props = {
        element: { type: 'table-cell' as const, children: [] },
        attributes: {
          'data-slate-node': 'element' as const,
          ref: { current: null },
        },
        children: [],
      };
      render(<Td {...props} />);
      const td = document.querySelector('td');
      expect(td).toBeInTheDocument();
    });

    it('应该处理复杂的子元素结构', () => {
      const props = {
        element: { type: 'table-cell' as const, children: [] },
        attributes: {
          'data-slate-node': 'element' as const,
          ref: { current: null },
        },
        children: [<div key="1">Complex</div>, <span key="2">Content</span>],
      };
      render(<Td {...props} />);
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
