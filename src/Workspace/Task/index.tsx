import React, { type FC } from 'react';
import {
  ThoughtChainList,
  ThoughtChainListProps,
  WhiteBoxProcessInterface,
} from '../../ThoughtChainList';
import './index.less';

export interface TaskItemInput {
  content: WhiteBoxProcessInterface[];
  thoughtChainListProps?: Partial<ThoughtChainListProps>;
}

export const TaskList: FC<{ data: TaskItemInput }> = ({ data }) => {
  // 默认的ThoughtChainList配置
  const getDefaultProps = (): Partial<ThoughtChainListProps> => ({
    style: { width: '100%' },
    finishAutoCollapse: false,
    titleRender: () => <></>,
  });

  // 合并默认配置和用户传入的配置
  const getMergedProps = (
    defaultProps: Partial<ThoughtChainListProps>,
  ): Partial<ThoughtChainListProps> => {
    return {
      ...defaultProps,
      ...data.thoughtChainListProps,
    };
  };

  return (
    <div className="chat-task-list">
      <ThoughtChainList
        {...getMergedProps(getDefaultProps())}
        thoughtChainList={data.content}
        style={{
          padding: 0,
          borderRadius: 0,
          boxShadow: 'none',
        }}
      />
    </div>
  );
};
