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
        gmtCreate: Date.now(),
        gmtLastConverse: Date.now(),
      },
      {
        id: '2',
        sessionId: 'session-2',
        sessionTitle: '代码优化建议',
        agentId: agentId,
        gmtCreate: Date.now() - 86400000, // 昨天
        gmtLastConverse: Date.now() - 86400000,
      },
      {
        id: '3',
        sessionId: 'session-3',
        sessionTitle: '前端性能优化讨论',
        agentId: agentId,
        gmtCreate: Date.now() - 172800000, // 前天
        gmtLastConverse: Date.now() - 172800000,
      },
      {
        id: '4',
        sessionId: 'session-4',
        sessionTitle: '数据库设计讨论',
        agentId: agentId,
        gmtCreate: Date.now() - 604800000, // 一周前
        gmtLastConverse: Date.now() - 604800000,
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
