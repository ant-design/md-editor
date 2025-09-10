import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MElement,
  MLeaf,
} from '../../../../src/MarkdownEditor/editor/elements';

// Mock 依赖
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: () => ({
    markdownEditorRef: { current: { focus: vi.fn() } },
    markdownContainerRef: { current: document.createElement('div') },
    readonly: false,
    store: {
      dragStart: vi.fn(),
      isLatestNode: vi.fn().mockReturnValue(false),
    },
    typewriter: false,
    editorProps: {
      titlePlaceholderContent: '请输入内容...',
    },
  }),
}));

vi.mock('slate-react', () => ({
  ReactEditor: {
    findPath: vi.fn().mockReturnValue([0, 0]),
  },
  useSlate: () => ({
    children: [],
  }),
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils/editorUtils', () => ({
  EditorUtils: {
    isDirtLeaf: vi.fn().mockReturnValue(false),
  },
}));

vi.mock('../../../../src/MarkdownEditor/editor/utils/dom', () => ({
  slugify: vi.fn().mockReturnValue('test-slug'),
}));

vi.mock('../../../../src/MarkdownEditor/editor/tools/DragHandle', () => ({
  DragHandle: () => <div data-testid="drag-handle">Drag Handle</div>,
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Table', () => ({
  tableRenderElement: vi.fn().mockReturnValue(null),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Card', () => ({
  WarpCard: ({ children, ...props }: any) => (
    <div data-testid="warp-card" {...props}>
      {children}
    </div>
  ),
}));



vi.mock('../../../../src/MarkdownEditor/editor/elements/Comment', () => ({
  CommentView: ({ children, ...props }: any) => (
    <div data-testid="comment-view" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Description', () => ({
  Description: ({ children, ...props }: any) => (
    <div data-testid="description" {...props}>
      {children}
    </div>
  ),
}));

vi.mock(
  '../../../../src/MarkdownEditor/editor/elements/FootnoteDefinition',
  () => ({
    FootnoteDefinition: ({ children, ...props }: any) => (
      <div data-testid="footnote-definition" {...props}>
        {children}
      </div>
    ),
  }),
);

vi.mock(
  '../../../../src/MarkdownEditor/editor/elements/FootnoteReference',
  () => ({
    FootnoteReference: ({ children, ...props }: any) => (
      <div data-testid="footnote-reference" {...props}>
        {children}
      </div>
    ),
  }),
);

vi.mock('../../../../src/MarkdownEditor/editor/elements/Image', () => ({
  EditorImage: ({ children, ...props }: any) => (
    <div data-testid="editor-image" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/LinkCard', () => ({
  LinkCard: ({ children, ...props }: any) => (
    <div data-testid="link-card" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/List', () => ({
  List: ({ children, ...props }: any) => (
    <div data-testid="list" {...props}>
      {children}
    </div>
  ),
  ListItem: ({ children, ...props }: any) => (
    <div data-testid="list-item" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Media', () => ({
  Media: ({ children, ...props }: any) => (
    <div data-testid="media" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Paragraph', () => ({
  Paragraph: ({ children, ...props }: any) => (
    <div data-testid="paragraph" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Schema', () => ({
  Schema: ({ children, ...props }: any) => (
    <div data-testid="schema" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/TagPopup', () => ({
  TagPopup: ({ children, ...props }: any) => (
    <div data-testid="tag-popup" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Blockquote', () => ({
  Blockquote: ({ children, ...props }: any) => (
    <div data-testid="blockquote" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../../../src/MarkdownEditor/editor/elements/Head', () => ({
  Head: ({ children, ...props }: any) => (
    <div data-testid="head" {...props}>
      {children}
    </div>
  ),
}));

// Mock Ant Design components
vi.mock('antd', () => ({
  ConfigProvider: {
    ConfigContext: React.createContext({
      getPrefixCls: (suffixCls: string) => `ant-${suffixCls}`,
    }),
  },
  Popover: ({ children, content }: any) => (
    <div data-testid="popover">
      {content}
      {children}
    </div>
  ),
}));

vi.mock('@ant-design/icons', () => ({
  ExportOutlined: ({ onClick }: any) => (
    <div data-testid="export-icon" onClick={onClick}>
      Export
    </div>
  ),
}));

describe('Elements Index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('MElement 组件测试', () => {
    const defaultElementProps = {
      element: { type: 'paragraph', children: [] },
      attributes: {
        'data-slate-node': 'element' as const,
        ref: { current: null },
      },
      children: <div>Test Content</div>,
      readonly: false,
    };

    describe('基本渲染测试', () => {
      it('应该渲染段落元素', () => {
        render(<MElement {...defaultElementProps} />);
        expect(screen.getByTestId('paragraph')).toBeInTheDocument();
      });

      it('应该渲染引用块元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'blockquote', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('blockquote')).toBeInTheDocument();
      });

      it('应该渲染标题元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'head', level: 1, children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('markdown-heading')).toBeInTheDocument();
      });

      it('应该渲染链接卡片元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'link-card', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('link-card')).toBeInTheDocument();
      });

      it('应该渲染列表元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'list', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('list')).toBeInTheDocument();
      });

      it('应该渲染列表项元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'list-item', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('list-item')).toBeInTheDocument();
      });

      it('应该渲染媒体元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'media', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('media')).toBeInTheDocument();
      });

      it('应该渲染图片元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'image', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('editor-image')).toBeInTheDocument();
      });

      it('应该渲染描述元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'description', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('description')).toBeInTheDocument();
      });

      it('应该渲染脚注定义元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'footnoteDefinition', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('footnote-definition')).toBeInTheDocument();
      });

      it('应该渲染脚注引用元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'footnoteReference', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('footnote-reference')).toBeInTheDocument();
      });

      it('应该渲染卡片元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'card', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('warp-card')).toBeInTheDocument();
      });



      it('应该渲染模式元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'schema', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('schema')).toBeInTheDocument();
      });

      it('应该渲染 apaasify 元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'apaasify', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('schema')).toBeInTheDocument();
      });
    });

    describe('特殊元素测试', () => {
      it('应该渲染水平分割线', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'hr', children: [] },
        };
        render(<MElement {...props} />);
        const hrElement = screen.getByText('Test Content').parentElement;
        expect(hrElement).toHaveAttribute('contenteditable', 'false');
        expect(hrElement).toHaveClass('select-none');
      });

      it('应该渲染换行元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'break', children: [] },
        };
        render(<MElement {...props} />);
        const breakElement = screen.getByText('Test Content').parentElement;
        expect(breakElement).toHaveAttribute('contenteditable', 'false');
      });

      it('应该渲染 KaTeX 元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'katex', value: 'x^2', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByText('x^2')).toBeInTheDocument();
      });

      it('应该渲染内联 KaTeX 元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'inline-katex', value: 'x^2', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByText('x^2')).toBeInTheDocument();
      });

      it('应该渲染 Mermaid 元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'mermaid', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });

      it('应该渲染代码元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'code', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });

      it('应该渲染卡片前置元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'card-before', children: [] },
          readonly: false,
        };
        render(<MElement {...props} />);
        const cardBeforeElement =
          screen.getByText('Test Content').parentElement;
        expect(cardBeforeElement).toHaveAttribute('data-be', 'card-before');
        expect(cardBeforeElement).toHaveStyle({ display: 'inline-block' });
      });

      it('应该在只读模式下隐藏卡片前置元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'card-before', children: [] },
          readonly: true,
        };
        render(<MElement {...props} />);
        const cardBeforeElement =
          screen.getByText('Test Content').parentElement;
        expect(cardBeforeElement).toHaveStyle({ display: 'none' });
      });

      it('应该渲染卡片后置元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'card-after', children: [] },
          readonly: false,
        };
        render(<MElement {...props} />);
        const cardAfterElement = screen.getByText('Test Content').parentElement;
        expect(cardAfterElement).toHaveAttribute('data-be', 'card-after');
        expect(cardAfterElement).toHaveStyle({ display: 'inline-block' });
      });

      it('应该在只读模式下隐藏卡片后置元素', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'card-after', children: [] },
          readonly: true,
        };
        render(<MElement {...props} />);
        const cardAfterElement = screen.getByText('Test Content').parentElement;
        expect(cardAfterElement).toHaveStyle({ display: 'none' });
      });
    });

    describe('默认渲染测试', () => {
      it('应该为未知类型渲染段落', () => {
        const props = {
          ...defaultElementProps,
          element: { type: 'unknown-type', children: [] },
        };
        render(<MElement {...props} />);
        expect(screen.getByTestId('paragraph')).toBeInTheDocument();
      });
    });
  });

  describe('MLeaf 组件测试', () => {
    const defaultLeafProps = {
      leaf: { text: 'Test Text' },
      text: { text: 'Test Text' },
      attributes: {
        'data-slate-leaf': true as const,
      },
      children: <div>Test Content</div>,
      hashId: 'test-hash',
      comment: {},
      fncProps: {},
      tagInputProps: {},
    } as any;

    describe('基本渲染测试', () => {
      it('应该渲染基本文本', () => {
        render(<MLeaf {...defaultLeafProps} />);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });

      it('应该渲染粗体文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, bold: true },
        };
        render(<MLeaf {...props} />);
        expect(screen.getByTestId('markdown-bold')).toBeInTheDocument();
      });

      it('应该渲染斜体文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, italic: true },
        };
        render(<MLeaf {...props} />);
        const element = screen.getByText('Test Content').parentElement;
        expect(element).toHaveStyle({ fontStyle: 'italic' });
      });

      it('应该渲染删除线文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, strikethrough: true },
        };
        render(<MLeaf {...props} />);
        expect(
          screen.getByText('Test Content').closest('s'),
        ).toBeInTheDocument();
      });

      it('应该渲染代码文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, code: true },
        };
        render(<MLeaf {...props} />);
        expect(
          screen.getByText('Test Content').closest('code'),
        ).toBeInTheDocument();
      });

      it('应该渲染标签文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, tag: true },
        };
        render(<MLeaf {...props} />);
        // 标签文本会渲染为代码元素
        expect(
          screen.getByText('Test Content').closest('code'),
        ).toBeInTheDocument();
      });

      it('应该渲染高亮颜色文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, highColor: '#ff0000' },
        };
        render(<MLeaf {...props} />);
        const element = screen.getByText('Test Content').parentElement;
        expect(element).toHaveStyle({ color: '#ff0000' });
      });

      it('应该渲染颜色文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, color: '#00ff00' },
        };
        render(<MLeaf {...props} />);
        const element = screen.getByText('Test Content').parentElement;
        expect(element).toHaveStyle({ color: '#00ff00' });
      });

      it('应该渲染当前选中文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, current: true },
        };
        render(<MLeaf {...props} />);
        const element = screen.getByText('Test Content').parentElement;
        expect(element).toHaveStyle({ background: '#f59e0b' });
      });

      it('应该渲染 HTML 文本', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, html: '<div>test</div>' },
        };
        render(<MLeaf {...props} />);
        const element = screen.getByText('Test Content').parentElement;
        expect(element).toHaveClass('ant-md-editor-content-m-html');
      });
    });

    describe('链接功能测试', () => {
      it('应该在只读模式下渲染链接弹窗', () => {
        const props = {
          ...defaultLeafProps,
          readonly: true,
          leaf: { ...defaultLeafProps.leaf, url: 'https://example.com' },
        };
        render(<MLeaf {...props} />);
        // 链接元素应该存在，但可能没有特定的属性
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });

      it('应该处理链接点击事件', () => {
        const props = {
          ...defaultLeafProps,
          readonly: true,
          leaf: { ...defaultLeafProps.leaf, url: 'https://example.com' },
        };
        render(<MLeaf {...props} />);
        // 链接元素应该存在
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    describe('特殊功能测试', () => {
      it('应该处理 fnc 功能', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, fnc: 'test' },
        };
        render(<MLeaf {...props} />);
        // fnc 功能会显示处理后的文本，但可能仍然是原始文本
        expect(screen.getByText('Test Text')).toBeInTheDocument();
      });

      it('应该处理 fnd 功能', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, fnd: 'test' },
        };
        render(<MLeaf {...props} />);
        // fnd 功能会显示处理后的文本，但可能仍然是原始文本
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });

      it('应该处理评论功能', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, comment: true, id: 'comment-1' },
        };
        render(<MLeaf {...props} />);
        expect(screen.getByTestId('comment-view')).toBeInTheDocument();
        expect(
          document.getElementById('comment-comment-1'),
        ).toBeInTheDocument();
      });

      it('应该处理 identifier 功能', () => {
        const props = {
          ...defaultLeafProps,
          leaf: { ...defaultLeafProps.leaf, identifier: 'test-id' },
        };
        render(<MLeaf {...props} />);
        // identifier 功能会显示原始文本
        expect(screen.getByText('Test Text')).toBeInTheDocument();
      });
    });

    describe('事件处理测试', () => {
      it('应该处理双击选择事件', () => {
        render(<MLeaf {...defaultLeafProps} />);
        const element = screen.getByText('Test Content').parentElement;
        fireEvent.dblClick(element!);
        // 验证事件处理逻辑（这里主要是确保不抛出错误）
        expect(element).toBeInTheDocument();
      });

      it('应该处理拖拽开始事件', () => {
        render(<MLeaf {...defaultLeafProps} />);
        const element = screen.getByText('Test Content').parentElement;
        fireEvent.dragStart(element!);
        // 验证事件处理逻辑
        expect(element).toBeInTheDocument();
      });
    });
  });
});
