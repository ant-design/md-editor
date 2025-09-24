import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ToolUseBar } from '../src/ToolUseBar';

const mockToolsWithContent = [
  {
    id: 'tool1',
    toolName: 'Tool 1',
    toolTarget: 'Target 1',
    time: '3',
    status: 'success' as const,
    content: <div>Tool 1 content</div>,
  },
  {
    id: 'tool2',
    toolName: 'Tool 2',
    toolTarget: 'Target 2',
    time: '3',
    status: 'error' as const,
    errorMessage: 'Tool 2 error',
  },
  {
    id: 'tool3',
    toolName: 'Tool 3',
    toolTarget: 'Target 3',
    time: '3',
    status: 'success' as const,
  },
];

describe('ToolUseBar - Expanded Keys', () => {
  it('should support controlled expanded state', () => {
    const mockOnExpandedKeysChange = vi.fn();
    const { container } = render(
      <ToolUseBar
        tools={mockToolsWithContent}
        expandedKeys={['tool1']}
        onExpandedKeysChange={mockOnExpandedKeysChange}
      />,
    );

    // tool1 应该是展开的
    const contentContainers = container.querySelectorAll(
      '[class*="ant-tool-use-bar-tool-container"]',
    );
    expect(contentContainers.length).toBe(1);
    expect(contentContainers[0]).toHaveTextContent('Tool 1 content');
  });

  it('should call onExpandedKeysChange when expand button is clicked', () => {
    const mockOnExpandedKeysChange = vi.fn();
    const { container } = render(
      <ToolUseBar
        tools={mockToolsWithContent}
        expandedKeys={[]}
        onExpandedKeysChange={mockOnExpandedKeysChange}
      />,
    );

    // 找到第一个展开按钮并点击
    const expandButtons = container.querySelectorAll(
      '[class*="tool-use-bar-tool-expand"]',
    );
    fireEvent.click(expandButtons[0]);

    expect(mockOnExpandedKeysChange).toHaveBeenCalledWith(['tool1'], []);
  });

  it('should collapse when clicking expanded item expand button', () => {
    const mockOnExpandedKeysChange = vi.fn();
    const { container } = render(
      <ToolUseBar
        tools={mockToolsWithContent}
        expandedKeys={['tool1']}
        onExpandedKeysChange={mockOnExpandedKeysChange}
      />,
    );

    // 找到第一个展开按钮并点击（此时应该是收起）
    const expandButtons = container.querySelectorAll(
      '[class*="tool-use-bar-tool-expand"]',
    );
    fireEvent.click(expandButtons[0]);

    expect(mockOnExpandedKeysChange).toHaveBeenCalledWith([], ['tool1']);
  });

  it('should support multiple expanded items', () => {
    const mockOnExpandedKeysChange = vi.fn();
    const { container } = render(
      <ToolUseBar
        tools={mockToolsWithContent}
        expandedKeys={['tool1', 'tool2']}
        onExpandedKeysChange={mockOnExpandedKeysChange}
      />,
    );

    // 应该有两个展开的内容容器
    const contentContainers = container.querySelectorAll(
      '[class*="ant-tool-use-bar-tool-container"]',
    );
    expect(contentContainers.length).toBe(2);
  });

  it('should support defaultExpandedKeys', () => {
    const { container } = render(
      <ToolUseBar
        tools={mockToolsWithContent}
        defaultExpandedKeys={['tool2']}
      />,
    );

    // tool2 应该是默认展开的
    const contentContainers = container.querySelectorAll(
      '[class*="ant-tool-use-bar-tool-container"]',
    );
    expect(contentContainers.length).toBe(1);
    expect(contentContainers[0]).toHaveTextContent('Tool 2 error');
  });

  it('should work in uncontrolled mode when onExpandedKeysChange is not provided', () => {
    const { container } = render(
      <ToolUseBar
        tools={mockToolsWithContent}
        defaultExpandedKeys={['tool1']}
      />,
    );

    // 初始状态应该展开 tool1
    let contentContainers = container.querySelectorAll(
      '[class*="ant-tool-use-bar-tool-container"]',
    );
    expect(contentContainers.length).toBe(1);

    // 点击展开按钮应该收起
    const expandButtons = container.querySelectorAll(
      '[class*="tool-use-bar-tool-expand"]',
    );
    fireEvent.click(expandButtons[0]);

    // 应该收起
    contentContainers = container.querySelectorAll(
      '[class*="ant-tool-use-bar-tool-container"]',
    );
    expect(contentContainers.length).toBe(0);
  });

  it('should only show expand button for tools with content or error', () => {
    const { container } = render(<ToolUseBar tools={mockToolsWithContent} />);

    // 只有 tool1 和 tool2 有内容或错误，所以应该有2个展开按钮
    const expandButtons = container.querySelectorAll(
      '[class*="tool-use-bar-tool-expand"]',
    );
    expect(expandButtons.length).toBe(2);
  });
});
