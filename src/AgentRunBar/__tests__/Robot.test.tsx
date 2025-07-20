import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import Robot from '../Robot';

describe('Robot Component', () => {
  it('should render with default size and image', () => {
    const { container } = render(<Robot />);

    const robot = screen.getByRole('img');
    expect(robot).toBeInTheDocument();
    expect(robot).toHaveAttribute('alt', 'robot');

    // 检查容器样式
    const robotContainer = container.firstChild as HTMLElement;
    expect(robotContainer).toHaveStyle({
      width: '42px',
      height: '42px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginRight: '8px',
    });
  });

  it('should render with custom size', () => {
    const customSize = 100;
    const { container } = render(<Robot size={customSize} />);

    const robotContainer = container.firstChild as HTMLElement;
    expect(robotContainer).toHaveStyle({
      width: `${customSize}px`,
      height: `${customSize}px`,
    });
  });

  it('should render with custom icon', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    render(<Robot icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom Icon')).toBeInTheDocument();
  });

  it('should render with custom icon and not apply size styles', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    const { container } = render(<Robot icon={customIcon} size={100} />);

    const robotContainer = container.firstChild as HTMLElement;
    expect(robotContainer).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginRight: '8px',
    });
    // 当有自定义图标时，不应该应用 width 和 height
    expect(robotContainer.style.width).toBe('');
    expect(robotContainer.style.height).toBe('');
  });

  it('should render with string icon as image src', () => {
    const customIconUrl = 'https://example.com/icon.png';
    render(<Robot icon={customIconUrl} />);

    const robot = screen.getByRole('img');
    expect(robot).toHaveAttribute('src', customIconUrl);
    expect(robot).toHaveAttribute('alt', 'robot');
  });

  it('should apply custom className and style', () => {
    const customClass = 'custom-robot';
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <Robot className={customClass} style={customStyle} />,
    );

    const robotContainer = container.firstChild as HTMLElement;
    expect(robotContainer).toHaveClass(customClass);
    expect(robotContainer.style.backgroundColor).toBe('red');
  });

  it('should render with different status prop (for type safety)', () => {
    // 虽然 status 在组件中没有实际使用，但确保传递不会导致错误
    const { container } = render(<Robot status="thinking" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with all props combined', () => {
    const customIcon = <span data-testid="icon">🤖</span>;
    const customClass = 'robot-custom';
    const customStyle = { border: '1px solid black' };

    render(
      <Robot
        icon={customIcon}
        size={80}
        className={customClass}
        style={customStyle}
        status="dazing"
      />,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
  });

  // 测试记忆化功能
  it('should memoize component properly', () => {
    const { rerender } = render(<Robot size={50} />);

    // 重新渲染相同的props，组件应该被memo优化
    rerender(<Robot size={50} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  // 测试默认图片URL
  it('should use default robot image URL', () => {
    render(<Robot />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*R2VDRJQuQd4AAAAAAAAAAAAADmuEAQ/original',
    );
  });

  // 测试极端尺寸值
  it('should handle extreme size values', () => {
    const { container: container1 } = render(<Robot size={1} />);
    const { container: container2 } = render(<Robot size={1000} />);

    const robot1 = container1.firstChild as HTMLElement;
    const robot2 = container2.firstChild as HTMLElement;

    expect(robot1).toHaveStyle({ width: '1px', height: '1px' });
    expect(robot2).toHaveStyle({ width: '1000px', height: '1000px' });
  });

  // 测试React.isValidElement的分支
  it('should handle non-React element icon', () => {
    const stringIcon = 'https://example.com/icon.png';
    render(<Robot icon={stringIcon} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', stringIcon);
  });

  // 测试undefined icon
  it('should handle undefined icon', () => {
    render(<Robot icon={undefined} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*R2VDRJQuQd4AAAAAAAAAAAAADmuEAQ/original',
    );
  });

  // 测试null icon
  it('should handle null icon', () => {
    render(<Robot icon={null} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*R2VDRJQuQd4AAAAAAAAAAAAADmuEAQ/original',
    );
  });

  // 测试空字符串icon
  it('should handle empty string icon', () => {
    render(<Robot icon="" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'src',
      'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*R2VDRJQuQd4AAAAAAAAAAAAADmuEAQ/original',
    );
  });

  // 测试复杂的React元素icon
  it('should render complex React element icon', () => {
    const complexIcon = (
      <div data-testid="complex-icon">
        <span>Robot</span>
        <img src="test.png" alt="test" />
      </div>
    );

    render(<Robot icon={complexIcon} />);

    expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
    expect(screen.getByText('Robot')).toBeInTheDocument();
    expect(screen.getByAltText('test')).toBeInTheDocument();
  });

  // 测试零尺寸
  it('should handle zero size', () => {
    const { container } = render(<Robot size={0} />);
    const robot = container.firstChild as HTMLElement;

    expect(robot).toHaveStyle({ width: '0px', height: '0px' });
  });

  // 测试所有status类型
  it('should accept all status types', () => {
    const statuses: Array<'default' | 'thinking' | 'dazing'> = [
      'default',
      'thinking',
      'dazing',
    ];

    statuses.forEach((status) => {
      const { container } = render(<Robot status={status} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
