import { History, HistoryDataType } from '@ant-design/md-editor';
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
        sessionTitle: 'Create Printable PDF from...',
        description: '这个任务会比较复杂，我会...',
        icon: '📋',
        agentId: agentId,
        gmtCreate: 1703123456789,
        gmtLastConverse: 1703123456789,
      },
      {
        id: '3',
        sessionId: 'session-3',
        sessionTitle: '数据分析任务',
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

  const handleDeleteItem = async (sessionId: string) => {
    console.log('删除会话:', sessionId);
    // 这里可以调用删除 API
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>任务类型历史记录演示</h3>
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
          onDeleteItem={handleDeleteItem}
          standalone
          agent={{
            enabled: true,
            onSearch: () => {},
            onLoadMore: () => {},
            onNewChat: () => {},
          }}
        />
      </div>
    </div>
  );
};

export default TaskHistoryDemo;
