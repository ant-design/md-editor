import {
  BackTo,
  BubbleList,
  ChatLayout,
  ChatLayoutRef,
  History,
  HistoryDataType,
  MessageBubbleData,
} from '@ant-design/agentic-ui';
import { Flex } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { assistantMeta, createCompletedMessages, userMeta } from './data';
import './style.css';

const StandaloneHistoryDemo = React.memo(() => {
  const [currentSessionId, setCurrentSessionId] = useState('session-2');

  // 模拟请求函数
  const mockRequest = useCallback(async ({ agentId }: { agentId: string }) => {
    // 模拟 API 请求
    return [
      {
        id: '1',
        sessionId: 'session-1',
        sessionTitle: '让黄河成为造福人民的幸福河',
        agentId: agentId,
        gmtCreate: 1703123456789, // 2023-12-21 10:30:56
        gmtLastConverse: 1703123456789,
        isFavorite: true,
      },
      {
        id: '2',
        sessionId: 'session-2',
        sessionTitle: '才读昔楚雄，又见今人勇。',
        agentId: agentId,
        gmtCreate: 1703037056789, // 2023-12-20 10:30:56
        gmtLastConverse: 1703037056789,
        isFavorite: false,
      },
      {
        id: '3',
        sessionId: 'session-3',
        sessionTitle:
          '金山银山不如绿水青山，生态环境保护是一个长期任务，要久久为功。',
        agentId: agentId,
        gmtCreate: 1702950656789, // 2023-12-19 10:30:56
        gmtLastConverse: 1702950656789,
      },
      {
        id: '4',
        sessionId: 'session-4',
        sessionTitle: '才读昔楚雄，又见今人勇。',
        agentId: agentId,
        gmtCreate: 1702950656789, // 2023-12-19 10:30:56
        gmtLastConverse: 1702950656789,
      },
      {
        id: '5',
        sessionId: 'session-5',
        sessionTitle: '县县通高速，铺就乡村幸福路',
        agentId: agentId,
        gmtCreate: 1702950656789, // 2023-12-19 10:30:56
        gmtLastConverse: 1702950656789,
      },
    ] as HistoryDataType[];
  }, []);

  const handleSelected = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    console.log('选择会话:', sessionId);
  };

  return (
    <History
      agentId="test-agent"
      sessionId={currentSessionId}
      request={mockRequest}
      onClick={handleSelected}
      standalone
      type="chat"
      agent={{
        enabled: true,
        onSearch: () => {},
        onNewChat: () => {},
        onLoadMore: async () => {},
        onFavorite: async () => {},
      }}
    />
  );
});

/**
 * ChatLayout 对话布局组件演示
 *
 * 展示 ChatLayout 组件的完整功能，包括：
 * - 头部区域的标题、折叠按钮和分享按钮
 * - 内容区域的对话消息展示
 * - 底部区域的输入框和发送按钮
 * - 左右侧边栏的折叠功能
 */
const ChatLayoutDemo: React.FC = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [bubbleList] = useState<MessageBubbleData[]>(createCompletedMessages);

  const containerRef = useRef<ChatLayoutRef>(null);

  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) {
      setLeftCollapsed(true);
    }
  }, []);

  // ***************** Header ***************** //
  const handleLeftCollapse = () => {
    setLeftCollapsed((collapsed) => !collapsed);
  };

  const handleShare = () => {
    console.log('分享对话');
    // 这里可以添加分享逻辑
  };
  // ***************** Header End ***************** //

  return (
    <div style={{ padding: 8, backgroundColor: 'var(--color-gray-bg-page)' }}>
      <div className="chat-flow-demo">
        {/* 左侧边栏 */}
        <div
          className={`chat-flow-demo__sidebar ${leftCollapsed ? 'collapsed' : ''}`}
        >
          <div className="chat-flow-demo__sidebar-content">
            <StandaloneHistoryDemo />
          </div>
        </div>

        {/* 主对话区域 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            minWidth: 0,
          }}
        >
          <ChatLayout
            ref={containerRef}
            header={{
              title: 'AI 助手',
              onLeftCollapse: handleLeftCollapse,
              onShare: handleShare,
            }}
            scrollBehavior="auto"
            showFooterBackground={false}
            footer={
              <Flex gap={8} align="center" justify="center">
                <BackTo.Top
                  tooltip="去顶部"
                  shouldVisible={200}
                  target={() =>
                    containerRef.current?.scrollContainer ?? document.body
                  }
                  style={{
                    position: 'relative',
                    bottom: 0,
                    insetInlineEnd: 0,
                  }}
                />
                <BackTo.Bottom
                  tooltip="去底部"
                  shouldVisible={200}
                  target={() =>
                    containerRef.current?.scrollContainer ?? document.body
                  }
                  style={{
                    position: 'relative',
                    bottom: 0,
                    insetInlineEnd: 0,
                  }}
                />
              </Flex>
            }
          >
            <BubbleList
              pure
              onLike={() => {}}
              onDisLike={() => {}}
              shouldShowVoice={true}
              markdownRenderConfig={{
                tableConfig: {
                  pure: true,
                },
              }}
              bubbleList={bubbleList}
              assistantMeta={assistantMeta}
              userMeta={userMeta}
            />
          </ChatLayout>
        </div>
      </div>
    </div>
  );
};

export default ChatLayoutDemo;
