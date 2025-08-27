import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ToolUseBarThink } from '../src/ToolUseBar/ToolUseBarThink';

describe('ToolUseBarThink Floating Expand Button', () => {
  const defaultProps = {
    toolName: 'Test Tool',
    toolTarget: 'Test Target',
    time: '10:30',
    thinkContent: 'This is test content for the think component',
  };

  it('应该在 loading 状态下显示浮动展开收起按钮', () => {
    render(
      <ToolUseBarThink
        {...defaultProps}
        status="loading"
        defaultExpanded={false}
        defaultFloatingExpanded={false}
      />,
    );

    const floatingExpandButton = screen.getByTestId(
      'tool-use-bar-think-floating-expand',
    );
    expect(floatingExpandButton).toBeInTheDocument();
  });

  it('不应该在非 loading 状态下显示浮动展开收起按钮', () => {
    render(
      <ToolUseBarThink
        {...defaultProps}
        status="success"
        defaultExpanded={false}
        defaultFloatingExpanded={false}
      />,
    );

    const floatingExpandButton = screen.queryByTestId(
      'tool-use-bar-think-floating-expand',
    );
    expect(floatingExpandButton).not.toBeInTheDocument();
  });

  it('浮动按钮点击应该切换浮动展开状态，不影响普通展开状态', () => {
    const onExpandedChange = vi.fn();
    const onFloatingExpandedChange = vi.fn();

    render(
      <ToolUseBarThink
        {...defaultProps}
        status="loading"
        defaultExpanded={false}
        defaultFloatingExpanded={false}
        onExpandedChange={onExpandedChange}
        onFloatingExpandedChange={onFloatingExpandedChange}
      />,
    );

    const floatingExpandButton = screen.getByTestId(
      'tool-use-bar-think-floating-expand',
    );

    // 初始状态应该是收起状态
    expect(floatingExpandButton).toBeInTheDocument();

    // 点击浮动按钮
    fireEvent.click(floatingExpandButton);

    // 应该调用 onFloatingExpandedChange 回调，而不是 onExpandedChange
    expect(onFloatingExpandedChange).toHaveBeenCalled();
    const lastCall = onFloatingExpandedChange.mock.lastCall;
    expect(lastCall?.[0]).toBe(true);

    // 普通展开状态不应该被调用
    expect(onExpandedChange).not.toHaveBeenCalled();
  });

  it('浮动按钮应该显示正确的图标', () => {
    const { rerender } = render(
      <ToolUseBarThink
        {...defaultProps}
        status="loading"
        defaultExpanded={false}
        defaultFloatingExpanded={false}
      />,
    );

    // 收起状态应该显示展开图标
    const floatingExpandButton = screen.getByTestId(
      'tool-use-bar-think-floating-expand',
    );
    expect(floatingExpandButton).toBeInTheDocument();

    // 重新渲染为展开状态
    rerender(
      <ToolUseBarThink
        {...defaultProps}
        status="loading"
        defaultExpanded={false}
        defaultFloatingExpanded={true}
      />,
    );

    // 展开状态应该显示收起图标
    const floatingExpandButtonExpanded = screen.getByTestId(
      'tool-use-bar-think-floating-expand',
    );
    expect(floatingExpandButtonExpanded).toBeInTheDocument();
  });

  it('普通展开按钮和浮动展开按钮应该独立工作', () => {
    const onExpandedChange = vi.fn();
    const onFloatingExpandedChange = vi.fn();

    render(
      <ToolUseBarThink
        {...defaultProps}
        status="loading"
        defaultExpanded={false}
        defaultFloatingExpanded={false}
        onExpandedChange={onExpandedChange}
        onFloatingExpandedChange={onFloatingExpandedChange}
      />,
    );

    // 点击普通展开按钮
    const expandButton = screen
      .getByTestId('tool-use-bar-think-bar')
      .querySelector('[class*="expand"]');
    fireEvent.click(expandButton!);

    // 应该只调用 onExpandedChange
    expect(onExpandedChange).toHaveBeenCalled();
    expect(onFloatingExpandedChange).not.toHaveBeenCalled();

    // 重置 mock
    onExpandedChange.mockClear();
    onFloatingExpandedChange.mockClear();

    // 点击浮动展开按钮
    const floatingExpandButton = screen.getByTestId(
      'tool-use-bar-think-floating-expand',
    );
    fireEvent.click(floatingExpandButton);

    // 应该只调用 onFloatingExpandedChange
    expect(onFloatingExpandedChange).toHaveBeenCalled();
    expect(onExpandedChange).not.toHaveBeenCalled();
  });
});
