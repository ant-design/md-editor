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

export const TaskList: FC<{ item: TaskItemInput }> = ({ item }) => {
  // 默认的ThoughtChainList配置
  const getDefaultProps = (): Partial<ThoughtChainListProps> => ({
    loading: false,
    style: { width: '100%' },
  });

  // 合并默认配置和用户传入的配置
  const getMergedProps = (
    defaultProps: Partial<ThoughtChainListProps>,
  ): Partial<ThoughtChainListProps> => {
    return {
      ...defaultProps,
      ...item.thoughtChainListProps,
    };
  };

  return (
    <div className="chat-task-list">
      <ThoughtChainList
        {...getMergedProps(getDefaultProps())}
        thoughtChainList={item.content}
      />
    </div>
  );
};
