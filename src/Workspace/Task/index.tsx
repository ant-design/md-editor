import LoadingLottie from '@ant-design/md-editor/TaskList/LoadingLottie';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { type FC, useContext } from 'react';
import DashPendingIcon from '../icons/DashPendingIcon';
import ErrorIcon from '../icons/ErrorIcon';
import SuccessIcon from '../icons/SuccessIcon';
import { useTaskStyle } from './style';

export interface TaskItemInput {
  items: {
    key: string;
    title?: string;
    content?: React.ReactNode | React.ReactNode[];
    status: 'success' | 'pending' | 'loading' | 'error';
  }[];
}

const StatusIcon: FC<{
  status: 'success' | 'pending' | 'loading' | 'error';
}> = ({ status }) => {
  switch (status) {
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'loading':
      return <LoadingLottie />;
    case 'pending':
    default:
      return <DashPendingIcon />;
  }
};

export const TaskList: FC<{ data: TaskItemInput }> = ({ data }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('workspace-task');
  const { wrapSSR, hashId } = useTaskStyle(prefixCls);

  return wrapSSR(
    <div className={classNames(prefixCls, hashId)} data-testid="task-list">
      {data.items.map((item) => (
        <div
          key={item.key}
          className={classNames(
            `${prefixCls}-item`,
            `${prefixCls}-item-${item.status}`,
            hashId,
          )}
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
      ))}
    </div>,
  );
};
