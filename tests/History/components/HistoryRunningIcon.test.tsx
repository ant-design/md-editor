import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import {
  HistoryRunningIcon,
  HistoryRunningIconContainer,
} from '../../../src/History/components/HistoryRunningIcon';

describe('HistoryRunningIcon', () => {
  it('应该渲染运行图标', () => {
    const { container } = render(<HistoryRunningIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('应该暂停动画', () => {
    const { container } = render(<HistoryRunningIcon paused={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ animation: 'none' });
  });

  it('应该应用自定义动画样式', () => {
    const animationStyle = { animationTimingFunction: 'ease-in-out' };
    const { container } = render(
      <HistoryRunningIcon animationStyle={animationStyle} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ animationTimingFunction: 'ease-in-out' });
  });

  it('应该设置自定义宽度和高度', () => {
    const { container } = render(<HistoryRunningIcon width={32} height={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('应该包含渐变定义', () => {
    const { container } = render(<HistoryRunningIcon />);
    const gradient = container.querySelector('linearGradient');
    expect(gradient).toBeInTheDocument();
  });

  it('应该包含clipPath定义', () => {
    const { container } = render(<HistoryRunningIcon />);
    const clipPath = container.querySelector('clipPath');
    expect(clipPath).toBeInTheDocument();
  });

  it('应该包含path元素', () => {
    const { container } = render(<HistoryRunningIcon />);
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });

  it('应该设置自定义颜色', () => {
    const { container } = render(<HistoryRunningIcon color="#FF0000" />);
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('fill', '#FF0000');
  });

  it('应该使用渐变填充（默认）', () => {
    const { container } = render(<HistoryRunningIcon />);
    const path = container.querySelector('path');
    const fill = path?.getAttribute('fill');
    expect(fill).toMatch(/url\(#history-running-.*-gradient\)/);
  });

  it('应该应用SVG属性', () => {
    const { container } = render(
      <HistoryRunningIcon
        data-testid="custom-icon"
        aria-label="Loading icon"
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-testid', 'custom-icon');
    expect(svg).toHaveAttribute('aria-label', 'Loading icon');
  });

  it('应该在测试环境中不注入style标签', () => {
    const { container } = render(<HistoryRunningIcon animated={true} />);
    const style = container.querySelector('style');
    expect(style).not.toBeInTheDocument();
  });

  // 添加新的测试用例来覆盖第101行
  it('应该在非测试环境中注入style标签（第101行）', () => {
    // 模拟非测试环境
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const { container } = render(<HistoryRunningIcon animated={true} />);
    const style = container.querySelector('style');
    
    // 在非测试环境中应该注入style标签
    expect(style).toBeInTheDocument();
    
    // 恢复原始环境变量
    process.env.NODE_ENV = originalEnv;
  });
});

describe('HistoryRunningIconContainer', () => {
  it('应该渲染容器', () => {
    const { container } = render(<HistoryRunningIconContainer />);
    const div = container.firstChild as HTMLElement;
    expect(div).toBeInTheDocument();
    expect(div.tagName).toBe('DIV');
  });

  it('应该渲染图标', () => {
    const { container } = render(<HistoryRunningIconContainer />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('应该应用默认大小', () => {
    const { container } = render(<HistoryRunningIconContainer />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({
      width: '16px',
      height: '16px',
    });
  });

  it('应该应用自定义数字大小', () => {
    const { container } = render(<HistoryRunningIconContainer size={24} />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({
      width: '24px',
      height: '24px',
    });
  });

  it('应该应用自定义字符串大小', () => {
    const { container } = render(<HistoryRunningIconContainer size="2em" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({
      width: '2em',
      height: '2em',
    });
  });

  it('应该应用自定义容器样式', () => {
    const customStyle = { background: 'red', padding: '10px' };
    const { container } = render(
      <HistoryRunningIconContainer containerStyle={customStyle} />,
    );
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle(customStyle);
  });

  it('应该传递图标属性', () => {
    const { container } = render(
      <HistoryRunningIconContainer
        iconProps={{ animated: false, color: 'blue' }}
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveStyle({
      animation: expect.any(String),
    });
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('fill', 'blue');
  });

  it('应该渲染子元素', () => {
    const { container } = render(
      <HistoryRunningIconContainer>
        <span>子元素</span>
      </HistoryRunningIconContainer>,
    );
    expect(container.textContent).toContain('子元素');
  });

  it('应该使用flex布局居中', () => {
    const { container } = render(<HistoryRunningIconContainer />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });

  it('应该将大小传递给图标', () => {
    const { container } = render(<HistoryRunningIconContainer size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32px');
    expect(svg).toHaveAttribute('height', '32px');
  });
});
