import React from 'react';
import { TaskList } from './src/TaskList';

const TestTaskList = () => {
  const items = [
    {
      key: '1',
      title: '测试任务 1',
      content: [
        <div key="1">这是任务1的内容</div>,
        <div key="2">点击标题可以展开/收起</div>,
      ],
      status: 'success',
    },
    {
      key: '2',
      title: '测试任务 2',
      content: [
        <div key="1">这是任务2的内容</div>,
        <div key="2">默认应该是展开状态</div>,
      ],
      status: 'pending',
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>TaskList 展开收起功能测试</h2>
      <p>点击任务标题可以展开/收起内容</p>
      <TaskList items={items} />
    </div>
  );
};

export default TestTaskList;
