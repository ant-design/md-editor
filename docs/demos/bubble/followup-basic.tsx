import {
  Bubble,
  FollowUpQuestion,
  MessageBubbleData,
} from '@ant-design/md-editor';
import { message } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { BubbleDemoCard } from './BubbleDemoCard';

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

export default function FollowUpBasicDemo() {
  const bubbleRef = useRef<any>();
  const [list, setList] = useState<MessageBubbleData[]>([initAssistant]);

  const assistantMeta = useMemo(() => initAssistant.meta!, []);

  const handleAsk = async (text: string) => {
    message.success(`追问: ${text}`);
    setList((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
        createAt: Date.now(),
        updateAt: Date.now(),
        isFinished: true,
        meta: { avatar: assistantMeta?.avatar, title: '开发者' },
      },
    ]);
  };

  return (
    <BubbleDemoCard
      title="💬 追问组件 FollowUpQuestion"
      description="在气泡下方渲染追问输入与建议"
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
            {m.id === initAssistant.id ? (
              <div
                style={{
                  marginTop: 0,
                  marginLeft: 10,
                  width: 'fit-content',
                }}
              >
                <FollowUpQuestion
                  items={[
                    {
                      key: 'qwe',
                      icon: '💸',
                      text: '关税对消费类基金的影响',
                      tooltip: '关税消费',
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
                      disabled: true,
                    },
                  ]}
                  onAsk={handleAsk}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </BubbleDemoCard>
  );
}
