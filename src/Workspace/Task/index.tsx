import { Check, CircleDashed, OctagonX } from '@sofa-design/icons';
import { ConfigProvider } from 'antd';
import classNames from 'clsx';
import React, { type FC, useContext } from 'react';
import { LoadingEffect } from '../../Components/effects';
import { useTaskStyle } from './style';

type TaskStatus = 'success' | 'pending' | 'loading' | 'error';

export interface TaskItem {
  key: string;
  title?: React.ReactNode;
  content?: React.ReactNode | React.ReactNode[];
  status: TaskStatus;
}

export interface TaskItemInput {
  items: TaskItem[];
}

export interface TaskListProps {
  /** 任务列表数据 */
  data: TaskItemInput;
  /** 点击任务项时的回调 */
  onItemClick?: (item: TaskItem) => void;
}

const StatusIcon: FC<{
  status: TaskStatus;
}> = ({ status }) => {
  switch (status) {
    case 'success':
      return (
        <Check style={{ color: 'var(--color-green-control-fill-primary)' }} />
      );
    case 'error':
      return (
        <OctagonX style={{ color: 'var(--color-red-control-fill-primary)' }} />
      );
    case 'loading':
      return (
        <LoadingEffect
          style={{
            color: 'var(--color-gray-text-disabled)',
            transform: 'scale(1.1)',
          }}
        />
      );
    case 'pending':
    default:
      return (
        <CircleDashed style={{ color: 'var(--color-gray-text-disabled)' }} />
      );
  }
};

interface TaskRowProps {
  item: TaskItem;
  prefixCls: string;
  hashId: string;
  onItemClick?: TaskListProps['onItemClick'];
}

const TaskRow = React.memo(function TaskRow({
  item,
  prefixCls,
  hashId,
  onItemClick,
}: TaskRowProps) {
  return (
    <div
      className={classNames(
        `${prefixCls}-item`,
        `${prefixCls}-item-${item.status}`,
        hashId,
      )}
      role={onItemClick ? 'button' : undefined}
      tabIndex={onItemClick ? 0 : undefined}
      onClick={onItemClick ? () => onItemClick(item) : undefined}
      onKeyDown={
        onItemClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onItemClick(item);
              }
            }
          : undefined
      }
      style={{ cursor: onItemClick ? 'pointer' : undefined }}
    >
      <div className={classNames(`${prefixCls}-status`, hashId)}>
        <StatusIcon status={item.status} />
      </div>
      <div className={classNames(`${prefixCls}-content`, hashId)}>
        <div className={classNames(`${prefixCls}-title`, hashId)}>
          {item.title}
        </div>
        {item.content && (
          <div className={classNames(`${prefixCls}-description`, hashId)}>
            {item.content}
          </div>
        )}
      </div>
    </div>
  );
});

export const TaskList: FC<TaskListProps> = ({ data, onItemClick }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('agentic-workspace-task');
  const { hashId } = useTaskStyle(prefixCls);

  return (
    <div className={classNames(prefixCls, hashId)} data-testid="task-list">
      {data.items.map((item) => (
        <TaskRow
          key={item.key}
          item={item}
          prefixCls={prefixCls}
          hashId={hashId}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
};
