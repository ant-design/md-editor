import { Bubble, MessageBubbleData } from '@ant-design/agentic-ui';
import {
  HeartOutlined,
  ShareAltOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';

const mockMessages: MessageBubbleData[] = [
  {
    id: '1',
    content: '你好！我是AI助手，请问有什么可以帮助你的吗？',
    role: 'assistant' as const,
    createAt: 1703123396789, // 2023-12-21 10:29:56
    updateAt: 1703123396789,
    isFinished: true,
    isAborted: false,
    extra: {},
    meta: {
      avatar:
        'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
      title: 'AI 助手',
    },
  },
  {
    id: '2',
    content: '帮我写一首关于春天的诗',
    role: 'user' as const,
    createAt: 1703123426789, // 2023-12-21 10:30:26
    updateAt: 1703123426789,
    isFinished: true,
    isAborted: false,
    extra: {},
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: '用户',
    },
  },
  {
    id: '3',
    content: `# 春日吟

春风轻抚绿柳梢，  
花开满园香气飘。  
燕子归来筑新巢，  
万物复苏生机昭。

**春天的特色：**
- 🌸 樱花盛开
- 🌱 万物复苏  
- 🐦 鸟语花香
- ☀️ 阳光明媚

这首诗描绘了春天的美好景象，表达了对新生活的向往和希望。`,
    role: 'assistant' as const,
    createAt: 1703123456789, // 2023-12-21 10:30:56
    updateAt: 1703123456789,
    isFinished: true,
    isAborted: false,
    extra: {},
    meta: {
      avatar:
        'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
      title: 'AI 助手',
    },
  },
];

export default function ExtraRenderDemo() {
  const bubbleRef = useRef<any>();
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [customMode, setCustomMode] = useState<
    'default' | 'custom' | 'disabled'
  >('default');

  const handleLike = (messageId: string) => {
    setLikes((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const handleFavorite = (messageId: string) => {
    setFavorites((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const handleShare = (message: any) => {
    navigator.clipboard.writeText(message.content);
    alert('内容已复制到剪贴板！');
  };

  // 自定义额外操作渲染函数
  const customExtraRender = (props: any, defaultDom: React.ReactNode) => {
    const messageId = props.id;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 0',
          borderTop: '1px solid #f0f0f0',
          marginTop: 8,
        }}
      >
        {/* 自定义操作按钮 */}
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<HeartOutlined />}
            style={{
              color: likes[messageId] ? '#ff4d4f' : '#8c8c8c',
            }}
            onClick={() => handleLike(messageId)}
          >
            {likes[messageId] ? '已点赞' : '点赞'}
          </Button>

          <Button
            type="text"
            size="small"
            icon={<StarOutlined />}
            style={{
              color: favorites[messageId] ? '#faad14' : '#8c8c8c',
            }}
            onClick={() => handleFavorite(messageId)}
          >
            {favorites[messageId] ? '已收藏' : '收藏'}
          </Button>

          <Button
            type="text"
            size="small"
            icon={<ShareAltOutlined />}
            onClick={() => handleShare(props.originData)}
          >
            分享
          </Button>
        </Space>

        {/* 显示默认操作按钮 */}
        <div style={{ marginLeft: 'auto' }}>{defaultDom}</div>

        {/* 状态标签 */}
        <div style={{ display: 'flex', gap: 4 }}>
          {likes[messageId] && <Tag color="red">已点赞</Tag>}
          {favorites[messageId] && <Tag color="orange">已收藏</Tag>}
        </div>
      </div>
    );
  };

  const getBubbleRenderConfig = () => {
    switch (customMode) {
      case 'custom':
        return { extraRender: customExtraRender };
      case 'disabled':
        return { extraRender: false as const };
      default:
        return {};
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2>Bubble extraRender 自定义功能演示</h2>
        <p>
          此演示展示如何使用 <code>extraRender</code>{' '}
          功能自定义气泡消息的额外操作区域。
        </p>

        <Space style={{ marginBottom: 16 }}>
          <span>操作模式：</span>
          <Button
            type={customMode === 'default' ? 'primary' : 'default'}
            onClick={() => setCustomMode('default')}
          >
            默认模式
          </Button>
          <Button
            type={customMode === 'custom' ? 'primary' : 'default'}
            onClick={() => setCustomMode('custom')}
          >
            自定义模式
          </Button>
          <Button
            type={customMode === 'disabled' ? 'primary' : 'default'}
            onClick={() => setCustomMode('disabled')}
          >
            禁用额外操作
          </Button>
        </Space>

        <div style={{ fontSize: '13px', color: '#666', marginBottom: 16 }}>
          <strong>当前模式说明：</strong>
          {customMode === 'default' &&
            ' 使用默认的额外操作区域（点赞、点踩、复制等）'}
          {customMode === 'custom' &&
            ' 使用自定义的额外操作区域（点赞、收藏、分享 + 默认操作）'}
          {customMode === 'disabled' && ' 完全禁用额外操作区域'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mockMessages.map((message) => (
          <Bubble
            key={message.id}
            avatar={message.meta!}
            markdownRenderConfig={{
              tableConfig: {
                pure: true,
              },
            }}
            originData={message}
            placement={message.role === 'user' ? 'right' : 'left'}
            bubbleRef={bubbleRef}
            pure
            bubbleRenderConfig={getBubbleRenderConfig()}
            onLike={async (data) => {
              console.log('点赞:', data);
            }}
            onDisLike={async (data) => {
              console.log('点踩:', data);
            }}
            onReply={(content) => {
              console.log('回复:', content);
            }}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: 32,
          padding: 16,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
        }}
      >
        <h4>代码示例：</h4>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {`// 自定义 extraRender 函数
const customExtraRender = (props, defaultDom) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* 自定义操作按钮 */}
      <Button icon={<HeartOutlined />} onClick={() => handleLike(props.id)}>
        点赞
      </Button>
      <Button icon={<StarOutlined />} onClick={() => handleFavorite(props.id)}>
        收藏
      </Button>
      
      {/* 包含默认操作按钮 */}
      {defaultDom}
    </div>
  );
};

// 使用自定义 extraRender
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    extraRender: customExtraRender  // 自定义渲染
    // extraRender: false           // 或者禁用额外操作
  }}
/>`}
        </pre>
      </div>
    </div>
  );
}
