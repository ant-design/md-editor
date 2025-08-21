import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  BubbleList,
  BubbleMetaData,
  MessageBubbleData,
} from '@ant-design/md-editor';
import { Button, InputNumber, message, Space, Switch } from 'antd';
import React, { useCallback, useRef, useState } from 'react';

// 创建更丰富的模拟数据
const createMockMessage = (
  id: string,
  role: 'user' | 'assistant',
  content: string,
  timestamp?: number,
): MessageBubbleData => ({
  id,
  role,
  content,
  createAt: timestamp || Date.now(),
  updateAt: timestamp || Date.now(),
  isFinished: true,
  meta: {
    avatar:
      role === 'assistant'
        ? 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
        : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: role === 'assistant' ? 'Ant Design Assistant' : '前端开发者',
    description: role === 'assistant' ? 'AI 智能助手' : '资深工程师',
  } as BubbleMetaData,
  extra:
    role === 'assistant'
      ? {
          duration: Math.floor(Math.random() * 3000) + 500,
          model: 'GPT-4',
          tokens: Math.floor(Math.random() * 200) + 50,
        }
      : {},
});

// 初始化消息数据
const initialMessages: MessageBubbleData[] = [
  createMockMessage(
    '1',
    'assistant',
    `# 欢迎使用 BubbleList 组件！

这是一个功能强大的消息列表组件，支持：

- 📝 **多种消息类型**：文本、代码、文件等
- 🎨 **自定义渲染**：支持自定义头像、标题、内容
- 🔄 **实时更新**：支持消息的增删改查
- 📱 **响应式设计**：适配不同屏幕尺寸
- 🚀 **高性能**：虚拟滚动，支持大量消息

你可以通过下方的控制按钮体验各种功能！`,
    Date.now() - 300000,
  ),
  createMockMessage(
    '2',
    'user',
    '这个组件看起来很不错！能演示一下如何添加新消息吗？',
    Date.now() - 240000,
  ),
  createMockMessage(
    '3',
    'assistant',
    `当然可以！添加新消息非常简单：

\`\`\`typescript
// 创建新消息
const newMessage: MessageBubbleData = {
  id: 'unique-id',
  role: 'user', // 或 'assistant'
  content: '消息内容',
  createAt: Date.now(),
  // ... 其他必要字段
};

// 添加到消息列表
setBubbleList(prev => [...prev, newMessage]);
\`\`\`

你可以点击下方的"添加消息"按钮来体验！`,
    Date.now() - 180000,
  ),
  createMockMessage(
    '4',
    'user',
    '太棒了！还支持哪些高级功能呢？',
    Date.now() - 120000,
  ),
  createMockMessage(
    '5',
    'assistant',
    `BubbleList 还支持很多高级功能：

## 🔧 交互功能
- **点赞/点踩**：用户反馈机制
- **回复功能**：支持消息回复
- **复制内容**：一键复制消息

## 🎯 自定义配置
- **bubbleRenderConfig**：自定义渲染逻辑
- **markdownRenderConfig**：Markdown 渲染配置
- **styles**：自定义样式配置

## 📊 状态管理
- **loading**：加载状态显示
- **readonly**：只读模式
- **slidesModeProps**：幻灯片模式

现在你可以体验这些功能了！`,
    Date.now() - 60000,
  ),
];

export default () => {
  const bubbleListRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<any>();

  // 状态管理
  const [bubbleList, setBubbleList] =
    useState<MessageBubbleData[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [listHeight, setListHeight] = useState(500);

  // 助手元数据
  const assistantMeta: BubbleMetaData = {
    avatar:
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    title: 'Ant Design Assistant',
    description: 'AI 智能助手',
  };

  // 用户元数据
  const userMeta: BubbleMetaData = {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: '前端开发者',
    description: '资深工程师',
  };

  // 添加用户消息
  const addUserMessage = useCallback(() => {
    const userMessages = [
      '能展示一下代码高亮功能吗？',
      '如何自定义消息样式？',
      '支持文件上传功能吗？',
      'BubbleList 的性能如何？',
      '可以集成到现有项目中吗？',
      '有没有更多的配置选项？',
    ];

    const randomMessage =
      userMessages[Math.floor(Math.random() * userMessages.length)];
    const newMessage = createMockMessage(
      `user-${Date.now()}`,
      'user',
      randomMessage,
    );

    setBubbleList((prev) => [...prev, newMessage]);

    if (autoScroll) {
      setTimeout(() => {
        bubbleListRef.current?.scrollTo({
          top: bubbleListRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [autoScroll]);

  // 添加助手消息
  const addAssistantMessage = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      const assistantResponses = [
        `当然可以！代码高亮功能示例：

\`\`\`typescript
// React Hook 示例
const useCustomHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  
  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);
  
  return { value, updateValue };
};
\`\`\``,

        `自定义样式非常灵活！你可以通过 \`styles\` 属性配置：

\`\`\`typescript
<BubbleList
  styles={{
    bubbleListItemStyle: { margin: '16px 0' },
    bubbleListItemContentStyle: { borderRadius: '12px' },
    bubbleListItemTitleStyle: { fontWeight: 'bold' }
  }}
/>
\`\`\``,

        `BubbleList 性能表现优异：

- ⚡ **虚拟滚动**：支持数万条消息
- 🎯 **按需渲染**：只渲染可见区域
- 💾 **内存优化**：智能垃圾回收
- 📱 **移动端优化**：触摸滚动体验

实测可流畅处理 10,000+ 条消息！`,
      ];

      const randomResponse =
        assistantResponses[
          Math.floor(Math.random() * assistantResponses.length)
        ];
      const newMessage = createMockMessage(
        `assistant-${Date.now()}`,
        'assistant',
        randomResponse,
      );

      setBubbleList((prev) => [...prev, newMessage]);
      setLoading(false);

      if (autoScroll) {
        setTimeout(() => {
          bubbleListRef.current?.scrollTo({
            top: bubbleListRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      }
    }, 1500);
  }, [autoScroll]);

  // 清空消息
  const clearMessages = useCallback(() => {
    setBubbleList([]);
    message.success('消息列表已清空');
  }, []);

  // 重新加载示例数据
  const reloadMessages = useCallback(() => {
    setBubbleList(initialMessages);
    message.success('示例数据已重新加载');
  }, []);

  // 处理点赞
  const handleLike = useCallback(async (bubble: MessageBubbleData) => {
    message.success(`已点赞消息: ${bubble.id}`);
    console.log('点赞:', bubble);
  }, []);

  // 处理点踩
  const handleDisLike = useCallback(async (bubble: MessageBubbleData) => {
    message.info(`已点踩消息: ${bubble.id}`);
    console.log('点踩:', bubble);
  }, []);

  // 处理回复
  const handleReply = useCallback((content: string) => {
    const replyMessage = createMockMessage(
      `reply-${Date.now()}`,
      'user',
      `回复: ${content}`,
    );
    setBubbleList((prev) => [...prev, replyMessage]);
    message.success('回复已发送');
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      {/* 控制面板 */}
      <div
        style={{
          background: '#f8f9fa',
          padding: 20,
          borderRadius: 12,
          marginBottom: 24,
          border: '1px solid #e9ecef',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0' }}>📋 BubbleList 功能演示</h3>

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addUserMessage}
              disabled={loading}
            >
              添加用户消息
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={addAssistantMessage}
              disabled={loading}
              loading={loading}
            >
              添加助手消息
            </Button>
            <Button icon={<ReloadOutlined />} onClick={reloadMessages}>
              重新加载
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={clearMessages}>
              清空消息
            </Button>
          </Space>
        </div>

        {/* 配置选项 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            padding: 16,
            background: 'white',
            borderRadius: 8,
            border: '1px solid #e9ecef',
          }}
        >
          <div>
            <label
              style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}
            >
              只读模式:
            </label>
            <Switch
              checked={readonly}
              onChange={setReadonly}
              checkedChildren="只读"
              unCheckedChildren="交互"
            />
          </div>

          <div>
            <label
              style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}
            >
              自动滚动:
            </label>
            <Switch
              checked={autoScroll}
              onChange={setAutoScroll}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </div>

          <div>
            <label
              style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}
            >
              列表高度:
            </label>
            <InputNumber
              value={listHeight}
              onChange={(value) => setListHeight(value || 500)}
              min={300}
              max={800}
              step={50}
              addonAfter="px"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* 统计信息 */}
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#e8f4fd',
            borderRadius: 6,
            fontSize: 14,
            color: '#1890ff',
          }}
        >
          <strong>📊 当前状态：</strong>
          总消息数: {bubbleList.length} | 加载状态:{' '}
          {loading ? '加载中' : '空闲'} | 只读模式: {readonly ? '开启' : '关闭'}{' '}
          | 自动滚动: {autoScroll ? '开启' : '关闭'}
        </div>
      </div>

      {/* 消息列表 */}
      <div
        style={{
          border: '1px solid #e9ecef',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <BubbleList
          bubbleList={bubbleList}
          bubbleListRef={bubbleListRef}
          bubbleRef={bubbleRef}
          loading={loading}
          readonly={readonly}
          assistantMeta={assistantMeta}
          userMeta={userMeta}
          style={{
            height: listHeight,
            overflow: 'auto',
            background: '#ffffff',
          }}
          onLike={handleLike}
          onDisLike={handleDisLike}
          onReply={handleReply}
          styles={{
            bubbleListItemStyle: {
              padding: '12px 16px',
              transition: 'all 0.2s ease',
            },
            bubbleListItemContentStyle: {
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            },
          }}
        />
      </div>

      {/* 功能说明 */}
      <div
        style={{
          marginTop: 24,
          padding: 20,
          background: '#f8f9fa',
          borderRadius: 12,
          border: '1px solid #e9ecef',
        }}
      >
        <h4 style={{ margin: '0 0 16px 0' }}>🔍 功能特性</h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          <div>
            <h5>💬 消息管理</h5>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
              <li>动态添加/删除消息</li>
              <li>支持用户和助手角色</li>
              <li>消息时间戳管理</li>
              <li>自动滚动到最新消息</li>
            </ul>
          </div>

          <div>
            <h5>🎨 视觉体验</h5>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
              <li>自定义头像和标题</li>
              <li>响应式布局设计</li>
              <li>流畅的动画效果</li>
              <li>可配置的样式选项</li>
            </ul>
          </div>

          <div>
            <h5>⚡ 性能优化</h5>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
              <li>虚拟滚动支持</li>
              <li>按需渲染机制</li>
              <li>内存使用优化</li>
              <li>大数据量处理</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
