import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { I18nContext, cnLabels, enLabels } from '../../i18n';
import { TASK_RUNNING_STATUS, TASK_STATUS, TaskRunning } from '../index';

describe('TaskRunning Component', () => {
  // 基础 props
  const baseProps = {
    minutes: '5',
    taskStatus: TASK_STATUS.RUNNING,
    taskRunningStatus: TASK_RUNNING_STATUS.RUNNING,
    onCreateNewTask: vi.fn(),
    onPause: vi.fn(),
    onReplay: vi.fn(),
    onViewResult: vi.fn(),
  };

  // 测试默认中文文案
  it('should render with default Chinese messages', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(new RegExp(cnLabels.agentRunBar.running)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(cnLabels.agentRunBar.timeUsedPrefix)),
    ).toBeInTheDocument();
    expect(screen.getByText(cnLabels.agentRunBar.calling)).toBeInTheDocument();
  });

  // 测试默认英文文案
  it('should render with default English messages', () => {
    render(
      <I18nContext.Provider value={{ locale: enLabels }}>
        <TaskRunning {...baseProps} />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(new RegExp(enLabels.agentRunBar.running)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(enLabels.agentRunBar.timeUsedPrefix)),
    ).toBeInTheDocument();
    expect(screen.getByText(enLabels.agentRunBar.calling)).toBeInTheDocument();
  });

  // 测试自定义文案
  it('should render with custom messages', () => {
    const customMessages = {
      running: 'Custom Running Status',
      timeUsedPrefix: 'Time Elapsed:',
      calling: 'Custom Calling Status',
    };

    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} messages={customMessages} />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(new RegExp(customMessages.running)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(customMessages.timeUsedPrefix)),
    ).toBeInTheDocument();
    expect(screen.getByText(customMessages.calling)).toBeInTheDocument();
  });

  // 测试部分自定义文案（混合使用自定义和默认文案）
  it('should render with mixed custom and default messages', () => {
    const partialCustomMessages = {
      running: 'Custom Running Status',
      // timeUsedPrefix 使用默认值
      calling: 'Custom Calling Status',
    };

    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} messages={partialCustomMessages} />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(new RegExp(partialCustomMessages.running)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(cnLabels.agentRunBar.timeUsedPrefix)),
    ).toBeInTheDocument();
    expect(screen.getByText(partialCustomMessages.calling)).toBeInTheDocument();
  });

  // 测试不同状态下的按钮文案
  it('should render correct button text for different states', () => {
    const { rerender } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );

    // 测试重新回放按钮
    expect(
      screen.getByText(cnLabels.agentRunBar.replayTask),
    ).toBeInTheDocument();

    // 测试创建新任务按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );
    expect(
      screen.getByText(cnLabels.agentRunBar.createNewTask),
    ).toBeInTheDocument();

    // 测试查看结果按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
        />
      </I18nContext.Provider>,
    );
    expect(
      screen.getByText(cnLabels.agentRunBar.viewResult),
    ).toBeInTheDocument();
  });

  // 测试按钮点击事件
  it('should handle button clicks correctly', () => {
    const props = {
      ...baseProps,
      onCreateNewTask: vi.fn(),
      onPause: vi.fn(),
      onReplay: vi.fn(),
      onViewResult: vi.fn(),
    };

    const { rerender } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...props} />
      </I18nContext.Provider>,
    );

    // 测试暂停按钮
    const pauseButton = screen.getByRole('img', { name: /pause/i });
    fireEvent.click(pauseButton);
    expect(props.onPause).toHaveBeenCalledTimes(1);

    // 测试创建新任务按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...props}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );
    const createNewTaskButton = screen.getByText(
      cnLabels.agentRunBar.createNewTask,
    );
    fireEvent.click(createNewTaskButton);
    expect(props.onCreateNewTask).toHaveBeenCalledTimes(1);

    // 测试重新回放按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...props}
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );
    const replayButton = screen.getByText(cnLabels.agentRunBar.replayTask);
    fireEvent.click(replayButton);
    expect(props.onReplay).toHaveBeenCalledTimes(1);

    // 测试查看结果按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...props}
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
        />
      </I18nContext.Provider>,
    );
    const viewResultButton = screen.getByText(cnLabels.agentRunBar.viewResult);
    fireEvent.click(viewResultButton);
    expect(props.onViewResult).toHaveBeenCalledTimes(1);
  });

  // 测试自定义消息文案
  it('should render with custom messages correctly', () => {
    const customMessages = {
      running: '自定义运行中',
      timeUsedPrefix: '自定义耗时',
      calling: '自定义调用中',
      taskCompleted: '自定义完成',
      taskStopped: '自定义停止',
      taskReplaying: '自定义回放中',
      createNewTask: '自定义创建新任务',
      viewResult: '自定义查看结果',
      replayTask: '自定义重新回放',
    };

    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} messages={customMessages} />
      </I18nContext.Provider>,
    );

    // 使用正则表达式来匹配包含逗号的文本
    expect(
      screen.getByText(new RegExp(customMessages.running)),
    ).toBeInTheDocument();
    expect(screen.getByText(customMessages.calling)).toBeInTheDocument();
  });

  // 测试不同任务状态的展示
  it('should render different task status correctly', () => {
    const { rerender } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} taskStatus={TASK_STATUS.ERROR} />
      </I18nContext.Provider>,
    );

    // 测试错误状态
    expect(
      screen.getByText(cnLabels.agentRunBar.taskStopped),
    ).toBeInTheDocument();

    // 测试取消状态
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} taskStatus={TASK_STATUS.CANCELLED} />
      </I18nContext.Provider>,
    );
    expect(
      screen.getByText(cnLabels.agentRunBar.taskStopped),
    ).toBeInTheDocument();

    // 测试暂停状态
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} taskStatus={TASK_STATUS.PAUSE} />
      </I18nContext.Provider>,
    );
    expect(
      screen.getByText(cnLabels.agentRunBar.taskStopped),
    ).toBeInTheDocument();

    // 测试成功状态 - 应该使用 taskRunningStatus: COMPLETE 来显示完成状态
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );
    expect(
      screen.getByText(cnLabels.agentRunBar.taskCompleted),
    ).toBeInTheDocument();
  });

  // 测试自定义样式和类名
  it('should apply custom className and style', () => {
    const customStyle = { backgroundColor: 'red' };
    const customClassName = 'custom-task-running';

    const { container } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          className={customClassName}
          style={customStyle}
        />
      </I18nContext.Provider>,
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass(customClassName);
    expect(element.style.backgroundColor).toBe('red');
  });

  // 测试自定义图标
  it('should render custom icon', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;

    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} icon={customIcon} />
      </I18nContext.Provider>,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom Icon')).toBeInTheDocument();
  });

  // 测试所有任务运行状态组合
  it('should handle all task running status combinations', () => {
    const { rerender } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
        />
      </I18nContext.Provider>,
    );

    // 运行状态 + 暂停
    expect(
      screen.getByText(cnLabels.agentRunBar.taskStopped),
    ).toBeInTheDocument();

    // 完成状态的不同组合
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.ERROR}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(cnLabels.agentRunBar.taskStopped),
    ).toBeInTheDocument();
  });

  // 测试按钮状态和可见性
  it('should show correct buttons based on task status and running status', () => {
    const { rerender } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
        />
      </I18nContext.Provider>,
    );

    // 运行中状态应显示暂停按钮
    expect(screen.getByRole('img', { name: /pause/i })).toBeInTheDocument();

    // 完成状态应显示创建新任务按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );
    expect(
      screen.getByText(cnLabels.agentRunBar.createNewTask),
    ).toBeInTheDocument();

    // 成功完成状态应显示重新回放按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );
    expect(
      screen.getByText(cnLabels.agentRunBar.replayTask),
    ).toBeInTheDocument();
  });

  // 测试长时间运行显示
  it('should display correct time format for different durations', () => {
    const { rerender } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} minutes="0" />
      </I18nContext.Provider>,
    );

    expect(screen.getByText(/0/)).toBeInTheDocument();

    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} minutes="120" />
      </I18nContext.Provider>,
    );

    expect(screen.getByText(/120/)).toBeInTheDocument();
  });

  // 测试回放状态
  it('should render replaying status correctly', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
        />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(cnLabels.agentRunBar.taskReplaying),
    ).toBeInTheDocument();
    expect(
      screen.getByText(cnLabels.agentRunBar.viewResult),
    ).toBeInTheDocument();
  });

  // 测试错误状态下的按钮
  it('should show create new task button for error status', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.ERROR}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(cnLabels.agentRunBar.createNewTask),
    ).toBeInTheDocument();
    expect(
      screen.getByText(cnLabels.agentRunBar.taskStopped),
    ).toBeInTheDocument();
  });

  // 测试取消状态
  it('should handle cancelled task status', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.CANCELLED}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(cnLabels.agentRunBar.taskStopped),
    ).toBeInTheDocument();
    expect(
      screen.getByText(cnLabels.agentRunBar.createNewTask),
    ).toBeInTheDocument();
  });

  // 测试暂停状态
  it('should handle paused task status', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.PAUSE}
          taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
        />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(cnLabels.agentRunBar.taskStopped),
    ).toBeInTheDocument();
    expect(
      screen.getByText(cnLabels.agentRunBar.createNewTask),
    ).toBeInTheDocument();
  });

  // 测试Robot组件的状态传递
  it('should pass correct status to Robot component', () => {
    const { rerender } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
        />
      </I18nContext.Provider>,
    );

    // Running状态时Robot应该显示thinking状态
    let robotImg = screen.getByAltText('robot');
    expect(robotImg).toBeInTheDocument();

    // Complete状态时Robot应该显示dazing状态
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );

    robotImg = screen.getByAltText('robot');
    expect(robotImg).toBeInTheDocument();

    // Pause状态时Robot应该显示default状态
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
        />
      </I18nContext.Provider>,
    );

    robotImg = screen.getByAltText('robot');
    expect(robotImg).toBeInTheDocument();
  });

  // 测试多种props组合
  it('should handle complex prop combinations', () => {
    const customMessages = {
      running: 'Custom Running',
      timeUsedPrefix: 'Custom Time:',
      calling: 'Custom Calling',
    };

    const customStyle = { border: '1px solid blue' };
    const customClass = 'test-class';
    const customIcon = <div data-testid="test-icon">Test Icon</div>;

    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          messages={customMessages}
          style={customStyle}
          className={customClass}
          icon={customIcon}
          minutes="30"
        />
      </I18nContext.Provider>,
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText(/Custom Running/)).toBeInTheDocument();
    expect(screen.getByText(/Custom Time:/)).toBeInTheDocument();
    expect(screen.getByText('Custom Calling')).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
  });

  // 测试无I18n上下文的情况
  it('should handle missing i18n context gracefully', () => {
    // 虽然在实际使用中不会发生，但测试组件的健壮性
    const { container } = render(<TaskRunning {...baseProps} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  // 测试按钮点击事件的详细测试
  it('should handle all button click events correctly', () => {
    const mockFunctions = {
      onCreateNewTask: vi.fn(),
      onPause: vi.fn(),
      onReplay: vi.fn(),
      onViewResult: vi.fn(),
    };

    const { rerender } = render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          {...mockFunctions}
          taskStatus={TASK_STATUS.RUNNING}
          taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
        />
      </I18nContext.Provider>,
    );

    // 测试暂停按钮
    const pauseButton = screen.getByRole('img', { name: /pause/i });
    fireEvent.click(pauseButton);
    expect(mockFunctions.onPause).toHaveBeenCalledTimes(1);

    // 重置mock
    Object.values(mockFunctions).forEach((mock) => mock.mockClear());

    // 测试成功+运行状态下的查看结果按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          {...mockFunctions}
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
        />
      </I18nContext.Provider>,
    );

    const viewResultButton = screen.getByText(cnLabels.agentRunBar.viewResult);
    fireEvent.click(viewResultButton);
    expect(mockFunctions.onViewResult).toHaveBeenCalledTimes(1);

    // 重置mock
    Object.values(mockFunctions).forEach((mock) => mock.mockClear());

    // 测试错误状态下的创建新任务按钮
    rerender(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning
          {...baseProps}
          {...mockFunctions}
          taskStatus={TASK_STATUS.ERROR}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
        />
      </I18nContext.Provider>,
    );

    const createNewTaskButton = screen.getByText(
      cnLabels.agentRunBar.createNewTask,
    );
    fireEvent.click(createNewTaskButton);
    expect(mockFunctions.onCreateNewTask).toHaveBeenCalledTimes(1);
  });

  // 测试部分自定义消息覆盖
  it('should handle partial custom messages override', () => {
    const partialMessages = {
      running: 'Partial Custom Running',
      // 其他使用默认值
    };

    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} messages={partialMessages} />
      </I18nContext.Provider>,
    );

    expect(screen.getByText(/Partial Custom Running/)).toBeInTheDocument();
    expect(screen.getByText(cnLabels.agentRunBar.calling)).toBeInTheDocument();
  });

  // 测试空字符串minutes
  it('should handle empty minutes string', () => {
    render(
      <I18nContext.Provider value={{ locale: cnLabels }}>
        <TaskRunning {...baseProps} minutes="" />
      </I18nContext.Provider>,
    );

    expect(
      screen.getByText(new RegExp(cnLabels.agentRunBar.timeUsedPrefix)),
    ).toBeInTheDocument();
  });
});
