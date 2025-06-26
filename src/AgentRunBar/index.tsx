import {
  PauseCircleFilled,
  PlusOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext } from 'react';
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

  style?: React.CSSProperties;
  /** 其他属性 */
  [key: string]: any;
}

/**
 * 任务运行状态展示组件
 *
 * 该组件用于展示任务的运行状态，包括：
 * - 任务运行时长
 * - 当前状态（运行中/完成/暂停等）
 * - 操作按钮（暂停/创建新任务/重新回放等）
 *
 * @component
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
  } = rest;

  const context = useContext(ConfigProvider.ConfigContext);
  const baseCls = context.getPrefixCls('task-running');
  const { wrapSSR, hashId } = useStyle(baseCls);

  return wrapSSR(
    <div className={classNames(baseCls, hashId, className)} style={rest.style}>
      <div className={`${baseCls}-left ${hashId}`}>
        <div className={`${baseCls}-left-icon-wrapper ${hashId}`}>
          <Robot
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
                <span>正在运行中，</span>
                <span>已耗时 {minutes}</span>
              </div>
              <div className={`${baseCls}-left-text ${hashId}`}>正在调用</div>
            </div>
          ) : taskRunningStatus === TASK_RUNNING_STATUS.COMPLETE ? (
            <div>
              <span>任务已完成</span>
            </div>
          ) : (
            <div>
              <span>任务已停止</span>
            </div>
          )
        ) : taskStatus === TASK_STATUS.SUCCESS ? (
          taskRunningStatus === TASK_RUNNING_STATUS.RUNNING ? (
            <div>
              <span>正在回放任务中</span>
            </div>
          ) : (
            <div>
              <span>任务已完成</span>
            </div>
          )
        ) : (
          <div>
            <span>任务已停止</span>
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
            创建新任务
          </Button>
        )
      ) : taskStatus === TASK_STATUS.SUCCESS ? (
        taskRunningStatus === TASK_RUNNING_STATUS.RUNNING ? (
          <Button type="primary" onClick={onViewResult}>
            查看结果
          </Button>
        ) : (
          <Button type="primary" onClick={onReplay} icon={<UndoOutlined />}>
            重新回放
          </Button>
        )
      ) : (
        <Button
          type="primary"
          onClick={onCreateNewTask}
          icon={<PlusOutlined />}
        >
          创建新任务
        </Button>
      )}
    </div>,
  );
};
