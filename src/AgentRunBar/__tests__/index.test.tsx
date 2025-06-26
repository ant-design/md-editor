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
});
