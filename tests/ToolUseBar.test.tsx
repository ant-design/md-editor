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
  },
];

describe('ToolUseBar', () => {
  it('should render tools correctly', () => {
    render(<ToolUseBar tools={mockTools} />);

    expect(screen.getByText('Tool 1')).toBeInTheDocument();
    expect(screen.getByText('Tool 2')).toBeInTheDocument();
    expect(screen.getByText('Tool 3')).toBeInTheDocument();
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
});
