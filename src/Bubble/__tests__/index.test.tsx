import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BubbleConfigContext } from '../BubbleConfigProvide';
import { Bubble } from '../index';
import type { BubbleProps } from '../type';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const defaultProps: BubbleProps = {
  placement: 'left',
  avatar: {
    src: 'https://example.com/avatar.jpg',
    title: 'Test User',
  },
  time: 1672574400000, // 2023-01-01 12:00:00 的时间戳
  children: 'Test message content',
};

describe('Bubble Component', () => {
  it('should render basic bubble with content', () => {
    render(<Bubble {...defaultProps} />);

    expect(screen.getByText('Test message content')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should render with different placements', () => {
    const { rerender } = render(<Bubble {...defaultProps} placement="left" />);

    let bubbleContainer = screen
      .getByText('Test message content')
      .closest('[class*="bubble"]');
    expect(bubbleContainer).toBeInTheDocument();

    rerender(<Bubble {...defaultProps} placement="right" />);
    bubbleContainer = screen
      .getByText('Test message content')
      .closest('[class*="bubble"]');
    expect(bubbleContainer).toBeInTheDocument();
  });

  it('should handle avatar click', () => {
    const onAvatarClick = vi.fn();
    render(<Bubble {...defaultProps} onAvatarClick={onAvatarClick} />);

    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);

    expect(onAvatarClick).toHaveBeenCalledTimes(1);
  });

  it('should render with custom className and style', () => {
    const customClassName = 'custom-bubble';
    const customStyle = { backgroundColor: 'red' };

    const { container } = render(
      <Bubble
        {...defaultProps}
        className={customClassName}
        style={customStyle}
      />,
    );

    const bubbleElement = container.firstChild as HTMLElement;
    expect(bubbleElement).toHaveClass(customClassName);
    expect(bubbleElement).toHaveStyle(customStyle);
  });

  it('should render loading state', () => {
    render(<Bubble {...defaultProps} loading />);

    // 应该显示加载状态
    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should render with actions', () => {
    const actions = [
      <button key="1" type="button" data-testid="action-1">
        Action 1
      </button>,
      <button key="2" type="button" data-testid="action-2">
        Action 2
      </button>,
    ];

    render(<Bubble {...defaultProps} actions={actions} />);

    expect(screen.getByTestId('action-1')).toBeInTheDocument();
    expect(screen.getByTestId('action-2')).toBeInTheDocument();
  });

  it('should render with header and footer', () => {
    const header = <div data-testid="header">Header Content</div>;
    const footer = <div data-testid="footer">Footer Content</div>;

    render(<Bubble {...defaultProps} header={header} footer={footer} />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render with messageRender', () => {
    const messageRender = vi.fn(() => (
      <div data-testid="custom-message">Custom Message</div>
    ));

    render(<Bubble {...defaultProps} messageRender={messageRender} />);

    expect(screen.getByTestId('custom-message')).toBeInTheDocument();
    expect(messageRender).toHaveBeenCalled();
  });

  it('should render with files', () => {
    const files = [
      { name: 'file1.pdf', url: 'https://example.com/file1.pdf' },
      { name: 'file2.doc', url: 'https://example.com/file2.doc' },
    ];

    render(<Bubble {...defaultProps} files={files} />);

    expect(screen.getByText('file1.pdf')).toBeInTheDocument();
    expect(screen.getByText('file2.doc')).toBeInTheDocument();
  });

  it('should work with BubbleConfigContext', () => {
    const config = {
      standalone: true,
      locale: {
        'chat.inputArea.placeholder': 'Test placeholder',
        'chat.inputArea.max_input_length': 'Test max length',
        'chat.list.helloMessage': 'Test hello',
        'chat.newsession.popconfirm': 'Test confirm',
        'chat.newsession': 'Test new session',
        'chat.close': 'Test close',
      },
    };

    render(
      <BubbleConfigContext.Provider value={config}>
        <Bubble {...defaultProps} />
      </BubbleConfigContext.Provider>,
    );

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should handle different avatar types', () => {
    const { rerender } = render(
      <Bubble
        {...defaultProps}
        avatar={{
          src: 'https://example.com/avatar.jpg',
          title: 'Image Avatar',
        }}
      />,
    );

    expect(screen.getByText('Image Avatar')).toBeInTheDocument();

    // Test emoji avatar
    rerender(
      <Bubble
        {...defaultProps}
        avatar={{
          emoji: '😀',
          title: 'Emoji Avatar',
        }}
      />,
    );

    expect(screen.getByText('Emoji Avatar')).toBeInTheDocument();
  });

  it('should render with metadata', () => {
    const metadata = {
      title: 'Test Title',
      description: 'Test Description',
      extra: <div data-testid="extra-content">Extra</div>,
    };

    render(<Bubble {...defaultProps} metadata={metadata} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId('extra-content')).toBeInTheDocument();
  });

  it('should handle time display', () => {
    const timeNumber = 1672574400000; // 2023-01-01 12:00:00
    render(<Bubble {...defaultProps} time={timeNumber} />);

    // 时间应该在文档中被显示（格式化后的）
    const timeElements = screen.getAllByText(/2023|01|12/);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('should render with custom variant', () => {
    render(<Bubble {...defaultProps} variant="outline" />);

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should handle onMessageClick', () => {
    const onMessageClick = vi.fn();
    render(<Bubble {...defaultProps} onMessageClick={onMessageClick} />);

    const messageContainer = screen.getByText('Test message content');
    fireEvent.click(messageContainer);

    expect(onMessageClick).toHaveBeenCalledTimes(1);
  });

  it('should render with custom typing animation', () => {
    render(<Bubble {...defaultProps} typing />);

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should handle ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Bubble {...defaultProps} bubbleRef={ref} />);

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should render without avatar', () => {
    render(<Bubble {...defaultProps} avatar={undefined} />);

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should render with animation', () => {
    render(<Bubble {...defaultProps} animation />);

    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });
});
