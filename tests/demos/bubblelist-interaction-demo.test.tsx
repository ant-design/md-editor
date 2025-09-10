import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import BubbleListInteractionDemo from '../../docs/demos/bubble/bubblelist-interaction-demo';

describe('BubbleListInteractionDemo', () => {
  it('should render without crashing', () => {
    const { container } = render(<BubbleListInteractionDemo />);
    expect(container).toBeTruthy();
  });

  it('should render the card container with correct styles', () => {
    const { container } = render(<BubbleListInteractionDemo />);

    // 查找卡片容器
    const cardContainer = container.querySelector(
      '[style*="border-radius: 20px"]',
    );
    expect(cardContainer).toBeTruthy();

    // 验证样式属性
    const cardElement = cardContainer as HTMLElement;
    expect(cardElement.style.borderRadius).toBe('20px');
    expect(cardElement.style.background).toBe('rgb(253, 254, 254)');
    expect(cardElement.style.width).toBe('830px');
  });

  it('should render BubbleList inside the card container', () => {
    const { container } = render(<BubbleListInteractionDemo />);

    // 查找 BubbleList 组件
    const bubbleList = container.querySelector('[data-chat-list]');
    expect(bubbleList).toBeTruthy();
  });

  it('should render interaction function descriptions', () => {
    const { getByText } = render(<BubbleListInteractionDemo />);

    expect(getByText('onLike:')).toBeTruthy();
    expect(getByText('onDisLike:')).toBeTruthy();
    expect(getByText('onReply:')).toBeTruthy();
    expect(getByText('onAvatarClick:')).toBeTruthy();
    expect(getByText('onDoubleClick:')).toBeTruthy();
  });

  it('should render title and description', () => {
    const { getByText } = render(<BubbleListInteractionDemo />);

    expect(getByText('🔧 BubbleList 交互功能演示')).toBeTruthy();
    expect(
      getByText(
        '💡 点击消息下方的按钮体验各种交互功能，或双击消息查看双击事件',
      ),
    ).toBeTruthy();
  });
});
