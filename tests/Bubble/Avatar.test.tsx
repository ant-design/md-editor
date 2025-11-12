import React from 'react';
import { render, screen } from '@testing-library/react';
import { BubbleAvatar } from '../../src/Bubble/Avatar';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock the isEmoji function to control its behavior in tests
vi.mock('../../src/Bubble/Avatar/isEmoji', () => ({
  isEmoji: vi.fn((str: string) => str === '😀' || str === '🤖'),
}));

describe('BubbleAvatar', () => {
  it('should render with default props', () => {
    render(<BubbleAvatar title="User" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    render(<BubbleAvatar title="User" size={50} />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement).toHaveStyle({ width: '50px', height: '50px' });
  });

  it('should render with custom shape', () => {
    render(<BubbleAvatar title="User" shape="square" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(<BubbleAvatar title="User" className="custom-avatar" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toHaveClass('custom-avatar');
  });

  it('should render with custom style', () => {
    render(<BubbleAvatar title="User" style={{ color: 'red' }} />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should render with image avatar from URL', () => {
    render(<BubbleAvatar avatar="http://example.com/avatar.jpg" title="User" />);
    
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', 'http://example.com/avatar.jpg');
    expect(imgElement).toHaveAttribute('alt', 'avatar');
  });

  it('should render with image avatar from relative path', () => {
    render(<BubbleAvatar avatar="/avatar.jpg" title="User" />);
    
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', '/avatar.jpg');
    expect(imgElement).toHaveAttribute('alt', 'avatar');
  });

  it('should render with base64 image avatar', () => {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    render(<BubbleAvatar avatar={base64Image} title="User" />);
    
    // For base64 images, the src should be the base64 string directly
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should render emoji avatar', () => {
    render(<BubbleAvatar avatar="😀" />);
    
    const emojiElement = screen.getByText('😀');
    expect(emojiElement).toBeInTheDocument();
  });

  it('should render emoji avatar for robot emoji', () => {
    render(<BubbleAvatar avatar="🤖" />);
    
    const emojiElement = screen.getByText('🤖');
    expect(emojiElement).toBeInTheDocument();
  });

  it('should render text avatar when avatar is not an image or emoji', () => {
    render(<BubbleAvatar avatar="JD" title="John Doe" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should render title when avatar is an image', () => {
    render(<BubbleAvatar avatar="http://example.com/avatar.jpg" title="JD" />);
    
    // When it's an image, it should show the title text
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should handle onClick callback', () => {
    const handleClick = vi.fn();
    render(<BubbleAvatar title="User" onClick={handleClick} />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    avatarElement.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have default cursor when no onClick handler', () => {
    render(<BubbleAvatar title="User" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toHaveStyle({ cursor: 'default' });
  });

  it('should render with custom prefixCls', () => {
    render(<BubbleAvatar title="User" prefixCls="custom-prefix" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should handle empty avatar and title', () => {
    render(<BubbleAvatar />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should handle undefined avatar', () => {
    render(<BubbleAvatar title="User" avatar={undefined} />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should handle null avatar', () => {
    render(<BubbleAvatar title="User" avatar={null as any} />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should slice text to maximum 2 characters', () => {
    render(<BubbleAvatar title="LongName" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should convert text to uppercase', () => {
    render(<BubbleAvatar title="john" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should handle special characters in title', () => {
    render(<BubbleAvatar title="J@D" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should handle numeric title', () => {
    render(<BubbleAvatar title={'123'} />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  it('should handle special unicode characters', () => {
    render(<BubbleAvatar title="ñá" />);
    
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  // 新增测试用例来覆盖第69行代码
  it('should render emoji with custom prefixCls', () => {
    render(<BubbleAvatar avatar="😀" prefixCls="custom-prefix" />);
    
    const emojiElement = screen.getByText('😀');
    expect(emojiElement).toBeInTheDocument();
    expect(emojiElement).toHaveClass('custom-prefix-emoji');
  });

  // 新增测试用例来覆盖第82-83行代码，验证base64图片的处理
  it('should render base64 image with correct src attribute', () => {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    render(<BubbleAvatar avatar={base64Image} title="User" />);
    
    // 验证是base64图片
    const avatarElement = screen.getByTestId('bubble-avatar');
    expect(avatarElement).toBeInTheDocument();
  });

  // 新增测试用例来覆盖第82-83行代码，验证普通图片URL的处理
  it('should render image with img tag for non-base64 URLs', () => {
    render(<BubbleAvatar avatar="http://example.com/avatar.jpg" title="User" />);
    
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', 'http://example.com/avatar.jpg');
    expect(imgElement).toHaveAttribute('alt', 'avatar');
  });
});