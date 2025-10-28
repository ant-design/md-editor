import { BaseMarkdownEditor } from '@ant-design/agentic-ui';
import { ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Card, Progress, Space, Spin, Switch, Typography } from 'antd';
import React, { useState } from 'react';

const { Title, Paragraph, Text } = Typography;

// 生成长内容用于测试
const generateLongContent = () => {
  const sections = [];
  for (let i = 1; i <= 20; i++) {
    sections.push(`
## 章节 ${i}

这是一个很长的章节内容，包含多个段落和元素。

### 子标题 ${i}.1

这里是一些详细的内容描述，用来测试懒加载效果。

- 列表项 1
- 列表项 2
- 列表项 3

### 子标题 ${i}.2

更多内容...

> 这是一个引用块，用来展示不同类型的元素。

\`\`\`javascript
// 代码块示例
function example() {
  console.log('Hello World');
}
\`\`\`

**粗体文本** 和 *斜体文本* 以及 [链接](https://example.com)

---

`);
  }
  return sections.join('');
};

// 自定义占位符组件
const CustomPlaceholder: React.FC<{
  height: number;
  style: React.CSSProperties;
  isIntersecting: boolean;
  elementInfo?: {
    type: string;
    index: number;
    total: number;
  };
}> = ({ height, style, isIntersecting, elementInfo }) => {
  const progress = elementInfo
    ? Math.round((elementInfo.index / elementInfo.total) * 100)
    : 0;

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isIntersecting
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: '8px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景动画 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'shimmer 2s infinite',
        }}
      />

      {/* 内容 */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />
          }
        />
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 500 }}>
          {isIntersecting ? '即将显示内容...' : '内容加载中...'}
        </div>

        {elementInfo && (
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            <Text style={{ color: 'white' }}>
              {elementInfo.type} - {elementInfo.index + 1}/{elementInfo.total}
            </Text>
            <Progress
              percent={progress}
              size="small"
              showInfo={false}
              strokeColor="white"
              trailColor="rgba(255, 255, 255, 0.3)"
              style={{ marginTop: 4, width: 100 }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

// 简单的占位符组件
const SimplePlaceholder: React.FC<{
  height: number;
  style: React.CSSProperties;
  isIntersecting: boolean;
}> = ({ height, style, isIntersecting }) => (
  <div
    style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      border: '2px dashed #d9d9d9',
      borderRadius: '4px',
      color: '#666',
    }}
  >
    <Space>
      <ClockCircleOutlined />
      <span>{isIntersecting ? '即将显示...' : '加载中...'}</span>
    </Space>
  </div>
);

// 骨架屏占位符组件
const SkeletonPlaceholder: React.FC<{
  height: number;
  style: React.CSSProperties;
  isIntersecting: boolean;
}> = ({ height, style, isIntersecting }) => (
  <div
    style={{
      ...style,
      padding: '16px',
      background: '#fafafa',
      borderRadius: '6px',
    }}
  >
    <div
      style={{
        height: '20px',
        background: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '12px',
        animation: isIntersecting ? 'pulse 1.5s ease-in-out infinite' : 'none',
      }}
    />
    <div
      style={{
        height: '16px',
        background: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '8px',
        width: '80%',
        animation: isIntersecting
          ? 'pulse 1.5s ease-in-out infinite 0.2s'
          : 'none',
      }}
    />
    <div
      style={{
        height: '16px',
        background: '#e0e0e0',
        borderRadius: '4px',
        width: '60%',
        animation: isIntersecting
          ? 'pulse 1.5s ease-in-out infinite 0.4s'
          : 'none',
      }}
    />

    <style jsx>{`
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
);

export default () => {
  const [placeholderType, setPlaceholderType] = useState<
    'default' | 'custom' | 'simple' | 'skeleton'
  >('custom');
  const [lazyEnabled, setLazyEnabled] = useState(true);
  const longContent = generateLongContent();

  const getPlaceholderRenderer = () => {
    switch (placeholderType) {
      case 'custom':
        return CustomPlaceholder;
      case 'simple':
        return SimplePlaceholder;
      case 'skeleton':
        return SkeletonPlaceholder;
      default:
        return undefined;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>自定义懒加载占位符示例</Title>
      <Paragraph>
        这个示例展示了如何在 lazy 模式下使用自定义渲染函数来动态渲染占位容器。
        你可以选择不同类型的占位符样式，并观察懒加载效果。
      </Paragraph>

      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Switch
              checked={lazyEnabled}
              onChange={setLazyEnabled}
              style={{ marginRight: '8px' }}
            />
            <Text>启用懒加载</Text>
          </div>

          <div>
            <Text strong style={{ marginRight: '16px' }}>
              占位符类型：
            </Text>
            <Space>
              <button
                onClick={() => setPlaceholderType('default')}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  background:
                    placeholderType === 'default' ? '#1890ff' : 'white',
                  color: placeholderType === 'default' ? 'white' : '#333',
                  cursor: 'pointer',
                }}
              >
                默认
              </button>
              <button
                onClick={() => setPlaceholderType('custom')}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  background:
                    placeholderType === 'custom' ? '#1890ff' : 'white',
                  color: placeholderType === 'custom' ? 'white' : '#333',
                  cursor: 'pointer',
                }}
              >
                自定义渐变
              </button>
              <button
                onClick={() => setPlaceholderType('simple')}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  background:
                    placeholderType === 'simple' ? '#1890ff' : 'white',
                  color: placeholderType === 'simple' ? 'white' : '#333',
                  cursor: 'pointer',
                }}
              >
                简单样式
              </button>
              <button
                onClick={() => setPlaceholderType('skeleton')}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  background:
                    placeholderType === 'skeleton' ? '#1890ff' : 'white',
                  color: placeholderType === 'skeleton' ? 'white' : '#333',
                  cursor: 'pointer',
                }}
              >
                骨架屏
              </button>
            </Space>
          </div>
        </Space>
      </Card>

      <BaseMarkdownEditor
        key={`${lazyEnabled}-${placeholderType}`}
        lazy={{
          enable: lazyEnabled,
          placeholderHeight: 120,
          rootMargin: '300px',
          renderPlaceholder: getPlaceholderRenderer(),
        }}
        initValue={longContent}
        readonly={true}
        height={600}
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
        }}
      />

      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>使用说明</Title>
        <Paragraph>
          <Text code>renderPlaceholder</Text> 函数接收以下参数：
        </Paragraph>
        <ul>
          <li>
            <Text code>height</Text>: 占位符高度（px）
          </li>
          <li>
            <Text code>style</Text>: 计算后的占位符样式
          </li>
          <li>
            <Text code>isIntersecting</Text>: 元素是否即将进入视口
          </li>
          <li>
            <Text code>elementInfo</Text>: 元素信息（类型、索引、总数等）
          </li>
        </ul>

        <Title level={5}>代码示例：</Title>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`<BaseMarkdownEditor
  lazy={{
    enable: true,
    placeholderHeight: 120,
    rootMargin: '300px',
    renderPlaceholder: ({ height, style, isIntersecting }) => (
      <div style={style}>
        <div>加载中... {isIntersecting ? '(即将显示)' : ''}</div>
      </div>
    )
  }}
  initValue={content}
  readonly={true}
/>`}
        </pre>
      </Card>
    </div>
  );
};
