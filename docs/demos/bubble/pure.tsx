import {
  Bubble,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/agentic-ui';
import { Card, Space, Switch, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { BubbleDemoCard } from './BubbleDemoCard';

const { Text, Title } = Typography;

// 创建更丰富的模拟数据
const createMockMessages = (): MessageBubbleData[] => [
  {
    id: '1',
    role: 'assistant',
    content: `## Pure 模式说明

Pure 模式是 Bubble 组件的简洁版本，特点：

- 🎨 **无边框无阴影**：更简洁的视觉效果
- 📱 **适配场景**：嵌入式对话、邮件预览等
- ⚡ **轻量级**：减少视觉干扰，突出内容
- 🔧 **易集成**：更容易融入现有设计系统

适用于需要低调显示的聊天场景。`,
    createAt: Date.now() - 180000,
    updateAt: Date.now() - 180000,
    isFinished: true,
    meta: {
      avatar:
        'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
      title: 'Design System',
      description: '设计系统助手',
    } as BubbleMetaData,
  },
  {
    id: '2',
    role: 'user',
    content: '这样看起来确实更简洁！什么时候使用 Pure 模式比较合适？',
    createAt: Date.now() - 120000,
    updateAt: Date.now() - 120000,
    isFinished: true,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: '产品经理',
      description: 'UI/UX 设计师',
    } as BubbleMetaData,
  },
  {
    id: '3',
    role: 'assistant',
    content: `Pure 模式的最佳使用场景：

### 🔸 嵌入式聊天
当聊天框作为页面的一部分时，pure 模式不会抢夺用户注意力。

### 🔸 邮件/消息预览
在预览模式中，简洁的样式更适合展示内容摘要。

### 🔸 移动端适配
在小屏幕设备上，pure 模式可以节省更多空间。

### 🔸 白色背景
当页面背景为白色时，pure 模式能更好地融入整体设计。

\`\`\`tsx
// 启用 Pure 模式很简单
<Bubble pure originData={message} />
\`\`\``,
    createAt: Date.now() - 60000,
    updateAt: Date.now() - 60000,
    isFinished: true,
    meta: {
      avatar:
        'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
      title: 'Design System',
      description: '设计系统助手',
    } as BubbleMetaData,
  },
  {
    id: '4',
    role: 'user',
    content: '太棒了！我现在明白了 Pure 模式的优势。能看看和普通模式的对比吗？',
    createAt: Date.now() - 30000,
    updateAt: Date.now() - 30000,
    isFinished: true,
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: '产品经理',
      description: 'UI/UX 设计师',
    } as BubbleMetaData,
  },
  {
    id: '5',
    role: 'assistant',
    content: `当然可以！下面你可以通过切换开关来对比两种模式的视觉效果。

**普通模式特点：**
- 有边框和阴影
- 立体感更强
- 适合独立聊天窗口

**Pure 模式特点：**
- 无边框无阴影
- 平面简洁设计
- 更好地融入页面布局


| 普通模式 | Pure 模式 |
| -------- | -------- |
| 有边框和阴影 | 无边框无阴影 |
| 立体感更强 | 平面简洁设计 |
| 适合独立聊天窗口 | 更好地融入页面布局 |

试试切换下方的开关，感受两种模式的差异！`,
    createAt: Date.now() - 10000,
    updateAt: Date.now() - 10000,
    isFinished: true,
    meta: {
      avatar:
        'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
      title: 'Design System',
      description: '设计系统助手',
    } as BubbleMetaData,
  },
];

export default () => {
  const bubbleRef = useRef<any>();
  const [isPureMode, setIsPureMode] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const mockMessages = createMockMessages();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* 控制面板 */}
      <Card
        style={{ marginBottom: 24 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎨</span>
            <Title level={4} style={{ margin: 0 }}>
              Pure 模式演示
            </Title>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Pure 模式提供更简洁的聊天气泡样式，适用于需要低调展示的场景。
          </Text>
        </div>

        <Space size="large">
          <div>
            <Text strong>Pure 模式: </Text>
            <Switch
              checked={isPureMode}
              onChange={setIsPureMode}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </div>

          <div>
            <Text strong>对比模式: </Text>
            <Switch
              checked={showComparison}
              onChange={setShowComparison}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </div>
        </Space>

        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: isPureMode ? '#e8f4fd' : '#fff7e6',
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          <Text>
            <strong>当前模式：</strong>
            {isPureMode
              ? '✨ Pure 模式 - 简洁无边框设计'
              : '🎯 普通模式 - 带边框和阴影'}
          </Text>
        </div>
      </Card>

      {/* 对比展示 */}
      {showComparison ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            marginBottom: 24,
          }}
        >
          {/* 普通模式 */}
          <Card title="🎯 普通模式" size="small">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockMessages.slice(0, 2).map((message) => (
                <Bubble
                  key={`normal-${message.id}`}
                  avatar={message.meta!}
                  placement={message.role === 'user' ? 'right' : 'left'}
                  bubbleRef={bubbleRef}
                  originData={message}
                  pure={false}
                  markdownRenderConfig={{
                    tableConfig: {
                      pure: true,
                    },
                  }}
                />
              ))}
            </div>
          </Card>

          {/* Pure 模式 */}
          <Card title="✨ Pure 模式" size="small">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockMessages.slice(0, 2).map((message) => (
                <Bubble
                  key={`pure-${message.id}`}
                  avatar={message.meta!}
                  placement={message.role === 'user' ? 'right' : 'left'}
                  bubbleRef={bubbleRef}
                  originData={message}
                  pure={true}
                  markdownRenderConfig={{
                    tableConfig: {
                      pure: true,
                    },
                  }}
                />
              ))}
            </div>
          </Card>
        </div>
      ) : (
        /* 主要演示区域 */
        <BubbleDemoCard
          title={`${isPureMode ? '✨' : '🎯'} ${isPureMode ? 'Pure' : '普通'}模式展示`}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              padding: 24,
            }}
          >
            {mockMessages.map((message) => (
              <Bubble
                key={message.id}
                avatar={message.meta!}
                placement={message.role === 'user' ? 'right' : 'left'}
                bubbleRef={bubbleRef}
                originData={message}
                pure={isPureMode}
                markdownRenderConfig={{
                  tableConfig: {
                    pure: true,
                  },
                }}
              />
            ))}
          </div>
        </BubbleDemoCard>
      )}

      {/* 使用指南 */}
      <Card title="📖 使用指南" style={{ marginTop: 24 }} size="small">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          <div>
            <Title level={5}>🎨 视觉差异</Title>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>
                <strong>普通模式：</strong>有边框、阴影，立体感强
              </li>
              <li>
                <strong>Pure 模式：</strong>无边框、阴影，扁平简洁
              </li>
              <li>
                <strong>布局：</strong>Pure 模式占用空间更少
              </li>
              <li>
                <strong>融合度：</strong>Pure 模式更易融入页面
              </li>
            </ul>
          </div>

          <div>
            <Title level={5}>🔧 使用场景</Title>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>
                <strong>嵌入式聊天：</strong>页面内聊天组件
              </li>
              <li>
                <strong>消息预览：</strong>邮件、通知预览
              </li>
              <li>
                <strong>移动端：</strong>节省屏幕空间
              </li>
              <li>
                <strong>白色背景：</strong>更好的视觉一致性
              </li>
            </ul>
          </div>

          <div>
            <Title level={5}>⚙️ 代码示例</Title>
            <div
              style={{
                background: '#f6f8fa',
                padding: 12,
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              <div>{`// 启用 Pure 模式`}</div>
              <div style={{ color: '#d73a49' }}>{'<Bubble pure />'}</div>
              <br />
              <div>{`// 禁用 Pure 模式`}</div>
              <div style={{ color: '#d73a49' }}>
                {'<Bubble pure={false} />'}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
