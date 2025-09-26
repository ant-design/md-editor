import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Robot from '../Robot';

// Mock Lottie组件
vi.mock('lottie-react', () => ({
  default: ({
    animationData,
    loop,
    autoplay,
    style,
    className,
    ...props
  }: any) => (
    <div
      data-testid="lottie-animation"
      data-loop={loop}
      data-autoplay={autoplay}
      data-animation={animationData ? 'loaded' : 'empty'}
      style={style}
      className={className}
      {...props}
    >
      Lottie Animation
    </div>
  ),
}));

describe('Robot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default size and dazing animation', () => {
    const { container } = render(<Robot />);

    // 检查Lottie动画组件
    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
    expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
    expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');
    expect(lottieAnimation).toHaveAttribute('data-animation', 'loaded');

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
    });
  });

  it('should render with custom size', () => {
    const customSize = 100;
    const { container } = render(<Robot size={customSize} />);

    // 检查Lottie动画组件
    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();

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

    // 当有自定义图标时，不应该显示Lottie动画
    expect(screen.queryByTestId('lottie-animation')).not.toBeInTheDocument();
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

    // 当有字符串图标时，不应该显示Lottie动画
    expect(screen.queryByTestId('lottie-animation')).not.toBeInTheDocument();
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

  it('should render thinking status with ThinkingLottie', () => {
    render(<Robot status="thinking" />);

    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
    expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
    expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');
    expect(lottieAnimation).toHaveAttribute('data-animation', 'loaded');
  });

  it('should render dazing status with DazingLottie', () => {
    render(<Robot status="dazing" />);

    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
    expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
    expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');
    expect(lottieAnimation).toHaveAttribute('data-animation', 'loaded');
  });

  it('should render default status with DazingLottie', () => {
    render(<Robot status="default" />);

    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
    expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
    expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');
    expect(lottieAnimation).toHaveAttribute('data-animation', 'loaded');
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

    // 当有自定义图标时，不应该显示Lottie动画
    expect(screen.queryByTestId('lottie-animation')).not.toBeInTheDocument();
  });

  // 测试记忆化功能
  it('should memoize component properly', () => {
    const { rerender } = render(<Robot size={50} />);

    // 重新渲染相同的props，组件应该被memo优化
    rerender(<Robot size={50} />);

    expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
  });

  // 测试Lottie动画属性
  it('should render Lottie animation with correct properties', () => {
    render(<Robot size={60} />);

    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
    expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
    expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');
    expect(lottieAnimation).toHaveAttribute('data-animation', 'loaded');
    expect(lottieAnimation).toHaveAttribute('aria-hidden', 'true');
  });

  // 测试极端尺寸值
  it('should handle extreme size values', () => {
    // 测试小尺寸
    const { container: container1, unmount: unmount1 } = render(
      <Robot size={1} />,
    );
    const robot1 = container1.firstChild as HTMLElement;
    expect(robot1).toHaveStyle({ width: '1px', height: '1px' });
    expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    unmount1();

    // 测试大尺寸
    const { container: container2 } = render(<Robot size={1000} />);
    const robot2 = container2.firstChild as HTMLElement;
    expect(robot2).toHaveStyle({ width: '1000px', height: '1000px' });
    expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
  });

  // 测试React.isValidElement的分支
  it('should handle non-React element icon', () => {
    const stringIcon = 'https://example.com/icon.png';
    render(<Robot icon={stringIcon} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', stringIcon);

    // 当有字符串图标时，不应该显示Lottie动画
    expect(screen.queryByTestId('lottie-animation')).not.toBeInTheDocument();
  });

  // 测试undefined icon
  it('should handle undefined icon', () => {
    render(<Robot icon={undefined} />);

    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
    expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
    expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');
  });

  // 测试null icon
  it('should handle null icon', () => {
    render(<Robot icon={null} />);

    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
    expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
    expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');
  });

  // 测试空字符串icon
  it('should handle empty string icon', () => {
    render(<Robot icon="" />);

    const lottieAnimation = screen.getByTestId('lottie-animation');
    expect(lottieAnimation).toBeInTheDocument();
    expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
    expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');
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

    // 当有复杂React元素图标时，不应该显示Lottie动画
    expect(screen.queryByTestId('lottie-animation')).not.toBeInTheDocument();
  });

  // 测试零尺寸
  it('should handle zero size', () => {
    const { container } = render(<Robot size={0} />);
    const robot = container.firstChild as HTMLElement;

    expect(robot).toHaveStyle({ width: '0px', height: '0px' });

    // 确保Lottie动画仍然存在
    expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
  });

  // 测试所有status类型
  it('should accept all status types', () => {
    const statuses: Array<'default' | 'thinking' | 'dazing'> = [
      'default',
      'thinking',
      'dazing',
    ];

    statuses.forEach((status) => {
      const { container, unmount } = render(<Robot status={status} />);
      expect(container.firstChild).toBeInTheDocument();

      // 确保每个状态都显示Lottie动画
      const lottieAnimation = screen.getByTestId('lottie-animation');
      expect(lottieAnimation).toBeInTheDocument();
      expect(lottieAnimation).toHaveAttribute('data-loop', 'true');
      expect(lottieAnimation).toHaveAttribute('data-autoplay', 'true');

      // 清理DOM，避免影响下一个测试
      unmount();
    });
  });
});
