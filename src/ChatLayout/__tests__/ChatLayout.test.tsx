import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ChatLayout } from '../index';

describe('ChatLayout', () => {
  it('renders with default props', () => {
    render(
      <ChatLayout>
        <div>Test content</div>
      </ChatLayout>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(
      <ChatLayout header={{ title: 'Custom Title' }}>
        <div>Test content</div>
      </ChatLayout>,
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('calls onLeftCollapse when left collapse button is clicked', () => {
    const handleLeftCollapse = vi.fn();

    render(
      <ChatLayout header={{ onLeftCollapse: handleLeftCollapse }}>
        <div>Test content</div>
      </ChatLayout>,
    );

    const leftCollapseButton = screen.getByLabelText('折叠左侧边栏');
    fireEvent.click(leftCollapseButton);

    expect(handleLeftCollapse).toHaveBeenCalledTimes(1);
  });

  it('calls onShare when share button is clicked', () => {
    const handleShare = vi.fn();

    render(
      <ChatLayout header={{ onShare: handleShare }}>
        <div>Test content</div>
      </ChatLayout>,
    );

    const shareButton = screen.getByLabelText('分享对话');
    fireEvent.click(shareButton);

    expect(handleShare).toHaveBeenCalledTimes(1);
  });

  it('hides buttons when show props are false', () => {
    render(
      <ChatLayout
        header={{
          showLeftCollapse: false,
          showRightCollapse: false,
          showShare: false,
        }}
      >
        <div>Test content</div>
      </ChatLayout>,
    );

    expect(screen.queryByLabelText('折叠左侧边栏')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('折叠右侧边栏')).not.toBeInTheDocument();
    expect(screen.queryByText('分享')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <ChatLayout footer={<div>Footer content</div>}>
        <div>Test content</div>
      </ChatLayout>,
    );

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChatLayout className="custom-class">
        <div>Test content</div>
      </ChatLayout>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('ant-chat-layout');
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <ChatLayout style={customStyle}>
        <div>Test content</div>
      </ChatLayout>,
    );

    expect(container.firstChild).toHaveStyle(
      'background-color: rgb(255, 0, 0)',
    );
  });
});
