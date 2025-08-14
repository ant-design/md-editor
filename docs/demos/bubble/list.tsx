import {
  BubbleList,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/md-editor';
import React, { useRef } from 'react';

// Mock data for the demo
const mockMessages: MessageBubbleData[] = [
  {
    id: '1',
    role: 'assistant',
    content: '你好！我是 Ant Design 聊天助手。',
    createAt: 1703123453789, // 2023-12-21 10:30:53
    updateAt: 1703123453789,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Ant Design',
    } as BubbleMetaData,
  },
  {
    id: '2',
    role: 'user',
    content: '你好！很高兴认识你。',
    createAt: 1703123454789, // 2023-12-21 10:30:54
    updateAt: 1703123454789,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: '用户',
    } as BubbleMetaData,
  },
  {
    id: '3',
    role: 'assistant',
    content: '我可以帮你了解 Ant Design 的各种组件和设计理念。你想了解什么？',
    createAt: 1703123455789, // 2023-12-21 10:30:55
    updateAt: 1703123455789,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Ant Design',
    } as BubbleMetaData,
  },
];

export default () => {
  const bubbleListRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<any>();

  // 助手元数据
  const assistantMeta: BubbleMetaData = {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'Ant Design',
  };

  // 用户元数据
  const userMeta: BubbleMetaData = {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: '用户',
  };

  return (
    <>
      <BubbleList
        bubbleList={mockMessages}
        bubbleListRef={bubbleListRef}
        bubbleRef={bubbleRef}
        loading={false}
        assistantMeta={assistantMeta}
        userMeta={userMeta}
        style={{ height: 400, overflow: 'auto' }}
      />
      <BubbleList
        bubbleList={mockMessages}
        bubbleListRef={bubbleListRef}
        bubbleRef={bubbleRef}
        loading={true}
        assistantMeta={assistantMeta}
        userMeta={userMeta}
        style={{ height: 400, overflow: 'auto' }}
      />
    </>
  );
};
