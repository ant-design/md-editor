import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownInputField } from '../MarkdownInputField';

describe('MarkdownInputField - toolsRender', () => {
  it('should render custom tools when toolsRender is provided', () => {
    const toolsRender = () => [
      <button key="custom-tool-1" data-testid="custom-tool-1">
        Tool 1
      </button>,
      <button key="custom-tool-2" data-testid="custom-tool-2">
        Tool 2
      </button>,
    ];

    render(<MarkdownInputField toolsRender={toolsRender} />);

    expect(screen.getByTestId('custom-tool-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-tool-2')).toBeInTheDocument();
  });

  it('should pass correct props to toolsRender function', () => {
    const toolsRender = vi
      .fn()
      .mockReturnValue([<button key="custom-tool">Tool</button>]);

    render(
      <MarkdownInputField value="test content" toolsRender={toolsRender} />,
    );

    // 验证传递给 toolsRender 的参数
    expect(toolsRender).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'test content',
        isHover: false,
        isLoading: false,
        fileUploadStatus: 'done',
      }),
    );
  });

  it('should update tools when component state changes', async () => {
    const toolsRender = vi.fn().mockImplementation(({ isHover }) => [
      <button key="custom-tool" data-testid="custom-tool">
        {isHover ? 'Hovered' : 'Not Hovered'}
      </button>,
    ]);

    const { container } = render(
      <MarkdownInputField toolsRender={toolsRender} />,
    );

    // 触发 hover 事件
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    // 验证 toolsRender 被调用，且传入了更新后的 isHover 状态
    expect(toolsRender).toHaveBeenCalledWith(
      expect.objectContaining({
        isHover: true,
      }),
    );
  });

  it('should handle tool click events', () => {
    const onToolClick = vi.fn();
    const toolsRender = () => [
      <button key="custom-tool" data-testid="custom-tool" onClick={onToolClick}>
        Tool
      </button>,
    ];

    render(<MarkdownInputField toolsRender={toolsRender} />);

    const toolButton = screen.getByTestId('custom-tool');
    fireEvent.click(toolButton);

    expect(onToolClick).toHaveBeenCalled();
  });

  it('should render tools with correct styles', () => {
    const toolsRender = () => [
      <button key="custom-tool" data-testid="custom-tool">
        Tool
      </button>,
    ];

    render(<MarkdownInputField toolsRender={toolsRender} />);

    const toolsContainer = screen
      .getByTestId('custom-tool')
      .closest('.ant-md-input-field-send-tools');
    expect(toolsContainer).toHaveClass('ant-md-input-field-send-tools');
  });

  it('should not interfere with send button functionality', () => {
    const onSend = vi.fn();
    const toolsRender = () => [
      <button key="custom-tool" data-testid="custom-tool">
        Tool
      </button>,
    ];

    render(
      <MarkdownInputField
        toolsRender={toolsRender}
        onSend={onSend}
        value="test message"
      />,
    );

    // 模拟发送消息
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);

    expect(onSend).toHaveBeenCalledWith('test message');
  });

  it('should handle disabled state correctly', () => {
    const toolsRender = () => [
      <button key="custom-tool" data-testid="custom-tool">
        Tool
      </button>,
    ];

    render(<MarkdownInputField toolsRender={toolsRender} disabled={true} />);

    const wrapper = screen
      .getByTestId('custom-tool')
      .closest('.ant-md-input-field');
    expect(wrapper).toHaveClass('ant-md-input-field-disabled');
  });
});
