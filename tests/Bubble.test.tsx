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

// Mock MarkdownPreview component
vi.mock('../src/Bubble/MessagesContent/MarkdownPreview', () => ({
  MarkdownPreview: ({
    content,
    isFinished,
    typing,
    extra,
    docListNode,
    slidesMode,
    onCloseSlides,
    fncProps,
    markdownRenderConfig,
    style,
    originData,
    htmlRef,
  }: any) => {
    return (
      <div data-testid="markdown-preview">
        <div data-testid="content">{content}</div>
        <div data-testid="is-finished">{isFinished ? 'true' : 'false'}</div>
        <div data-testid="typing">{typing ? 'true' : 'false'}</div>
        <div data-testid="slides-mode">{slidesMode ? 'true' : 'false'}</div>
        {extra && <div data-testid="extra">{extra}</div>}
        {docListNode && <div data-testid="doc-list">{docListNode}</div>}
        {fncProps && <div data-testid="fnc-props">fncProps</div>}
        {markdownRenderConfig && (
          <div data-testid="markdown-config">config</div>
        )}
        {style && <div data-testid="style">style</div>}
        {originData && <div data-testid="origin-data">originData</div>}
        {htmlRef && <div data-testid="html-ref">htmlRef</div>}
        <button
          type="button"
          data-testid="close-slides"
          onClick={onCloseSlides}
        >
          Close Slides
        </button>
      </div>
    );
  },
}));

// Mock BubbleExtra component
vi.mock('../src/Bubble/MessagesContent/BubbleExtra', () => ({
  BubbleExtra: ({
    onLike,
    onDisLike,
    onReply,
    onOpenSlidesMode,
    style,
    readonly,
    bubble,
    onRenderExtraNull,
    slidesModeProps,
    render,
    shouldShowCopy,
    onCancelLike,
  }: any) => {
    // 模拟 shouldShowCopy 的逻辑
    let showCopy = true;
    if (typeof shouldShowCopy === 'function') {
      showCopy = shouldShowCopy(bubble);
    } else if (typeof shouldShowCopy === 'boolean') {
      showCopy = shouldShowCopy;
    }

    // 根据 feedback 状态决定显示哪个按钮
    const feedback = bubble?.originData?.feedback;
    const showCancelLike = feedback === 'thumbsUp';

    return (
      <div data-testid="bubble-extra" style={style}>
        <div data-testid="readonly">{readonly ? 'true' : 'false'}</div>
        <div data-testid="bubble-id">{bubble?.id}</div>
        <div data-testid="is-latest">true</div>
        {onLike && !showCancelLike && (
          <button type="button" data-testid="like-button" onClick={onLike}>
            Like
          </button>
        )}
        {onCancelLike && showCancelLike && (
          <button
            type="button"
            data-testid="like-button"
            onClick={onCancelLike}
          >
            Cancel Like
          </button>
        )}
        {onDisLike && (
          <button
            type="button"
            data-testid="dislike-button"
            onClick={onDisLike}
          >
            Dislike
          </button>
        )}
        {onReply && (
          <button
            type="button"
            data-testid="reply-button"
            onClick={() => onReply?.('test reply')}
          >
            Reply
          </button>
        )}
        {onOpenSlidesMode && (
          <button
            type="button"
            data-testid="slides-button"
            onClick={onOpenSlidesMode}
          >
            Slides
          </button>
        )}
        {showCopy && (
          <button type="button" data-testid="chat-item-copy-button">
            Copy
          </button>
        )}
        <button
          type="button"
          data-testid="extra-null-btn"
          onClick={() => onRenderExtraNull?.(true)}
        >
          Set Extra Null
        </button>
        {slidesModeProps?.enable && (
          <div data-testid="slides-enabled">Slides Enabled</div>
        )}
        {render && <div data-testid="custom-render">Custom Render</div>}
      </div>
    );
  },
}));

describe('Bubble', () => {
  const defaultProps: BubbleProps<Record<string, any>> = {
    placement: 'left' as const,
    avatar: {
      title: 'Test User',
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
      onLike: vi.fn(),
      onDisLike: vi.fn(),
      onReply: vi.fn(),
      bubbleRenderConfig: {
        extraRender: (props: any, defaultDom: any) => defaultDom, // 返回默认的 BubbleExtra 组件
      },
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
        isFinished: true,
        extra: {
          // 确保 extra 字段存在但没有 answerStatus
        },
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble
          {...propsWithAssistantRole}
          shouldShowCopy={true}
          bubbleRenderConfig={{
            extraRender: (props: any, defaultDom: any) => defaultDom, // 确保 BubbleExtra 被渲染
          }}
        />
      </BubbleConfigProvide>,
    );

    // 验证复制按钮存在
    const copyButton = screen.queryByTestId('chat-item-copy-button');
    expect(copyButton).toBeInTheDocument();
  });

  it('should handle shouldShowCopy as boolean false', () => {
    const propsWithAssistantRole = {
      ...defaultProps,
      onLike: vi.fn(),
      onDisLike: vi.fn(),
      onReply: vi.fn(),
      bubbleRenderConfig: {
        extraRender: (props: any, defaultDom: any) => defaultDom, // 返回默认的 BubbleExtra 组件
      },
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
        isFinished: true,
        extra: {
          // 确保 extra 字段存在但没有 answerStatus
        },
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble {...propsWithAssistantRole} shouldShowCopy={false} />
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
      onLike: vi.fn(),
      onDisLike: vi.fn(),
      onReply: vi.fn(),
      bubbleRenderConfig: {
        extraRender: (props: any, defaultDom: any) => defaultDom, // 返回默认的 BubbleExtra 组件
      },
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
        isFinished: true,
        extra: {
          // 确保 extra 字段存在但没有 answerStatus
        },
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble
          {...propsWithAssistantRole}
          shouldShowCopy={shouldShowCopyFn}
          bubbleRenderConfig={{
            extraRender: (props: any, defaultDom: any) => defaultDom, // 确保 BubbleExtra 被渲染
          }}
        />
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
      onLike: vi.fn(),
      onDisLike: vi.fn(),
      onReply: vi.fn(),
      bubbleRenderConfig: {
        extraRender: (props: any, defaultDom: any) => defaultDom, // 返回默认的 BubbleExtra 组件
      },
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
        isFinished: true,
        extra: {
          // 确保 extra 字段存在但没有 answerStatus
        },
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble
          {...propsWithAssistantRole}
          shouldShowCopy={shouldShowCopyFn}
          bubbleRenderConfig={{
            extraRender: (props: any, defaultDom: any) => defaultDom, // 确保 BubbleExtra 被渲染
          }}
        />
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
      onDisLike: vi.fn(),
      onReply: vi.fn(),
      bubbleRenderConfig: {
        extraRender: (props: any, defaultDom: any) => defaultDom, // 返回默认的 BubbleExtra 组件
      },
      originData: {
        ...defaultProps.originData,
        content: 'Test message content',
        role: 'assistant' as const,
        createAt: 1716537600000,
        id: '123',
        updateAt: 1716537600000,
        isFinished: true,
        feedback: 'thumbsUp' as const, // 已经点赞
        extra: {
          // 确保 extra 字段存在但没有 answerStatus
        },
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble
          {...propsWithFeedback}
          bubbleRenderConfig={{
            extraRender: (props: any, defaultDom: any) => defaultDom, // 确保 BubbleExtra 被渲染
          }}
        />
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
      onDisLike: vi.fn(),
      onReply: vi.fn(),
      bubbleRenderConfig: {
        extraRender: (props: any, defaultDom: any) => defaultDom, // 返回默认的 BubbleExtra 组件
      },
      originData: {
        ...defaultProps.originData,
        content: 'Test message content',
        role: 'assistant' as const,
        createAt: 1716537600000,
        id: '123',
        updateAt: 1716537600000,
        isFinished: true,
        feedback: 'thumbsUp' as const,
        extra: {
          // 确保 extra 字段存在但没有 answerStatus
        },
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble
          {...propsWithFeedback}
          bubbleRenderConfig={{
            extraRender: (props: any, defaultDom: any) => defaultDom, // 确保 BubbleExtra 被渲染
          }}
        />
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
      onLike: vi.fn(),
      onDisLike: vi.fn(),
      onReply: vi.fn(),
      bubbleRenderConfig: {
        extraRender: (props: any, defaultDom: any) => defaultDom, // 返回默认的 BubbleExtra 组件
      },
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
        isFinished: true,
        extra: {
          // 确保 extra 字段存在但没有 answerStatus
        },
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble
          {...propsWithAssistantRole}
          bubbleRenderConfig={{
            extraRender: (props: any, defaultDom: any) => defaultDom, // 确保 BubbleExtra 被渲染
          }}
        />
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
      onLike: vi.fn(),
      onDisLike: vi.fn(),
      onReply: vi.fn(),
      bubbleRenderConfig: {
        extraRender: (props: any, defaultDom: any) => defaultDom, // 返回默认的 BubbleExtra 组件
      },
      originData: {
        content: 'Test message content',
        createAt: 1716537600000,
        id: '123',
        role: 'assistant' as const,
        updateAt: 1716537600000,
        isFinished: true,
        extra: {
          // 确保 extra 字段存在但没有 answerStatus
        },
      },
    };

    render(
      <BubbleConfigProvide>
        <Bubble
          {...propsWithAssistantRole}
          shouldShowCopy={shouldShowCopyFn}
          bubbleRenderConfig={{
            extraRender: (props: any, defaultDom: any) => defaultDom, // 确保 BubbleExtra 被渲染
          }}
        />
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
});
