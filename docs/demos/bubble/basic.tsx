import {
  AttachmentFile,
  Bubble,
  MessageBubbleData,
} from '@ant-design/md-editor';
import React, { useRef } from 'react';

// Mock data for the demo
const mockMessage: MessageBubbleData = {
  id: '1',
  role: 'assistant',
  content: '你好，我是 Ant Design 聊天助手！',
  createAt: 1703123456789, // 2023-12-21 10:30:56
  updateAt: 1703123456789,
  meta: {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'Ant Design',
  },
};

const mockUserMessage: MessageBubbleData = {
  id: '2',
  role: 'user',
  content: '你好！很高兴认识你。',
  createAt: 1703123456789, // 2023-12-21 10:30:56
  updateAt: 1703123456789,
  meta: {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: '用户',
  },
};

const mockFileMessage: MessageBubbleData = {
  id: '3',
  role: 'assistant',
  content: '这是一些文件供你参考：',
  createAt: 1703123456789, // 2023-12-21 10:30:56
  updateAt: 1703123456789,
  meta: {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'Ant Design',
  },
  fileMap: new Map<string, AttachmentFile>([
    [
      'design.pdf',
      {
        name: 'design.pdf',
        size: 2048576, // 2MB
        type: 'application/pdf',
        url: 'https://example.com/design.pdf',
      } as unknown as AttachmentFile,
    ],
    [
      'image.png',
      {
        name: 'image.png',
        size: 1048576, // 1MB
        type: 'image/png',
        url: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      } as unknown as AttachmentFile,
    ],
  ]),
};

export default () => {
  const bubbleRef = useRef<any>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Assistant message */}
      <Bubble
        avatar={mockMessage.meta!}
        placement="left"
        bubbleRef={bubbleRef}
        originData={mockMessage}
      />

      {/* User message */}
      <Bubble
        avatar={mockUserMessage.meta!}
        placement="right"
        bubbleRef={bubbleRef}
        originData={mockUserMessage}
      />

      {/* Message with files */}
      <Bubble
        avatar={mockFileMessage.meta!}
        placement="left"
        bubbleRef={bubbleRef}
        originData={mockFileMessage}
      />

      {/* Loading message */}
      <Bubble
        avatar={mockMessage.meta!}
        placement="left"
        loading={true}
        bubbleRef={bubbleRef}
        originData={{
          ...mockMessage,
          id: '4',
          content: '正在输入...',
          isFinished: false,
        }}
      />
    </div>
  );
};
