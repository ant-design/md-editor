import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { ShinyText } from '../../src/Components/lotties/ShinyText';

describe('ShinyText 组件', () => {
  it('应该渲染闪光文字组件', () => {
    render(<ShinyText />);

    expect(screen.getByTestId('shiny-text')).toBeInTheDocument();
  });

  it('应该显示自定义文本', () => {
    render(<ShinyText text="加载中..." />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('应该显示默认文本', () => {
    render(<ShinyText />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('应该应用自定义className', () => {
    render(<ShinyText className="custom-class" />);

    expect(screen.getByTestId('shiny-text')).toHaveClass('custom-class');
  });

  it('应该应用自定义样式', () => {
    render(<ShinyText style={{ color: 'rgb(255, 0, 0)' }} />);

    expect(screen.getByTestId('shiny-text')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
    });
  });

  it('应该支持无障碍属性', () => {
    render(<ShinyText text="加载中..." />);

    const element = screen.getByTestId('shiny-text');
    expect(element).toHaveAttribute('role', 'status');
    expect(element).toHaveAttribute('aria-live', 'polite');
    expect(element).toHaveAttribute('aria-label', '加载中...');
  });

  it('禁用动画时应该添加disabled类', () => {
    render(<ShinyText disabled={true} />);

    const element = screen.getByTestId('shiny-text');
    expect(element.className).toContain('disabled');
  });

  it('应该应用自定义字体大小', () => {
    render(<ShinyText fontSize="24px" />);

    expect(screen.getByTestId('shiny-text')).toHaveStyle({ fontSize: '24px' });
  });

  it('默认应该使用亮色主题', () => {
    render(<ShinyText />);

    const element = screen.getByTestId('shiny-text');
    expect(element.className).toContain('light');
  });

  it('应该支持暗色主题', () => {
    render(<ShinyText theme="dark" />);

    const element = screen.getByTestId('shiny-text');
    expect(element.className).toContain('dark');
  });

  it('应该支持亮色主题', () => {
    render(<ShinyText theme="light" />);

    const element = screen.getByTestId('shiny-text');
    expect(element.className).toContain('light');
  });
});
