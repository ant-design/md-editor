import { History, HistoryDataType } from '@ant-design/md-editor';
import { Badge, Button, Tag } from 'antd';
import React, { useState } from 'react';

const ExtraContentHistoryDemo = () => {
  const [currentSessionId, setCurrentSessionId] = useState('session-1');

  const mockRequest = async ({ agentId }: { agentId: string }) => {
    return [
      {
        id: '1',
        sessionId: 'session-1',
        sessionTitle: '重要会议记录',
        agentId: agentId,
        gmtCreate: 1703123456789, // 2023-12-21 10:30:56
        gmtLastConverse: 1703123456789,
      },
      {
        id: '2',
        sessionId: 'session-2',
        sessionTitle: '日常讨论',
        agentId: agentId,
        gmtCreate: 1703037056789, // 2023-12-20 10:30:56
        gmtLastConverse: 1703037056789,
      },
      {
        id: '3',
        sessionId: 'session-3',
        sessionTitle: '紧急问题处理',
        agentId: agentId,
        gmtCreate: 1702950656789, // 2023-12-19 10:30:56
        gmtLastConverse: 1702950656789,
      },
      {
        id: '4',
        sessionId: 'session-4',
        sessionTitle: '长期项目规划',
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

  // 自定义额外内容
  const extraContent = (item: HistoryDataType) => {
    const isImportant =
      item.sessionTitle?.toString().includes('重要') ||
      item.sessionTitle?.toString().includes('紧急');
    const isToday =
      new Date(item.gmtCreate as number).toDateString() ===
      new Date().toDateString();

    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {isImportant && <Tag color="red">重要</Tag>}
        {isToday && <Badge count="新" size="small" />}
        <Button
          size="small"
          type="link"
          onClick={(e) => {
            e.stopPropagation();
            console.log('导出会话:', item.sessionId);
          }}
        >
          导出
        </Button>
      </div>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>自定义额外内容</h3>
      <p>当前会话ID: {currentSessionId}</p>
      <div
        style={{
          width: 400,
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
          extra={extraContent}
          standalone
        />
      </div>
    </div>
  );
};

export default ExtraContentHistoryDemo;
