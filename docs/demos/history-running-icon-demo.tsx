import { History, HistoryDataType } from '@ant-design/agentic-ui';
import { Button, Card, Space, Typography } from 'antd';
import React, { useState } from 'react';

const { Title, Paragraph } = Typography;

/**
 * History 运行图标演示组件
 *
 * 展示如何使用 History 组件的 runningId 功能来显示运行状态图标
 */
const HistoryRunningIconDemo: React.FC = () => {
  // 模拟历史数据
  const mockHistoryData: HistoryDataType[] = [
    {
      id: 'task-1',
      sessionId: 'session-1',
      sessionTitle: '数据分析任务',
      description: '正在分析用户行为数据',
      gmtCreate: Date.now() - 1000 * 60 * 30, // 30分钟前
      gmtLastConverse: Date.now() - 1000 * 60 * 5, // 5分钟前
      isFavorite: false,
      icon: '📊',
    },
    {
      id: 'task-2',
      sessionId: 'session-2',
      sessionTitle: '模型训练任务',
      description: '深度学习模型训练中',
      gmtCreate: Date.now() - 1000 * 60 * 60 * 2, // 2小时前
      gmtLastConverse: Date.now() - 1000 * 60 * 10, // 10分钟前
      isFavorite: true,
      icon: '🤖',
    },
    {
      id: 'task-3',
      sessionId: 'session-3',
      sessionTitle: '报告生成',
      description: '已完成的月度报告',
      gmtCreate: Date.now() - 1000 * 60 * 60 * 24, // 1天前
      gmtLastConverse: Date.now() - 1000 * 60 * 60, // 1小时前
      isFavorite: false,
      icon: '📄',
    },
    {
      id: 'task-4',
      sessionId: 'session-4',
      sessionTitle: '系统备份',
      description: '定期系统数据备份',
      gmtCreate: Date.now() - 1000 * 60 * 60 * 6, // 6小时前
      gmtLastConverse: Date.now() - 1000 * 60 * 30, // 30分钟前
      isFavorite: false,
      icon: '💾',
    },
    {
      id: 'task-5',
      sessionId: 'session-5',
      sessionTitle: '代码部署',
      description: '新版本代码部署到生产环境',
      gmtCreate: Date.now() - 1000 * 60 * 60 * 4, // 4小时前
      gmtLastConverse: Date.now() - 1000 * 60 * 15, // 15分钟前
      isFavorite: true,
      icon: '🚀',
    },
  ];

  // 运行中的任务ID列表
  const [runningIds, setRunningIds] = useState<string[]>([
    'task-1',
    'task-2',
    'task-5',
  ]);

  // 模拟请求函数
  const mockRequest = async () => {
    // 模拟网络延迟
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    return mockHistoryData;
  };

  // 处理任务点击
  const handleTaskClick = (sessionId: string, item: HistoryDataType) => {
    console.log('点击任务:', sessionId, item);
  };

  // 处理任务删除
  const handleDeleteTask = async (sessionId: string) => {
    console.log('删除任务:', sessionId);
    // 这里可以添加删除逻辑
  };

  // 模拟开始/停止任务
  const toggleTaskRunning = (taskId: string) => {
    setRunningIds((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  // 停止所有任务
  const stopAllTasks = () => {
    setRunningIds([]);
  };

  // 启动所有任务
  const startAllTasks = () => {
    setRunningIds(mockHistoryData.map((item) => item.id as string));
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>History 运行图标演示</Title>

      <Paragraph>
        这个演示展示了如何使用 History 组件的 <code>runningId</code>{' '}
        功能来显示任务的运行状态。 当任务ID在 <code>runningId</code>{' '}
        数组中时，会在图标区域显示运行状态图标。
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 控制按钮 */}
        <Card title="运行状态控制" size="small">
          <Space wrap>
            <Button onClick={startAllTasks} type="primary">
              启动所有任务
            </Button>
            <Button onClick={stopAllTasks}>停止所有任务</Button>
            {mockHistoryData.map((item) => (
              <Button
                key={item.id}
                size="small"
                type={
                  runningIds.includes(item.id as string) ? 'primary' : 'default'
                }
                onClick={() => toggleTaskRunning(item.id as string)}
              >
                {runningIds.includes(item.id as string) ? '停止' : '启动'}{' '}
                {item.sessionTitle}
              </Button>
            ))}
          </Space>
        </Card>

        {/* 当前运行状态 */}
        <Card title="当前运行状态" size="small">
          <Paragraph>
            正在运行的任务:{' '}
            {runningIds.length > 0 ? runningIds.join(', ') : '无'}
          </Paragraph>
        </Card>

        {/* History 组件演示 */}
        <Card title="History 组件 - 任务模式" size="small">
          <div
            style={{
              height: 400,
              border: '1px solid #f0f0f0',
              borderRadius: '16px',
            }}
          >
            <History
              agentId="demo-agent"
              sessionId="current-session"
              type="task"
              standalone
              agent={{
                enabled: true,
                runningId: runningIds,
              }}
              request={mockRequest}
              onClick={handleTaskClick}
              onDeleteItem={handleDeleteTask}
              customDateFormatter={(date) => {
                const now = Date.now();
                const diff = now - Number(date);
                const minutes = Math.floor(diff / (1000 * 60));
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));

                if (days > 0) return `${days}天前`;
                if (hours > 0) return `${hours}小时前`;
                if (minutes > 0) return `${minutes}分钟前`;
                return '刚刚';
              }}
            />
          </div>
        </Card>

        {/* 聊天模式对比 */}
        <Card title="History 组件 - 聊天模式（对比）" size="small">
          <div
            style={{
              height: 300,
              border: '1px solid #f0f0f0',
              borderRadius: 6,
            }}
          >
            <History
              agentId="demo-agent"
              sessionId="current-session"
              type="chat"
              standalone
              agent={{
                enabled: true,
                runningId: runningIds,
              }}
              request={async () =>
                mockHistoryData.map((item) => ({
                  ...item,
                  sessionTitle: `聊天: ${item.sessionTitle}`,
                  description: undefined,
                  icon: undefined,
                }))
              }
              onClick={handleTaskClick}
              onDeleteItem={handleDeleteTask}
            />
          </div>
        </Card>
      </Space>

      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>type</strong>: 组件类型，支持 &apos;task&apos; |
            &apos;chat&apos;
          </li>
          <li>
            <strong>agent.runningId</strong>: 正在运行的任务 ID
            数组，用于显示运行状态图标
          </li>
          <li>
            <strong>agent.enabled</strong>: 启用 Agent
            模式，显示搜索、收藏、多选等功能
          </li>
          <li>
            <strong>agentId</strong>: 代理ID，用于获取历史记录
          </li>
          <li>
            <strong>sessionId</strong>: 当前会话ID
          </li>
          <li>
            <strong>request</strong>: 请求函数，用于获取历史数据
          </li>
          <li>
            <strong>onClick</strong>: 点击历史记录项时的回调函数
          </li>
          <li>
            <strong>onDeleteItem</strong>: 删除历史记录项时的回调函数
          </li>
          <li>
            <strong>standalone</strong>: 设置为 true 时，直接显示菜单列表
          </li>
          <li>
            <strong>customDateFormatter</strong>: 自定义日期格式化函数
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HistoryRunningIconDemo;
