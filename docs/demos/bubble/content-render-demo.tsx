import type { BubbleProps, MessageBubbleData } from '@ant-design/agentic-ui';
import { Bubble } from '@ant-design/agentic-ui';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Progress, Space, Spin, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { BubbleDemoCard } from './BubbleDemoCard';

export default () => {
  const bubbleRef = useRef<any>();
  const [contentStyle, setContentStyle] = useState<
    'default' | 'metadata' | 'loading' | 'enhanced'
  >('default');

  // Mock message data
  const mockMessages: MessageBubbleData[] = [
    {
      id: '1',
      role: 'assistant',
      content: `# contentRender 自定义内容渲染演示

contentRender 允许你完全自定义消息气泡的内容区域，可以：

## 功能特点
- 🎨 **样式定制**：自定义内容的样式和布局
- 📊 **元数据显示**：显示模型信息、耗时、置信度等
- ⏳ **加载状态**：自定义加载中的显示效果
- 🏷️ **标签展示**：显示业务相关的标签信息
- 📍 **位置信息**：显示用户位置和设备信息

通过下方的按钮可以切换不同的内容渲染样式。`,
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
      content: '请帮我分析这段代码的性能问题，并提供优化建议。',
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
        browser: 'Chrome 120',
      },
    },
    {
      id: '3',
      role: 'assistant',
      content: `## 性能分析报告

### 问题识别
1. **内存泄漏**：事件监听器未正确清理
2. **重复渲染**：组件缺少 memo 优化
3. **大列表渲染**：未使用虚拟滚动

### 优化建议
\`\`\`typescript
// 使用 React.memo 优化
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>;
});

// 使用 useCallback 优化回调
const handleClick = useCallback(() => {
  // 处理点击事件
}, [dependency]);
\`\`\`

### 预期效果
- 性能提升 40%
- 内存使用减少 30%
- 渲染时间缩短 50%`,
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
        customTags: ['性能分析', 'React'],
        model: 'GPT-4',
        duration: 1800,
        confidence: 0.88,
        progress: 75,
      },
    },
  ];

  // 默认内容渲染
  const defaultContentRender = (
    props: BubbleProps,
    defaultDom: React.ReactNode,
  ) => {
    return defaultDom;
  };

  // 带元数据的内容渲染
  const metadataContentRender = (
    props: BubbleProps,
    defaultDom: React.ReactNode,
  ) => {
    const { originData } = props;

    return (
      <div>
        {/* 原始内容 */}
        <div style={{ marginBottom: 12 }}>{defaultDom}</div>

        {/* 元数据信息 */}
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
              {originData.extra.device && (
                <span>💻 设备: {originData.extra.device}</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 加载状态的内容渲染
  const loadingContentRender = (
    props: BubbleProps,
    defaultDom: React.ReactNode,
  ) => {
    const { originData } = props;
    const isLoading = originData?.extra?.status === 'in_progress';

    if (isLoading) {
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
          <div style={{ marginBottom: 12 }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            🤖 AI 正在思考...
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
            预计用时: 2-5秒
          </div>
          {originData?.extra?.progress && (
            <Progress
              percent={originData.extra.progress}
              size="small"
              status="active"
              style={{ maxWidth: 200, margin: '0 auto' }}
            />
          )}
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginBottom: 12 }}>{defaultDom}</div>
        {originData?.extra && (
          <div
            style={{
              padding: '8px 12px',
              background: '#f6ffed',
              borderRadius: 6,
              fontSize: 12,
              color: '#666',
              borderLeft: '3px solid #52c41a',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span>✅ 处理完成</span>
              {originData.extra.duration && (
                <span>⏱️ 耗时: {originData.extra.duration}ms</span>
              )}
              {originData.extra.confidence && (
                <span>
                  📊 置信度: {(originData.extra.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 增强版内容渲染
  const enhancedContentRender = (
    props: BubbleProps,
    defaultDom: React.ReactNode,
  ) => {
    const { originData } = props;
    const isLoading = originData?.extra?.status === 'in_progress';

    return (
      <div>
        {/* 原始内容 */}
        <div style={{ marginBottom: 16 }}>{defaultDom}</div>

        {/* 增强信息展示 */}
        {originData?.extra && (
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #f6ffed 0%, #f0f5ff 100%)',
              borderRadius: 8,
              border: '1px solid #d9d9d9',
            }}
          >
            {/* 状态和进度 */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {isLoading ? '🔄 处理中' : '✅ 已完成'}
                </span>
                {originData.extra.priority && (
                  <Tag
                    color={
                      originData.extra.priority === 'high' ? 'red' : 'default'
                    }
                  >
                    {originData.extra.priority === 'high'
                      ? '🔥 高优先级'
                      : '📋 普通'}
                  </Tag>
                )}
              </div>
              {isLoading && originData.extra.progress && (
                <Progress
                  percent={originData.extra.progress}
                  size="small"
                  status="active"
                  strokeColor="#1890ff"
                />
              )}
            </div>

            {/* 详细信息网格 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                fontSize: 12,
              }}
            >
              {originData.extra.model && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>🤖</span>
                  <span>模型: {originData.extra.model}</span>
                </div>
              )}
              {originData.extra.duration && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>⏱️</span>
                  <span>耗时: {originData.extra.duration}ms</span>
                </div>
              )}
              {originData.extra.confidence && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>📊</span>
                  <span>
                    置信度: {(originData.extra.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}
              {originData.extra.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>📍</span>
                  <span>位置: {originData.extra.location}</span>
                </div>
              )}
              {originData.extra.device && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>💻</span>
                  <span>设备: {originData.extra.device}</span>
                </div>
              )}
              {originData.extra.browser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>🌐</span>
                  <span>浏览器: {originData.extra.browser}</span>
                </div>
              )}
            </div>

            {/* 自定义标签 */}
            {originData.extra.customTags &&
              originData.extra.customTags.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: '1px solid #d9d9d9',
                  }}
                >
                  <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
                    标签:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {originData.extra.customTags.map((tag: string) => (
                      <Tag key={tag} color="blue" style={{ fontSize: 11 }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    );
  };

  // 获取当前内容渲染函数
  const getContentRender = () => {
    switch (contentStyle) {
      case 'metadata':
        return metadataContentRender;
      case 'loading':
        return loadingContentRender;
      case 'enhanced':
        return enhancedContentRender;
      default:
        return defaultContentRender;
    }
  };

  return (
    <BubbleDemoCard
      title="🎨 contentRender 自定义内容渲染"
      description="展示如何使用 contentRender 自定义消息气泡的内容区域"
    >
      {/* 控制面板 */}
      <div style={{ padding: 24, paddingBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 12, fontWeight: 500 }}>内容样式：</span>
          <Space>
            <Button
              type={contentStyle === 'default' ? 'primary' : 'default'}
              onClick={() => setContentStyle('default')}
            >
              默认样式
            </Button>
            <Button
              type={contentStyle === 'metadata' ? 'primary' : 'default'}
              onClick={() => setContentStyle('metadata')}
            >
              元数据展示
            </Button>
            <Button
              type={contentStyle === 'loading' ? 'primary' : 'default'}
              onClick={() => setContentStyle('loading')}
            >
              加载状态
            </Button>
            <Button
              type={contentStyle === 'enhanced' ? 'primary' : 'default'}
              onClick={() => setContentStyle('enhanced')}
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
          {contentStyle === 'default' && '使用默认内容渲染'}
          {contentStyle === 'metadata' &&
            '显示元数据信息（模型、耗时、置信度等）'}
          {contentStyle === 'loading' && '显示加载状态和进度条'}
          {contentStyle === 'enhanced' &&
            '显示完整的增强信息（状态、进度、详细信息、标签）'}
        </div>
      </div>

      {/* 消息列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mockMessages.map((message) => (
          <Bubble
            key={message.id}
            markdownRenderConfig={{
              tableConfig: {
                pure: true,
              },
            }}
            avatar={message.meta!}
            placement={message.role === 'user' ? 'right' : 'left'}
            bubbleRef={bubbleRef}
            originData={message}
            bubbleRenderConfig={{
              contentRender: getContentRender(),
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
        <h4>🔧 contentRender API 说明</h4>
        <div style={{ marginBottom: 16 }}>
          <h5>函数签名：</h5>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            {`contentRender: (
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
              <strong>defaultDom</strong>: 默认的内容 DOM 元素
            </li>
          </ul>
        </div>

        <div>
          <h5>使用场景：</h5>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>显示元数据信息（模型、耗时、置信度）</li>
            <li>自定义加载状态和进度显示</li>
            <li>添加用户位置和设备信息</li>
            <li>显示业务相关的标签和分类</li>
            <li>自定义内容的样式和布局</li>
          </ul>
        </div>
      </div>
    </BubbleDemoCard>
  );
};
