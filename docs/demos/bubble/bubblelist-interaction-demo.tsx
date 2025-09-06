import {
  BubbleList,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/md-editor';
import { message } from 'antd';
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

// 示例消息
const sampleMessages: MessageBubbleData[] = [
  createMockMessage('1', 'assistant', '点击下方的 👍 和 👎 按钮体验点赞功能'),
  createMockMessage('2', 'assistant', '点击"回复"按钮可以回复这条消息'),
  createMockMessage('3', 'user', '这是用户消息，可以双击体验双击事件'),
];

export default () => {
  const bubbleListRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<any>();

  // 状态管理
  const [bubbleList, setBubbleList] =
    useState<MessageBubbleData[]>(sampleMessages);

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

  // 处理点赞
  const handleLike = useCallback(async (bubble: MessageBubbleData) => {
    message.success(`已点赞消息: ${bubble.id}`);
    console.log('点赞:', bubble);
  }, []);

  // 处理点踩
  const handleDisLike = useCallback(async (bubble: MessageBubbleData) => {
    message.info(`已点踩消息: ${bubble.id}`);
    console.log('点踩:', bubble);
  }, []);

  // 处理回复
  const handleReply = useCallback((content: string) => {
    const replyMessage = createMockMessage(
      `reply-${Date.now()}`,
      'user',
      `回复: ${content}`,
    );
    setBubbleList((prev) => [...prev, replyMessage]);
    message.success('回复已发送');
  }, []);

  // 处理头像点击
  const handleAvatarClick = useCallback(() => {
    message.info('点击了头像');
  }, []);

  // 处理双击
  const handleDoubleClick = useCallback((bubble: MessageBubbleData) => {
    message.info(`双击了消息: ${bubble.id}`);
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 说明区域 */}
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          background: '#f8f9fa',
          borderRadius: 8,
        }}
      >
        <h3>🔧 BubbleList 交互功能</h3>
        <div style={{ fontSize: 14, color: '#666' }}>
          💡 点击消息下方的按钮体验各种交互功能，或双击消息查看双击事件
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
          onLike={handleLike}
          onDisLike={handleDisLike}
          onReply={handleReply}
          onAvatarClick={handleAvatarClick}
          onDoubleClick={handleDoubleClick}
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
        <strong>📖 交互功能：</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
          <li>
            <strong>onLike:</strong> 点赞回调函数
          </li>
          <li>
            <strong>onDisLike:</strong> 点踩回调函数
          </li>
          <li>
            <strong>onReply:</strong> 回复回调函数
          </li>
          <li>
            <strong>onAvatarClick:</strong> 头像点击回调
          </li>
          <li>
            <strong>onDoubleClick:</strong> 双击回调函数
          </li>
        </ul>
      </div>
    </div>
  );
};
