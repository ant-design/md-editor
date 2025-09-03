import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TASK_RUNNING_STATUS, TASK_STATUS, TaskRunning } from '../index';

describe('TaskRunning Component', () => {
  // 基础 props
  const baseProps = {
    taskStatus: TASK_STATUS.RUNNING,
    taskRunningStatus: TASK_RUNNING_STATUS.RUNNING,
    onCreateNewTask: vi.fn(),
    onPause: vi.fn(),
    onReplay: vi.fn(),
    onViewResult: vi.fn(),
  };

  // 测试默认渲染
  it('should render without title and description', () => {
    render(<TaskRunning {...baseProps} />);

    // 应该渲染基本的组件结构，但没有文案内容
    expect(screen.getByRole('button', { name: /暂停/i })).toBeInTheDocument();
  });

  // 测试自定义标题和描述
  it('should render with custom title and description', () => {
    render(
      <TaskRunning
        {...baseProps}
        title="正在运行中"
        description="任务执行中..."
      />,
    );

    expect(screen.getByText('正在运行中')).toBeInTheDocument();
    expect(screen.getByText('任务执行中...')).toBeInTheDocument();
  });

  // 测试只有标题的情况
  it('should render with title only', () => {
    render(<TaskRunning {...baseProps} title="正在运行中" />);

    expect(screen.getByText('正在运行中')).toBeInTheDocument();
    expect(screen.queryByText('任务执行中...')).not.toBeInTheDocument();
  });

  // 测试只有描述的情况
  it('should render with description only', () => {
    render(<TaskRunning {...baseProps} description="任务执行中..." />);

    expect(screen.queryByText('正在运行中')).not.toBeInTheDocument();
    expect(screen.getByText('任务执行中...')).toBeInTheDocument();
  });

  // 测试不同状态下的按钮文案
  it('should render correct button text for different states', () => {
    const { rerender } = render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
      />,
    );

    // 测试重新回放按钮
    expect(screen.getByText('重新执行')).toBeInTheDocument();

    // 测试创建新任务按钮
    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
      />,
    );
    expect(screen.getByText('创建新任务')).toBeInTheDocument();

    // 测试查看结果按钮
    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
      />,
    );
    expect(screen.getByText('查看结果')).toBeInTheDocument();
  });

  // 测试不同任务状态下的渲染
  it('should render correctly for different task statuses', () => {
    const { rerender } = render(
      <TaskRunning {...baseProps} taskStatus={TASK_STATUS.ERROR} />,
    );

    expect(screen.getByText('创建新任务')).toBeInTheDocument();

    rerender(<TaskRunning {...baseProps} taskStatus={TASK_STATUS.CANCELLED} />);

    expect(screen.getByText('创建新任务')).toBeInTheDocument();

    rerender(<TaskRunning {...baseProps} taskStatus={TASK_STATUS.PAUSE} />);

    expect(screen.getByText('创建新任务')).toBeInTheDocument();
  });

  // 测试不同运行状态下的渲染
  it('should render correctly for different running statuses', () => {
    const { rerender } = render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
      />,
    );

    expect(screen.getByText('重新执行')).toBeInTheDocument();

    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
      />,
    );

    expect(screen.getByText('查看结果')).toBeInTheDocument();

    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
      />,
    );

    expect(screen.getByText('创建新任务')).toBeInTheDocument();

    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
      />,
    );

    expect(screen.getByText('创建新任务')).toBeInTheDocument();
  });

  // 测试自定义图标
  it('should render with custom icon', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    render(<TaskRunning {...baseProps} icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // 测试暂停功能
  it('should call onPause when pause button is clicked', () => {
    const onPause = vi.fn();
    render(<TaskRunning {...baseProps} onPause={onPause} />);

    const pauseButton = screen.getByRole('button', { name: /暂停/i });
    fireEvent.click(pauseButton);

    expect(onPause).toHaveBeenCalledTimes(1);
  });

  // 测试创建新任务功能
  it('should call onCreateNewTask when create new task button is clicked', () => {
    const onCreateNewTask = vi.fn();
    render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        onCreateNewTask={onCreateNewTask}
      />,
    );

    const createButton = screen.getByText('创建新任务');
    fireEvent.click(createButton);

    expect(onCreateNewTask).toHaveBeenCalledTimes(1);
  });

  // 测试查看结果功能
  it('should call onViewResult when view result button is clicked', () => {
    const onViewResult = vi.fn();
    render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
        onViewResult={onViewResult}
      />,
    );

    const viewButton = screen.getByText('查看结果');
    fireEvent.click(viewButton);

    expect(onViewResult).toHaveBeenCalledTimes(1);
  });

  // 测试重新执行功能
  it('should call onReplay when replay button is clicked', () => {
    const onReplay = vi.fn();
    render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        onReplay={onReplay}
      />,
    );

    const replayButton = screen.getByText('重新执行');
    fireEvent.click(replayButton);

    expect(onReplay).toHaveBeenCalledTimes(1);
  });

  // 测试自定义样式
  it('should apply custom className and style', () => {
    const customClassName = 'custom-class';
    const customStyle = { backgroundColor: 'red' };

    const { container } = render(
      <TaskRunning
        {...baseProps}
        className={customClassName}
        style={customStyle}
      />,
    );

    const taskRunningElement = container.firstChild as HTMLElement;
    expect(taskRunningElement).toHaveClass(customClassName);
    expect(taskRunningElement).toHaveStyle(customStyle);
  });

  // 测试机器人状态变化
  it('should render robot with correct status based on running status', () => {
    const { rerender } = render(
      <TaskRunning
        {...baseProps}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
      />,
    );

    // 机器人应该显示为 dazing 状态
    const robotElement = screen.getByTestId('robot');
    expect(robotElement).toBeInTheDocument();

    rerender(
      <TaskRunning
        {...baseProps}
        taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
      />,
    );

    // 机器人应该显示为 default 状态
    expect(robotElement).toBeInTheDocument();

    rerender(
      <TaskRunning
        {...baseProps}
        taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
      />,
    );

    // 机器人应该显示为 thinking 状态
    expect(robotElement).toBeInTheDocument();
  });
});
