import { History, HistoryDataType } from '@ant-design/md-editor';
import React, { useState } from 'react';

const BasicHistoryDemo = () => {
  const [currentSessionId, setCurrentSessionId] = useState('session-1');

  // 模拟请求函数
  const mockRequest = async ({ agentId }: { agentId: string }) => {
    // 模拟 API 请求
    return [
      {
        id: '1',
        sessionId: 'session-1',
        sessionTitle: '关于项目架构的讨论',
        agentId: agentId,
        gmtCreate: 1703123456789, // 2023-12-21 10:30:56
        gmtLastConverse: 1703123456789,
      },
      {
        id: '2',
        sessionId: 'session-2',
        sessionTitle: '代码优化建议',
        agentId: agentId,
        gmtCreate: 1703037056789, // 2023-12-20 10:30:56
        gmtLastConverse: 1703037056789,
      },
      {
        id: '3',
        sessionId: 'session-3',
        sessionTitle: '前端性能优化讨论',
        agentId: agentId,
        gmtCreate: 1702950656789, // 2023-12-19 10:30:56
        gmtLastConverse: 1702950656789,
      },
      {
        id: '4',
        sessionId: 'session-4',
        sessionTitle: '数据库设计讨论',
        agentId: agentId,
        gmtCreate: 1702518656789, // 2023-12-14 10:30:56
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
      <h3>当前会话ID: {currentSessionId}</h3>
      <History
        agentId="test-agent"
        sessionId={currentSessionId}
        request={mockRequest}
        onSelected={handleSelected}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default BasicHistoryDemo;
