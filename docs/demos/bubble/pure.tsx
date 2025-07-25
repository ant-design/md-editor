import {
  Bubble,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/md-editor';
import React, { useRef } from 'react';

// Mock data for the demo
const mockMessage: MessageBubbleData = {
  id: '1',
  role: 'assistant',
  content: '这是一条使用 pure 模式的消息，没有阴影和边框。',
  createAt: Date.now(),
  updateAt: Date.now(),
  meta: {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'Ant Design',
  } as BubbleMetaData,
};

const mockUserMessage: MessageBubbleData = {
  id: '2',
  role: 'user',
  content: '这是一条用户发送的 pure 模式消息。',
  createAt: Date.now(),
  updateAt: Date.now(),
  meta: {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: '用户',
  } as BubbleMetaData,
};

export default () => {
  const bubbleRef = useRef<any>();
  const deps: any[] = [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bubble
        bubbleRef={bubbleRef}
        deps={deps}
        originData={mockMessage}
        avatar={mockMessage.meta as BubbleMetaData}
        pure
      />
      <Bubble
        bubbleRef={bubbleRef}
        deps={deps}
        originData={mockUserMessage}
        avatar={mockUserMessage.meta as BubbleMetaData}
        pure
      />
    </div>
  );
};
