import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ChatFlowContainer } from '../index';

describe('ChatFlowContainer', () => {
  it('renders with default props', () => {
    render(
      <ChatFlowContainer>
        <div>Test content</div>
      </ChatFlowContainer>,
    );

    expect(screen.getByText('AI 助手')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(
      <ChatFlowContainer title="Custom Title">
        <div>Test content</div>
      </ChatFlowContainer>,
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('calls onLeftCollapse when left collapse button is clicked', () => {
    const handleLeftCollapse = vi.fn();

    render(
      <ChatFlowContainer onLeftCollapse={handleLeftCollapse}>
        <div>Test content</div>
      </ChatFlowContainer>,
    );

    const leftCollapseButton = screen.getByLabelText('折叠左侧边栏');
    fireEvent.click(leftCollapseButton);

    expect(handleLeftCollapse).toHaveBeenCalledTimes(1);
  });

  // it('calls onRightCollapse when right collapse button is clicked', () => {
  //   const handleRightCollapse = vi.fn();

  //   render(
  //     <ChatFlowContainer onRightCollapse={handleRightCollapse}>
  //       <div>Test content</div>
  //     </ChatFlowContainer>
  //   );

  //   const rightCollapseButton = screen.getByLabelText('折叠右侧边栏');
  //   fireEvent.click(rightCollapseButton);

  //   expect(handleRightCollapse).toHaveBeenCalledTimes(1);
  // });

  it('calls onShare when share button is clicked', () => {
    const handleShare = vi.fn();

    render(
      <ChatFlowContainer onShare={handleShare}>
        <div>Test content</div>
      </ChatFlowContainer>,
    );

    const shareButton = screen.getByLabelText('分享对话');
    fireEvent.click(shareButton);

    expect(handleShare).toHaveBeenCalledTimes(1);
  });

  it('hides buttons when show props are false', () => {
    render(
      <ChatFlowContainer
        showLeftCollapse={false}
        showRightCollapse={false}
        showShare={false}
      >
        <div>Test content</div>
      </ChatFlowContainer>,
    );

    expect(screen.queryByLabelText('折叠左侧边栏')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('折叠右侧边栏')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('分享对话')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <ChatFlowContainer footer={<div>Footer content</div>}>
        <div>Test content</div>
      </ChatFlowContainer>,
    );

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChatFlowContainer className="custom-class">
        <div>Test content</div>
      </ChatFlowContainer>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('chat-flow-container');
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };

    const { container } = render(
      <ChatFlowContainer style={customStyle}>
        <div>Test content</div>
      </ChatFlowContainer>,
    );

    expect(container.firstChild).toHaveStyle(
      'background-color: rgb(255, 0, 0)',
    );
  });
});
