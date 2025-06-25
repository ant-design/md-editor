import type { BubbleProps, MessageBubbleData } from '@ant-design/md-editor';
import { Bubble } from '@ant-design/md-editor';
import { Tag } from 'antd';
import React, { useRef } from 'react';

export default () => {
  const bubbleRef = useRef<any>();
  const deps: any[] = [];

  // Mock message data
  const mockMessage: MessageBubbleData = {
    id: '1',
    role: 'assistant',
    content: '这是一条带有自定义渲染的消息。',
    createAt: Date.now(),
    updateAt: Date.now(),
    meta: {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Ant Design',
    },
    extra: {
      customTags: ['重要', '紧急'],
      status: 'success',
    },
  };

  // Custom render config
  const bubbleRenderConfig = {
    // 自定义标题渲染
    titleRender: (props: BubbleProps, defaultDom: React.ReactNode) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {defaultDom}
        {props.originData?.extra?.customTags?.map((tag: string) => (
          <Tag key={tag} color="blue">
            {tag}
          </Tag>
        ))}
      </div>
    ),

    // 自定义内容渲染
    contentRender: (props: BubbleProps, defaultDom: React.ReactNode) => (
      <div
        style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 8 }}
      >
        {defaultDom}
        {props.originData?.extra?.status && (
          <div style={{ marginTop: 8, color: '#52c41a' }}>
            状态：{props.originData.extra.status}
          </div>
        )}
      </div>
    ),

    // 自定义头像渲染
    avatarRender: (props: BubbleProps, defaultDom: React.ReactNode) => (
      <div style={{ position: 'relative' }}>
        {defaultDom}
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 10,
            height: 10,
            background: '#52c41a',
            borderRadius: '50%',
            border: '2px solid #fff',
          }}
        />
      </div>
    ),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Message with custom rendering */}
      <Bubble
        avatar={mockMessage.meta!}
        placement="left"
        deps={deps}
        bubbleRef={bubbleRef}
        originData={mockMessage}
        bubbleRenderConfig={bubbleRenderConfig}
      />
    </div>
  );
};
