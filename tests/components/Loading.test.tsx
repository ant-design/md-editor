import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Loading } from '../../src/components/Loading';

// Mock useStyle hook
vi.mock('../../src/components/Loading/style', () => ({
  useStyle: () => ({
    wrapSSR: (children: React.ReactNode) => children,
    hashId: 'test-hash-id',
  }),
}));

describe('Loading', () => {
  it('should render loading container', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector('.loading-container');

    expect(loadingContainer).toBeInTheDocument();
  });

  it('should render three loading items', () => {
    const { container } = render(<Loading />);
    const loadingItems = container.querySelectorAll('.loading-container-item');

    expect(loadingItems).toHaveLength(3);
  });

  it('should apply hashId to container and items', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector('.loading-container');
    const loadingItems = container.querySelectorAll('.loading-container-item');

    expect(loadingContainer).toHaveClass('test-hash-id');
    loadingItems.forEach((item) => {
      expect(item).toHaveClass('test-hash-id');
    });
  });

  it('should have correct class names', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector('.loading-container');
    const loadingItems = container.querySelectorAll('.loading-container-item');

    expect(loadingContainer).toHaveClass('loading-container');
    loadingItems.forEach((item) => {
      expect(item).toHaveClass('loading-container-item');
    });
  });

  it('should render as a loading animation container', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector('.loading-container');

    // 检查容器结构
    expect(loadingContainer?.children).toHaveLength(3);

    // 检查每个子元素都是div
    Array.from(loadingContainer?.children || []).forEach((child) => {
      expect(child.tagName).toBe('DIV');
    });
  });
});
