import {
  PauseCircleFilled,
  PlusOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { I18nContext } from '../i18n';
import Robot from './Robot';
import { useStyle } from './style';

/**
 * 任务状态枚举
 * @enum {string}
 */
export enum TASK_STATUS {
  /** 任务正在运行中 */
  RUNNING = 'running',
  /** 任务已成功完成 */
  SUCCESS = 'success',
  /** 任务执行出错 */
  ERROR = 'error',
  /** 任务已暂停 */
  PAUSE = 'pause',
  /** 任务已取消 */
  CANCELLED = 'cancelled',
}

/**
 * 任务运行状态枚举
 * @enum {string}
 */
export enum TASK_RUNNING_STATUS {
  /** 正在运行中 */
  RUNNING = 'running',
  /** 已完成 */
  COMPLETE = 'complete',
  /** 已暂停 */
  PAUSE = 'pause',
}

/**
 * TaskRunning组件的属性接口
 * @interface TaskRunningProps
 */
interface TaskRunningProps {
  /** 任务运行时长（分钟） */
  minutes: string;
  /** 任务状态 */
  taskStatus: TASK_STATUS;
  /** 任务运行状态 */
  taskRunningStatus: TASK_RUNNING_STATUS;
  /** 创建新任务的回调函数 */
  onCreateNewTask: () => void;
  /** 暂停任务的回调函数 */
  onPause: () => void;
  /** 重新回放任务的回调函数 */
  onReplay: () => void;
  /** 查看任务结果的回调函数 */
  onViewResult: () => void;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  /** 自定义文案配置，可选 */
  messages?: {
    /** 运行中文案 */
    running?: string;
    /** 已耗时前缀文案 */
    timeUsedPrefix?: string;
    /** 调用中文案 */
    calling?: string;
    /** 任务完成文案 */
    taskCompleted?: string;
    /** 任务停止文案 */
    taskStopped?: string;
    /** 任务回放中文案 */
    taskReplaying?: string;
    /** 创建新任务按钮文案 */
    createNewTask?: string;
    /** 查看结果按钮文案 */
    viewResult?: string;
    /** 重新回放按钮文案 */
    replayTask?: string;
  };
}

/**
 * TaskRunning 组件 - 任务运行状态组件
 *
 * 该组件显示AI任务运行的状态信息，包括运行时间、状态指示、操作按钮等。
 * 支持多种任务状态：运行中、暂停、完成、重播等，提供完整的任务管理功能。
 *
 * @component
 * @description 任务运行状态组件，显示AI任务运行信息和操作按钮
 * @param {TaskRunningProps} props - 组件属性
 * @param {string} props.minutes - 任务运行时间（分钟）
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {TASK_RUNNING_STATUS} [props.taskRunningStatus] - 任务运行状态
 * @param {TASK_STATUS} [props.taskStatus] - 任务状态
 * @param {() => void} [props.onPause] - 暂停任务回调
 * @param {() => void} [props.onCreateNewTask] - 创建新任务回调
 * @param {() => void} [props.onViewResult] - 查看结果回调
 * @param {() => void} [props.onReplay] - 重播任务回调
 * @param {TaskRunningMessages} [props.messages] - 自定义消息文案
 * @param {React.ReactNode} [props.icon] - 自定义图标
 *
 * @example
 * ```tsx
 * <TaskRunning
 *   minutes="5"
 *   taskStatus={TASK_STATUS.RUNNING}
 *   taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
 *   onCreateNewTask={() => {}}
 *   onPause={() => {}}
 *   onReplay={() => {}}
 *   onViewResult={() => {}}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的任务运行状态组件
 *
 * @remarks
 * - 支持多种任务状态显示
 * - 提供任务操作按钮（暂停、重播、查看结果等）
 * - 显示任务运行时间
 * - 支持自定义消息文案
 * - 支持自定义图标
 * - 提供机器人状态动画
 */
export const TaskRunning: React.FC<TaskRunningProps> = ({
  minutes,
  ...rest
}) => {
  const {
    className,
    taskRunningStatus,
    taskStatus,
    onPause,
    onCreateNewTask,
    onViewResult,
    onReplay,
    messages,
  } = rest;

  const context = useContext(ConfigProvider.ConfigContext);
  const { locale } = useContext(I18nContext);
  const baseCls = context?.getPrefixCls('task-running');
  const { wrapSSR, hashId } = useStyle(baseCls);

  // 合并默认文案和自定义文案
  const finalMessages = {
    running: messages?.running || locale?.agentRunBar.running,
    timeUsedPrefix:
      messages?.timeUsedPrefix || locale?.agentRunBar.timeUsedPrefix,
    calling: messages?.calling || locale?.agentRunBar.calling,
    taskCompleted: messages?.taskCompleted || locale?.agentRunBar.taskCompleted,
    taskStopped: messages?.taskStopped || locale?.agentRunBar.taskStopped,
    taskReplaying: messages?.taskReplaying || locale?.agentRunBar.taskReplaying,
    createNewTask: messages?.createNewTask || locale?.agentRunBar.createNewTask,
    viewResult: messages?.viewResult || locale?.agentRunBar.viewResult,
    replayTask: messages?.replayTask || locale?.agentRunBar.replayTask,
  };

  return wrapSSR(
    <div className={classNames(baseCls, hashId, className)} style={rest.style}>
      <div className={`${baseCls}-left ${hashId}`}>
        <div className={`${baseCls}-left-icon-wrapper ${hashId}`}>
          <Robot
            icon={rest.icon}
            status={
              taskRunningStatus === TASK_RUNNING_STATUS.COMPLETE
                ? 'dazing'
                : taskRunningStatus === TASK_RUNNING_STATUS.PAUSE
                  ? 'default'
                  : 'thinking'
            }
            size={34}
          />
        </div>
        {/* 文字区 */}
        {taskStatus === TASK_STATUS.RUNNING ? (
          taskRunningStatus === TASK_RUNNING_STATUS.RUNNING ? (
            <div>
              <div>
                <span>{finalMessages.running}，</span>
                <span>
                  {finalMessages.timeUsedPrefix} {minutes}
                </span>
              </div>
              <div className={`${baseCls}-left-text ${hashId}`}>
                {finalMessages.calling}
              </div>
            </div>
          ) : taskRunningStatus === TASK_RUNNING_STATUS.COMPLETE ? (
            <div>
              <span>{finalMessages.taskCompleted}</span>
            </div>
          ) : (
            <div>
              <span>{finalMessages.taskStopped}</span>
            </div>
          )
        ) : taskStatus === TASK_STATUS.SUCCESS ? (
          taskRunningStatus === TASK_RUNNING_STATUS.RUNNING ? (
            <div>
              <span>{finalMessages.taskReplaying}</span>
            </div>
          ) : (
            <div>
              <span>{finalMessages.taskCompleted}</span>
            </div>
          )
        ) : (
          <div>
            <span>{finalMessages.taskStopped}</span>
          </div>
        )}
      </div>
      {/* 按钮区 */}
      {taskStatus === TASK_STATUS.RUNNING ? (
        taskRunningStatus === TASK_RUNNING_STATUS.RUNNING ? (
          <div className={`${baseCls}-pause ${hashId}`} onClick={onPause}>
            <PauseCircleFilled />
          </div>
        ) : (
          <Button
            type="primary"
            onClick={onCreateNewTask}
            icon={<PlusOutlined />}
          >
            {finalMessages.createNewTask}
          </Button>
        )
      ) : taskStatus === TASK_STATUS.SUCCESS ? (
        taskRunningStatus === TASK_RUNNING_STATUS.RUNNING ? (
          <Button type="primary" onClick={onViewResult}>
            {finalMessages.viewResult}
          </Button>
        ) : (
          <Button type="primary" onClick={onReplay} icon={<UndoOutlined />}>
            {finalMessages.replayTask}
          </Button>
        )
      ) : (
        <Button
          type="primary"
          onClick={onCreateNewTask}
          icon={<PlusOutlined />}
        >
          {finalMessages.createNewTask}
        </Button>
      )}
    </div>,
  );
};
