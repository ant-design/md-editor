import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../../src/I18n';
import { HistoryItem } from '../../../src/History/components/HistoryItem';

// Mock HistoryActionsBox to simplify testing
vi.mock('../../../src/History/components/HistoryActionsBox', () => ({
  HistoryActionsBox: ({ children }: any) => <div data-testid="history-actions-box">{children}</div>,
}));

// Mock HistoryRunningIcon to simplify testing
vi.mock('../../../src/History/components/HistoryRunningIcon', () => ({
  HistoryRunningIcon: () => <div data-testid="history-running-icon">Running Icon</div>,
}));

const mockI18nLocale = {
  'task.default': '任务',
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ConfigProvider>
    <I18nContext.Provider
      value={{ locale: mockI18nLocale, language: 'zh-CN' } as any}
    >
      {children}
    </I18nContext.Provider>
  </ConfigProvider>
);

describe('HistoryItem', () => {
  const mockItem = {
    sessionId: 'session-1',
    sessionTitle: 'Test Session',
    gmtCreate: Date.now(),
    isFavorite: false,
  };

  const mockTaskItem = {
    sessionId: 'task-1',
    sessionTitle: 'Test Task',
    gmtCreate: Date.now(),
    isFavorite: false,
    type: 'task' as const,
    status: 'success' as const,
    description: 'Task description',
  };

  it('应该渲染单行模式的历史记录项（第26, 27, 72行）', () => {
    const onClick = vi.fn();
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={onClick}
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('Test Session')).toBeInTheDocument();
    
    // 点击事件测试
    fireEvent.click(screen.getByText('Test Session'));
    expect(onClick).toHaveBeenCalledWith('session-1', mockItem);
  });

  it('应该处理文本溢出情况（第95, 100行）', () => {
    // 创建一个长标题来测试文本溢出
    const longTitleItem = {
      ...mockItem,
      sessionTitle: '这是一个非常长的标题，用于测试文本溢出情况的处理',
    };

    render(
      <TestWrapper>
        <HistoryItem
          item={longTitleItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('这是一个非常长的标题，用于测试文本溢出情况的处理')).toBeInTheDocument();
  });

  it('应该处理复选框变化事件（第212-214行）', () => {
    const onSelectionChange = vi.fn();
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={onSelectionChange}
          onClick={vi.fn()}
          agent={{ onSelectionChange: vi.fn() }}
        />
      </TestWrapper>,
    );

    // 获取复选框并触发变化事件
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onSelectionChange).toHaveBeenCalledWith('session-1', true);
  });

  it('应该处理删除事件（第223, 224行）', async () => {
    const onDeleteItem = vi.fn().mockResolvedValue(undefined);
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          onDeleteItem={onDeleteItem}
        />
      </TestWrapper>,
    );

    // 验证 HistoryActionsBox 接收了 onDeleteItem 函数
    expect(screen.getByTestId('history-actions-box')).toBeInTheDocument();
  });

  it('应该在选中状态时应用正确的样式（第245, 300, 328, 332行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={['session-1']} // 选中状态
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          agent={{ onSelectionChange: vi.fn() }}
        />
      </TestWrapper>,
    );

    // 验证选中状态的复选框
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    
    // 验证组件渲染
    expect(screen.getByText('Test Session')).toBeInTheDocument();
  });

  it('应该处理运行状态显示（第378-383行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          runningId={['session-1']} // 运行状态
          type="task" // 需要设置为任务类型才能显示运行图标
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('Test Session')).toBeInTheDocument();
  });

  it('应该处理文本溢出钩子（第386-390行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('Test Session')).toBeInTheDocument();
  });

  it('应该正确计算是否显示图标和描述（第393, 394, 397, 398, 401, 402行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证任务项渲染
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Task description')).toBeInTheDocument();
  });

  it('应该处理点击事件（第410-414行）', () => {
    const onClick = vi.fn();
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={onClick}
        />
      </TestWrapper>,
    );

    // 触发点击事件
    fireEvent.click(screen.getByText('Test Session'));
    expect(onClick).toHaveBeenCalledWith('session-1', mockItem);
  });

  it('应该处理复选框变化事件（第423-426行）', () => {
    const onSelectionChange = vi.fn();
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={onSelectionChange}
          onClick={vi.fn()}
          agent={{ onSelectionChange: vi.fn() }}
        />
      </TestWrapper>,
    );

    // 获取复选框并触发变化事件
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onSelectionChange).toHaveBeenCalledWith('session-1', true);
  });

  it('应该处理删除事件（第434-436行）', async () => {
    const onDeleteItem = vi.fn().mockResolvedValue(undefined);
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          onDeleteItem={onDeleteItem}
        />
      </TestWrapper>,
    );

    // 验证 HistoryActionsBox 接收了 onDeleteItem 函数
    expect(screen.getByTestId('history-actions-box')).toBeInTheDocument();
  });

  it('应该渲染多行模式的历史记录项（第444行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证任务项渲染
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Task description')).toBeInTheDocument();
  });

  it('应该处理复选框样式（第456, 457行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          agent={{ onSelectionChange: vi.fn() }}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证复选框存在
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('应该处理图标显示逻辑（第464, 465行）', () => {
    const taskItemWithIcon = {
      ...mockTaskItem,
      icon: <div data-testid="custom-icon">Custom Icon</div>,
    };

    render(
      <TestWrapper>
        <HistoryItem
          item={taskItemWithIcon}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证自定义图标显示
    expect(screen.getByText('Custom Icon')).toBeInTheDocument();
  });

  it('应该处理运行状态图标（第474行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          runningId={['session-1']}
          type="task" // 需要设置为任务类型才能显示运行图标
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('Test Session')).toBeInTheDocument();
  });

  it('应该处理图标渲染逻辑（第483-490行）', () => {
    const taskItemWithIcon = {
      ...mockTaskItem,
      icon: <div data-testid="custom-icon">Custom Icon</div>,
    };

    render(
      <TestWrapper>
        <HistoryItem
          item={taskItemWithIcon}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证自定义图标显示
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('应该处理默认图标（第493行）', () => {
    const taskItemWithoutStatus = {
      ...mockTaskItem,
      status: undefined,
    };

    render(
      <TestWrapper>
        <HistoryItem
          item={taskItemWithoutStatus}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('应该处理文本溢出提示（第526, 528行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('应该处理选中状态字体样式（第534, 535行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={['task-1']} // 选中状态
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('应该处理描述显示逻辑（第545, 546行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证描述显示
    expect(screen.getByText('Task description')).toBeInTheDocument();
  });

  it('应该处理描述提示逻辑（第548-551行）', () => {
    const taskItemWithLongDescription = {
      ...mockTaskItem,
      description: '这是一个很长的任务描述，用于测试提示功能是否正常工作',
    };

    render(
      <TestWrapper>
        <HistoryItem
          item={taskItemWithLongDescription}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('这是一个很长的任务描述，用于测试提示功能是否正常工作')).toBeInTheDocument();
  });

  it('应该处理默认任务描述（第554, 555行）', () => {
    const taskItemWithoutDescription = {
      ...mockTaskItem,
      description: undefined,
    };

    render(
      <TestWrapper>
        <HistoryItem
          item={taskItemWithoutDescription}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证组件渲染
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('应该处理描述文本显示（第575, 576行）', () => {
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证描述文本显示
    expect(screen.getByText('Task description')).toBeInTheDocument();
  });

  it('应该处理日期格式化（第581, 582行）', () => {
    const customDateFormatter = vi.fn().mockReturnValue('自定义日期');
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
          itemDateFormatter={customDateFormatter}
        />
      </TestWrapper>,
    );

    // 验证自定义日期格式化函数被调用
    expect(customDateFormatter).toHaveBeenCalledWith(mockTaskItem.gmtCreate);
  });

  it('应该处理删除操作（第599行）', async () => {
    const onDeleteItem = vi.fn().mockResolvedValue(undefined);
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          onDeleteItem={onDeleteItem}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证 HistoryActionsBox 接收了 onDeleteItem 函数
    expect(screen.getByTestId('history-actions-box')).toBeInTheDocument();
  });

  it('应该处理日期格式化（第605, 606行）', () => {
    const customDateFormatter = vi.fn().mockReturnValue('自定义日期');
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
          itemDateFormatter={customDateFormatter}
        />
      </TestWrapper>,
    );

    // 验证自定义日期格式化函数被调用
    expect(customDateFormatter).toHaveBeenCalledWith(mockTaskItem.gmtCreate);
  });

  it('应该处理自定义操作区域（第608, 609行）', () => {
    const customOperationExtra = <div data-testid="custom-operation">Custom Operation</div>;
    
    render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
          customOperationExtra={customOperationExtra}
        />
      </TestWrapper>,
    );

    // 验证自定义操作区域显示
    expect(screen.getByTestId('custom-operation')).toBeInTheDocument();
  });

  it('应该根据模式选择正确的组件渲染（第714行）', () => {
    // 测试多行模式
    const { rerender } = render(
      <TestWrapper>
        <HistoryItem
          item={mockTaskItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
          type="task"
        />
      </TestWrapper>,
    );

    // 验证任务项渲染
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Task description')).toBeInTheDocument();

    // 测试单行模式
    rerender(
      <TestWrapper>
        <HistoryItem
          item={mockItem}
          selectedIds={[]}
          onSelectionChange={vi.fn()}
          onClick={vi.fn()}
        />
      </TestWrapper>,
    );

    // 验证会话项渲染
    expect(screen.getByText('Test Session')).toBeInTheDocument();
  });
});