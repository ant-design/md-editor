import React from 'react';
import { Bubble } from '../../../src/Bubble';
import { MessageBubbleData } from '../../../src/Bubble/type';

const AfterContentBeforeContentDemo: React.FC = () => {
  const mockMessageData: MessageBubbleData = {
    id: 'demo-message-1',
    content: `# 这是一个演示消息

这是一个支持 **Markdown** 的消息内容。

## 功能特性

- 支持标题、列表、代码块等 Markdown 语法
- 支持自定义 beforeContent 和 afterContent 渲染
- 可以显示消息的元数据信息

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> 这是一个引用块，展示 Markdown 的引用功能。`,
    role: 'assistant',
    createAt: 1703123456789, // 2023-12-21 10:30:56
    updateAt: 1703123456789,
    isFinished: true,
    model: 'gpt-4',
    name: 'AI助手',
  };

  // 自定义 beforeContent 渲染函数
  const customBeforeContentRender = (props: any) => {
    const messageData = props.originData;
    return (
      <div
        style={{
          padding: '8px 12px',
          background: '#f5f5f5',
          borderRadius: '6px',
          marginBottom: '8px',
          fontSize: '12px',
          color: '#666',
          border: '1px solid #e8e8e8',
        }}
      >
        📝 <strong>消息信息</strong>
        <br />
        创建时间: {new Date(messageData?.createAt).toLocaleString()}
        <br />
        模型: {messageData?.model || '未知'}
        <br />
        发送者: {messageData?.name || '未知'}
      </div>
    );
  };

  // 自定义 afterContent 渲染函数
  const customAfterContentRender = (props: any) => {
    const messageData = props.originData;
    return (
      <div
        style={{
          padding: '8px 12px',
          background: '#e6f7ff',
          borderRadius: '6px',
          marginTop: '8px',
          fontSize: '12px',
          color: '#1890ff',
          border: '1px solid #91d5ff',
        }}
      >
        ✅ <strong>状态信息</strong>
        <br />
        消息状态: {messageData?.isFinished ? '✅ 已完成' : '⏳ 生成中...'}
        <br />
        角色: {messageData?.role === 'assistant' ? '🤖 AI助手' : '👤 用户'}
        <br />
        消息ID: {messageData?.id}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>afterContent 和 beforeContent 渲染演示</h2>
      <p>
        这个演示展示了如何使用 <code>afterContentRender</code> 和{' '}
        <code>beforeContentRender</code> 在消息内容的前后添加自定义内容。
      </p>

      <div style={{ marginTop: '20px' }}>
        <Bubble
          originData={mockMessageData}
          bubbleRenderConfig={{
            beforeContentRender: customBeforeContentRender,
            afterContentRender: customAfterContentRender,
          }}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>代码示例</h3>
        <pre
          style={{
            background: '#f6f8fa',
            padding: '16px',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '14px',
          }}
        >
          {`// 自定义 beforeContent 渲染函数
const customBeforeContentRender = (props) => {
  const messageData = props.originData;
  return (
    <div style={{
      padding: '8px 12px',
      background: '#f5f5f5',
      borderRadius: '6px',
      marginBottom: '8px',
      fontSize: '12px',
      color: '#666'
    }}>
      📝 消息创建时间: 2023-12-21 10:30:56
    </div>
  );
};

// 自定义 afterContent 渲染函数
const customAfterContentRender = (props) => {
  const messageData = props.originData;
  return (
    <div style={{
      padding: '8px 12px',
      background: '#e6f7ff',
      borderRadius: '6px',
      marginTop: '8px',
      fontSize: '12px',
      color: '#1890ff'
    }}>
      ✅ 消息状态: 已完成
    </div>
  );
};

// 使用配置
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    beforeContentRender: customBeforeContentRender,
    afterContentRender: customAfterContentRender,
  }}
/>`}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>功能说明</h3>
        <ul>
          <li>
            <strong>beforeContentRender</strong>: 在消息内容前面添加自定义内容
          </li>
          <li>
            <strong>afterContentRender</strong>: 在消息内容后面添加自定义内容
          </li>
          <li>
            <strong>参数</strong>: 两个函数都接收 <code>props</code> 和{' '}
            <code>defaultDom</code> 参数
          </li>
          <li>
            <strong>返回值</strong>: 可以返回任何有效的 React 节点
          </li>
          <li>
            <strong>禁用</strong>: 设置为 <code>false</code> 可以禁用对应的渲染
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AfterContentBeforeContentDemo;
