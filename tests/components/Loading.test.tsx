import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Loading } from '../../src/components/Loading';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    svg: React.forwardRef<SVGSVGElement>((props: any, ref) => (
      <svg ref={ref} {...props} />
    )),
    ellipse: React.forwardRef<SVGEllipseElement>((props: any, ref) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { animate, initial, transition, ...restProps } = props;
      return <ellipse ref={ref} {...restProps} />;
    }),
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

  it('should render gradient definition', () => {
    const { container } = render(<Loading />);
    const gradient = container.querySelector('#gradient');

    expect(gradient).toBeInTheDocument();
    expect(gradient?.tagName).toBe('linearGradient');
  });

  it('should render gradient stops with correct colors', () => {
    const { container } = render(<Loading />);
    const stops = container.querySelectorAll('#gradient stop');

    expect(stops).toHaveLength(4);
    expect(stops[0]).toHaveAttribute('stop-color', '#5EF050');
    expect(stops[1]).toHaveAttribute('stop-color', '#37ABFF');
    expect(stops[2]).toHaveAttribute('stop-color', '#D7B9FF');
    expect(stops[3]).toHaveAttribute('stop-color', '#D7B9FF');
  });

  it('should render two animated ellipses', () => {
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
      expect(ellipse).toHaveAttribute('stroke', 'url(#gradient)');
      expect(ellipse).toHaveAttribute('stroke-width', '6');
    });
  });

  it('should render SVG elements with correct viewBox', () => {
    const { container } = render(<Loading />);
    // 3 SVGs: 1 for gradient definition + 2 for animated ellipses
    const svgs = container.querySelectorAll('svg');

    expect(svgs.length).toBeGreaterThanOrEqual(3);

    // Check animated SVGs have correct viewBox
    const animatedSvgs = Array.from(svgs).filter(
      (svg) => svg.getAttribute('viewBox') === '0 0 100 100',
    );
    expect(animatedSvgs).toHaveLength(2);
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

    expect(loadingContainer).toHaveStyle({ fontSize: '64px' });
    expect(loadingContainer).toHaveAttribute('data-custom', 'test');
  });

  it('should render with 1em size for responsive scaling', () => {
    const { container } = render(<Loading />);
    const animatedSvgs = container.querySelectorAll(
      'svg[viewBox="0 0 100 100"]',
    );

    animatedSvgs.forEach((svg) => {
      expect(svg).toHaveAttribute('width', '1em');
      expect(svg).toHaveAttribute('height', '1em');
    });
  });
});
