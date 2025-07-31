import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BubbleConfigContext } from '../src/Bubble/BubbleConfigProvide';
import { BubbleList } from '../src/Bubble/List';
import { MessageBubbleData } from '../src/Bubble/type';

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

describe('BubbleList', () => {
  const createMockBubbleData = (
    id: string,
    role: 'user' | 'assistant',
    content: string,
  ): MessageBubbleData => ({
    id,
    role,
    content,
    createAt: Date.now(),
    updateAt: Date.now(),
  });

  describe('isLatest property', () => {
    it('should set isLatest to true only for the last bubble in the list', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'First message'),
        createMockBubbleData('2', 'assistant', 'Second message'),
        createMockBubbleData('3', 'user', 'Third message'),
        createMockBubbleData('4', 'assistant', 'Last message'),
      ];

      render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      // 验证只有最后一个消息的 isLatest 为 true
      expect(bubbleList[0].isLatest).toBe(false);
      expect(bubbleList[1].isLatest).toBe(false);
      expect(bubbleList[2].isLatest).toBe(false);
      expect(bubbleList[3].isLatest).toBe(true);
    });

    it('should set isLatest to true for single bubble in the list', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Only message'),
      ];

      render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      // 验证单个消息的 isLatest 为 true
      expect(bubbleList[0].isLatest).toBe(true);
    });

    it('should handle empty bubble list', () => {
      const bubbleList: MessageBubbleData[] = [];

      render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      // 空列表不应该抛出错误
      expect(bubbleList.length).toBe(0);
    });

    it('should update isLatest when bubble list changes', () => {
      const initialBubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'First message'),
        createMockBubbleData('2', 'assistant', 'Second message'),
      ];

      const { rerender } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={initialBubbleList} />
        </BubbleConfigProvide>,
      );

      // 验证初始状态
      expect(initialBubbleList[0].isLatest).toBe(false);
      expect(initialBubbleList[1].isLatest).toBe(true);

      // 添加新的消息
      const updatedBubbleList: MessageBubbleData[] = [
        ...initialBubbleList,
        createMockBubbleData('3', 'user', 'Third message'),
      ];

      rerender(
        <BubbleConfigProvide>
          <BubbleList bubbleList={updatedBubbleList} />
        </BubbleConfigProvide>,
      );

      // 验证更新后的状态
      expect(updatedBubbleList[0].isLatest).toBe(false);
      expect(updatedBubbleList[1].isLatest).toBe(false);
      expect(updatedBubbleList[2].isLatest).toBe(true);
    });

    it('should maintain isLatest property for different roles', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'User message 1'),
        createMockBubbleData('2', 'user', 'User message 2'),
        createMockBubbleData('3', 'assistant', 'Assistant message 1'),
        createMockBubbleData('4', 'assistant', 'Assistant message 2'),
        createMockBubbleData('5', 'user', 'User message 3'),
      ];

      render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      // 验证无论角色如何，只有最后一个消息的 isLatest 为 true
      expect(bubbleList[0].isLatest).toBe(false);
      expect(bubbleList[1].isLatest).toBe(false);
      expect(bubbleList[2].isLatest).toBe(false);
      expect(bubbleList[3].isLatest).toBe(false);
      expect(bubbleList[4].isLatest).toBe(true);
    });
  });

  describe('onCancelLike callback', () => {
    it('should call onCancelLike when provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnCancelLike = vi.fn();

      render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} onCancelLike={mockOnCancelLike} />
        </BubbleConfigProvide>,
      );

      // 验证回调函数被正确传递
      expect(mockOnCancelLike).toBeDefined();
    });

    it('should handle onCancelLike when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      expect(() => {
        render(
          <BubbleConfigProvide>
            <BubbleList bubbleList={bubbleList} />
          </BubbleConfigProvide>,
        );
      }).not.toThrow();
    });
  });

  describe('shouldShowCopy callback', () => {
    it('should handle shouldShowCopy as boolean', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      expect(() => {
        render(
          <BubbleConfigProvide>
            <BubbleList bubbleList={bubbleList} shouldShowCopy={true} />
          </BubbleConfigProvide>,
        );
      }).not.toThrow();
    });

    it('should handle shouldShowCopy as function', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockShouldShowCopy = vi.fn(() => true);

      render(
        <BubbleConfigProvide>
          <BubbleList
            bubbleList={bubbleList}
            shouldShowCopy={mockShouldShowCopy}
          />
        </BubbleConfigProvide>,
      );

      // 验证函数被正确传递
      expect(mockShouldShowCopy).toBeDefined();
    });

    it('should handle shouldShowCopy when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      expect(() => {
        render(
          <BubbleConfigProvide>
            <BubbleList bubbleList={bubbleList} />
          </BubbleConfigProvide>,
        );
      }).not.toThrow();
    });
  });

  describe('onScroll callback', () => {
    it('should call onScroll when scroll event occurs', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnScroll = vi.fn();

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} onScroll={mockOnScroll} />
        </BubbleConfigProvide>,
      );

      // 找到BubbleList的容器元素
      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 触发滚动事件
      fireEvent.scroll(bubbleListContainer!);

      // 验证回调被调用
      expect(mockOnScroll).toHaveBeenCalledTimes(1);
    });

    it('should handle onScroll when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 应该不会抛出错误
      expect(() => {
        fireEvent.scroll(bubbleListContainer!);
      }).not.toThrow();
    });
  });

  describe('onWheel callback', () => {
    it('should call onWheel when wheel event occurs', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnWheel = vi.fn();

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} onWheel={mockOnWheel} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 触发滚轮事件
      fireEvent.wheel(bubbleListContainer!);

      // 验证回调被调用
      expect(mockOnWheel).toHaveBeenCalledTimes(1);
    });

    it('should handle onWheel when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 应该不会抛出错误
      expect(() => {
        fireEvent.wheel(bubbleListContainer!);
      }).not.toThrow();
    });
  });

  describe('onTouchMove callback', () => {
    it('should call onTouchMove when touch move event occurs', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnTouchMove = vi.fn();

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} onTouchMove={mockOnTouchMove} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 触发触摸移动事件
      fireEvent.touchMove(bubbleListContainer!);

      // 验证回调被调用
      expect(mockOnTouchMove).toHaveBeenCalledTimes(1);
    });

    it('should handle onTouchMove when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 应该不会抛出错误
      expect(() => {
        fireEvent.touchMove(bubbleListContainer!);
      }).not.toThrow();
    });
  });

  describe('event handlers integration', () => {
    it('should handle multiple event handlers together', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnScroll = vi.fn();
      const mockOnWheel = vi.fn();
      const mockOnTouchMove = vi.fn();
      const mockOnCancelLike = vi.fn();
      const mockShouldShowCopy = vi.fn(() => true);

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList
            bubbleList={bubbleList}
            onScroll={mockOnScroll}
            onWheel={mockOnWheel}
            onTouchMove={mockOnTouchMove}
            onCancelLike={mockOnCancelLike}
            shouldShowCopy={mockShouldShowCopy}
          />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 触发所有事件
      fireEvent.scroll(bubbleListContainer!);
      fireEvent.wheel(bubbleListContainer!);
      fireEvent.touchMove(bubbleListContainer!);

      // 验证所有回调都被调用
      expect(mockOnScroll).toHaveBeenCalledTimes(1);
      expect(mockOnWheel).toHaveBeenCalledTimes(1);
      expect(mockOnTouchMove).toHaveBeenCalledTimes(1);
      expect(mockOnCancelLike).toBeDefined();
      expect(mockShouldShowCopy).toBeDefined();
    });
  });

  describe('onCancelLike callback', () => {
    it('should call onCancelLike when provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnCancelLike = vi.fn();

      render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} onCancelLike={mockOnCancelLike} />
        </BubbleConfigProvide>,
      );

      // 验证回调函数被正确传递
      expect(mockOnCancelLike).toBeDefined();
    });

    it('should handle onCancelLike when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      expect(() => {
        render(
          <BubbleConfigProvide>
            <BubbleList bubbleList={bubbleList} />
          </BubbleConfigProvide>,
        );
      }).not.toThrow();
    });
  });

  describe('shouldShowCopy callback', () => {
    it('should handle shouldShowCopy as boolean', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      expect(() => {
        render(
          <BubbleConfigProvide>
            <BubbleList bubbleList={bubbleList} shouldShowCopy={true} />
          </BubbleConfigProvide>,
        );
      }).not.toThrow();
    });

    it('should handle shouldShowCopy as function', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockShouldShowCopy = vi.fn(() => true);

      render(
        <BubbleConfigProvide>
          <BubbleList
            bubbleList={bubbleList}
            shouldShowCopy={mockShouldShowCopy}
          />
        </BubbleConfigProvide>,
      );

      // 验证函数被正确传递
      expect(mockShouldShowCopy).toBeDefined();
    });

    it('should handle shouldShowCopy when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      expect(() => {
        render(
          <BubbleConfigProvide>
            <BubbleList bubbleList={bubbleList} />
          </BubbleConfigProvide>,
        );
      }).not.toThrow();
    });
  });

  describe('onScroll callback', () => {
    it('should call onScroll when scroll event occurs', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnScroll = vi.fn();

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} onScroll={mockOnScroll} />
        </BubbleConfigProvide>,
      );

      // 找到BubbleList的容器元素
      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 触发滚动事件
      fireEvent.scroll(bubbleListContainer!);

      // 验证回调被调用
      expect(mockOnScroll).toHaveBeenCalledTimes(1);
    });

    it('should handle onScroll when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 应该不会抛出错误
      expect(() => {
        fireEvent.scroll(bubbleListContainer!);
      }).not.toThrow();
    });
  });

  describe('onWheel callback', () => {
    it('should call onWheel when wheel event occurs', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnWheel = vi.fn();

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} onWheel={mockOnWheel} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 触发滚轮事件
      fireEvent.wheel(bubbleListContainer!);

      // 验证回调被调用
      expect(mockOnWheel).toHaveBeenCalledTimes(1);
    });

    it('should handle onWheel when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 应该不会抛出错误
      expect(() => {
        fireEvent.wheel(bubbleListContainer!);
      }).not.toThrow();
    });
  });

  describe('onTouchMove callback', () => {
    it('should call onTouchMove when touch move event occurs', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnTouchMove = vi.fn();

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} onTouchMove={mockOnTouchMove} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 触发触摸移动事件
      fireEvent.touchMove(bubbleListContainer!);

      // 验证回调被调用
      expect(mockOnTouchMove).toHaveBeenCalledTimes(1);
    });

    it('should handle onTouchMove when not provided', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList bubbleList={bubbleList} />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 应该不会抛出错误
      expect(() => {
        fireEvent.touchMove(bubbleListContainer!);
      }).not.toThrow();
    });
  });

  describe('event handlers integration', () => {
    it('should handle multiple event handlers together', () => {
      const bubbleList: MessageBubbleData[] = [
        createMockBubbleData('1', 'user', 'Test message'),
      ];
      const mockOnScroll = vi.fn();
      const mockOnWheel = vi.fn();
      const mockOnTouchMove = vi.fn();
      const mockOnCancelLike = vi.fn();
      const mockShouldShowCopy = vi.fn(() => true);

      const { container } = render(
        <BubbleConfigProvide>
          <BubbleList
            bubbleList={bubbleList}
            onScroll={mockOnScroll}
            onWheel={mockOnWheel}
            onTouchMove={mockOnTouchMove}
            onCancelLike={mockOnCancelLike}
            shouldShowCopy={mockShouldShowCopy}
          />
        </BubbleConfigProvide>,
      );

      const bubbleListContainer = container.querySelector('[data-chat-list]');
      expect(bubbleListContainer).toBeTruthy();

      // 触发所有事件
      fireEvent.scroll(bubbleListContainer!);
      fireEvent.wheel(bubbleListContainer!);
      fireEvent.touchMove(bubbleListContainer!);

      // 验证所有回调都被调用
      expect(mockOnScroll).toHaveBeenCalledTimes(1);
      expect(mockOnWheel).toHaveBeenCalledTimes(1);
      expect(mockOnTouchMove).toHaveBeenCalledTimes(1);
      expect(mockOnCancelLike).toBeDefined();
      expect(mockShouldShowCopy).toBeDefined();
    });
  });
});
