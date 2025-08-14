import { History, HistoryDataType } from '@ant-design/md-editor';
import React, { useState } from 'react';

const StandaloneHistoryDemo = () => {
  const [currentSessionId, setCurrentSessionId] = useState('session-1');

  const mockRequest = async ({ agentId }: { agentId: string }) => {
    return [
      {
        id: '1',
        sessionId: 'session-1',
        sessionTitle: '项目需求分析',
        agentId: agentId,
        gmtCreate: 1703123456789, // 2023-12-21 10:30:56
        gmtLastConverse: 1703123456789,
      },
      {
        id: '2',
        sessionId: 'session-2',
        sessionTitle: '技术方案讨论',
        agentId: agentId,
        gmtCreate: 1703037056789, // 2023-12-20 10:30:56
        gmtLastConverse: 1703037056789,
      },
      {
        id: '3',
        sessionId: 'session-3',
        sessionTitle: 'UI/UX 设计评审',
        agentId: agentId,
        gmtCreate: 1702950656789, // 2023-12-19 10:30:56
        gmtLastConverse: 1702950656789,
      },
      {
        id: '4',
        sessionId: 'session-4',
        sessionTitle: '测试计划制定',
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
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>独立菜单模式</h3>
      <p>当前会话ID: {currentSessionId}</p>
      <div
        style={{
          width: 300,
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          padding: 16,
          backgroundColor: '#fafafa',
        }}
      >
        <History
          agentId="test-agent"
          sessionId={currentSessionId}
          request={mockRequest}
          onSelected={handleSelected}
          onDeleteItem={handleDeleteItem}
          standalone
        />
      </div>
    </div>
  );
};

export default StandaloneHistoryDemo;
