import { TaskList, ToolUseBar } from '@ant-design/md-editor';
import React, { useState } from 'react';

type TaskStatus = 'success' | 'pending';

export default () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [items] = useState([
    {
      key: '1',
      title: '创建全面的 Tesla 股票分析任务列表',
      content: [
        <div key="1">Get stock chart 获取股票图表</div>,
        <div key="2">Get stock holders 获取股票持有人</div>,
        <div key="3">Get stock insights 获取股票洞察</div>,
        <div key="4">Get stock profile 获取股票概况</div>,
        <div key="5">Get stock SEC filing 获取股票 SEC 备案</div>,
        <div key="6">
          Get what analysts say about the stock 获取分析师对股票的评价
        </div>,
      ],
      status: 'success' as TaskStatus,
    },
    {
      key: '2',
      title: '创建全面的 Tesla 股票分析任务列表',
      content: [
        <ToolUseBar
          key="1"
          activeKeys={activeKeys}
          onActiveKeysChange={(keys) => {
            setActiveKeys(keys);
          }}
          tools={[
            {
              id: '1',
              toolName: '工具类/工具名称',
              toolTarget: '操作...',
              time: '3',
            },
            {
              id: '2',
              toolName: '工具类/工具名称',
              toolTarget: '操作...',
              time: '3',
            },
            {
              id: '3',
              toolName: '工具类/工具名称',
              toolTarget: '操作...',
              time: '3',
            },
          ]}
        />,
      ],
      status: 'loading' as TaskStatus,
    },
    {
      key: '3',
      title: '创建全面的 Tesla 股票分析任务列表',
      content: [
        <div key="1">Get stock chart 获取股票图表</div>,
        <div key="2">Get stock holders 获取股票持有人</div>,
        <div key="3" style={{ color: '#1890ff' }}>
          Get stock insights 编辑文件 股票洞察.md
        </div>,
      ],
      status: 'pending' as TaskStatus,
    },
    {
      key: '4',
      title: '任务获取失败',
      content: [<div key="1">Get stock chart 获取股票图表</div>],
      status: 'error' as TaskStatus,
    },
  ]);

  return (
    <div style={{ padding: 24 }}>
      <h3>Tesla 股票分析任务列表示例</h3>
      <TaskList items={items} />

      <div style={{ marginTop: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>items</strong>: 任务列表数组，每个任务包含
            key、title、content、status 等属性
          </li>
          <li>
            <strong>key</strong>: 任务的唯一标识符
          </li>
          <li>
            <strong>title</strong>: 任务标题
          </li>
          <li>
            <strong>content</strong>: 任务内容，可以是 React 节点数组
          </li>
          <li>
            <strong>status</strong>: 任务状态，支持 'success' | 'pending' |
            'loading'
          </li>
        </ul>
      </div>
    </div>
  );
};
