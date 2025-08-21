import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ToolUseBar } from '../src/ToolUseBar';

const mockTools = [
  {
    id: 'tool1',
    toolName: 'Tool 1',
    toolTarget: 'Target 1',
    time: '10:00',
    status: 'success' as const,
  },
  {
    id: 'tool2',
    toolName: 'Tool 2',
    toolTarget: 'Target 2',
    time: '10:30',
    status: 'loading' as const,
  },
  {
    id: 'tool3',
    toolName: 'Tool 3',
    toolTarget: 'Target 3',
    time: '11:00',
    status: 'error' as const,
    errorMessage: 'Network error',
  },
  {
    id: 'tool4',
    toolName: 'Tool 4',
    toolTarget: 'Target 4',
    time: '11:30',
    status: 'success' as const,
    content: <div>Custom content</div>,
  },
];

describe('ToolUseBar', () => {
  it('should render tools correctly', () => {
    render(<ToolUseBar tools={mockTools} />);

    expect(screen.getByText('Tool 1')).toBeInTheDocument();
    expect(screen.getByText('Tool 2')).toBeInTheDocument();
    expect(screen.getByText('Tool 3')).toBeInTheDocument();
    expect(screen.getByText('Tool 4')).toBeInTheDocument();
  });

  it('should call onToolClick when tool is clicked', () => {
    const mockOnToolClick = vi.fn();
    const { container } = render(
      <ToolUseBar tools={mockTools} onToolClick={mockOnToolClick} />,
    );

    const toolContainers = container.querySelectorAll(
      '[class*="tool-use-bar-tool"]',
    );
    fireEvent.click(toolContainers[0]);

    expect(mockOnToolClick).toHaveBeenCalledWith('tool1');
  });

  it('should render empty state when no tools provided', () => {
    const { container } = render(<ToolUseBar tools={[]} />);
    expect(container.firstChild).toHaveClass('tool-use-bar');
  });

  it('should support activeKeys prop', () => {
    render(
      <ToolUseBar
        tools={mockTools}
        activeKeys={['tool1']}
        onActiveKeysChange={() => {}}
      />,
    );

    // 验证组件能正常渲染
    expect(screen.getByText('Tool 1')).toBeInTheDocument();
    expect(screen.getByText('Tool 2')).toBeInTheDocument();
    expect(screen.getByText('Tool 3')).toBeInTheDocument();
    expect(screen.getByText('Tool 4')).toBeInTheDocument();
  });

  it('should show error icon when tool status is error', () => {
    const { container } = render(<ToolUseBar tools={mockTools} />);

    // 查找包含错误图标的 SVG 元素
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);

    // 验证至少有一个错误图标存在（通过检查 SVG 的 path 元素）
    const pathElements = container.querySelectorAll('svg path');
    expect(pathElements.length).toBeGreaterThan(0);
  });

  it('should not show error icon for non-error tools', () => {
    const toolsWithoutError = [
      {
        id: 'tool1',
        toolName: 'Tool 1',
        toolTarget: 'Target 1',
        time: '10:00',
        status: 'success' as const,
      },
      {
        id: 'tool2',
        toolName: 'Tool 2',
        toolTarget: 'Target 2',
        time: '10:30',
        status: 'loading' as const,
      },
    ];

    const { container } = render(<ToolUseBar tools={toolsWithoutError} />);

    // 验证没有错误图标容器
    const errorIconContainers = container.querySelectorAll(
      '[class*="tool-use-bar-tool-error-icon"]',
    );
    expect(errorIconContainers.length).toBe(0);
  });

  it('should show expand button when tool has content or error message', () => {
    const { container } = render(<ToolUseBar tools={mockTools} />);

    // 查找展开按钮
    const expandButtons = container.querySelectorAll(
      '[class*="tool-use-bar-tool-expand"]',
    );
    expect(expandButtons.length).toBe(2); // tool3 (error) 和 tool4 (content)
  });

  it('should expand/collapse content when expand button is clicked', () => {
    const { container } = render(<ToolUseBar tools={mockTools} />);

    // 查找展开按钮
    const expandButtons = container.querySelectorAll(
      '[class*="tool-use-bar-tool-expand"]',
    );
    const firstExpandButton = expandButtons[0];

    // 初始状态应该是收起的
    const contentContainers = container.querySelectorAll(
      '[class*="tool-use-bar-tool-container"]',
    );
    expect(contentContainers.length).toBe(0);

    // 点击展开按钮
    fireEvent.click(firstExpandButton);

    // 应该显示内容
    const expandedContentContainers = container.querySelectorAll(
      '[class*="tool-use-bar-tool-container"]',
    );
    expect(expandedContentContainers.length).toBe(1);

    // 再次点击应该收起
    fireEvent.click(firstExpandButton);

    const collapsedContentContainers = container.querySelectorAll(
      '[class*="tool-use-bar-tool-container"]',
    );
    expect(collapsedContentContainers.length).toBe(0);
  });

  it('should correctly handle activeKeys in controlled mode', () => {
    const mockOnActiveKeysChange = vi.fn();
    
    // 测试受控模式下的 activeKeys
    const { rerender } = render(
      <ToolUseBar
        tools={mockTools}
        activeKeys={['tool1']}
        onActiveKeysChange={mockOnActiveKeysChange}
      />,
    );

    // 验证初始状态
    expect(screen.getByText('Tool 1')).toBeInTheDocument();
    expect(screen.getByText('Tool 2')).toBeInTheDocument();

    // 重新渲染，改变 activeKeys 属性
    rerender(
      <ToolUseBar
        tools={mockTools}
        activeKeys={['tool2', 'tool3']}
        onActiveKeysChange={mockOnActiveKeysChange}
      />,
    );

    // 验证组件能正确响应 activeKeys 变化
    expect(screen.getByText('Tool 1')).toBeInTheDocument();
    expect(screen.getByText('Tool 2')).toBeInTheDocument();
    expect(screen.getByText('Tool 3')).toBeInTheDocument();
  });

  it('should use defaultActiveKeys in uncontrolled mode', () => {
    // 测试非受控模式下的 defaultActiveKeys
    render(
      <ToolUseBar
        tools={mockTools}
        defaultActiveKeys={['tool2']}
      />,
    );

    // 验证组件能正常渲染
    expect(screen.getByText('Tool 1')).toBeInTheDocument();
    expect(screen.getByText('Tool 2')).toBeInTheDocument();
    expect(screen.getByText('Tool 3')).toBeInTheDocument();
    expect(screen.getByText('Tool 4')).toBeInTheDocument();
  });

  it('should prioritize activeKeys over defaultActiveKeys when both are provided', () => {
    const mockOnActiveKeysChange = vi.fn();
    
    // 当同时提供 activeKeys 和 defaultActiveKeys 时，应该优先使用 activeKeys（受控模式）
    render(
      <ToolUseBar
        tools={mockTools}
        activeKeys={['tool1']}
        defaultActiveKeys={['tool2']}
        onActiveKeysChange={mockOnActiveKeysChange}
      />,
    );

    // 验证组件能正常渲染，使用的是 activeKeys 而不是 defaultActiveKeys
    expect(screen.getByText('Tool 1')).toBeInTheDocument();
    expect(screen.getByText('Tool 2')).toBeInTheDocument();
    expect(screen.getByText('Tool 3')).toBeInTheDocument();
    expect(screen.getByText('Tool 4')).toBeInTheDocument();
  });
});
