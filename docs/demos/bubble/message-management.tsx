import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  BubbleList,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/md-editor';
import { Button, message, Space, Switch } from 'antd';
import React, { useCallback, useRef, useState } from 'react';

// 创建模拟消息
const createMockMessage = (
  id: string,
  role: 'user' | 'assistant',
  content: string,
  timestamp?: number,
): MessageBubbleData => ({
  id,
  role,
  content,
  createAt: timestamp || Date.now(),
  updateAt: timestamp || Date.now(),
  isFinished: true,
  meta: {
    avatar:
      role === 'assistant'
        ? 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
        : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: role === 'assistant' ? 'Ant Design Assistant' : '前端开发者',
    description: role === 'assistant' ? 'AI 智能助手' : '资深工程师',
  } as BubbleMetaData,
  extra:
    role === 'assistant'
      ? {
          duration: Math.floor(Math.random() * 3000) + 500,
          model: 'GPT-4',
          tokens: Math.floor(Math.random() * 200) + 50,
        }
      : {},
});

// 初始化消息数据
const initialMessages: MessageBubbleData[] = [
  createMockMessage(
    '1',
    'assistant',
    `# 📝 消息管理功能演示

BubbleList 组件提供了强大的消息管理功能，包括：

## 管理功能
- ➕ **添加消息**：动态添加新消息
- 🗑️ **删除消息**：删除指定消息
- 🔄 **更新消息**：修改消息内容
- 📊 **消息统计**：查看消息数量
- 🔍 **消息搜索**：快速定位消息

你可以通过下方的控制按钮体验这些功能！`,
    Date.now() - 300000,
  ),
  createMockMessage(
    '2',
    'user',
    '这个功能很实用！能演示一下如何添加和删除消息吗？',
    Date.now() - 240000,
  ),
  createMockMessage(
    '3',
    'assistant',
    `当然可以！消息管理非常简单：

## 添加消息
\`\`\`typescript
const newMessage = createMockMessage('new-id', 'user', '新消息内容');
setMessages(prev => [...prev, newMessage]);
\`\`\`

## 删除消息
\`\`\`typescript
const deleteMessage = (id: string) => {
  setMessages(prev => prev.filter(msg => msg.id !== id));
};
\`\`\`

你可以点击下方的按钮来体验这些功能！`,
    Date.now() - 180000,
  ),
];

export default () => {
  const bubbleRef = useRef<any>();
  const [messages, setMessages] =
    useState<MessageBubbleData[]>(initialMessages);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showStats, setShowStats] = useState(false);

  // 添加新消息
  const addMessage = useCallback(() => {
    const newId = `msg-${Date.now()}`;
    const role = Math.random() > 0.5 ? 'assistant' : 'user';
    const contents = [
      '这是一条新添加的消息！',
      '消息管理功能真的很方便！',
      '可以动态添加各种类型的消息。',
      '支持用户和助手两种角色。',
      '消息会自动分配唯一的ID。',
    ];
    const content = contents[Math.floor(Math.random() * contents.length)];

    const newMessage = createMockMessage(newId, role, content);
    setMessages((prev) => [...prev, newMessage]);
    message.success('新消息已添加！');
  }, []);

  // 删除最后一条消息
  const deleteLastMessage = useCallback(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setMessages((prev) => prev.slice(0, -1));
      message.success(`已删除消息: ${lastMessage.id}`);
    } else {
      message.warning('没有消息可以删除');
    }
  }, [messages]);

  // 删除指定消息
  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    message.success(`已删除消息: ${id}`);
  }, []);

  // 清空所有消息
  const clearAllMessages = useCallback(() => {
    setMessages([]);
    message.success('所有消息已清空');
  }, []);

  // 重置消息
  const resetMessages = useCallback(() => {
    setMessages(initialMessages);
    message.success('消息已重置');
  }, []);

  // 处理点赞/点踩事件
  const handleLike = async (bubble: MessageBubbleData) => {
    message.success(`已点赞消息: ${bubble.id}`);
    console.log('点赞消息:', bubble);
  };

  const handleDisLike = async (bubble: MessageBubbleData) => {
    message.info(`已点踩消息: ${bubble.id}`);
    console.log('点踩消息:', bubble);
  };

  // 处理回复事件
  const handleReply = (content: string) => {
    message.info(`回复内容: ${content}`);
    console.log('回复内容:', content);
  };

  // 获取消息统计
  const getMessageStats = () => {
    const assistantCount = messages.filter(
      (msg) => msg.role === 'assistant',
    ).length;
    const userCount = messages.filter((msg) => msg.role === 'user').length;
    const totalTokens = messages.reduce(
      (sum, msg) => sum + (msg.extra?.tokens || 0),
      0,
    );

    return {
      total: messages.length,
      assistant: assistantCount,
      user: userCount,
      totalTokens,
    };
  };

  const stats = getMessageStats();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 控制区域 */}
      <div style={{ marginBottom: 24 }}>
        <h3>📝 消息管理控制</h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addMessage}
              >
                添加消息
              </Button>
              <Button icon={<DeleteOutlined />} onClick={deleteLastMessage}>
                删除最后一条
              </Button>
              <Button onClick={clearAllMessages} danger>
                清空所有
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetMessages}>
                重置消息
              </Button>
            </Space>
          </div>
          <div>
            <Space>
              <span>自动滚动：</span>
              <Switch
                checked={autoScroll}
                onChange={setAutoScroll}
                checkedChildren="开启"
                unCheckedChildren="关闭"
              />
              <Button type="primary" onClick={() => setShowStats(!showStats)}>
                {showStats ? '隐藏' : '显示'}统计信息
              </Button>
            </Space>
          </div>
        </Space>
        <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
          💡 使用控制按钮来管理消息列表
        </div>
      </div>

      {/* 统计信息 */}
      {showStats && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            backgroundColor: '#f0f8ff',
            borderRadius: 6,
            border: '1px solid #d6e4ff',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>📊 消息统计</h4>
          <Space>
            <span>
              总消息数: <strong>{stats.total}</strong>
            </span>
            <span>
              助手消息: <strong>{stats.assistant}</strong>
            </span>
            <span>
              用户消息: <strong>{stats.user}</strong>
            </span>
            <span>
              总Token数: <strong>{stats.totalTokens}</strong>
            </span>
          </Space>
        </div>
      )}

      {/* 消息列表 */}
      <div style={{ marginBottom: 16 }}>
        <BubbleList
          bubbleRef={bubbleRef}
          bubbleList={messages}
          autoScroll={autoScroll}
          onLike={handleLike}
          onDisLike={handleDisLike}
          onReply={handleReply}
          onDelete={deleteMessage}
          style={{
            maxHeight: 500,
            overflowY: 'auto',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            padding: 16,
          }}
        />
      </div>

      {/* 功能说明 */}
      <div
        style={{
          padding: 16,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>📝 消息管理功能说明</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>添加消息：</strong>动态添加新的用户或助手消息
          </li>
          <li>
            <strong>删除消息：</strong>支持删除最后一条或指定消息
          </li>
          <li>
            <strong>清空重置：</strong>一键清空所有消息或重置到初始状态
          </li>
          <li>
            <strong>自动滚动：</strong>新消息时自动滚动到底部
          </li>
          <li>
            <strong>消息统计：</strong>实时显示消息数量和类型统计
          </li>
          <li>
            <strong>交互操作：</strong>支持点赞、点踩、回复等操作
          </li>
        </ul>
      </div>
    </div>
  );
};
