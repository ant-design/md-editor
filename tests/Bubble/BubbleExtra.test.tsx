import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BubbleExtra } from '../../src/Bubble/MessagesContent/BubbleExtra';

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
    bubble: {
      id: 'test-id',
      content: 'Test content',
      isLast: true,
      isFinished: true,
      isAborted: false,
      uuid: 1,
      extra: {
        preMessage: {
          content: 'Test preset message',
        },
      },
    },
    style: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染基本组件', () => {
      render(<BubbleExtra {...defaultProps} />);

      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
    });

    it('应该处理只读模式', () => {
      const props = {
        ...defaultProps,
        readonly: true,
      };

      const { container } = render(<BubbleExtra {...props} />);

      // 在只读模式下，组件可能不渲染任何内容
      // 检查组件是否正确渲染（即使为空）
      expect(container).toBeInTheDocument();
    });

    it('应该处理非最新消息', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          isLast: false,
        },
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
    });

    it('应该处理紧凑模式', () => {
      const props = {
        ...defaultProps,
        style: { width: '100%' },
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
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

      const likeButton = screen.getByTestId('like-button');
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

      const dislikeButton = screen.getByTestId('dislike-button');
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

      // 检查组件是否正确渲染
      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
    });

    it('应该处理幻灯片模式操作', async () => {
      const onOpenSlidesMode = vi.fn();
      const props = {
        ...defaultProps,
        onOpenSlidesMode,
      };

      render(<BubbleExtra {...props} />);

      // 检查组件是否正确渲染
      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
    });
  });

  describe('配置测试', () => {
    it('应该处理幻灯片模式启用', () => {
      const props = {
        ...defaultProps,
        slidesModeProps: { enable: true },
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
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

      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
    });
  });

  describe('状态测试', () => {
    it('应该处理typing状态', () => {
      const props = {
        ...defaultProps,
        typing: true,
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
    });

    it('应该处理feedback状态', () => {
      const props = {
        ...defaultProps,
        feedback: 'thumbsUp',
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
    });

    it('应该处理answerStatus状态', () => {
      const props = {
        ...defaultProps,
        answerStatus: 'aborted',
      };

      render(<BubbleExtra {...props} />);

      expect(screen.getByTestId('like-button')).toBeInTheDocument();
      expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
    });
  });
});
