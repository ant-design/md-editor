import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Loading } from '../../src/components/Loading';

// Mock GSAP to avoid animation issues in tests
vi.mock('gsap', () => ({
  default: {
    set: vi.fn(),
    to: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(function (this: any) {
        return this;
      }),
      add: vi.fn(function (this: any) {
        return this;
      }),
      kill: vi.fn(),
    })),
  },
}));

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
    const loadingContainer = container.querySelector(
      '[data-testid="loading-container"]',
    );

    expect(loadingContainer).toBeInTheDocument();
  });

  it('should render SVG mask definitions', () => {
    const { container } = render(<Loading />);
    const masks = container.querySelectorAll('mask');

    expect(masks).toHaveLength(2);
  });

  it('should render two ellipses in masks', () => {
    const { container } = render(<Loading />);
    const ellipses = container.querySelectorAll('ellipse');

    expect(ellipses).toHaveLength(2);
  });

  it('should render ellipses with correct attributes', () => {
    const { container } = render(<Loading />);
    const ellipses = container.querySelectorAll('ellipse');

    ellipses.forEach((ellipse) => {
      expect(ellipse).toHaveAttribute('cx', '50');
      expect(ellipse).toHaveAttribute('cy', '50');
      expect(ellipse).toHaveAttribute('fill', 'none');
      expect(ellipse).toHaveAttribute('stroke', 'white');
      expect(ellipse).toHaveAttribute('stroke-width', '8');
    });
  });

  it('should render two wrapper divs with conic-gradient backgrounds', () => {
    const { container } = render(<Loading />);
    const wrappers = container.querySelectorAll(
      '.ant-loading-container-wrapper1, .ant-loading-container-wrapper2',
    );

    expect(wrappers).toHaveLength(2);

    wrappers.forEach((wrapper) => {
      const style = window.getComputedStyle(wrapper);
      expect(style.position).toBe('absolute');
      expect(style.borderRadius).toBe('50%');
    });
  });

  it('should apply hashId to container', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector(
      '[data-testid="loading-container"]',
    );

    expect(loadingContainer).toHaveClass('test-hash-id');
  });

  it('should have correct class names', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.querySelector(
      '[data-testid="loading-container"]',
    );

    expect(loadingContainer).toHaveClass('ant-loading-container');
  });

  it('should accept custom props', () => {
    const { container } = render(
      <Loading style={{ fontSize: 64 }} data-custom="test" />,
    );
    const loadingContainer = container.querySelector(
      '[data-testid="loading-container"]',
    );

    expect(loadingContainer).toHaveAttribute('data-custom', 'test');
  });

  it('should render with 1em size for responsive scaling', () => {
    const { container } = render(<Loading />);
    const innerDiv = container.querySelector(
      '[data-testid="loading-container"] > div',
    );

    expect(innerDiv).toHaveStyle({ width: '1em', height: '1em' });
  });

  it('should generate unique mask IDs for multiple instances', () => {
    const { container: container1 } = render(<Loading />);
    const { container: container2 } = render(<Loading />);

    const masks1 = container1.querySelectorAll('mask');
    const masks2 = container2.querySelectorAll('mask');

    const id1_1 = masks1[0].getAttribute('id');
    const id2_1 = masks2[0].getAttribute('id');

    expect(id1_1).not.toBe(id2_1);
  });
});
