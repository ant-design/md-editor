import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { BubbleDemoCard } from '../../docs/demos/bubble/BubbleDemoCard';

describe('BubbleDemoCard', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <BubbleDemoCard title="Test Title">
        <div>Test Content</div>
      </BubbleDemoCard>,
    );
    expect(container).toBeTruthy();
  });

  it('should render with correct card styles', () => {
    const { container } = render(
      <BubbleDemoCard title="Test Title">
        <div>Test Content</div>
      </BubbleDemoCard>,
    );

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
    expect(cardElement.style.display).toBe('flex');
    expect(cardElement.style.flexDirection).toBe('column');
  });

  it('should render title and description when provided', () => {
    const { getByText } = render(
      <BubbleDemoCard title="Test Title" description="Test Description">
        <div>Test Content</div>
      </BubbleDemoCard>,
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('should render children content', () => {
    const { getByText } = render(
      <BubbleDemoCard title="Test Title">
        <div>Test Content</div>
      </BubbleDemoCard>,
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should render code example when provided', () => {
    const { getByText } = render(
      <BubbleDemoCard
        title="Test Title"
        showCodeExample={true}
        codeExample="console.log('test');"
      >
        <div>Test Content</div>
      </BubbleDemoCard>,
    );

    expect(getByText('💻 代码示例：')).toBeTruthy();
    expect(getByText("console.log('test');")).toBeTruthy();
  });
});
