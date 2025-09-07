import { PlusOutlined } from '@ant-design/icons';
import {
  BubbleList,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/md-editor';
import { Button, message } from 'antd';
import React, { useCallback, useRef, useState } from 'react';

// 创建模拟消息
const createMockMessage = (
  id: string,
  role: 'user' | 'assistant',
  content: string,
): MessageBubbleData => ({
  id,
  role,
  content,
  createAt: Date.now(),
  updateAt: Date.now(),
  isFinished: true,
  meta: {
    avatar:
      role === 'assistant'
        ? 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
        : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: role === 'assistant' ? 'AI助手' : '用户',
  } as BubbleMetaData,
});

// 初始消息
const initialMessages: MessageBubbleData[] = [
  createMockMessage('1', 'assistant', '欢迎使用 BubbleList 组件！'),
  createMockMessage('2', 'user', '这个组件功能很强大！'),
];

export default () => {
  const bubbleListRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<any>();

  // 状态管理
  const [bubbleList, setBubbleList] =
    useState<MessageBubbleData[]>(initialMessages);

  // 元数据配置
  const assistantMeta: BubbleMetaData = {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'AI助手',
  };

  const userMeta: BubbleMetaData = {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: '用户',
  };

  // 添加消息
  const addMessage = useCallback(() => {
    const newMessage = createMockMessage(
      `msg-${Date.now()}`,
      bubbleList.length % 2 === 0 ? 'user' : 'assistant',
      `这是第 ${bubbleList.length + 1} 条消息`,
    );
    setBubbleList((prev) => [...prev, newMessage]);
    message.success('消息已添加');
  }, [bubbleList.length]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 控制区域 */}
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          background: '#f8f9fa',
          borderRadius: 8,
        }}
      >
        <h3>📋 BubbleList 基础用法</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={addMessage}>
          添加消息
        </Button>
        <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
          当前消息数: {bubbleList.length}
        </div>
      </div>

      {/* 消息列表 */}
      <div
        style={{
          border: '1px solid #e9ecef',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <BubbleList
          bubbleList={bubbleList}
          bubbleListRef={bubbleListRef}
          bubbleRef={bubbleRef}
          assistantMeta={assistantMeta}
          userMeta={userMeta}
          style={{ height: 400, overflow: 'auto' }}
        />
      </div>

      {/* 说明 */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: '#e6f7ff',
          borderRadius: 6,
          fontSize: 14,
        }}
      >
        <strong>📖 基础用法：</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
          <li>
            <strong>bubbleList:</strong> 消息列表数据
          </li>
          <li>
            <strong>assistantMeta:</strong> 助手元数据配置
          </li>
          <li>
            <strong>userMeta:</strong> 用户元数据配置
          </li>
        </ul>
      </div>
    </div>
  );
};
