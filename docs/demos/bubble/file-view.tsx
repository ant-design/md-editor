import type { AttachmentFile, MessageBubbleData } from '@ant-design/md-editor';
import { Bubble } from '@ant-design/md-editor';
import React, { useRef } from 'react';

const createMockFile = (
  name: string,
  type: string,
  size: number,
  url: string,
): AttachmentFile => ({
  name,
  type,
  size,
  url,
  lastModified: Date.now(),
  webkitRelativePath: '',
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  bytes: () => Promise.resolve(new Uint8Array(0)),
  text: () => Promise.resolve(''),
  stream: () => new ReadableStream(),
  slice: () => new Blob(),
});

export default () => {
  const bubbleRef = useRef<any>();
  const deps: any[] = [];

  // Mock message with different types of files
  const mockMessage: MessageBubbleData = {
    id: '1',
    role: 'assistant',
    content: '这里是一些不同类型的文件：',
    createAt: Date.now(),
    updateAt: Date.now(),
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Ant Design',
    },
    fileMap: new Map([
      [
        'document.pdf',
        createMockFile(
          'document.pdf',
          'application/pdf',
          1024 * 1024, // 1MB
          'https://example.com/document.pdf',
        ),
      ],
      [
        'image.png',
        createMockFile(
          'image.png',
          'image/png',
          512 * 1024, // 512KB
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        ),
      ],
      [
        'data.json',
        createMockFile(
          'data.json',
          'application/json',
          256 * 1024, // 256KB
          'https://example.com/data.json',
        ),
      ],
    ]),
  };

  // Mock message with a single image
  const mockImageMessage: MessageBubbleData = {
    id: '2',
    role: 'assistant',
    content: '这是一张图片：',
    createAt: Date.now(),
    updateAt: Date.now(),
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Ant Design',
    },
    fileMap: new Map([
      [
        'screenshot.png',
        createMockFile(
          'screenshot.png',
          'image/png',
          1024 * 1024, // 1MB
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        ),
      ],
    ]),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Message with multiple files */}
      <Bubble
        avatar={mockMessage.meta!}
        placement="left"
        deps={deps}
        bubbleRef={bubbleRef}
        originData={mockMessage}
      />

      {/* Message with a single image */}
      <Bubble
        avatar={mockImageMessage.meta!}
        placement="left"
        deps={deps}
        bubbleRef={bubbleRef}
        originData={mockImageMessage}
      />
    </div>
  );
};
