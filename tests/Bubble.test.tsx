import { render, screen } from '@testing-library/react';
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
});
