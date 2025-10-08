import {
  BubbleList,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/md-editor';
import { Button, InputNumber, message } from 'antd';
import React, { useRef, useState } from 'react';

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
        ? 'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original'
        : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: role === 'assistant' ? 'AI助手' : '用户',
  } as BubbleMetaData,
});

export default () => {
  const bubbleListRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<any>();

  // 状态管理
  const [messageCount, setMessageCount] = useState(100);
  const [bubbleList, setBubbleList] = useState<MessageBubbleData[]>([]);

  // 元数据配置
  const assistantMeta: BubbleMetaData = {
    avatar:
      'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
    title: 'AI助手',
  };

  const userMeta: BubbleMetaData = {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: '用户',
  };

  // 生成大量消息
  const generateMessages = () => {
    const messages: MessageBubbleData[] = [];
    const startTime = performance.now();

    for (let i = 0; i < messageCount; i++) {
      const role = i % 2 === 0 ? 'assistant' : 'user';
      const content = `这是第 ${i + 1} 条消息，用于测试性能表现。`;
      messages.push(createMockMessage(`msg-${i}`, role, content));
    }

    setBubbleList(messages);

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    message.success(`生成了 ${messageCount} 条消息，耗时 ${duration}ms`);
  };

  // 清空消息
  const clearMessages = () => {
    setBubbleList([]);
    message.info('消息已清空');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 性能测试控制 */}
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          background: '#f8f9fa',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <InputNumber
              value={messageCount}
              onChange={(value) => setMessageCount(value || 100)}
              min={10}
              max={10000}
              step={100}
              style={{ width: 120 }}
            />
          </div>

          <Button type="primary" onClick={generateMessages}>
            生成消息
          </Button>

          <Button onClick={clearMessages}>清空消息</Button>
        </div>

        <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
          💡 测试虚拟滚动性能，建议从 100 条开始，逐步增加到 10000 条
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
          style={{ height: 500, overflow: 'auto' }}
        />
      </div>

      {/* 性能说明 */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: '#f6ffed',
          borderRadius: 6,
          fontSize: 14,
        }}
      >
        <strong>⚡ 性能特性：</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
          <li>
            <strong>虚拟滚动：</strong>只渲染可见区域的消息
          </li>
          <li>
            <strong>按需渲染：</strong>减少 DOM 节点数量
          </li>
          <li>
            <strong>内存优化：</strong>智能垃圾回收机制
          </li>
          <li>
            <strong>流畅体验：</strong>支持数万条消息流畅滚动
          </li>
        </ul>
      </div>
    </div>
  );
};
