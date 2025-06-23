import { TaskList } from '@ant-design/md-editor';
import React, { useState } from 'react';

type TaskStatus = 'success' | 'error' | 'pending';

export default () => {
  const [items] = useState([
    {
      key: '1',
      title: '已完成任务',
      content: '这是一个已完成的任务内容',
      status: 'success' as TaskStatus,
    },
    {
      key: '2',
      title: '进行中任务',
      content: [
        <div key="1">这是一个进行中的任务内容</div>,
        <div key="2">可以包含多个内容项</div>,
      ],
      status: 'pending' as TaskStatus,
    },
    {
      key: '3',
      title: '错误任务',
      content: '这是一个出错的任务内容',
      status: 'error' as TaskStatus,
    },
  ]);

  return (
    <div style={{ padding: 24, backgroundColor: '#f5f5f5' }}>
      <h3>基础用法</h3>
      <TaskList items={items} />
    </div>
  );
};
