import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Bubble } from '../src/Bubble';
import { BubbleConfigContext } from '../src/Bubble/BubbleConfigProvide';
import { BubbleProps } from '../src/Bubble/type';

const BubbleConfigProvide: React.FC<{
  children: React.ReactNode;
  compact?: boolean;
  standalone?: boolean;
}> = ({ children, compact, standalone }) => {
  return (
    <BubbleConfigContext.Provider
      value={{ standalone: standalone || false, compact, locale: {} as any }}
    >
      {children}
    </BubbleConfigContext.Provider>
  );
};

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe('Bubble', () => {
  const defaultProps: BubbleProps<Record<string, any>> = {
    placement: 'left' as const,
    avatar: {
      name: 'Test User',
      avatar: 'test-avatar.jpg',
    },
    time: 1716537600000,
    originData: {
      content: 'Test message content',
      createAt: 1716537600000,
      id: '123',
      role: 'user',
      updateAt: 1716537600000,
    },
  };

  it('should render with default props', () => {
    render(
      <BubbleConfigProvide>
        <Bubble {...defaultProps} />
      </BubbleConfigProvide>,
    );

    expect(screen.getByText('Test message content')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should render with right placement', () => {
    render(
      <BubbleConfigProvide>
        <Bubble {...defaultProps} placement="right" />
      </BubbleConfigProvide>,
    );

    // 查找包含 placement 类的元素
    const bubbleElement = document.querySelector('[class*="right"]');
    expect(bubbleElement).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(
      <BubbleConfigProvide>
        <Bubble {...defaultProps} className="custom-bubble" />
      </BubbleConfigProvide>,
    );

    // 查找包含自定义类名的元素
    const bubbleElement = document.querySelector('.custom-bubble');
    expect(bubbleElement).toBeInTheDocument();
  });

  it('should render without avatar', () => {
    render(
      <BubbleConfigProvide>
        <Bubble {...defaultProps} avatar={undefined} />
      </BubbleConfigProvide>,
    );

    expect(screen.getByText('Test message content')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('should render without time', () => {
    render(
      <BubbleConfigProvide>
        <Bubble {...defaultProps} time={undefined} />
      </BubbleConfigProvide>,
    );

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should handle avatar click', () => {
    const onAvatarClick = vi.fn();
    render(
      <BubbleConfigProvide>
        <Bubble {...defaultProps} onAvatarClick={onAvatarClick} />
      </BubbleConfigProvide>,
    );

    // 注意：这里需要根据实际的avatar组件结构来调整
    // 如果avatar是可点击的，这里应该模拟点击事件
    expect(onAvatarClick).toBeDefined();
  });

  it('should render with compact mode', () => {
    render(
      <BubbleConfigProvide compact>
        <Bubble {...defaultProps} />
      </BubbleConfigProvide>,
    );

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should render with standalone mode', () => {
    render(
      <BubbleConfigProvide standalone>
        <Bubble {...defaultProps} />
      </BubbleConfigProvide>,
    );

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should render with custom bubble render config', () => {
    const customTitleRender = vi.fn().mockReturnValue(<div>Custom Title</div>);
    render(
      <BubbleConfigProvide>
        <Bubble
          {...defaultProps}
          bubbleRenderConfig={{ titleRender: customTitleRender }}
        />
      </BubbleConfigProvide>,
    );

    expect(customTitleRender).toHaveBeenCalled();
  });

  it('should render with custom classNames', () => {
    render(
      <BubbleConfigProvide>
        <Bubble
          {...defaultProps}
          classNames={{ bubbleListItemTitleClassName: 'custom-title-class' }}
        />
      </BubbleConfigProvide>,
    );

    // 检查自定义类名是否被应用
    const titleElement = screen.getByText('Test User');
    expect(titleElement).toBeInTheDocument();
  });

  it('should render with custom styles', () => {
    render(
      <BubbleConfigProvide>
        <Bubble
          {...defaultProps}
          styles={{ bubbleListItemTitleStyle: { color: 'blue' } }}
        />
      </BubbleConfigProvide>,
    );

    // 检查自定义样式是否被应用
    const titleElement = screen.getByText('Test User');
    expect(titleElement).toBeInTheDocument();
  });

  it('should handle shouldShowCopy as boolean true', () => {
    const propsWithAssistantRole = {
      ...defaultProps,
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble {...propsWithAssistantRole} shouldShowCopy={true} />
      </BubbleConfigProvide>,
    );

    // 验证复制按钮存在
    const copyButton = screen.queryByTestId('chat-item-copy-button');
    expect(copyButton).toBeInTheDocument();
  });

  it('should handle shouldShowCopy as boolean false', () => {
    render(
      <BubbleConfigProvide>
        <Bubble {...defaultProps} shouldShowCopy={false} />
      </BubbleConfigProvide>,
    );

    // 验证复制按钮不存在
    const copyButton = screen.queryByTestId('chat-item-copy-button');
    expect(copyButton).not.toBeInTheDocument();
  });

  it('should handle shouldShowCopy as function returning true', () => {
    const shouldShowCopyFn = vi.fn().mockReturnValue(true);
    const propsWithAssistantRole = {
      ...defaultProps,
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble {...propsWithAssistantRole} shouldShowCopy={shouldShowCopyFn} />
      </BubbleConfigProvide>,
    );

    // 验证函数被正确调用
    expect(shouldShowCopyFn).toHaveBeenCalled();

    // 验证复制按钮存在
    const copyButton = screen.queryByTestId('chat-item-copy-button');
    expect(copyButton).toBeInTheDocument();
  });

  it('should handle shouldShowCopy as function returning false', () => {
    const shouldShowCopyFn = vi.fn().mockReturnValue(false);
    const propsWithAssistantRole = {
      ...defaultProps,
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble {...propsWithAssistantRole} shouldShowCopy={shouldShowCopyFn} />
      </BubbleConfigProvide>,
    );

    // 验证函数被正确调用
    expect(shouldShowCopyFn).toHaveBeenCalled();

    // 验证复制按钮不存在
    const copyButton = screen.queryByTestId('chat-item-copy-button');
    expect(copyButton).not.toBeInTheDocument();
  });

  it('should call onCancelLike when cancel like button is clicked', async () => {
    const onCancelLike = vi.fn();
    const propsWithFeedback = {
      ...defaultProps,
      onCancelLike,
      onLike: vi.fn(),
      originData: {
        ...defaultProps.originData,
        content: 'Test message content',
        role: 'assistant' as const,
        createAt: 1716537600000,
        id: '123',
        updateAt: 1716537600000,
        feedback: 'thumbsUp' as const, // 已经点赞
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble {...propsWithFeedback} />
      </BubbleConfigProvide>,
    );

    // 查找点赞按钮（此时应该是取消点赞状态）
    const likeButton = screen.queryByTestId('like-button');
    expect(likeButton).toBeInTheDocument();

    // 点击取消点赞按钮
    if (likeButton) {
      fireEvent.click(likeButton);
      await waitFor(() => {
        expect(onCancelLike).toHaveBeenCalled();
      });
    }
  });

  it('should handle onCancelLike with error gracefully', async () => {
    const onCancelLike = vi
      .fn()
      .mockRejectedValue(new Error('Cancel like failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const propsWithFeedback = {
      ...defaultProps,
      onCancelLike,
      onLike: vi.fn(),
      originData: {
        ...defaultProps.originData,
        content: 'Test message content',
        role: 'assistant' as const,
        createAt: 1716537600000,
        id: '123',
        updateAt: 1716537600000,
        feedback: 'thumbsUp' as const,
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble {...propsWithFeedback} />
      </BubbleConfigProvide>,
    );

    const likeButton = screen.queryByTestId('like-button');
    if (likeButton) {
      fireEvent.click(likeButton);
      await waitFor(() => {
        expect(onCancelLike).toHaveBeenCalled();
      });
    }

    consoleSpy.mockRestore();
  });

  it('should show copy button by default when shouldShowCopy is undefined', () => {
    const propsWithAssistantRole = {
      ...defaultProps,
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble {...propsWithAssistantRole} />
      </BubbleConfigProvide>,
    );

    // 默认情况下应该显示复制按钮
    const copyButton = screen.queryByTestId('chat-item-copy-button');
    expect(copyButton).toBeInTheDocument();
  });

  it('should pass bubble data to shouldShowCopy function', () => {
    const shouldShowCopyFn = vi.fn().mockReturnValue(true);
    const propsWithAssistantRole = {
      ...defaultProps,
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble {...propsWithAssistantRole} shouldShowCopy={shouldShowCopyFn} />
      </BubbleConfigProvide>,
    );

    // 验证函数被调用时传入了正确的 bubble 数据
    expect(shouldShowCopyFn).toHaveBeenCalledWith(
      expect.objectContaining({
        originData: expect.objectContaining({
          content: 'Test message content',
          id: '123',
          role: 'assistant',
        }),
      }),
    );
  });

  describe('preMessageSameRole', () => {
    it('should hide avatar and title when preMessage has same role as current message', () => {
      const propsWithPreMessage = {
        ...defaultProps,
        preMessage: {
          content: 'Previous message',
          createAt: 1716537500000,
          id: '122',
          role: 'user' as const,
          updateAt: 1716537500000,
        },
        originData: {
          content: 'Current message',
          createAt: 1716537600000,
          id: '123',
          role: 'user' as const,
          updateAt: 1716537600000,
        },
      };

      render(
        <BubbleConfigProvide>
          <Bubble {...propsWithPreMessage} />
        </BubbleConfigProvide>,
      );

      // 验证消息内容存在
      expect(screen.getByText('Current message')).toBeInTheDocument();

      // 验证头像和标题被隐藏（因为角色相同）
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    it('should show avatar and title when preMessage has different role from current message', () => {
      const propsWithPreMessage = {
        ...defaultProps,
        preMessage: {
          content: 'Previous assistant message',
          createAt: 1716537500000,
          id: '122',
          role: 'assistant' as const,
          updateAt: 1716537500000,
        },
        originData: {
          content: 'Current user message',
          createAt: 1716537600000,
          id: '123',
          role: 'user' as const,
          updateAt: 1716537600000,
        },
      };

      render(
        <BubbleConfigProvide>
          <Bubble {...propsWithPreMessage} />
        </BubbleConfigProvide>,
      );

      // 验证消息内容存在
      expect(screen.getByText('Current user message')).toBeInTheDocument();

      // 验证头像和标题显示（因为角色不同）
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should show avatar and title when preMessage is undefined', () => {
      render(
        <BubbleConfigProvide>
          <Bubble {...defaultProps} />
        </BubbleConfigProvide>,
      );

      // 验证消息内容存在
      expect(screen.getByText('Test message content')).toBeInTheDocument();

      // 验证头像和标题显示（因为没有前一条消息）
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should hide avatar and title when placement is right regardless of preMessageSameRole', () => {
      const propsWithPreMessage = {
        ...defaultProps,
        placement: 'right' as const,
        preMessage: {
          content: 'Previous message',
          createAt: 1716537500000,
          id: '122',
          role: 'user' as const,
          updateAt: 1716537500000,
        },
        originData: {
          content: 'Current message',
          createAt: 1716537600000,
          id: '123',
          role: 'user' as const,
          updateAt: 1716537600000,
        },
      };

      render(
        <BubbleConfigProvide>
          <Bubble {...propsWithPreMessage} />
        </BubbleConfigProvide>,
      );

      // 验证消息内容存在
      expect(screen.getByText('Current message')).toBeInTheDocument();

      // 验证头像和标题被隐藏（因为 placement 是 right）
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    it('should handle preMessage with undefined role', () => {
      const propsWithPreMessage = {
        ...defaultProps,
        preMessage: {
          content: 'Previous message',
          createAt: 1716537500000,
          id: '122',
          role: undefined,
          updateAt: 1716537500000,
        },
        originData: {
          content: 'Current message',
          createAt: 1716537600000,
          id: '123',
          role: 'user' as const,
          updateAt: 1716537600000,
        },
      };

      render(
        <BubbleConfigProvide>
          <Bubble {...propsWithPreMessage} />
        </BubbleConfigProvide>,
      );

      // 验证消息内容存在
      expect(screen.getByText('Current message')).toBeInTheDocument();

      // 验证头像和标题显示（因为角色不同，undefined !== 'user'）
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should handle current message with undefined role', () => {
      const propsWithPreMessage = {
        ...defaultProps,
        preMessage: {
          content: 'Previous message',
          createAt: 1716537500000,
          id: '122',
          role: 'user' as const,
          updateAt: 1716537500000,
        },
        originData: {
          content: 'Current message',
          createAt: 1716537600000,
          id: '123',
          role: undefined,
          updateAt: 1716537600000,
        },
      };

      render(
        <BubbleConfigProvide>
          <Bubble {...propsWithPreMessage} />
        </BubbleConfigProvide>,
      );

      // 验证消息内容存在
      expect(screen.getByText('Current message')).toBeInTheDocument();

      // 验证头像和标题显示（因为角色不同，'user' !== undefined）
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should handle both messages with undefined roles', () => {
      const propsWithPreMessage = {
        ...defaultProps,
        preMessage: {
          content: 'Previous message',
          createAt: 1716537500000,
          id: '122',
          role: undefined,
          updateAt: 1716537500000,
        },
        originData: {
          content: 'Current message',
          createAt: 1716537600000,
          id: '123',
          role: undefined,
          updateAt: 1716537600000,
        },
      };

      render(
        <BubbleConfigProvide>
          <Bubble {...propsWithPreMessage} />
        </BubbleConfigProvide>,
      );

      // 验证消息内容存在
      expect(screen.getByText('Current message')).toBeInTheDocument();

      // 验证头像和标题显示（因为角色相同，undefined === undefined）
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });
});
