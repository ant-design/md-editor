import { MoreOutlined } from '@ant-design/icons';
import { History, HistoryDataType } from '@ant-design/md-editor';
import { Dropdown } from 'antd';
import React, { useState } from 'react';

const TaskHistoryDemo = () => {
  const [currentSessionId, setCurrentSessionId] = useState('session-1');

  // 模拟请求函数
  const mockRequest = async ({ agentId }: { agentId: string }) => {
    // 模拟 API 请求
    return [
      {
        id: '1',
        sessionId: 'session-1',
        sessionTitle: '帮我规划一条重庆两日游路线',
        description:
          '这个任务会比较复杂，我会根据你的需求生成一条路线，并给出详细的攻略',
        icon: '📋',
        agentId: agentId,
        gmtCreate: 1703123456789,
        gmtLastConverse: 1703123456789,
      },
      {
        id: '3',
        sessionId: 'session-3',
        sessionTitle: 'Create Printable PDF from Subtitle',
        description: '需要分析用户行为数据并生成报告',
        icon: '📊',
        agentId: agentId,
        gmtCreate: 1702950656789,
        gmtLastConverse: 1702950656789,
      },
      {
        id: '4',
        sessionId: 'session-4',
        sessionTitle: '代码审查',
        description: '审查前端代码质量和性能优化',
        icon: '🔍',
        agentId: agentId,
        gmtCreate: 1702518656789,
        gmtLastConverse: 1702518656789,
      },
    ] as HistoryDataType[];
  };

  const handleSelected = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    console.log('选择会话:', sessionId);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>History Task 模式</h3>
      <p>当前会话ID: {currentSessionId}</p>

      <p>说明：</p>
      <ul>
        <li>任务类型使用 📋 作为默认图标</li>
      </ul>
      <div
        style={{
          padding: '20px',
          width: 348,
          margin: '0 auto',
          border: '1px solid #d9d9d9',
        }}
      >
        <History
          agentId="test-agent"
          sessionId={currentSessionId}
          request={mockRequest}
          type="task"
          onClick={handleSelected}
          standalone
          agent={{
            runningId: ['1'],
            enabled: true,
            onSearch: () => {},
            onLoadMore: () => {},
            onNewChat: () => {},
          }}
          customOperationExtra={
            <Dropdown>
              <MoreOutlined />
            </Dropdown>
          }
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>type=&quot;task&quot;</strong>:
            启用任务模式，自动显示图标和描述
          </li>
          <li>
            <strong>agentId</strong>: 代理ID，用于获取历史记录
          </li>
          <li>
            <strong>sessionId</strong>: 当前会话ID，变更时会触发数据重新获取
          </li>
          <li>
            <strong>request</strong>: 请求函数，用于获取历史数据
          </li>
          <li>
            <strong>onClick</strong>: 点击历史记录项时的回调函数（推荐使用）
          </li>
          <li>
            <strong>onDeleteItem</strong>: 删除历史记录项时的回调函数
          </li>
          <li>
            <strong>standalone</strong>: 设置为 true 时，直接显示菜单列表
          </li>
          <li>
            <strong>agent.enabled</strong>: 启用 Agent
            模式，显示搜索、收藏、多选等功能
          </li>
          <li>
            <strong>agent.runningId</strong>: 正在运行的任务 ID 数组
          </li>
          <li>
            <strong>agent.onSearch</strong>: 搜索回调函数
          </li>
          <li>
            <strong>agent.onLoadMore</strong>: 加载更多回调函数
          </li>
          <li>
            <strong>agent.onNewChat</strong>: 新对话回调函数
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TaskHistoryDemo;
