/**
 * InlineKatex 组件测试文件
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InlineKatex } from '../../../../src/plugins/code/CodeUI/Katex/InlineKatex';

// Mock katex
vi.mock('katex', () => ({
  default: {
    render: vi.fn(),
  },
}));

// Mock useEditorStore
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: vi.fn(() => ({
    markdownEditorRef: { current: { focus: vi.fn() } },
    readonly: false,
  })),
}));

// Mock useSelStatus
vi.mock('../../../../src/MarkdownEditor/hooks/editor', () => ({
  useSelStatus: vi.fn(() => [false, [0]]),
}));

// Mock slate
vi.mock('slate', () => ({
  Editor: {
    end: vi.fn(() => ({ path: [0], offset: 0 })),
  },
  Node: {
    string: vi.fn(() => 'x^2 + y^2 = z^2'),
  },
  Transforms: {
    select: vi.fn(),
  },
}));

describe('InlineKatex Component', () => {
  const defaultProps: any = {
    element: {
      type: 'inline-katex',
      value: 'x^2 + y^2 = z^2',
      children: [{ text: 'test content' }],
    },
    attributes: {
      'data-testid': 'inline-katex',
    },
    children: <span>test content</span>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染 InlineKatex 组件', () => {
      render(<InlineKatex {...defaultProps} />);
      expect(screen.getByTestId('inline-katex')).toBeInTheDocument();
    });

    it('应该包含正确的 data-be 属性', () => {
      render(<InlineKatex {...defaultProps} />);
      const element = screen.getByTestId('inline-katex');
      expect(element).toHaveAttribute('data-be', 'inline-katex');
    });

    it('应该渲染子元素', () => {
      render(<InlineKatex {...defaultProps} />);
      expect(screen.getByText('test content')).toBeInTheDocument();
    });
  });

  describe('只读模式测试', () => {
    it('应该在只读模式下正确渲染', () => {
      const mockUseEditorStore =
        require('../../../../src/MarkdownEditor/editor/store').useEditorStore;
      mockUseEditorStore.mockReturnValue({
        markdownEditorRef: { current: { focus: vi.fn() } },
        readonly: true,
      });

      render(<InlineKatex {...defaultProps} />);
      expect(screen.getByTestId('inline-katex')).toBeInTheDocument();
    });

    it('应该在只读模式下隐藏编辑内容', () => {
      const mockUseEditorStore =
        require('../../../../src/MarkdownEditor/editor/store').useEditorStore;
      mockUseEditorStore.mockReturnValue({
        markdownEditorRef: { current: { focus: vi.fn() } },
        readonly: true,
      });

      render(<InlineKatex {...defaultProps} />);
      const editArea = screen
        .getByTestId('inline-katex')
        .querySelector('[contenteditable="true"]');
      expect(editArea).toHaveStyle({ visibility: 'hidden' });
    });
  });

  describe('选中状态测试', () => {
    it('应该在选中状态下显示编辑区域', () => {
      const mockUseSelStatus =
        require('../../../../src/MarkdownEditor/hooks/editor').useSelStatus;
      mockUseSelStatus.mockReturnValue([true, [0]]);

      render(<InlineKatex {...defaultProps} />);
      const editArea = screen
        .getByTestId('inline-katex')
        .querySelector('[contenteditable="true"]');
      expect(editArea).toHaveStyle({ visibility: 'visible' });
    });

    it('应该在选中状态下隐藏渲染区域', () => {
      const mockUseSelStatus =
        require('../../../../src/MarkdownEditor/hooks/editor').useSelStatus;
      mockUseSelStatus.mockReturnValue([true, [0]]);

      render(<InlineKatex {...defaultProps} />);
      const renderArea = screen
        .getByTestId('inline-katex')
        .querySelector('[contenteditable="false"]');
      expect(renderArea).toHaveStyle({ visibility: 'hidden' });
    });
  });

  describe('非选中状态测试', () => {
    it('应该在非选中状态下隐藏编辑区域', () => {
      const mockUseSelStatus =
        require('../../../../src/MarkdownEditor/hooks/editor').useSelStatus;
      mockUseSelStatus.mockReturnValue([false, [0]]);

      render(<InlineKatex {...defaultProps} />);
      const editArea = screen
        .getByTestId('inline-katex')
        .querySelector('[contenteditable="true"]');
      expect(editArea).toHaveStyle({ visibility: 'hidden' });
    });

    it('应该在非选中状态下显示渲染区域', () => {
      const mockUseSelStatus =
        require('../../../../src/MarkdownEditor/hooks/editor').useSelStatus;
      mockUseSelStatus.mockReturnValue([false, [0]]);

      render(<InlineKatex {...defaultProps} />);
      const renderArea = screen
        .getByTestId('inline-katex')
        .querySelector('[contenteditable="false"]');
      expect(renderArea).toHaveStyle({ visibility: 'visible' });
    });
  });

  describe('交互测试', () => {
    it('应该处理渲染区域点击事件', async () => {
      const user = userEvent.setup();
      const mockSelect = vi.fn();
      const mockTransforms = require('slate').Transforms;
      mockTransforms.select.mockImplementation(mockSelect);

      render(<InlineKatex {...defaultProps} />);
      const renderArea = screen
        .getByTestId('inline-katex')
        .querySelector('[contenteditable="false"]');

      if (renderArea) {
        await user.click(renderArea);
        expect(mockSelect).toHaveBeenCalled();
      }
    });
  });

  describe('Katex 渲染测试', () => {
    it('应该在非选中状态下调用 katex.render', () => {
      const mockKatex = require('katex').default;
      const mockUseSelStatus =
        require('../../../../src/MarkdownEditor/hooks/editor').useSelStatus;
      mockUseSelStatus.mockReturnValue([false, [0]]);

      render(<InlineKatex {...defaultProps} />);

      expect(mockKatex.render).toHaveBeenCalledWith(
        'x^2 + y^2 = z^2',
        expect.any(HTMLElement),
        expect.objectContaining({
          strict: false,
          output: 'htmlAndMathml',
          throwOnError: false,
          displayMode: false,
          macros: {
            '\\f': '#1f(#2)',
          },
        }),
      );
    });

    it('不应该在选中状态下调用 katex.render', () => {
      const mockKatex = require('katex').default;
      const mockUseSelStatus =
        require('../../../../src/MarkdownEditor/hooks/editor').useSelStatus;
      mockUseSelStatus.mockReturnValue([true, [0]]);

      render(<InlineKatex {...defaultProps} />);

      expect(mockKatex.render).not.toHaveBeenCalled();
    });
  });

  describe('测试环境处理', () => {
    it('应该在测试环境中返回特殊元素', () => {
      // 模拟测试环境
      const originalProcess = global.process;
      global.process = {
        ...originalProcess,
        env: { ...originalProcess.env, NODE_ENV: 'test' },
      };

      render(<InlineKatex {...defaultProps} />);
      const testElement = screen.getAllByRole('generic')[0];
      expect(testElement).toHaveAttribute('contenteditable', 'false');
      expect(testElement).toHaveStyle({ fontSize: 0 });

      // 恢复原始环境
      global.process = originalProcess;
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的数学公式', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: '',
        },
      };

      render(<InlineKatex {...props} />);
      expect(screen.getByTestId('inline-katex')).toBeInTheDocument();
    });

    it('应该处理复杂的数学公式', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
        },
      };

      render(<InlineKatex {...props} />);
      expect(screen.getByTestId('inline-katex')).toBeInTheDocument();
    });

    it('应该处理未定义的属性', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: undefined,
        },
      };

      expect(() => {
        render(<InlineKatex {...props} />);
      }).not.toThrow();
    });
  });
});
