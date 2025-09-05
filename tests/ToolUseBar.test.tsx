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
    expect(container.firstChild).toHaveClass('ant-tool-use-bar');
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

    // 测试受控模式下的 activeKeys - 验证激活状态的CSS类名
    const { container, rerender } = render(
      <ToolUseBar
        tools={mockTools}
        activeKeys={['tool1', 'tool3']}
        onActiveKeysChange={mockOnActiveKeysChange}
      />,
    );

    // 验证激活的工具项具有正确的CSS类名
    const toolItems = container.querySelectorAll(
      '[data-testid="ToolUserItem"]',
    );
    expect(toolItems[0]).toHaveClass('ant-tool-use-bar-tool-active'); // tool1 应该激活
    expect(toolItems[1]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool2 不应该激活
    expect(toolItems[2]).toHaveClass('ant-tool-use-bar-tool-active'); // tool3 应该激活
    expect(toolItems[3]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool4 不应该激活

    // 重新渲染，改变 activeKeys 属性
    rerender(
      <ToolUseBar
        tools={mockTools}
        activeKeys={['tool2']}
        onActiveKeysChange={mockOnActiveKeysChange}
      />,
    );

    // 验证激活状态更新后的CSS类名
    const updatedToolItems = container.querySelectorAll(
      '[data-testid="ToolUserItem"]',
    );
    expect(updatedToolItems[0]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool1 不再激活
    expect(updatedToolItems[1]).toHaveClass('ant-tool-use-bar-tool-active'); // tool2 现在激活
    expect(updatedToolItems[2]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool3 不再激活
    expect(updatedToolItems[3]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool4 不激活
  });

  it('should use defaultActiveKeys in uncontrolled mode', () => {
    // 测试非受控模式下的 defaultActiveKeys - 验证默认激活状态
    const { container } = render(
      <ToolUseBar tools={mockTools} defaultActiveKeys={['tool2', 'tool4']} />,
    );

    // 验证默认激活的工具项具有正确的CSS类名
    const toolItems = container.querySelectorAll(
      '[data-testid="ToolUserItem"]',
    );
    expect(toolItems[0]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool1 不激活
    expect(toolItems[1]).toHaveClass('ant-tool-use-bar-tool-active'); // tool2 默认激活
    expect(toolItems[2]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool3 不激活
    expect(toolItems[3]).toHaveClass('ant-tool-use-bar-tool-active'); // tool4 默认激活
  });

  it('should prioritize activeKeys over defaultActiveKeys when both are provided', () => {
    const mockOnActiveKeysChange = vi.fn();

    // 当同时提供 activeKeys 和 defaultActiveKeys 时，应该优先使用 activeKeys（受控模式）
    const { container } = render(
      <ToolUseBar
        tools={mockTools}
        activeKeys={['tool1']}
        defaultActiveKeys={['tool2', 'tool3']}
        onActiveKeysChange={mockOnActiveKeysChange}
      />,
    );

    // 验证使用的是 activeKeys 而不是 defaultActiveKeys
    const toolItems = container.querySelectorAll(
      '[data-testid="ToolUserItem"]',
    );
    expect(toolItems[0]).toHaveClass('ant-tool-use-bar-tool-active'); // tool1 激活（来自activeKeys）
    expect(toolItems[1]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool2 不激活（忽略defaultActiveKeys）
    expect(toolItems[2]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool3 不激活（忽略defaultActiveKeys）
    expect(toolItems[3]).not.toHaveClass('ant-tool-use-bar-tool-active'); // tool4 不激活
  });

  it('should handle activeKeys change when tool items are clicked', () => {
    const mockOnActiveKeysChange = vi.fn();

    // 在受控模式下，我们需要模拟父组件的状态更新行为
    let currentActiveKeys = ['tool1'];

    const TestComponent = () => {
      return (
        <ToolUseBar
          tools={mockTools}
          activeKeys={currentActiveKeys}
          onActiveKeysChange={(newKeys) => {
            mockOnActiveKeysChange(newKeys, currentActiveKeys);
            currentActiveKeys = newKeys; // 模拟父组件状态更新
          }}
        />
      );
    };

    const { container, rerender } = render(<TestComponent />);

    // 点击未激活的工具项
    const toolItems = container.querySelectorAll(
      '[data-testid="ToolUserItem"]',
    );
    fireEvent.click(toolItems[1]); // 点击 tool2

    // 验证回调函数被正确调用，添加新的激活项
    expect(mockOnActiveKeysChange).toHaveBeenCalledWith(
      ['tool1', 'tool2'],
      ['tool1'],
    );

    // 重新渲染以模拟父组件状态更新
    rerender(<TestComponent />);

    // 验证新的激活状态
    const updatedToolItems = container.querySelectorAll(
      '[data-testid="ToolUserItem"]',
    );
    expect(updatedToolItems[0]).toHaveClass('ant-tool-use-bar-tool-active'); // tool1 仍然激活
    expect(updatedToolItems[1]).toHaveClass('ant-tool-use-bar-tool-active'); // tool2 现在也激活

    // 清除之前的调用记录
    mockOnActiveKeysChange.mockClear();

    // 点击已激活的工具项
    fireEvent.click(updatedToolItems[0]); // 点击 tool1

    // 验证回调函数被正确调用，移除激活项
    expect(mockOnActiveKeysChange).toHaveBeenCalledWith(
      ['tool2'],
      ['tool1', 'tool2'],
    );
  });
});
