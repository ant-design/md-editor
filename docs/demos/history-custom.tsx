import { History, HistoryDataType } from '@ant-design/md-editor';
import dayjs from 'dayjs';
import React, { useState } from 'react';

const CustomHistoryDemo = () => {
  const [currentSessionId, setCurrentSessionId] = useState('session-1');

  const mockRequest = async ({ agentId }: { agentId: string }) => {
    return [
      {
        id: '1',
        sessionId: 'session-1',
        sessionTitle: '重要会议记录',
        agentId: agentId,
        gmtCreate: 1718332800000,
        gmtLastConverse: 1718332800000,
      },
      {
        id: '2',
        sessionId: 'session-2',
        sessionTitle: '日常讨论',
        agentId: agentId,
        gmtCreate: 1718332800000,
        gmtLastConverse: 1718332800000,
      },
      {
        id: '3',
        sessionId: 'session-3',
        sessionTitle: '紧急问题处理',
        agentId: agentId,
        gmtCreate: 1718332800000,
        gmtLastConverse: 1718332800000,
      },
      {
        id: '4',
        sessionId: 'session-4',
        sessionTitle: '长期项目规划',
        agentId: agentId,
        gmtCreate: 1718332800000,
        gmtLastConverse: 1718332800000,
      },
      {
        id: '5',
        sessionId: 'session-5',
        sessionTitle: '历史数据分析',
        agentId: agentId,
        gmtCreate: 1718332800000, // 两周前
        gmtLastConverse: 1718332800000,
      },
    ] as HistoryDataType[];
  };

  // 自定义日期格式化
  const customDateFormatter = (date: number | string | Date) => {
    const d = dayjs(date);
    if (d.isSame(dayjs(), 'day')) {
      return '今天';
    }
    if (d.isSame(dayjs().subtract(1, 'day'), 'day')) {
      return '昨天';
    }
    if (d.isAfter(dayjs().subtract(7, 'day'))) {
      return '本周';
    }
    if (d.isAfter(dayjs().subtract(30, 'day'))) {
      return '本月';
    }
    return d.format('MM月DD日');
  };

  // 自定义分组逻辑
  const customGroupBy = (item: HistoryDataType) => {
    const d = dayjs(item.gmtCreate);
    if (d.isSame(dayjs(), 'day')) {
      return '今天';
    }
    if (d.isSame(dayjs().subtract(1, 'day'), 'day')) {
      return '昨天';
    }
    if (d.isAfter(dayjs().subtract(7, 'day'))) {
      return '本周';
    }
    if (d.isAfter(dayjs().subtract(30, 'day'))) {
      return '本月';
    }
    return '更早';
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
      <h3>自定义日期格式化和分组</h3>
      <p>当前会话ID: {currentSessionId}</p>
      <div
        style={{
          width: 350,
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
          customDateFormatter={customDateFormatter}
          groupBy={customGroupBy}
          standalone
        />
      </div>
    </div>
  );
};

export default CustomHistoryDemo;
