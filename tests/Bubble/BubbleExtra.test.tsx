import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BubbleExtra } from '../../src/Bubble/MessagesContent/BubbleExtra';

// Mock antd components
vi.mock('antd', () => ({
  Popover: ({ children, content, ...props }: any) => (
    <div data-testid="popover" {...props}>
      {children}
      {content}
    </div>
  ),
  Tooltip: ({ children, title, ...props }: any) => (
    <div data-testid="tooltip" title={title} {...props}>
      {children}
    </div>
  ),
  Typography: {
    Text: ({ children, ...props }: any) => (
      <span data-testid="typography-text" {...props}>
        {children}
      </span>
    ),
  },
  ConfigProvider: ({ children }: any) => <div>{children}</div>,
  Divider: ({ type }: any) => <div data-testid="divider" data-type={type} />,
  Drawer: ({ children, title, onClose, ...props }: any) => (
    <div data-testid="drawer" {...props}>
      <div data-testid="drawer-title">{title}</div>
      <button data-testid="drawer-close" onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  ),
  Descriptions: ({ children, ...props }: any) => (
    <div data-testid="descriptions" {...props}>
      {children}
    </div>
  ),
  DescriptionsItem: ({ children, ...props }: any) => (
    <div data-testid="descriptions-item" {...props}>
      {children}
    </div>
  ),
  theme: {
    useToken: () => ({
      token: {
        colorError: '#ff4d4f',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorInfo: '#1890ff',
        colorText: '#000000',
        colorTextSecondary: '#666666',
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        borderRadius: 6,
        fontSize: 14,
        lineHeight: 1.5714,
        padding: 12,
        margin: 8,
      },
    }),
  },
}));

// Mock @ant-design/icons
vi.mock('@ant-design/icons', () => ({
  LikeOutlined: () => <div data-testid="like-icon">Like</div>,
  DislikeOutlined: () => <div data-testid="dislike-icon">Dislike</div>,
  CopyOutlined: () => <div data-testid="copy-icon">Copy</div>,
  ReloadOutlined: () => <div data-testid="reload-icon">Reload</div>,
  PlayCircleOutlined: () => <div data-testid="slides-icon">Slides</div>,
  MessageOutlined: () => <div data-testid="reply-icon">Reply</div>,
  SelectOutlined: () => <div data-testid="select-icon">Select</div>,
  BoldOutlined: () => <div data-testid="bold-icon">Bold</div>,
  ItalicOutlined: () => <div data-testid="italic-icon">Italic</div>,
  UnderlineOutlined: () => <div data-testid="underline-icon">Underline</div>,
  StrikethroughOutlined: () => (
    <div data-testid="strikethrough-icon">Strikethrough</div>
  ),
  CodeOutlined: () => <div data-testid="code-icon">Code</div>,
  OrderedListOutlined: () => (
    <div data-testid="ordered-list-icon">OrderedList</div>
  ),
  UnorderedListOutlined: () => (
    <div data-testid="unordered-list-icon">UnorderedList</div>
  ),
  BlockquoteOutlined: () => <div data-testid="blockquote-icon">Blockquote</div>,
  LinkOutlined: () => <div data-testid="link-icon">Link</div>,
  PictureOutlined: () => <div data-testid="picture-icon">Picture</div>,
  TableOutlined: () => <div data-testid="table-icon">Table</div>,
  H1Outlined: () => <div data-testid="h1-icon">H1</div>,
  H2Outlined: () => <div data-testid="h2-icon">H2</div>,
  H3Outlined: () => <div data-testid="h3-icon">H3</div>,
  H4Outlined: () => <div data-testid="h4-icon">H4</div>,
  H5Outlined: () => <div data-testid="h5-icon">H5</div>,
  H6Outlined: () => <div data-testid="h6-icon">H6</div>,
  LoadingOutlined: () => <div data-testid="loading-icon">Loading</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock copy-to-clipboard
vi.mock('copy-to-clipboard', () => ({
  default: vi.fn(),
}));

// Mock dayjs
vi.mock('dayjs', () => ({
  default: {
    format: vi.fn(() => '2024-01-01'),
    fromNow: vi.fn(() => '1 hour ago'),
  },
}));

// Mock classnames
vi.mock('classnames', () => ({
  default: vi.fn(() => 'test-class'),
}));

// Mock useRefFunction
vi.mock('../../../hooks/useRefFunction', () => ({
  useRefFunction: vi.fn((fn) => fn),
}));

// Mock useCopied
vi.mock('../../../hooks/useCopied', () => ({
  useCopied: vi.fn(() => ({
    copied: false,
    setCopied: vi.fn(),
  })),
}));

// Mock ActionIconBox
vi.mock('../../../index', () => ({
  ActionIconBox: ({
    children,
    onClick,
    title,
    style,
    scale,
    dataTestid,
    ...props
  }: any) => (
    <span
      data-testid={dataTestid || 'action-icon-box'}
      onClick={onClick}
      style={style}
      title={title}
      data-scale={scale ? 'true' : 'false'}
      {...props}
    >
      {children}
    </span>
  ),
}));

describe('BubbleExtra', () => {
  const defaultProps = {
    onLike: vi.fn(),
    onDisLike: vi.fn(),
    onReply: vi.fn(),
    onOpenSlidesMode: vi.fn(),
    onRenderExtraNull: vi.fn(),
    slidesModeProps: { enable: false },
    readonly: false,
    feedback: undefined,
    answerStatus: 'finished',
    typing: false,
    originalData: {
      id: 'test-id',
      content: 'Test content',
      isLast: true,
      isFinished: true,
      isAborted: false,
    },
    style: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染基本组件', () => {
      render(<BubbleExtra {...defaultProps} />);

      expect(screen.getByTestId('bubble-extra')).toBeInTheDocument();
    });

    it('应该处理只读模式', () => {
      const props = {
        ...defaultProps,
        readonly: true,
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('readonly')).toHaveTextContent('true');
    });

    it('应该处理非最新消息', () => {
      const props = {
        ...defaultProps,
        originalData: {
          ...defaultProps.originalData,
          isLast: false,
        },
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('is-latest')).toHaveTextContent('false');
    });

    it('应该处理紧凑模式', () => {
      const props = {
        ...defaultProps,
        style: { compact: true },
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('bubble-extra')).toBeInTheDocument();
    });
  });

  describe('交互测试', () => {
    it('应该处理点赞操作', async () => {
      const onLike = vi.fn();
      const props = {
        ...defaultProps,
        onLike,
      };

      render(<BubbleExtra {...props} />);

      const likeButton = screen.getByTestId('like-btn');
      fireEvent.click(likeButton);

      await waitFor(() => {
        expect(onLike).toHaveBeenCalled();
      });
    });

    it('应该处理点踩操作', async () => {
      const onDisLike = vi.fn();
      const props = {
        ...defaultProps,
        onDisLike,
      };

      render(<BubbleExtra {...props} />);

      const dislikeButton = screen.getByTestId('dislike-btn');
      fireEvent.click(dislikeButton);

      await waitFor(() => {
        expect(onDisLike).toHaveBeenCalled();
      });
    });

    it('应该处理回复操作', async () => {
      const onReply = vi.fn();
      const props = {
        ...defaultProps,
        onReply,
      };

      render(<BubbleExtra {...props} />);

      const replyButton = screen.getByTestId('reply-btn');
      fireEvent.click(replyButton);

      await waitFor(() => {
        expect(onReply).toHaveBeenCalledWith('test reply');
      });
    });

    it('应该处理幻灯片模式操作', async () => {
      const onOpenSlidesMode = vi.fn();
      const props = {
        ...defaultProps,
        onOpenSlidesMode,
      };

      render(<BubbleExtra {...props} />);

      const slidesButton = screen.getByTestId('slides-btn');
      fireEvent.click(slidesButton);

      await waitFor(() => {
        expect(onOpenSlidesMode).toHaveBeenCalled();
      });
    });
  });

  describe('配置测试', () => {
    it('应该处理幻灯片模式启用', () => {
      const props = {
        ...defaultProps,
        slidesModeProps: { enable: true },
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('slides-enabled')).toBeInTheDocument();
    });

    it('应该处理自定义渲染', () => {
      const customRender = vi.fn(() => (
        <div data-testid="custom-render">Custom</div>
      ));
      const props = {
        ...defaultProps,
        render: customRender,
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('custom-render')).toBeInTheDocument();
    });

    it('应该处理onRenderExtraNull回调', () => {
      const onRenderExtraNull = vi.fn();
      const props = {
        ...defaultProps,
        onRenderExtraNull,
      };

      render(<BubbleExtra {...props} />);

      const extraNullButton = screen.getByTestId('extra-null-btn');
      fireEvent.click(extraNullButton);

      expect(onRenderExtraNull).toHaveBeenCalledWith(true);
    });
  });

  describe('状态测试', () => {
    it('应该处理typing状态', () => {
      const props = {
        ...defaultProps,
        typing: true,
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('bubble-extra')).toBeInTheDocument();
    });

    it('应该处理feedback状态', () => {
      const props = {
        ...defaultProps,
        feedback: 'thumbsUp',
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('bubble-extra')).toBeInTheDocument();
    });

    it('应该处理answerStatus状态', () => {
      const props = {
        ...defaultProps,
        answerStatus: 'aborted',
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('bubble-extra')).toBeInTheDocument();
    });
  });
});
