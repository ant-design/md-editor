import { render } from '@testing-library/react';
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
});
