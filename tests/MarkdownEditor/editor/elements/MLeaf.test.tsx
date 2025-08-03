/**
 * MLeaf 组件测试文件
 *
 * 测试覆盖范围：
 * - 基本渲染功能
 * - 代码和标签组件
 * - 样式处理
 * - 事件处理
 * - 边界情况处理
 */

import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MLeaf } from '../../../../src/MarkdownEditor/editor/elements/MLeaf';

// Mock 依赖
vi.mock('../../../../src/MarkdownEditor/editor/elements/Comment', () => ({
  CommentView: ({ children, ...props }: any) => (
    <span data-testid="comment-view" {...props}>
      {children}
    </span>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/TagPopup', () => ({
  TagPopup: ({ children, ...props }: any) => (
    <span data-testid="tag-popup" {...props}>
      {children}
    </span>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: () => ({
    readonly: false,
  }),
}));

// 测试用的默认属性
const defaultProps = {
  leaf: {
    text: 'test text',
    bold: false,
    italic: false,
    strikethrough: false,
    code: false,
    tag: false,
    url: '',
    color: '',
    highColor: '',
    html: '',
    current: false,
    fnc: false,
    fnd: false,
    comment: false,
    identifier: '',
    placeholder: '',
    autoOpen: false,
    triggerText: '',
  },
  children: 'test content',
  attributes: {
    'data-slate-leaf': true,
  },
  text: { text: 'test text' },
  hashId: 'test-hash',
  comment: undefined,
  fncProps: undefined,
  tagInputProps: undefined,
  style: {},
  className: '',
};

describe('MLeaf Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ConfigProvider>{component}</ConfigProvider>);
  };

  describe('基本渲染功能', () => {
    it('应该正确渲染基本文本内容', () => {
      const { container } = renderWithProvider(
        <MLeaf {...defaultProps}>
          <span>测试文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector('[data-be="text"]');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveTextContent('测试文本');
    });

    it('应该处理自定义样式', () => {
      const customStyle = { color: 'red', fontSize: '16px' };
      const { container } = renderWithProvider(
        <MLeaf {...defaultProps} style={customStyle}>
          <span>测试文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector(
        '[data-be="text"]',
      ) as HTMLElement;
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveStyle('font-size: 16px');
    });
  });

  describe('代码和标签组件', () => {
    it('应该渲染代码内容', () => {
      const propsWithCode = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, code: true },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithCode}>
          <code>console.log("test")</code>
        </MLeaf>,
      );

      const codeElement = container.querySelector('code');
      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveTextContent('console.log("test")');
    });

    it('应该处理代码和标签的组合', () => {
      const propsWithCodeAndTag = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, code: true, tag: true },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithCodeAndTag}>
          <code>#tag</code>
        </MLeaf>,
      );

      const codeElement = container.querySelector('code');
      expect(codeElement).toBeInTheDocument();
    });
  });

  describe('评论视图组件', () => {
    it('应该渲染评论视图', () => {
      const mockComment = {
        commentItem: [{ id: '1', content: 'test comment' }],
      };

      const propsWithComment = {
        ...defaultProps,
        comment: mockComment,
        leaf: { ...defaultProps.leaf, comment: true },
      };

      const { getByTestId } = renderWithProvider(
        <MLeaf {...propsWithComment}>
          <span>评论文本</span>
        </MLeaf>,
      );

      const commentView = getByTestId('comment-view');
      expect(commentView).toBeInTheDocument();
    });

    it('应该在没有评论时直接渲染内容', () => {
      const propsWithoutComment = {
        ...defaultProps,
        comment: undefined,
        leaf: { ...defaultProps.leaf, comment: false },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithoutComment}>
          <span>普通文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector('[data-be="text"]');
      expect(textElement).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="comment-view"]'),
      ).not.toBeInTheDocument();
    });
  });

  describe('样式处理', () => {
    it('应该应用粗体样式', () => {
      const propsWithBold = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, bold: true },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithBold}>
          <strong>粗体文本</strong>
        </MLeaf>,
      );

      const boldElement = container.querySelector('strong');
      expect(boldElement).toBeInTheDocument();
    });

    it('应该应用斜体样式', () => {
      const propsWithItalic = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, italic: true },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithItalic}>
          <em>斜体文本</em>
        </MLeaf>,
      );

      const italicElement = container.querySelector('em');
      expect(italicElement).toBeInTheDocument();
    });

    it('应该应用删除线样式', () => {
      const propsWithStrikethrough = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, strikethrough: true },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithStrikethrough}>
          <s>删除线文本</s>
        </MLeaf>,
      );

      const strikethroughElement = container.querySelector('s');
      expect(strikethroughElement).toBeInTheDocument();
    });

    it('应该应用颜色样式', () => {
      const propsWithColor = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, color: 'red' },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithColor}>
          <span>彩色文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector(
        '[data-be="text"]',
      ) as HTMLElement;
      expect(textElement).toHaveStyle('color: rgb(255, 0, 0)');
    });

    it('应该应用高亮颜色样式', () => {
      const propsWithHighColor = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, highColor: 'yellow' },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithHighColor}>
          <span>高亮文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector(
        '[data-be="text"]',
      ) as HTMLElement;
      expect(textElement).toHaveStyle('background-color: rgb(255, 255, 0)');
    });
  });

  describe('事件处理', () => {
    it('应该处理鼠标按下事件', () => {
      const { container } = renderWithProvider(
        <MLeaf {...defaultProps}>
          <span>测试文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector(
        '[data-be="text"]',
      ) as HTMLElement;
      expect(() => {
        fireEvent.mouseDown(textElement);
      }).not.toThrow();
    });

    it('应该处理拖拽开始事件', () => {
      const { container } = renderWithProvider(
        <MLeaf {...defaultProps}>
          <span>测试文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector(
        '[data-be="text"]',
      ) as HTMLElement;
      expect(() => {
        fireEvent.dragStart(textElement);
      }).not.toThrow();
    });
  });

  describe('数据属性处理', () => {
    it('应该添加当前属性', () => {
      const propsWithCurrent = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, current: true },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithCurrent}>
          <span>当前文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector('[data-be="text"]');
      expect(textElement).toHaveAttribute('data-current', 'true');
    });

    it('应该添加函数属性', () => {
      const propsWithFnc = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, fnc: 'test-function' },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithFnc}>
          <span>函数文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector('[data-be="text"]');
      expect(textElement).toHaveAttribute('data-fnc', 'test-function');
    });

    it('应该添加标识符属性', () => {
      const propsWithIdentifier = {
        ...defaultProps,
        leaf: { ...defaultProps.leaf, identifier: 'test-id' },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithIdentifier}>
          <span>标识符文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector('[data-be="text"]');
      expect(textElement).toHaveAttribute('data-identifier', 'test-id');
    });
  });

  describe('边界情况处理', () => {
    it('应该处理空的 children', () => {
      const { container } = renderWithProvider(
        <MLeaf {...defaultProps}>{null}</MLeaf>,
      );

      const textElement = container.querySelector('[data-be="text"]');
      expect(textElement).toBeInTheDocument();
    });

    it('应该处理空的 attributes', () => {
      const propsWithEmptyAttributes = {
        ...defaultProps,
        attributes: {},
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithEmptyAttributes}>
          <span>测试文本</span>
        </MLeaf>,
      );

      const textElement = container.querySelector('[data-be="text"]');
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('复杂组合场景', () => {
    it('应该处理代码和链接的组合', () => {
      const propsWithCodeAndLink = {
        ...defaultProps,
        leaf: {
          ...defaultProps.leaf,
          code: true,
          url: 'https://example.com',
        },
      };

      const { container } = renderWithProvider(
        <MLeaf {...propsWithCodeAndLink}>
          <code>链接代码</code>
        </MLeaf>,
      );

      const codeElement = container.querySelector('code');
      expect(codeElement).toBeInTheDocument();
    });
  });
});
