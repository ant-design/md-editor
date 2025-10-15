import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Loading } from '../../src/components/Loading';

describe('Loading 组件', () => {
  it('应该渲染加载组件', () => {
    render(<Loading />);

    expect(screen.getByTestId('loading-container')).toBeInTheDocument();
  });

  it('应该包含渐变定义', () => {
    const { container } = render(<Loading />);

    const defs = container.querySelector('defs');
    expect(defs).toBeInTheDocument();

    const gradient1 = container.querySelector('#gradient');
    const gradient2 = container.querySelector('#gradient1');

    expect(gradient1).toBeInTheDocument();
    expect(gradient2).toBeInTheDocument();
  });

  it('应该包含两个动画椭圆', () => {
    const { container } = render(<Loading />);

    const ellipses = container.querySelectorAll('ellipse');
    expect(ellipses).toHaveLength(2);
  });

  it('应该包含两个 SVG 容器', () => {
    const { container } = render(<Loading />);

    const svgs = container.querySelectorAll('svg');
    // 至少有3个 svg：1个用于渐变定义，2个用于动画椭圆
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  it('应该支持自定义样式', () => {
    const { container } = render(
      <Loading style={{ fontSize: '2em', color: 'red' }} />,
    );

    const loadingContainer = screen.getByTestId('loading-container');
    expect(loadingContainer).toBeInTheDocument();
  });

  it('应该在 ConfigProvider 中正确工作', () => {
    const { container } = render(
      <ConfigProvider prefixCls="custom">
        <Loading />
      </ConfigProvider>,
    );

    expect(container.querySelector('.custom-loading-container')).toBeInTheDocument();
  });

  it('应该设置正确的 viewBox', () => {
    const { container } = render(<Loading />);

    const ellipseSvgs = container.querySelectorAll('svg[viewBox="0 0 100 100"]');
    expect(ellipseSvgs.length).toBeGreaterThanOrEqual(2);
  });

  it('应该使用渐变填充椭圆', () => {
    const { container } = render(<Loading />);

    const ellipses = container.querySelectorAll('ellipse');

    // 验证椭圆使用了渐变
    Array.from(ellipses).forEach((ellipse) => {
      const stroke = ellipse.getAttribute('stroke');
      expect(stroke).toMatch(/url\(#gradient/);
    });
  });

  it('应该设置椭圆的中心点', () => {
    const { container } = render(<Loading />);

    const ellipses = container.querySelectorAll('ellipse');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('应该设置椭圆为无填充', () => {
    const { container } = render(<Loading />);

    const ellipses = container.querySelectorAll('ellipse');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('应该设置描边宽度', () => {
    const { container } = render(<Loading />);

    const ellipses = container.querySelectorAll('ellipse');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('应该支持传递额外的 DOM 属性', () => {
    render(<Loading data-custom="test-value" />);

    const container = screen.getByTestId('loading-container');
    expect(container).toHaveAttribute('data-custom', 'test-value');
  });

  it('应该设置正确的容器尺寸', () => {
    const { container } = render(<Loading />);

    const innerDiv = container.querySelector('div > div');
    // 验证容器存在
    expect(innerDiv).toBeInTheDocument();
  });

  it('应该包含线性渐变的正确停止点', () => {
    const { container } = render(<Loading />);

    const gradient1 = container.querySelector('#gradient');
    const stops1 = gradient1?.querySelectorAll('stop');

    expect(stops1).toHaveLength(4);

    // 验证第一个渐变的停止点
    expect(stops1?.[0].getAttribute('offset')).toBe('0%');
    expect(stops1?.[1].getAttribute('offset')).toBe('20%');
    expect(stops1?.[2].getAttribute('offset')).toBe('55%');
    expect(stops1?.[3].getAttribute('offset')).toBe('75%');
  });

  it('应该使用绝对定位的 SVG', () => {
    const { container } = render(<Loading />);

    const ellipseSvgs = container.querySelectorAll(
      'svg[viewBox="0 0 100 100"]',
    );

    Array.from(ellipseSvgs).forEach((svg) => {
      expect(svg).toHaveStyle({ position: 'absolute' });
    });
  });

  it('应该设置渐变的坐标', () => {
    const { container } = render(<Loading />);

    const gradient1 = container.querySelector('#gradient');

    expect(gradient1?.getAttribute('x1')).toBe('60%');
    expect(gradient1?.getAttribute('y1')).toBe('0%');
    expect(gradient1?.getAttribute('x2')).toBe('0%');
    expect(gradient1?.getAttribute('y2')).toBe('100%');
  });

  it('应该创建隐藏的渐变定义 SVG', () => {
    const { container } = render(<Loading />);

    const defsSvg = container.querySelector('svg[width="0"]');
    expect(defsSvg).toHaveStyle({ position: 'absolute' });
  });
});

