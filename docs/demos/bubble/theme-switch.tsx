import {
  AttachmentFile,
  Bubble,
  MessageBubbleData,
} from '@ant-design/md-editor';
import { Button, Space, Switch, message } from 'antd';
import React, { useRef, useState } from 'react';

// 创建模拟文件
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

// 主题切换演示数据
const themeMessages: MessageBubbleData[] = [
  {
    id: 'theme-1',
    role: 'assistant',
    content: `# 🎨 主题切换功能演示

Bubble 组件支持多种主题切换，包括：

## 支持的主题
- 🌞 **浅色主题**：适合明亮环境
- 🌙 **深色主题**：适合夜间使用
- 🎯 **自定义主题**：支持自定义颜色配置

你可以通过下方的开关来体验不同的主题效果。`,
    createAt: Date.now() - 300000,
    updateAt: Date.now() - 300000,
    isFinished: true,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Theme Assistant',
      description: '主题切换演示',
    },
    extra: {
      theme: 'light',
      version: '2.0',
    },
  },
  {
    id: 'theme-2',
    role: 'user',
    content: '这些主题看起来很棒！能详细介绍一下每个主题的特点吗？',
    createAt: Date.now() - 240000,
    updateAt: Date.now() - 240000,
    isFinished: true,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: 'UI 设计师',
      description: '视觉设计师',
    },
  },
  {
    id: 'theme-3',
    role: 'assistant',
    content: `## 主题特点详解

### 🌞 浅色主题
- **背景色**：白色或浅灰色
- **文字色**：深色，确保良好的对比度
- **边框色**：浅灰色，提供微妙的边界
- **适用场景**：白天使用、办公环境

### 🌙 深色主题
- **背景色**：深色系，减少眼部疲劳
- **文字色**：浅色，保持良好的可读性
- **边框色**：深灰色，融入整体设计
- **适用场景**：夜间使用、低光环境

### 🎯 自定义主题
- **灵活配置**：支持自定义所有颜色值
- **品牌适配**：可以匹配品牌色彩
- **场景适配**：根据具体需求调整`,
    createAt: Date.now() - 180000,
    updateAt: Date.now() - 180000,
    isFinished: true,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Theme Assistant',
      description: '主题切换演示',
    },
    extra: {
      theme: 'dark',
      version: '2.0',
    },
    fileMap: new Map<string, AttachmentFile>([
      [
        'theme-guide.pdf',
        createMockFile(
          'theme-guide.pdf',
          'application/pdf',
          2048576,
          'https://example.com/theme-guide.pdf',
        ),
      ],
    ]),
  },
];

export default () => {
  const bubbleRef = useRef<any>();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isCustomTheme, setIsCustomTheme] = useState(false);

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

  // 切换主题
  const handleThemeChange = (checked: boolean) => {
    setIsDarkTheme(checked);
    message.success(`已切换到${checked ? '深色' : '浅色'}主题`);
  };

  // 切换自定义主题
  const handleCustomThemeChange = (checked: boolean) => {
    setIsCustomTheme(checked);
    message.success(`已${checked ? '启用' : '禁用'}自定义主题`);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 主题控制区域 */}
      <div style={{ marginBottom: 24 }}>
        <h3>🎨 主题切换控制</h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Space>
              <span>深色主题：</span>
              <Switch
                checked={isDarkTheme}
                onChange={handleThemeChange}
                checkedChildren="深色"
                unCheckedChildren="浅色"
              />
              <Button
                type="primary"
                onClick={() => setIsDarkTheme(!isDarkTheme)}
              >
                切换主题
              </Button>
            </Space>
          </div>
          <div>
            <Space>
              <span>自定义主题：</span>
              <Switch
                checked={isCustomTheme}
                onChange={handleCustomThemeChange}
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
              <Button
                type="primary"
                onClick={() => setIsCustomTheme(!isCustomTheme)}
                disabled={isDarkTheme}
              >
                切换自定义主题
              </Button>
            </Space>
          </div>
        </Space>
        <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
          💡 切换开关或点击按钮来体验不同的主题效果
        </div>
      </div>

      {/* 消息列表 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          backgroundColor: isDarkTheme ? '#1f1f1f' : '#ffffff',
          padding: 16,
          borderRadius: 8,
          border: isDarkTheme ? '1px solid #333' : '1px solid #e8e8e8',
        }}
      >
        {themeMessages.map((message) => (
          <Bubble
            key={message.id}
            avatar={message.meta!}
            placement={message.role === 'assistant' ? 'left' : 'right'}
            bubbleRef={bubbleRef}
            originData={message}
            onLike={handleLike}
            onDisLike={handleDisLike}
            onReply={handleReply}
            style={{
              backgroundColor: isDarkTheme ? '#2a2a2a' : '#ffffff',
              color: isDarkTheme ? '#ffffff' : '#000000',
            }}
          />
        ))}
      </div>

      {/* 功能说明 */}
      <div
        style={{
          marginTop: 32,
          padding: 16,
          backgroundColor: isDarkTheme ? '#2a2a2a' : '#f8f9fa',
          borderRadius: 8,
          fontSize: 14,
          lineHeight: 1.6,
          color: isDarkTheme ? '#ffffff' : '#000000',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>🎨 主题切换功能说明</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>主题切换：</strong>支持浅色和深色主题的快速切换
          </li>
          <li>
            <strong>自定义主题：</strong>支持自定义颜色配置
          </li>
          <li>
            <strong>实时预览：</strong>切换主题时立即看到效果
          </li>
          <li>
            <strong>场景适配：</strong>根据使用环境选择合适的主题
          </li>
          <li>
            <strong>品牌定制：</strong>可以匹配品牌色彩方案
          </li>
          <li>
            <strong>用户体验：</strong>提供更好的视觉体验和可读性
          </li>
        </ul>
      </div>
    </div>
  );
};
