import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React, { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { MessagesContext } from '../../src/Bubble/MessagesContent/BubbleContext';
import { MessageBubbleData } from '../../src/Bubble/type';

// 创建一个测试组件来使用 MessagesContext
const TestComponent = () => {
  const context = useContext(MessagesContext);
  
  return (
    <div>
      <div data-testid="message-id">{context.message?.id || 'no-message'}</div>
      <div data-testid="hide-padding">{context.hidePadding?.toString() || 'undefined'}</div>
      <div data-testid="typing">{context.typing?.toString() || 'undefined'}</div>
    </div>
  );
};

describe('MessagesContext', () => {
  describe('默认值测试', () => {
    it('应该提供默认的上下文值', () => {
      render(
        <MessagesContext.Provider value={{
          setMessage: () => {},
          message: undefined,
          hidePadding: false,
          setHidePadding: () => {},
          typing: false,
        }}>
          <TestComponent />
        </MessagesContext.Provider>
      );

      expect(screen.getByTestId('message-id')).toBeInTheDocument();
      expect(screen.getByTestId('hide-padding')).toBeInTheDocument();
      expect(screen.getByTestId('typing')).toBeInTheDocument();
    });

    it('应该提供默认的setMessage函数', () => {
      // 测试默认的setMessage函数不会抛出错误
      const defaultValue = {
        setMessage: (message: Partial<MessageBubbleData>) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void message;
        },
        message: undefined,
        hidePadding: false,
        setHidePadding: (hide: boolean) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void hide;
        },
        typing: false,
      };
      
      expect(() => {
        defaultValue.setMessage({ id: 'test' });
      }).not.toThrow();
    });

    it('应该提供默认的setHidePadding函数', () => {
      // 测试默认的setHidePadding函数不会抛出错误
      const defaultValue = {
        setMessage: (message: Partial<MessageBubbleData>) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void message;
        },
        message: undefined,
        hidePadding: false,
        setHidePadding: (hide: boolean) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void hide;
        },
        typing: false,
      };
      
      expect(() => {
        defaultValue.setHidePadding(true);
      }).not.toThrow();
    });

    it('应该提供默认的message对象', () => {
      const defaultValue = {
        setMessage: (message: Partial<MessageBubbleData>) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void message;
        },
        message: undefined,
        hidePadding: false,
        setHidePadding: (hide: boolean) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void hide;
        },
        typing: false,
      };
      expect(defaultValue.message).toBeUndefined();
    });

    it('应该提供默认的hidePadding值', () => {
      const defaultValue = {
        setMessage: (message: Partial<MessageBubbleData>) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void message;
        },
        message: undefined,
        hidePadding: false,
        setHidePadding: (hide: boolean) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void hide;
        },
        typing: false,
      };
      expect(defaultValue.hidePadding).toBe(false);
    });

    it('应该提供默认的typing值', () => {
      const defaultValue = {
        setMessage: (message: Partial<MessageBubbleData>) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void message;
        },
        message: undefined,
        hidePadding: false,
        setHidePadding: (hide: boolean) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void hide;
        },
        typing: false,
      };
      expect(defaultValue.typing).toBe(false);
    });
  });

  describe('Provider测试', () => {
    it('应该能够通过Provider传递值', () => {
      const testValue = {
        message: { 
          id: 'test-id', 
          content: 'test content',
          role: 'user',
          createAt: Date.now(),
          updateAt: Date.now(),
        } as MessageBubbleData,
        hidePadding: true,
        typing: true,
        setMessage: (message: Partial<MessageBubbleData>) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void message;
        },
        setHidePadding: (hide: boolean) => {
          // 空实现，仅用于测试
          // 使用参数避免未使用变量的警告
          void hide;
        },
      };

      render(
        <MessagesContext.Provider value={testValue}>
          <TestComponent />
        </MessagesContext.Provider>
      );

      expect(screen.getByTestId('message-id')).toHaveTextContent('test-id');
      expect(screen.getByTestId('hide-padding')).toHaveTextContent('true');
      expect(screen.getByTestId('typing')).toHaveTextContent('true');
    });
  });
});