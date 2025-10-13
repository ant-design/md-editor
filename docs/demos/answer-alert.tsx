import { AnswerAlert, Bubble, MessageBubbleData } from '@ant-design/md-editor';
import React from 'react';

// Mock data for the demo
const mockMessage: MessageBubbleData = {
  id: '1',
  role: 'assistant',
  content: `
我是 Ant Design 聊天助手，可以帮你：

- **回答问题** - 解答技术相关疑问
- **代码示例** - 提供组件使用示例
- **设计建议** - 给出设计方案建议
- **文档说明** - 解释 API 和功能

你想了解什么呢？`,
  createAt: Date.now() - 60000, // 1分钟前
  updateAt: Date.now() - 60000,
  isFinished: true,
  extra: {
    duration: 1200, // 生成耗时
    model: 'gpt-4',
    tokens: 150,
  },
  meta: {
    avatar:
      'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
    title: 'Ant Design Assistant',
    description: 'AI 助手',
  },
};

const AnsweringIndicatorDemo = () => {
  return (
    <div
      style={{
        padding: 24,
      }}
    >
      <Bubble
        pure
        avatar={mockMessage.meta}
        placement="left"
        originData={mockMessage}
      />
      <AnswerAlert message="LUI chat 已完成当前任务" type="success" showIcon />
    </div>
  );
};

export default AnsweringIndicatorDemo;
