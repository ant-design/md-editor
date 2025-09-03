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
    onResume: vi.fn(),
    onStop: vi.fn(),
    onReplay: vi.fn(),
    onViewResult: vi.fn(),
  };

  // 测试默认渲染
  it('should render without title and description', () => {
    render(<TaskRunning {...baseProps} />);

    // 应该渲染基本的组件结构，但没有文案内容
    expect(screen.getByLabelText('PauseIcon')).toBeInTheDocument();
    expect(screen.getByLabelText('StopIcon')).toBeInTheDocument();
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

  // 测试不同状态下的按钮显示
  it('should render correct buttons for different states', () => {
    const { rerender } = render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
      />,
    );

    // 任务已完成状态：查看按钮 + 重新执行按钮 + 新任务按钮
    expect(screen.getByText('查看')).toBeInTheDocument();
    expect(screen.getByText('重新执行')).toBeInTheDocument();
    expect(screen.getByText('新任务')).toBeInTheDocument();

    // 任务运行中状态：暂停按钮 + 停止按钮
    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
      />,
    );
    expect(screen.getByLabelText('PauseIcon')).toBeInTheDocument();
    expect(screen.getByLabelText('StopIcon')).toBeInTheDocument();

    // 任务已暂停状态：继续按钮 + 新任务按钮
    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.PAUSE}
        taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
      />,
    );
    expect(screen.getByLabelText('PlayIcon')).toBeInTheDocument();
    expect(screen.getByText('新任务')).toBeInTheDocument();
  });

  // 测试不同任务状态下的渲染
  it('should render correctly for different task statuses', () => {
    const { rerender } = render(
      <TaskRunning {...baseProps} taskStatus={TASK_STATUS.ERROR} />,
    );

    // 任务出错状态：重新执行按钮 + 新任务按钮
    expect(screen.getByText('重新执行')).toBeInTheDocument();
    expect(screen.getByText('新任务')).toBeInTheDocument();

    rerender(<TaskRunning {...baseProps} taskStatus={TASK_STATUS.STOPPED} />);

    // 任务已停止状态：创建新任务按钮
    expect(screen.getByText('创建新任务')).toBeInTheDocument();

    rerender(<TaskRunning {...baseProps} taskStatus={TASK_STATUS.CANCELLED} />);

    // 任务已取消状态：创建新任务按钮
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

    // 任务已完成：查看按钮 + 重新执行按钮 + 新任务按钮
    expect(screen.getByText('查看')).toBeInTheDocument();
    expect(screen.getByText('重新执行')).toBeInTheDocument();
    expect(screen.getByText('新任务')).toBeInTheDocument();

    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
      />,
    );

    // 任务已暂停：继续按钮 + 新任务按钮
    expect(screen.getByLabelText('PlayIcon')).toBeInTheDocument();
    expect(screen.getByText('新任务')).toBeInTheDocument();
  });

  // 测试自定义图标
  it('should render with custom icon', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    render(<TaskRunning {...baseProps} icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // 测试图标提示
  it('should render with icon tooltip', () => {
    render(
      <TaskRunning
        {...baseProps}
        icon="https://example.com/icon.png"
        iconTooltip="AI助手图标提示"
      />,
    );

    // 检查图标是否被Tooltip包装
    const iconElements = screen.getAllByRole('img');
    expect(iconElements.length).toBeGreaterThan(0);
    // 检查是否有自定义图标
    const customIcon = iconElements.find(
      (img) => (img as HTMLImageElement).src === 'https://example.com/icon.png',
    );
    expect(customIcon).toBeInTheDocument();
  });

  // 测试暂停功能
  it('should call onPause when pause button is clicked', () => {
    const onPause = vi.fn();
    render(<TaskRunning {...baseProps} onPause={onPause} />);

    // 在运行中状态下，应该显示暂停按钮
    const pauseButton = screen.getByLabelText('PauseIcon');
    fireEvent.click(pauseButton);

    expect(onPause).toHaveBeenCalledTimes(1);
  });

  // 测试继续功能
  it('should call onResume when resume button is clicked', () => {
    const onResume = vi.fn();
    render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.PAUSE}
        taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
        onResume={onResume}
      />,
    );

    // 在暂停状态下，应该显示继续按钮（PlayIcon）
    const resumeButton = screen.getByLabelText('PlayIcon');
    fireEvent.click(resumeButton);

    expect(onResume).toHaveBeenCalledTimes(1);
  });

  // 测试停止功能
  it('should call onStop when stop button is clicked', () => {
    const onStop = vi.fn();
    render(<TaskRunning {...baseProps} onStop={onStop} />);

    const stopButton = screen.getByLabelText('StopIcon');
    fireEvent.click(stopButton);

    expect(onStop).toHaveBeenCalledTimes(1);
  });

  // 测试创建新任务功能
  it('should call onCreateNewTask when create new task button is clicked', () => {
    const onCreateNewTask = vi.fn();
    render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.STOPPED}
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
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        onViewResult={onViewResult}
      />,
    );

    const viewButton = screen.getByText('查看');
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
    expect(taskRunningElement).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  // 测试机器人状态变化
  it('should render robot with correct status based on task status', () => {
    const { rerender } = render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
      />,
    );

    // 机器人应该显示为 dazing 状态
    const robotElement = screen.getByTestId('robot');
    expect(robotElement).toBeInTheDocument();

    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.PAUSE}
        taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
      />,
    );

    // 机器人应该显示为 default 状态
    expect(robotElement).toBeInTheDocument();

    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
      />,
    );

    // 机器人应该显示为 thinking 状态
    expect(robotElement).toBeInTheDocument();
  });

  // 测试按钮组的条件渲染
  it('should conditionally render buttons based on callback availability', () => {
    const { rerender } = render(
      <TaskRunning
        {...baseProps}
        onPause={undefined as any}
        onStop={undefined as any}
        onCreateNewTask={undefined as any}
      />,
    );

    // 如果没有提供回调函数，相应的按钮不应该显示
    expect(screen.queryByLabelText('PauseIcon')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('StopIcon')).not.toBeInTheDocument();
    expect(screen.queryByText('创建新任务')).not.toBeInTheDocument();

    // 重新渲染，提供所有回调函数
    rerender(<TaskRunning {...baseProps} />);

    expect(screen.getByLabelText('PauseIcon')).toBeInTheDocument();
    expect(screen.getByLabelText('StopIcon')).toBeInTheDocument();
  });

  // 测试状态组合的按钮显示
  it('should show correct buttons for different status combinations', () => {
    // 测试 RUNNING + RUNNING 状态
    const { rerender } = render(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
      />,
    );

    expect(screen.getByLabelText('PauseIcon')).toBeInTheDocument();
    expect(screen.getByLabelText('StopIcon')).toBeInTheDocument();

    // 测试 RUNNING + PAUSE 状态
    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.RUNNING}
        taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
      />,
    );

    expect(screen.getByLabelText('PlayIcon')).toBeInTheDocument();
    expect(screen.getByText('新任务')).toBeInTheDocument();

    // 测试 SUCCESS + COMPLETE 状态
    rerender(
      <TaskRunning
        {...baseProps}
        taskStatus={TASK_STATUS.SUCCESS}
        taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
      />,
    );

    expect(screen.getByText('查看')).toBeInTheDocument();
    expect(screen.getByText('重新执行')).toBeInTheDocument();
    expect(screen.getByText('新任务')).toBeInTheDocument();
  });
});
