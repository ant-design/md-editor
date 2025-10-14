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
  const [titleStyle, setTitleStyle] = useState<
    'default' | 'status' | 'priority' | 'enhanced'
  >('default');

  // Mock message data
  const mockMessages: MessageBubbleData[] = [
    {
      id: '1',
      role: 'assistant',
      content: `# titleRender 自定义渲染演示

titleRender 允许你完全自定义消息气泡的标题区域，可以：

## 功能特点
- 🎨 **样式定制**：自定义标题的样式和布局
- 🏷️ **状态标签**：显示消息状态（成功、进行中、错误）
- ⭐ **优先级标识**：显示消息优先级（高、中、低）
- 🏷️ **自定义标签**：添加业务相关的标签
- 👤 **角色图标**：显示用户或AI助手图标

通过下方的按钮可以切换不同的标题渲染样式。`,
      createAt: Date.now() - 120000,
      updateAt: Date.now() - 120000,
      isFinished: true,
      meta: {
        avatar:
          'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
        title: 'AI Assistant',
        description: '智能助手 v2.1',
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
      content: '请帮我优化这段代码的性能，有什么建议吗？',
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
      },
    },
    {
      id: '3',
      role: 'assistant',
      content: `## 代码优化建议

### 1. 使用 React.memo
\`\`\`typescript
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>;
});
\`\`\`

### 2. 使用 useCallback
\`\`\`typescript
const handleClick = useCallback(() => {
  // 处理点击事件
}, [dependency]);
\`\`\`

这样可以避免不必要的重渲染。`,
      createAt: Date.now() - 10000,
      updateAt: Date.now() - 10000,
      isFinished: true,
      meta: {
        avatar:
          'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
        title: 'AI Assistant',
        description: '智能助手 v2.1',
      },
      extra: {
        status: 'in_progress',
        priority: 'medium',
        customTags: ['实现指南', 'React'],
        model: 'GPT-4',
        duration: 1800,
        confidence: 0.88,
      },
    },
  ];

  // 默认标题渲染
  const defaultTitleRender = (
    props: BubbleProps,
    defaultDom: React.ReactNode,
  ) => {
    return defaultDom;
  };

  // 带状态标签的标题渲染
  const statusTitleRender = (
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
      </div>
    );
  };

  // 带优先级的标题渲染
  const priorityTitleRender = (
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

        {/* 优先级标签 */}
        {originData?.extra?.priority && (
          <Tag color={originData.extra.priority === 'high' ? 'red' : 'default'}>
            {originData.extra.priority === 'high' ? '🔥 高优先级' : '📋 普通'}
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

  // 增强版标题渲染
  const enhancedTitleRender = (
    props: BubbleProps,
    defaultDom: React.ReactNode,
  ) => {
    const { originData } = props;
    const isAssistant = originData?.role === 'assistant';
    const timeStr = new Date(
      originData?.createAt || Date.now(),
    ).toLocaleTimeString();

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
            src={originData?.meta?.avatar}
            icon={isAssistant ? <RobotOutlined /> : <UserOutlined />}
          />
          <span style={{ fontWeight: 600 }}>{defaultDom}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {originData?.extra?.status && (
            <Badge
              status={
                originData.extra.status === 'success'
                  ? 'success'
                  : originData.extra.status === 'in_progress'
                    ? 'processing'
                    : 'error'
              }
              text={originData.extra.status}
            />
          )}
          {originData?.extra?.duration && (
            <span style={{ fontSize: 12, color: '#666' }}>
              ⏱️ {originData.extra.duration}ms
            </span>
          )}
          {originData?.extra?.confidence && (
            <span style={{ fontSize: 12, color: '#666' }}>
              🎯 {(originData.extra.confidence * 100).toFixed(0)}%
            </span>
          )}
        </div>

        <div style={{ fontSize: 11, color: '#999' }}>{timeStr}</div>
      </div>
    );
  };

  // 获取当前标题渲染函数
  const getTitleRender = () => {
    switch (titleStyle) {
      case 'status':
        return statusTitleRender;
      case 'priority':
        return priorityTitleRender;
      case 'enhanced':
        return enhancedTitleRender;
      default:
        return defaultTitleRender;
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* 控制面板 */}
      <div style={{ marginBottom: 24 }}>
        <h3>🎨 titleRender 自定义标题渲染</h3>
        <p style={{ marginBottom: 16, color: '#666' }}>
          展示如何使用 titleRender 自定义消息气泡的标题区域
        </p>

        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 12, fontWeight: 500 }}>标题样式：</span>
          <Space>
            <Button
              type={titleStyle === 'default' ? 'primary' : 'default'}
              onClick={() => setTitleStyle('default')}
            >
              默认样式
            </Button>
            <Button
              type={titleStyle === 'status' ? 'primary' : 'default'}
              onClick={() => setTitleStyle('status')}
            >
              状态标签
            </Button>
            <Button
              type={titleStyle === 'priority' ? 'primary' : 'default'}
              onClick={() => setTitleStyle('priority')}
            >
              优先级标签
            </Button>
            <Button
              type={titleStyle === 'enhanced' ? 'primary' : 'default'}
              onClick={() => setTitleStyle('enhanced')}
            >
              增强样式
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
          <strong>当前样式：</strong>
          {titleStyle === 'default' && '使用默认标题渲染'}
          {titleStyle === 'status' && '显示状态标签（成功、进行中、错误）'}
          {titleStyle === 'priority' && '显示优先级标签和自定义标签'}
          {titleStyle === 'enhanced' &&
            '显示完整信息（状态、耗时、置信度、时间）'}
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
            bubbleRenderConfig={{
              titleRender: getTitleRender(),
            }}
            markdownRenderConfig={{
              tableConfig: {
                pure: true,
              },
            }}
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
        <h4>🔧 titleRender API 说明</h4>
        <div style={{ marginBottom: 16 }}>
          <h5>函数签名：</h5>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            {`titleRender: (
  props: BubbleProps,
  defaultDom: React.ReactNode
) => React.ReactNode`}
          </pre>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h5>参数说明：</h5>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>
              <strong>props</strong>: 包含 originData 等消息数据的属性对象
            </li>
            <li>
              <strong>defaultDom</strong>: 默认的标题 DOM 元素
            </li>
          </ul>
        </div>

        <div>
          <h5>使用场景：</h5>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>添加状态指示器（成功、失败、进行中）</li>
            <li>显示优先级标识（高、中、低）</li>
            <li>添加自定义标签和图标</li>
            <li>显示时间戳和元数据信息</li>
            <li>自定义标题的样式和布局</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
