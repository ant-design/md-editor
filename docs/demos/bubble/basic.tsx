import {
  AttachmentFile,
  Bubble,
  MessageBubbleData,
} from '@ant-design/md-editor';
import { Button, Space, message } from 'antd';
import React, { useRef, useState } from 'react';

// 创建模拟文件的辅助函数
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

// Mock data for the demo
const mockMessage: MessageBubbleData = {
  id: '1',
  role: 'assistant',
  content: `# 欢迎使用 Ant Design MD Editor！

我是 Ant Design 聊天助手，可以帮你：

- **回答问题** - 解答技术相关疑问
- **代码示例** - 提供组件使用示例  
- **设计建议** - 给出设计方案建议
- **文档说明** - 解释 API 和功能

你想了解什么呢？`,
  createAt: Date.now() - 60000, // 1分钟前
  updateAt: Date.now() - 60000,
  isFinished: true,
  extra: {
    duration: 1200, // 生成耗时
    model: 'gpt-4',
    tokens: 150,
  },
  meta: {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'Ant Design Assistant',
    description: 'AI 助手',
  },
};

const mockUserMessage: MessageBubbleData = {
  id: '2',
  role: 'user',
  content: '你好！我想了解 Bubble 组件的基本用法和特性。',
  createAt: Date.now() - 30000, // 30秒前
  updateAt: Date.now() - 30000,
  isFinished: true,
  meta: {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: '开发者',
    description: '前端工程师',
  },
};

const mockFileMessage: MessageBubbleData = {
  id: '3',
  role: 'assistant',
  content: `## Bubble 组件功能文档

Bubble 组件是一个功能丰富的聊天气泡组件，支持：

- 多种消息类型（文本、文件、图片等）
- 自定义渲染配置
- 左右布局切换
- 文件附件展示

以下是相关的设计文档和示例图片：`,
  createAt: Date.now() - 10000, // 10秒前
  updateAt: Date.now() - 10000,
  isFinished: true,
  extra: {
    duration: 800,
    model: 'gpt-4',
    tokens: 88,
  },
  meta: {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'Ant Design Assistant',
    description: 'AI 助手',
  },
  fileMap: new Map<string, AttachmentFile>([
    [
      'bubble-design-spec.pdf',
      createMockFile(
        'bubble-design-spec.pdf',
        'application/pdf',
        2048576, // 2MB
        'https://example.com/bubble-design-spec.pdf',
      ),
    ],
    [
      'component-preview.png',
      createMockFile(
        'component-preview.png',
        'image/png',
        1048576, // 1MB
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      ),
    ],
    [
      'api-reference.json',
      createMockFile(
        'api-reference.json',
        'application/json',
        512000, // 512KB
        'https://example.com/api-reference.json',
      ),
    ],
  ]),
};

export default () => {
  const bubbleRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);

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

  // 模拟生成新消息
  const simulateNewMessage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.success('新消息生成完成！');
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 操作区域 */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" onClick={simulateNewMessage}>
            模拟生成新消息
          </Button>
          <Button onClick={() => setIsLoading(!isLoading)} disabled={isLoading}>
            切换加载状态
          </Button>
        </Space>
        <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
          💡 点击消息下方的操作按钮可以体验交互功能
        </div>
      </div>

      {/* 消息列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Assistant message */}
        <Bubble
          avatar={mockMessage.meta!}
          placement="left"
          bubbleRef={bubbleRef}
          originData={mockMessage}
          onLike={handleLike}
          onDisLike={handleDisLike}
          onReply={handleReply}
        />

        {/* User message */}
        <Bubble
          avatar={mockUserMessage.meta!}
          placement="right"
          bubbleRef={bubbleRef}
          originData={mockUserMessage}
          onReply={handleReply}
        />

        {/* Message with files */}
        <Bubble
          avatar={mockFileMessage.meta!}
          placement="left"
          bubbleRef={bubbleRef}
          originData={mockFileMessage}
          onLike={handleLike}
          onDisLike={handleDisLike}
          onReply={handleReply}
        />

        {/* Loading message */}
        <Bubble
          avatar={mockMessage.meta!}
          placement="left"
          loading={isLoading}
          bubbleRef={bubbleRef}
          originData={{
            ...mockMessage,
            id: '4',
            content: isLoading ? '正在思考中...' : '点击上方按钮体验加载状态',
            isFinished: !isLoading,
          }}
          onLike={handleLike}
          onDisLike={handleDisLike}
        />
      </div>

      {/* 功能说明 */}
      <div
        style={{
          marginTop: 32,
          padding: 16,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>🚀 基础功能演示</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>消息布局：</strong>支持左右两种布局，适配不同角色
          </li>
          <li>
            <strong>丰富内容：</strong>支持 Markdown 格式、文件附件展示
          </li>
          <li>
            <strong>加载状态：</strong>支持消息生成过程中的加载动画
          </li>
          <li>
            <strong>交互操作：</strong>点赞、点踩、回复等操作反馈
          </li>
          <li>
            <strong>文件支持：</strong>自动识别并展示不同类型的文件
          </li>
          <li>
            <strong>元数据：</strong>头像、标题、描述等信息展示
          </li>
        </ul>
      </div>
    </div>
  );
};
