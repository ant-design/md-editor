import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { BubbleProps, MessageBubbleData } from '@ant-design/md-editor';
import { Bubble } from '@ant-design/md-editor';
import { Avatar, Badge, Button, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';

export default () => {
  const bubbleRef = useRef<any>();
  const [renderMode, setRenderMode] = useState<
    'title' | 'content' | 'avatar' | 'all'
  >('all');

  // Mock message data with more realistic content
  const mockMessages: MessageBubbleData[] = [
    {
      id: '1',
      role: 'assistant',
      content: `# 代码优化建议

根据你提供的代码，我建议以下几个优化点：

## 1. 性能优化
\`\`\`typescript
// 使用 React.memo 优化组件重渲染
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>;
});
\`\`\`

## 2. 类型安全
确保所有 props 都有明确的 TypeScript 类型定义。

## 3. 错误处理
添加适当的错误边界和异常处理逻辑。`,
      createAt: Date.now() - 120000, // 2分钟前
      updateAt: Date.now() - 120000,
      isFinished: true,
      meta: {
        avatar:
          'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        title: 'Code Assistant',
        description: '代码助手 v2.1',
      },
      extra: {
        status: 'success',
        priority: 'high',
        customTags: ['代码优化', '性能'], // 自定义标签
        model: 'GPT-4',
        duration: 2300,
        confidence: 0.95,
      },
    },
    {
      id: '2',
      role: 'user',
      content: '谢谢你的建议！请问如何实现这些优化？能给出具体的实现步骤吗？',
      createAt: Date.now() - 60000, // 1分钟前
      updateAt: Date.now() - 60000,
      isFinished: true,
      meta: {
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        title: '前端开发者',
        description: '高级工程师',
      },
      extra: {
        location: '上海',
        device: 'Desktop',
      },
    },
    {
      id: '3',
      role: 'assistant',
      content: `## 实现步骤详解

### 步骤 1: React.memo 优化
\`\`\`typescript
import React from 'react';

const ComponentA = React.memo(({ title, onClick }) => (
  <button onClick={onClick}>{title}</button>
));
\`\`\`

### 步骤 2: useCallback 优化回调
\`\`\`typescript
const handleClick = useCallback(() => {
  // 处理点击事件
}, [dependency]);
\`\`\`

这样可以避免不必要的重渲染。`,
      createAt: Date.now() - 10000, // 10秒前
      updateAt: Date.now() - 10000,
      isFinished: true,
      meta: {
        avatar:
          'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        title: 'Code Assistant',
        description: '代码助手 v2.1',
      },
      extra: {
        status: 'in_progress',
        priority: 'medium',
        customTags: ['实现指南', 'React'], // 自定义标签
        model: 'GPT-4',
        duration: 1800,
        confidence: 0.88,
      },
    },
  ];

  // 自定义标题渲染
  const customTitleRender = (
    props: BubbleProps,
    defaultDom: React.ReactNode,
  ) => {
    const { originData } = props;
    const isAssistant = originData?.role === 'assistant';

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* 角色图标 */}
        <span style={{ fontSize: 16 }}>
          {isAssistant ? <RobotOutlined /> : <UserOutlined />}
        </span>

        {/* 原始标题 */}
        <span style={{ flex: 1 }}>{defaultDom}</span>

        {/* 状态标签 */}
        {originData?.extra?.status && (
          <Tag
            color={
              originData.extra.status === 'success'
                ? 'green'
                : originData.extra.status === 'in_progress'
                  ? 'blue'
                  : 'orange'
            }
            icon={
              originData.extra.status === 'success' ? (
                <CheckCircleOutlined />
              ) : originData.extra.status === 'in_progress' ? (
                <ClockCircleOutlined />
              ) : (
                <ExclamationCircleOutlined />
              )
            }
          >
            {originData.extra.status === 'success'
              ? '已完成'
              : originData.extra.status === 'in_progress'
                ? '进行中'
                : '待处理'}
          </Tag>
        )}

        {/* 优先级标签 */}
        {originData?.extra?.priority && (
          <Tag color={originData.extra.priority === 'high' ? 'red' : 'default'}>
            {originData.extra.priority === 'high' ? '高优先级' : '普通'}
          </Tag>
        )}

        {/* 自定义标签 */}
        {originData?.extra?.customTags?.map((tag: string) => (
          <Tag key={tag} color="blue" style={{ fontSize: 12 }}>
            {tag}
          </Tag>
        ))}
      </div>
    );
  };

  // 自定义内容渲染
  const customContentRender = (
    props: BubbleProps,
    defaultDom: React.ReactNode,
  ) => {
    const { originData } = props;
    const loading = false; // 示例中假设不处于加载状态

    if (loading) {
      return (
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            background: '#f8f9fa',
            borderRadius: 8,
            border: '1px dashed #d9d9d9',
          }}
        >
          <div style={{ marginBottom: 8 }}>🤖 AI 正在思考...</div>
          <div style={{ fontSize: 12, color: '#666' }}>预计用时: 2-5秒</div>
        </div>
      );
    }

    return (
      <div>
        {/* 原始内容 */}
        <div style={{ marginBottom: 12 }}>{defaultDom}</div>

        {/* 额外信息 */}
        {originData?.extra && (
          <div
            style={{
              padding: '8px 12px',
              background:
                originData.role === 'assistant' ? '#f6ffed' : '#f0f5ff',
              borderRadius: 6,
              fontSize: 12,
              color: '#666',
              borderLeft: `3px solid ${originData.role === 'assistant' ? '#52c41a' : '#1890ff'}`,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {originData.extra.model && (
                <span>🤖 模型: {originData.extra.model}</span>
              )}
              {originData.extra.duration && (
                <span>⏱️ 耗时: {originData.extra.duration}ms</span>
              )}
              {originData.extra.confidence && (
                <span>
                  📊 置信度: {(originData.extra.confidence * 100).toFixed(0)}%
                </span>
              )}
              {originData.extra.location && (
                <span>📍 位置: {originData.extra.location}</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 自定义头像渲染
  const customAvatarRender = (props: BubbleProps) => {
    const { originData } = props;
    const isOnline = true; // 模拟在线状态

    return (
      <div style={{ position: 'relative' }}>
        <Badge dot color={isOnline ? '#52c41a' : '#d9d9d9'} offset={[-8, 8]}>
          <Avatar
            size={40}
            src={originData?.meta?.avatar}
            icon={
              originData?.role === 'assistant' ? (
                <RobotOutlined />
              ) : (
                <UserOutlined />
              )
            }
            style={{
              border: `2px solid ${originData?.role === 'assistant' ? '#1890ff' : '#52c41a'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </Badge>

        {/* 角色标识 */}
        <div
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background:
              originData?.role === 'assistant' ? '#1890ff' : '#52c41a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8,
            color: 'white',
            border: '2px solid white',
          }}
        >
          {originData?.role === 'assistant' ? '🤖' : '👤'}
        </div>
      </div>
    );
  };

  // 根据模式选择渲染配置
  const getBubbleRenderConfig = () => {
    switch (renderMode) {
      case 'title':
        return { titleRender: customTitleRender };
      case 'content':
        return { contentRender: customContentRender };
      case 'avatar':
        return { avatarRender: customAvatarRender };
      case 'all':
        return {
          titleRender: customTitleRender,
          contentRender: customContentRender,
          avatarRender: customAvatarRender,
        };
      default:
        return {};
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* 控制面板 */}
      <div style={{ marginBottom: 24 }}>
        <h3>🎨 自定义渲染演示</h3>
        <p style={{ marginBottom: 16, color: '#666' }}>
          展示如何使用 titleRender、contentRender、avatarRender 等自定义渲染功能
        </p>

        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 12, fontWeight: 500 }}>渲染模式：</span>
          <Space>
            <Button
              type={renderMode === 'all' ? 'primary' : 'default'}
              onClick={() => setRenderMode('all')}
            >
              全部自定义
            </Button>
            <Button
              type={renderMode === 'title' ? 'primary' : 'default'}
              onClick={() => setRenderMode('title')}
            >
              仅标题
            </Button>
            <Button
              type={renderMode === 'content' ? 'primary' : 'default'}
              onClick={() => setRenderMode('content')}
            >
              仅内容
            </Button>
            <Button
              type={renderMode === 'avatar' ? 'primary' : 'default'}
              onClick={() => setRenderMode('avatar')}
            >
              仅头像
            </Button>
          </Space>
        </div>

        <div
          style={{
            padding: 12,
            background: '#f8f9fa',
            borderRadius: 6,
            fontSize: 14,
            color: '#666',
          }}
        >
          <strong>当前模式：</strong>
          {renderMode === 'all' && '所有部分都使用自定义渲染'}
          {renderMode === 'title' &&
            '仅标题使用自定义渲染（显示状态、优先级、标签）'}
          {renderMode === 'content' && '仅内容使用自定义渲染（显示元数据信息）'}
          {renderMode === 'avatar' &&
            '仅头像使用自定义渲染（显示在线状态、角色标识）'}
        </div>
      </div>

      {/* 消息列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mockMessages.map((message) => (
          <Bubble
            key={message.id}
            avatar={message.meta!}
            placement={message.role === 'user' ? 'right' : 'left'}
            bubbleRef={bubbleRef}
            originData={message}
            bubbleRenderConfig={getBubbleRenderConfig()}
          />
        ))}
      </div>

      {/* 功能说明 */}
      <div
        style={{
          marginTop: 32,
          padding: 16,
          background: '#f8f9fa',
          borderRadius: 8,
        }}
      >
        <h4>🔧 自定义渲染功能</h4>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>
            <strong>titleRender：</strong>
            自定义标题区域，可添加状态标签、优先级等
          </li>
          <li>
            <strong>contentRender：</strong>
            自定义内容区域，可展示额外的元数据信息
          </li>
          <li>
            <strong>avatarRender：</strong>
            自定义头像显示，可添加在线状态、角色标识
          </li>
          <li>
            <strong>组合使用：</strong>可以单独或组合使用多个自定义渲染函数
          </li>
        </ul>
      </div>
    </div>
  );
};
