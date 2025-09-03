import { PlusOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
import PauseIcon from './icons/PauseIcon';
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
  /** 标题文案 */
  title?: string;
  /** 描述文案 */
  description?: string;
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
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {TASK_RUNNING_STATUS} [props.taskRunningStatus] - 任务运行状态
 * @param {TASK_STATUS} [props.taskStatus] - 任务状态
 * @param {() => void} [props.onPause] - 暂停任务回调
 * @param {() => void} [props.onCreateNewTask] - 创建新任务回调
 * @param {() => void} [props.onViewResult] - 查看结果回调
 * @param {() => void} [props.onReplay] - 重播任务回调
 * @param {string} [props.title] - 标题文案
 * @param {string} [props.description] - 描述文案
 * @param {React.ReactNode} [props.icon] - 自定义图标
 *
 * @example
 * ```tsx
 * <TaskRunning
 *   title="正在运行中"
 *   description="任务执行中..."
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
 * - 支持自定义标题和描述文案
 * - 支持自定义图标
 * - 提供机器人状态动画
 */
export const TaskRunning: React.FC<TaskRunningProps> = (rest) => {
  const {
    className,
    taskRunningStatus,
    taskStatus,
    onPause,
    onCreateNewTask,
    onViewResult,
    onReplay,
    title,
    description,
  } = rest;

  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context?.getPrefixCls('task-running');
  const { wrapSSR, hashId } = useStyle(baseCls);

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
            size={36}
          />
        </div>
        {/* 文字区 */}
        <div className={`${baseCls}-left-content ${hashId}`}>
          {title && (
            <div className={`${baseCls}-left-main-text ${hashId}`}>{title}</div>
          )}
          {description && (
            <div className={`${baseCls}-left-text ${hashId}`}>
              {description}
            </div>
          )}
        </div>
      </div>
      {/* 按钮区 */}
      {taskStatus === TASK_STATUS.RUNNING ? (
        taskRunningStatus === TASK_RUNNING_STATUS.RUNNING ? (
          <div className={`${baseCls}-pause ${hashId}`} onClick={onPause}>
            <PauseIcon />
          </div>
        ) : (
          <div className={`${baseCls}-button-wrapper ${hashId}`}>
            <Button
              color="default"
              variant="solid"
              onClick={onCreateNewTask}
              icon={<PlusOutlined />}
            >
              创建新任务
            </Button>
          </div>
        )
      ) : taskStatus === TASK_STATUS.SUCCESS ? (
        taskRunningStatus === TASK_RUNNING_STATUS.RUNNING ? (
          <div className={`${baseCls}-button-wrapper ${hashId}`}>
            <Button color="default" variant="solid" onClick={onViewResult}>
              查看结果
            </Button>
          </div>
        ) : (
          <div className={`${baseCls}-button-wrapper ${hashId}`}>
            <Button
              color="default"
              variant="solid"
              onClick={onReplay}
              icon={<UndoOutlined />}
            >
              重新执行
            </Button>
          </div>
        )
      ) : (
        <div className={`${baseCls}-button-wrapper ${hashId}`}>
          <Button
            color="default"
            variant="solid"
            onClick={onCreateNewTask}
            icon={<PlusOutlined />}
          >
            创建新任务
          </Button>
        </div>
      )}
    </div>,
  );
};
