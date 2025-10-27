import type { MessageBubbleData } from '@ant-design/agentic-ui';
import { Bubble } from '@ant-design/agentic-ui';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';

export default () => {
  const bubbleRef = useRef<any>();
  const [renderMode, setRenderMode] = useState<
    'default' | 'custom' | 'enhanced'
  >('default');

  // Mock message data
  const mockMessages: MessageBubbleData[] = [
    {
      id: '1',
      role: 'assistant',
      content: `# 自定义标题渲染演示

Bubble 组件支持自定义标题渲染，可以：

## 功能特点
- 🎨 **样式定制**：自定义标题的样式和布局
- 🏷️ **标签显示**：添加状态标签、优先级等
- 👤 **角色标识**：显示用户角色和状态
- ⏰ **时间信息**：显示消息时间戳
- 📊 **统计信息**：显示消息统计信息

你可以通过下方的按钮切换不同的渲染模式。`,
      createAt: Date.now() - 120000,
      updateAt: Date.now() - 120000,
      isFinished: true,
      meta: {
        avatar:
          'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
        title: 'Code Assistant',
        description: '代码助手 v2.1',
      },
      extra: {
        status: 'success',
        priority: 'high',
        customTags: ['代码优化', '性能'],
        model: 'GPT-4',
        duration: 2300,
        confidence: 0.95,
      },
    },
    {
      id: '2',
      role: 'user',
      content: '这个功能很实用！能演示一下不同的标题渲染效果吗？',
      createAt: Date.now() - 60000,
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
        online: true,
      },
    },
    {
      id: '3',
      role: 'assistant',
      content: `## 自定义标题渲染示例

### 默认模式
显示基本的标题和描述信息。

### 自定义模式
添加状态标签、优先级标识等。

### 增强模式
包含更多详细信息，如时间戳、统计信息等。

\`\`\`typescript
// 自定义标题渲染函数
const customTitleRender = (props: any) => {
  const { meta, extra } = props.originData;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>{meta.title}</span>
      {extra?.status && (
        <Tag color={extra.status === 'success' ? 'green' : 'red'}>
          {extra.status}
        </Tag>
      )}
      {extra?.priority && (
        <Tag color="orange">{extra.priority}</Tag>
      )}
    </div>
  );
};
\`\`\``,
      createAt: Date.now() - 10000,
      updateAt: Date.now() - 10000,
      isFinished: true,
      meta: {
        avatar:
          'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
        title: 'Code Assistant',
        description: '代码助手 v2.1',
      },
      extra: {
        status: 'processing',
        priority: 'medium',
        model: 'GPT-4',
        duration: 1500,
        confidence: 0.88,
      },
    },
  ];

  // 默认标题渲染
  const defaultTitleRender = (props: any) => {
    const { meta } = props.originData;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>{meta.title}</span>
        <span style={{ color: '#666', fontSize: 12 }}>{meta.description}</span>
      </div>
    );
  };

  // 自定义标题渲染
  const customTitleRender = (props: any) => {
    const { meta, extra } = props.originData;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 600 }}>{meta.title}</span>
        {extra?.status && (
          <Tag
            color={
              extra.status === 'success'
                ? 'green'
                : extra.status === 'processing'
                  ? 'blue'
                  : 'red'
            }
            icon={
              extra.status === 'success' ? (
                <CheckCircleOutlined />
              ) : extra.status === 'processing' ? (
                <ClockCircleOutlined />
              ) : (
                <ExclamationCircleOutlined />
              )
            }
          >
            {extra.status}
          </Tag>
        )}
        {extra?.priority && (
          <Tag
            color={
              extra.priority === 'high'
                ? 'red'
                : extra.priority === 'medium'
                  ? 'orange'
                  : 'green'
            }
          >
            {extra.priority}
          </Tag>
        )}
        {extra?.model && <Tag color="purple">{extra.model}</Tag>}
      </div>
    );
  };

  // 增强标题渲染
  const enhancedTitleRender = (props: any) => {
    const { meta, extra, createAt } = props.originData;
    const timeStr = new Date(createAt).toLocaleTimeString();

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Avatar
            size="small"
            src={meta.avatar}
            icon={
              meta.title.includes('Assistant') ? (
                <RobotOutlined />
              ) : (
                <UserOutlined />
              )
            }
          />
          <span style={{ fontWeight: 600 }}>{meta.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {extra?.status && (
            <Badge
              status={
                extra.status === 'success'
                  ? 'success'
                  : extra.status === 'processing'
                    ? 'processing'
                    : 'error'
              }
              text={extra.status}
            />
          )}
          {extra?.duration && (
            <span style={{ fontSize: 12, color: '#666' }}>
              ⏱️ {extra.duration}ms
            </span>
          )}
          {extra?.confidence && (
            <span style={{ fontSize: 12, color: '#666' }}>
              🎯 {(extra.confidence * 100).toFixed(0)}%
            </span>
          )}
        </div>

        <div style={{ fontSize: 11, color: '#999' }}>{timeStr}</div>
      </div>
    );
  };

  // 获取当前标题渲染函数
  const getTitleRender = () => {
    switch (renderMode) {
      case 'custom':
        return customTitleRender;
      case 'enhanced':
        return enhancedTitleRender;
      default:
        return defaultTitleRender;
    }
  };

  // 处理点赞/点踩事件
  const handleLike = async (bubble: MessageBubbleData) => {
    console.log('点赞消息:', bubble);
  };

  const handleDisLike = async (bubble: MessageBubbleData) => {
    console.log('点踩消息:', bubble);
  };

  // 处理回复事件
  const handleReply = (content: string) => {
    console.log('回复内容:', content);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 控制区域 */}
      <div style={{ marginBottom: 24 }}>
        <h3>🎨 自定义标题渲染控制</h3>
        <Space>
          <Button
            type={renderMode === 'default' ? 'primary' : 'default'}
            onClick={() => setRenderMode('default')}
          >
            默认模式
          </Button>
          <Button
            type={renderMode === 'custom' ? 'primary' : 'default'}
            onClick={() => setRenderMode('custom')}
          >
            自定义模式
          </Button>
          <Button
            type={renderMode === 'enhanced' ? 'primary' : 'default'}
            onClick={() => setRenderMode('enhanced')}
          >
            增强模式
          </Button>
        </Space>
        <div style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
          💡 切换按钮来体验不同的标题渲染效果
        </div>
      </div>

      {/* 消息列表 */}
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
            placement={message.role === 'assistant' ? 'left' : 'right'}
            bubbleRef={bubbleRef}
            originData={message}
            onLike={handleLike}
            onDisLike={handleDisLike}
            onReply={handleReply}
            bubbleRenderConfig={{
              titleRender: getTitleRender(),
            }}
          />
        ))}
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
        <h4 style={{ margin: '0 0 12px 0' }}>🎨 自定义标题渲染功能说明</h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>默认模式：</strong>显示基本的标题和描述信息
          </li>
          <li>
            <strong>自定义模式：</strong>添加状态标签、优先级标识等
          </li>
          <li>
            <strong>增强模式：</strong>包含头像、时间戳、统计信息等
          </li>
          <li>
            <strong>灵活配置：</strong>支持完全自定义的标题渲染逻辑
          </li>
          <li>
            <strong>状态显示：</strong>支持成功、处理中、错误等状态
          </li>
          <li>
            <strong>信息丰富：</strong>可以显示模型、耗时、置信度等信息
          </li>
        </ul>
      </div>
    </div>
  );
};
