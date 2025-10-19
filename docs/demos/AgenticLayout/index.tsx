import {
  BackTo,
  BubbleList,
  ChatFlowContainer,
  ChatFlowContainerRef,
  History,
  HistoryDataType,
  MessageBubbleData,
  TASK_RUNNING_STATUS,
  TASK_STATUS,
  TaskRunning,
  Workspace,
} from '@ant-design/md-editor';
import React, { useEffect, useRef, useState } from 'react';
import {
  assistantMeta,
  createMockMessage,
  INITIAL_MESSAGES,
  mockInlineFileMap,
  RETRY_CONFIG,
  userMeta,
} from '../ChatFlowContainer/data';
import AgenticLayout from '../../../src/AgenticLayout';
import './style.css';

const StandaloneHistoryDemo = () => {
  const [currentSessionId, setCurrentSessionId] = useState('session-2');

  // 模拟请求函数
  const mockRequest = async ({ agentId }: { agentId: string }) => {
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
  };

  const handleSelected = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    console.log('选择会话:', sessionId);
  };

  // 处理加载更多
  const handleLoadMore = async () => {
    // 模拟加载更多
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
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
        onLoadMore: handleLoadMore,
        onFavorite: async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        },
      }}
    />
  );
};

const StandaloneWorkspaceDemo = () => {
  return (
    <Workspace
      title="工作空间"
      activeTabKey="realtime"
      onTabChange={(key) => console.log('切换到:', key)}
      onClose={() => console.log('关闭工作空间')}
    >
      <Workspace.Realtime
        data={{
          url: 'https://example.com',
          title: '实时跟随',
          status: 'active',
        }}
      />
      <Workspace.Browser
        data={{
          url: 'https://ant.design',
          title: '浏览器',
          status: 'active',
        }}
      />
      <Workspace.Task
        data={{
          title: '任务管理',
          status: 'running',
          progress: 75,
        }}
      />
    </Workspace>
  );
};

/**
 * AgenticLayout 布局组件演示
 *
 * 展示 AgenticLayout 组件的完整功能，包括：
 * - 左侧历史记录区域
 * - 中间 ChatFlowContainer 对话区域
 * - 右侧 Workspace 工作空间区域
 * - 左右侧栏的折叠功能
 */
const AgenticLayoutDemo: React.FC = () => {
  const [bubbleList, setBubbleList] = useState<MessageBubbleData[]>(() => {
    const messages: MessageBubbleData[] = [];

    for (let i = 0; i < RETRY_CONFIG.MESSAGE_COUNT; i++) {
      const role = i % 2 === 0 ? 'assistant' : 'user';
      const content =
        i === 0 ? INITIAL_MESSAGES.assistant : INITIAL_MESSAGES.user;
      messages.push(createMockMessage(`msg-${i}`, role, content, new Map()));
    }

    return messages;
  });

  const containerRef = useRef<ChatFlowContainerRef>(null);

  // 使用 useRef 管理重试状态，避免全局污染
  const isRetryingRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 组件卸载时清理定时器，防止内存泄漏
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearInterval(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      isRetryingRef.current = false;
    };
  }, []);

  // ***************** Header ***************** //
  const handleLeftCollapse = (collapsed: boolean) => {
    console.log('左侧边栏折叠状态:', collapsed);
  };

  const handleRightCollapse = (collapsed: boolean) => {
    console.log('右侧边栏折叠状态:', collapsed);
  };

  const handleShare = () => {
    console.log('分享对话');
    // 这里可以添加分享逻辑
  };
  // ***************** Header End ***************** //

  // ***************** Footer Task Running ***************** //
  // 空函数，用于满足类型要求
  const noop = () => {};

  const handleCreateNewTask = () => {
    console.log('创建新任务');
  };

  const handleRetry = () => {
    console.log('重试任务');

    // 防止重复执行
    if (isRetryingRef.current) return;
    isRetryingRef.current = true;

    let retryCount = 0;

    retryTimerRef.current = setInterval(() => {
      let content = `这是第 ${retryCount + RETRY_CONFIG.MESSAGE_COUNT + 1} 条消息`;
      let fileMap = new Map();
      if (retryCount === RETRY_CONFIG.MAX_RETRY - 1) {
        content = INITIAL_MESSAGES.bubbleDoc;
        fileMap = mockInlineFileMap;
      } else {
        content = `这是第 ${retryCount + RETRY_CONFIG.MESSAGE_COUNT + 1} 条消息`;
      }
      setBubbleList((prev) => {
        const newMessage = createMockMessage(
          `msg-${Date.now()}`,
          prev.length % 2 === 0 ? 'user' : 'assistant',
          content,
          fileMap,
        );
        return [...prev, newMessage];
      });

      retryCount += 1;
      if (retryCount >= RETRY_CONFIG.MAX_RETRY) {
        if (retryTimerRef.current) {
          clearInterval(retryTimerRef.current);
          retryTimerRef.current = null;
        }
        isRetryingRef.current = false;
      }
    }, RETRY_CONFIG.INTERVAL);
  };

  const handleViewResult = () => {
    console.log('查看任务结果');
  };
  useEffect(() => {
    handleRetry();
  }, []);
  // ***************** Footer Task Running End ***************** //

  return (
    <div
      style={{ padding: 8, backgroundColor: 'var(--color-gray-bg-page-dark)' }}
    >
      <div className="agentic-layout-demo">
        <AgenticLayout
          left={<StandaloneHistoryDemo />}
          center={
            <ChatFlowContainer
              ref={containerRef}
              title="AI 助手"
              onLeftCollapse={() => {}}
              onShare={handleShare}
              footer={
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      left: '50%',
                      transform: 'translate(-50%, -100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 16,
                    }}
                  >
                    <BackTo.Top
                      tooltip="去顶部"
                      shouldVisible={200}
                      target={() =>
                        containerRef.current?.scrollContainer as HTMLElement
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
                        containerRef.current?.scrollContainer as HTMLElement
                      }
                      style={{
                        position: 'relative',
                        bottom: 0,
                        insetInlineEnd: 0,
                      }}
                    />
                  </div>
                  <TaskRunning
                    title={`任务已完成, 耗时03分00秒`}
                    taskStatus={TASK_STATUS.SUCCESS}
                    taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
                    onPause={noop}
                    onResume={noop}
                    onStop={noop}
                    onCreateNewTask={handleCreateNewTask}
                    onReplay={handleRetry}
                    onViewResult={handleViewResult}
                  />
                </div>
              }
            >
              <BubbleList
                style={{
                  paddingBottom: '60px',
                }}
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
            </ChatFlowContainer>
          }
          right={<StandaloneWorkspaceDemo />}
          leftCollapsible={true}
          rightCollapsible={true}
          onLeftCollapse={handleLeftCollapse}
          onRightCollapse={handleRightCollapse}
          leftWidth={256}
          rightWidth={320}
          minHeight="calc(100vh - 16px)"
        />
      </div>
    </div>
  );
};

export default AgenticLayoutDemo;
