import {
  AttachmentFile,
  Bubble,
  MessageBubbleData,
} from '@ant-design/agentic-ui';
import { Button, message, Space, Switch } from 'antd';
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

const mockFileMessage: MessageBubbleData = {
  id: '2',
  role: 'assistant',
  content: `## 文件上传加载状态演示

当文件正在上传或处理时，Bubble 组件会显示加载状态。

支持的文件类型：
- 图片文件 (PNG, JPG, GIF, SVG)
- 文档文件 (PDF, DOC, TXT, MD)
- 代码文件 (JS, TS, PY, JAVA)
- 其他格式文件

文件上传完成后，用户可以预览和下载文件。`,
  createAt: Date.now() - 30000,
  updateAt: Date.now() - 30000,
  isFinished: true,
  extra: {
    duration: 800,
    model: 'gpt-4',
    tokens: 88,
  },
  meta: {
    avatar:
      'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
    title: 'Ant Design Assistant',
    description: 'AI 助手',
  },
  fileMap: new Map<string, AttachmentFile>([
    [
      'example-document.pdf',
      createMockFile(
        'example-document.pdf',
        'application/pdf',
        2048576,
        'https://example.com/example-document.pdf',
      ),
    ],
    [
      'preview-image.png',
      createMockFile(
        'preview-image.png',
        'image/png',
        1048576,
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      ),
    ],
    [
      'code-example.js',
      createMockFile(
        'code-example.js',
        'application/javascript',
        512000,
        'https://example.com/code-example.js',
      ),
    ],
  ]),
};

export default () => {
  const bubbleRef = useRef<any>();
  const [isFileLoading, setIsFileLoading] = useState(false);

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

  // 模拟文件上传过程
  const simulateFileUpload = () => {
    setIsFileLoading(true);
    setTimeout(() => {
      setIsFileLoading(false);
      message.success('文件上传完成！');
    }, 4000);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 控制区域 */}
      <div style={{ marginBottom: 24 }}>
        <h3>🎯 文件加载状态控制</h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Space>
              <span>文件加载状态：</span>
              <Switch
                checked={isFileLoading}
                onChange={setIsFileLoading}
                checkedChildren="上传中"
                unCheckedChildren="已完成"
              />
              <Button type="primary" onClick={simulateFileUpload}>
                模拟上传过程
              </Button>
            </Space>
          </div>
        </Space>
        <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
          💡 切换开关或点击按钮来体验文件上传加载状态
        </div>
      </div>

      {/* 消息列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 文件消息加载状态 */}
        <Bubble
          avatar={mockFileMessage.meta!}
          placement="left"
          bubbleRef={bubbleRef}
          markdownRenderConfig={{
            tableConfig: {
              pure: true,
            },
          }}
          originData={{
            ...mockFileMessage,
            typing: isFileLoading,
            content: isFileLoading
              ? '正在处理文件，请稍候...'
              : mockFileMessage.content,
            isFinished: !isFileLoading,
          }}
          onLike={handleLike}
          onDisLike={handleDisLike}
          onReply={handleReply}
        />

        {/* 用户消息（对比） */}
        <Bubble
          markdownRenderConfig={{
            tableConfig: {
              pure: true,
            },
          }}
          avatar={{
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            title: '开发者',
            description: '前端工程师',
          }}
          placement="right"
          bubbleRef={bubbleRef}
          originData={{
            id: '3',
            role: 'user',
            content: '请展示一下文件上传加载状态的效果',
            createAt: Date.now() - 10000,
            updateAt: Date.now() - 10000,
            isFinished: true,
            meta: {
              avatar:
                'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
              title: '开发者',
              description: '前端工程师',
            },
          }}
          onReply={handleReply}
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
        <h4 style={{ margin: '0 0 12px 0' }}>📁 文件加载状态功能说明</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>文件上传：</strong>支持多种文件类型的上传和预览
          </li>
          <li>
            <strong>加载动画：</strong>文件处理期间显示动态加载指示器
          </li>
          <li>
            <strong>进度显示：</strong>显示文件上传和处理进度
          </li>
          <li>
            <strong>文件预览：</strong>支持图片、文档等文件的在线预览
          </li>
          <li>
            <strong>下载功能：</strong>用户可以下载已上传的文件
          </li>
          <li>
            <strong>错误处理：</strong>文件上传失败时的错误提示和重试
          </li>
        </ul>
      </div>

      {/* 支持的文件类型 */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: '#fff7e6',
          borderRadius: 8,
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>📋 支持的文件类型</h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}
        >
          <div>
            <strong>图片文件：</strong>
            <div style={{ fontSize: 12, color: '#666' }}>
              PNG, JPG, GIF, SVG, WebP
            </div>
          </div>
          <div>
            <strong>文档文件：</strong>
            <div style={{ fontSize: 12, color: '#666' }}>
              PDF, DOC, TXT, MD, RTF
            </div>
          </div>
          <div>
            <strong>代码文件：</strong>
            <div style={{ fontSize: 12, color: '#666' }}>
              JS, TS, PY, JAVA, C++, C#
            </div>
          </div>
          <div>
            <strong>数据文件：</strong>
            <div style={{ fontSize: 12, color: '#666' }}>
              JSON, CSV, XML, YAML
            </div>
          </div>
        </div>
      </div>

      {/* API 说明 */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: '#e6f7ff',
          borderRadius: 8,
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>📖 API 说明</h4>
        <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
          <div>
            <strong>fileMap:</strong> Map&lt;string, File&gt; - 文件附件映射
          </div>
          <div>
            <strong>loading:</strong> boolean - 控制是否显示加载状态
          </div>
          <div>
            <strong>typing:</strong> boolean - 控制是否显示打字效果
          </div>
          <div>
            <strong>isFinished:</strong> boolean - 文件处理是否完成
          </div>
        </div>
      </div>
    </div>
  );
};
