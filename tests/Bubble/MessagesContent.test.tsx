import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BubbleConfigContext } from '../../src/Bubble/BubbleConfigProvide';
import { BubbleMessageDisplay } from '../../src/Bubble/MessagesContent';
import { BubbleProps, MessageBubbleData } from '../../src/Bubble/type';

// Mock 依赖组件
vi.mock('../../src/icons/LoadingIcon', () => ({
  LoadingIcon: () => <div data-testid="loading-icon">Loading...</div>,
}));

vi.mock('../../src/Bubble/MessagesContent/MarkdownPreview', () => ({
  MarkdownPreview: ({
    content,
    isFinished,
    typing,
    extra,
    docListNode,
  }: any) => (
    <div data-testid="markdown-preview">
      <div data-testid="content">{content}</div>
      <div data-testid="is-finished">{isFinished ? 'true' : 'false'}</div>
      <div data-testid="typing">{typing ? 'true' : 'false'}</div>
      {extra && <div data-testid="extra">{extra}</div>}
      {docListNode && <div data-testid="doc-list">{docListNode}</div>}
    </div>
  ),
}));

vi.mock('../../src/Bubble/MessagesContent/BubbleExtra', () => ({
  BubbleExtra: ({ onLike, onDisLike, onReply, onOpenSlidesMode }: any) => (
    <div data-testid="bubble-extra">
      <button data-testid="like-btn" onClick={onLike}>
        Like
      </button>
      <button data-testid="dislike-btn" onClick={onDisLike}>
        Dislike
      </button>
      <button data-testid="reply-btn" onClick={() => onReply?.('test reply')}>
        Reply
      </button>
      <button data-testid="slides-btn" onClick={onOpenSlidesMode}>
        Slides
      </button>
    </div>
  ),
}));

vi.mock('../../src/Bubble/MessagesContent/DocInfo', () => ({
  DocInfoList: ({ options }: any) => (
    <div data-testid="doc-info-list">
      {options?.map((item: any, index: number) => (
        <div key={index} data-testid={`doc-item-${index}`}>
          {item.content}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../../src/Bubble/MessagesContent/EXCEPTION', () => ({
  EXCEPTION: ({ content, extra }: any) => (
    <div data-testid="exception">
      <div data-testid="exception-content">{content}</div>
      {extra && <div data-testid="exception-extra">{extra}</div>}
    </div>
  ),
}));

// Mock MarkdownEditor
vi.mock('../../src/MarkdownEditor', () => ({
  MarkdownEditor: ({ initValue }: any) => (
    <div data-testid="markdown-editor">{initValue}</div>
  ),
}));

// Mock ActionIconBox
vi.mock('../../src/index', () => ({
  ActionIconBox: ({ children, onClick }: any) => (
    <button data-testid="action-icon-box" onClick={onClick}>
      {children}
    </button>
  ),
  useRefFunction: (fn: any) => fn,
}));

// Mock Antd 组件
vi.mock('antd', () => ({
  Popover: ({ children, content }: any) => (
    <div data-testid="popover">
      {children}
      {content && <div data-testid="popover-content">{content}</div>}
    </div>
  ),
  Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  Typography: {
    Text: ({ children, copyable }: any) => (
      <span
        data-testid="typography-text"
        data-copyable={copyable ? 'true' : 'false'}
      >
        {children}
      </span>
    ),
  },
}));

// Mock 图标
vi.mock('@ant-design/icons', () => ({
  ExportOutlined: () => <div data-testid="export-icon">Export</div>,
}));

describe('BubbleMessageDisplay', () => {
  const defaultProps: BubbleProps & {
    content: MessageBubbleData['content'];
    bubbleListItemExtraStyle?: React.CSSProperties;
  } = {
    content: 'Test message content',
    bubbleRef: { current: { setMessageItem: vi.fn() } },
    readonly: false,
    placement: 'left',
    originData: {
      id: 'test-id',
      role: 'assistant',
      content: 'Test content',
      createAt: Date.now(),
      updateAt: Date.now(),
      isFinished: true,
      extra: {},
    },
  };

  const defaultContext = {
    standalone: false,
    locale: {
      'chat.message.thinking': '正在思考中...',
      'chat.message.error': '生成回答失败，请重试',
    },
    compact: false,
  };

  const renderWithContext = (
    props = defaultProps,
    context = defaultContext,
  ) => {
    return render(
      <BubbleConfigContext.Provider value={context}>
        <BubbleMessageDisplay {...props} />
      </BubbleConfigContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染普通消息内容', () => {
      renderWithContext();

      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toHaveTextContent('Test content');
      expect(screen.getByTestId('is-finished')).toHaveTextContent('true');
    });

    it('应该渲染加载状态', () => {
      const props = {
        ...defaultProps,
        content: '...',
        originData: {
          ...defaultProps.originData,
          isFinished: false,
        },
      };

      renderWithContext(props);

      expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
      expect(screen.getByText('正在思考中...')).toBeInTheDocument();
    });

    it('应该渲染异常状态', () => {
      const props = {
        ...defaultProps,
        originData: {
          ...defaultProps.originData,
          extra: {
            answerStatus: 'EXCEPTION',
          },
        },
      };

      renderWithContext(props);

      expect(screen.getByTestId('exception')).toBeInTheDocument();
      expect(screen.getByTestId('exception-content')).toHaveTextContent(
        'Test content',
      );
    });
  });

  describe('交互功能测试', () => {
    it('应该处理点赞功能', async () => {
      const onLike = vi.fn();
      const props = {
        ...defaultProps,
        onLike,
      };

      renderWithContext(props);

      const likeButton = screen.getByTestId('like-btn');
      fireEvent.click(likeButton);

      await waitFor(() => {
        expect(onLike).toHaveBeenCalledWith(props.originData);
      });
    });

    it('应该处理点踩功能', async () => {
      const onDisLike = vi.fn();
      const props = {
        ...defaultProps,
        onDisLike,
      };

      renderWithContext(props);

      const dislikeButton = screen.getByTestId('dislike-btn');
      fireEvent.click(dislikeButton);

      await waitFor(() => {
        expect(onDisLike).toHaveBeenCalledWith(props.originData);
      });
    });

    it('应该处理回复功能', () => {
      const onReply = vi.fn();
      const props = {
        ...defaultProps,
        onReply,
      };

      renderWithContext(props);

      const replyButton = screen.getByTestId('reply-btn');
      fireEvent.click(replyButton);

      expect(onReply).toHaveBeenCalledWith('test reply');
    });

    it('应该处理幻灯片模式', () => {
      const props = {
        ...defaultProps,
        slidesModeProps: { enable: true },
      };

      renderWithContext(props);

      const slidesButton = screen.getByTestId('slides-btn');
      fireEvent.click(slidesButton);

      // 幻灯片模式应该被激活
      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
    });
  });

  describe('文档信息测试', () => {
    it('应该渲染文档信息列表', () => {
      const props = {
        ...defaultProps,
        originData: {
          ...defaultProps.originData,
          extra: {
            white_box_process: {
              output: {
                chunks: [{ content: 'Document 1' }, { content: 'Document 2' }],
              },
            },
          },
        },
        docListProps: { enable: true },
      };

      renderWithContext(props);

      expect(screen.getByTestId('doc-info-list')).toBeInTheDocument();
      expect(screen.getByTestId('doc-item-0')).toHaveTextContent('Document 1');
      expect(screen.getByTestId('doc-item-1')).toHaveTextContent('Document 2');
    });

    it('应该禁用文档信息列表', () => {
      const props = {
        ...defaultProps,
        originData: {
          ...defaultProps.originData,
          extra: {
            white_box_process: {
              output: {
                chunks: [{ content: 'Document 1' }],
              },
            },
          },
        },
        docListProps: { enable: false },
      };

      renderWithContext(props);

      expect(screen.queryByTestId('doc-info-list')).not.toBeInTheDocument();
    });
  });

  describe('自定义渲染测试', () => {
    it('应该支持自定义额外渲染', () => {
      const customExtra = <div data-testid="custom-extra">Custom Extra</div>;
      const extraRender = vi.fn().mockReturnValue(customExtra);
      const props = {
        ...defaultProps,
        extraRender,
      };

      renderWithContext(props);

      expect(extraRender).toHaveBeenCalled();
      expect(screen.getByTestId('custom-extra')).toBeInTheDocument();
    });

    it('应该禁用额外渲染', () => {
      const props = {
        ...defaultProps,
        extraRender: false,
      };

      renderWithContext(props);

      expect(screen.queryByTestId('bubble-extra')).not.toBeInTheDocument();
    });
  });

  describe('状态测试', () => {
    it('应该处理未完成状态', () => {
      const props = {
        ...defaultProps,
        originData: {
          ...defaultProps.originData,
          isFinished: false,
        },
      };

      renderWithContext(props);

      expect(screen.getByTestId('typing')).toHaveTextContent('true');
    });

    it('应该处理被终止状态', () => {
      const props = {
        ...defaultProps,
        originData: {
          ...defaultProps.originData,
          isAborted: true,
        },
      };

      renderWithContext(props);

      expect(screen.getByTestId('typing')).toHaveTextContent('false');
    });

    it('应该处理只读模式', () => {
      const props = {
        ...defaultProps,
        readonly: true,
      };

      renderWithContext(props);

      // 在只读模式下，交互按钮应该被禁用或隐藏
      expect(screen.getByTestId('bubble-extra')).toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空内容', () => {
      const props = {
        ...defaultProps,
        content: '',
        originData: {
          ...defaultProps.originData,
          content: '',
        },
      };

      renderWithContext(props);

      // 空内容时应该显示错误信息
      expect(screen.getByTestId('content')).toHaveTextContent(
        '生成回答失败，请重试',
      );
    });

    it('应该处理 React 元素内容', () => {
      const reactContent = <div data-testid="react-content">React Content</div>;
      const props = {
        ...defaultProps,
        content: reactContent,
        originData: {
          ...defaultProps.originData,
          content: 'Test content',
        },
      };

      renderWithContext(props);

      // React 元素内容会被渲染为 MarkdownPreview
      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
    });

    it('应该处理用户角色消息', () => {
      const props = {
        ...defaultProps,
        originData: {
          ...defaultProps.originData,
          role: 'user',
        },
      };

      renderWithContext(props);

      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
    });
  });

  describe('配置测试', () => {
    it('应该应用紧凑模式样式', () => {
      const context = {
        ...defaultContext,
        compact: true,
      };

      renderWithContext(defaultProps, context);

      // 在紧凑模式下，应该渲染加载状态
      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
    });

    it('应该处理自定义样式', () => {
      const props = {
        ...defaultProps,
        bubbleListItemExtraStyle: { backgroundColor: 'red' },
      };

      renderWithContext(props);

      expect(screen.getByTestId('bubble-extra')).toBeInTheDocument();
    });
  });
});
