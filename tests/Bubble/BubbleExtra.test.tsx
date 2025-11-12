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

// Mock CopyButton
vi.mock('../../src/Bubble/MessagesContent/CopyButton', () => ({
  CopyButton: ({
    children,
    onClick,
    title,
    style,
    dataTestid,
    ...props
  }: any) => (
    <span
      data-testid={dataTestid || 'copy-button'}
      onClick={onClick}
      style={style}
      title={title}
      {...props}
    >
      {children}
    </span>
  ),
}));

// Mock VoiceButton
vi.mock('../../src/Bubble/MessagesContent/VoiceButton', () => ({
  VoiceButton: ({ text, ...props }: any) => (
    <span data-testid="voice-button" {...props}>
      Voice: {text}
    </span>
  ),
}));

// Mock copy-to-clipboard
vi.mock('copy-to-clipboard', () => ({
  default: vi.fn(),
}));

describe('BubbleExtra', () => {
  const defaultProps = {
    onLike: vi.fn(),
    onDisLike: vi.fn(),
    onReply: vi.fn(),
    onOpenSlidesMode: vi.fn(),
    onRenderExtraNull: vi.fn(),
    readonly: false,
    feedback: undefined,
    answerStatus: 'finished',
    typing: false,
    bubble: {
      id: 'test-id',
      content: 'Test content',
      isFinished: true,
      isAborted: false,
      uuid: 1,
      extra: {
        preMessage: {
          content: 'Test preset message',
        },
      },
      originData: {
        id: 'test-id',
        role: 'assistant' as const,
        content: 'Test content',
        createAt: Date.now(),
        updateAt: Date.now(),
        isFinished: true,
        isAborted: false,
        uuid: 1,
        extra: {
          preMessage: {
            content: 'Test preset message',
          },
        },
      },
    },
    style: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 新增测试用例来覆盖指定的代码行
  describe('新增覆盖率测试', () => {
    it('应该处理isHistory为true的情况（第116-117行）', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            isFinished: false,
            extra: {
              ...defaultProps.bubble.originData.extra,
              isHistory: true,
            },
          },
        },
      };

      render(<BubbleExtra {...props} />);

      // 当isHistory为true时，typing应该为false，相关按钮应该显示
      expect(screen.getByTestId('like-button')).toBeInTheDocument();
    });

    it('应该处理复制按钮点击和错误情况（第244-246行和第249行）', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      
      // 获取copy模块并模拟错误
      const copyModule = await import('copy-to-clipboard');
      const copyMock = copyModule.default as unknown as { 
        mockImplementationOnce: (fn: () => any) => void;
      };
      copyMock.mockImplementationOnce(() => {
        throw new Error('Copy failed');
      });

      render(<BubbleExtra {...defaultProps} />);

      const copyButton = screen.getByTestId('chat-item-copy-button');
      fireEvent.click(copyButton);

      // 等待错误处理
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '复制失败:',
          new Error('Copy failed'),
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('应该处理复制按钮点击成功情况（第244-246行）', async () => {
      // 获取copy模块并模拟成功
      const copyModule = await import('copy-to-clipboard');
      const copyMock = copyModule.default as unknown as { 
        mockImplementationOnce: (fn: () => any) => void;
      };
      copyMock.mockImplementationOnce(() => true);

      render(<BubbleExtra {...defaultProps} />);

      const copyButton = screen.getByTestId('chat-item-copy-button');
      fireEvent.click(copyButton);

      // 应该调用copy函数
      expect(copyMock).toHaveBeenCalledWith('Test content');
    });

    it('应该处理回答被中止的情况（第336行）', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            isAborted: true,
            isFinished: false,
          },
        },
      };

      render(<BubbleExtra {...props} />);

      // 应该显示"回答已停止生成"的文本
      expect(
        screen.getByText('回答已停止生成'),
      ).toBeInTheDocument();
    });

    it('应该处理没有预设消息的情况（第338行）', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            extra: {
              preMessage: undefined,
            } as any,
          },
        },
      };

      render(<BubbleExtra {...props} />);

      // 没有预设消息，不应该显示重新发送按钮
      expect(screen.queryByTestId('reply-button')).not.toBeInTheDocument();
    });

    it('应该处理重新发送按钮点击（第349-353行）', async () => {
      const onReply = vi.fn();
      const props = {
        ...defaultProps,
        onReply,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            extra: {
              preMessage: {
                content: 'Previous message content',
              },
            },
          },
        },
      };

      render(<BubbleExtra {...props} />);

      const replyButton = screen.getByTestId('reply-button');
      fireEvent.click(replyButton);

      await waitFor(() => {
        expect(onReply).toHaveBeenCalledWith('Previous message content');
      });
    });

    it('应该处理rightRender为false的情况（第384行和第405行）', () => {
      const props = {
        ...defaultProps,
        rightRender: false as const,
      };

      render(<BubbleExtra {...props} />);

      // rightRender为false时，不应该显示操作按钮
      expect(screen.queryByTestId('like-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dislike-button')).not.toBeInTheDocument();
    });

    it('应该处理rightRender函数的情况（第386行）', () => {
      const rightRender = vi.fn(() => <div data-testid="custom-right">Custom</div>);
      const props = {
        ...defaultProps,
        rightRender,
      };

      render(<BubbleExtra {...props} />);

      // rightRender函数应该被调用
      expect(rightRender).toHaveBeenCalled();
      expect(screen.getByTestId('custom-right')).toBeInTheDocument();
    });

    it('应该处理回答被中止时的右侧内容显示（第403行）', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            isAborted: true,
          },
        },
      };

      render(<BubbleExtra {...props} />);

      // 回答被中止时，应该显示复制按钮
      expect(screen.getByTestId('chat-item-copy-button')).toBeInTheDocument();
    });

    it('应该处理没有复制按钮且回答被中止的情况（第412行）', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            isAborted: true,
            content: '', // 没有内容，不显示复制按钮
            extra: {
              preMessage: undefined,
            } as any,
          },
        },
      };

      const { container } = render(<BubbleExtra {...props} />);

      // 应该返回null，不渲染任何内容
      expect(container.firstChild).toBeNull();
    });

    it('应该处理生成中的状态显示（第435-437行）', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            isFinished: false,
            isAborted: false,
            content: 'Generating content...',
          },
        },
      };

      render(<BubbleExtra {...props} />);

      // 应该显示加载状态
      expect(screen.getByText('生成中...')).toBeInTheDocument(); // 生成中本地化文本
    });
  });
});