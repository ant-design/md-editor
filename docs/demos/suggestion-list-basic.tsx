import {
  Bubble,
  MessageBubbleData,
  SuggestionList,
} from '@ant-design/md-editor';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import { BubbleDemoCard } from './bubble/BubbleDemoCard';

const initAssistant: MessageBubbleData = {
  id: 'a-1',
  role: 'assistant',
  content: `# 欢迎使用 Ant Design MD Editor！
我是 Ant Design 聊天助手，可以帮你：
- **回答问题** - 解答技术相关疑问
- **代码示例** - 提供组件使用示例  
- **设计建议** - 给出设计方案建议
- **文档说明** - 解释 API 和功能
你想了解什么呢？`,
  extra: {},
  createAt: Date.now() - 10000,
  updateAt: Date.now() - 10000,
  isFinished: true,
  isAborted: false,
  meta: {
    avatar:
      'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
    title: 'AI 助手',
    description: 'AI 助手',
  },
};

const items = [
  {
    key: 'qwe',
    icon: '💸',
    text: '关税对消费类基金的影响',
  },
  {
    key: 'asd',
    icon: '📝',
    text: ' 恒生科技指数基金相关新闻',
  },
  {
    key: 'zxc',
    icon: '📊',
    text: ' 数据分析与可视化',
  },
];

export default function SuggestionListBasicDemo() {
  const bubbleRef = useRef<any>();
  const [list] = useState<MessageBubbleData[]>([initAssistant]);

  const handleAsk = async (text: string) => {
    message.info(`${text}`);
  };

  return (
    <BubbleDemoCard
      title="💬 建议列表组件 SuggestionList"
      description="在气泡下方渲染建议列表"
    >
      <div style={{ padding: 24 }}>
        {list.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              marginBottom: 4,
            }}
          >
            <Bubble
              bubbleRef={bubbleRef}
              avatar={m.meta!}
              originData={m}
              placement={m.role === 'user' ? 'right' : 'left'}
              style={{ marginBottom: 4 }}
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
            <div>基础版本示例</div>
            {m.id === initAssistant.id ? (
              <div
                style={{
                  marginTop: 0,
                  marginLeft: 10,
                  width: 'fit-content',
                }}
              >
                <SuggestionList
                  items={items}
                  onItemClick={handleAsk}
                  type="basic"
                />
              </div>
            ) : null}
            <div>透明版本示例</div>
            {m.role === 'assistant' && m.id === 'a-1' ? (
              <div
                style={{
                  marginLeft: 10,
                }}
              >
                <SuggestionList
                  type="transparent"
                  maxItems={4}
                  items={items}
                  onItemClick={handleAsk}
                />
              </div>
            ) : null}
            <div>白色版本示例</div>
            {m.role === 'assistant' && m.id === 'a-1' ? (
              <div
                style={{
                  marginLeft: 10,
                }}
              >
                <SuggestionList
                  type="white"
                  maxItems={4}
                  items={items}
                  onItemClick={handleAsk}
                />
              </div>
            ) : null}
            <div>搜索更多示例</div>
            {m.id === initAssistant.id ? (
              <div
                style={{
                  marginLeft: 10,
                  width: 'fit-content',
                }}
              >
                <SuggestionList
                  items={items}
                  onItemClick={handleAsk}
                  type="basic"
                  showMore={{
                    enable: true,
                    onClick: () => message.info('点击了：搜索更多'),
                  }}
                />
              </div>
            ) : null}
            <div>横向布局示例</div>
            {m.role === 'assistant' && m.id === 'a-1' ? (
              <div
                style={{
                  marginLeft: 10,
                }}
              >
                <SuggestionList
                  layout="horizontal"
                  maxItems={4}
                  items={items}
                  onItemClick={handleAsk}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </BubbleDemoCard>
  );
}
