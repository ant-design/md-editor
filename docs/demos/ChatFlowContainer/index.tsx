import {
  BackTo,
  BubbleList,
  ChatFlowContainer,
  ChatFlowContainerRef,
  MessageBubbleData,
  TASK_RUNNING_STATUS,
  TASK_STATUS,
  TaskRunning,
} from '@ant-design/md-editor';
import React, { useEffect, useRef, useState } from 'react';
import {
  assistantMeta,
  createMockMessage,
  INITIAL_MESSAGES,
  mockInlineFileMap,
  RETRY_CONFIG,
  userMeta,
} from './data';
import './style.css';

/**
 * ChatFlowContainer 对话流容器组件演示
 *
 * 展示 ChatFlowContainer 组件的完整功能，包括：
 * - 头部区域的标题、折叠按钮和分享按钮
 * - 内容区域的对话消息展示
 * - 底部区域的输入框和发送按钮
 * - 左右侧边栏的折叠功能
 */
const ChatFlowContainerDemo: React.FC = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
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
  const handleLeftCollapse = () => {
    setLeftCollapsed(!leftCollapsed);
    console.log('左侧边栏折叠状态:', !leftCollapsed);
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
  // ***************** Footer Task Running End ***************** //

  return (
    <div className="custom-chat-container-demo">
      {/* 左侧边栏 */}
      <div className={`sidebar-left ${leftCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-left-content">
          <h3>左侧边栏</h3>
          <p>这里可以放置历史记录、设置等内容</p>
        </div>
      </div>

      {/* 主对话区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatFlowContainer
          ref={containerRef}
          title="AI 助手"
          onLeftCollapse={handleLeftCollapse}
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
            bubbleList={bubbleList}
            assistantMeta={assistantMeta}
            userMeta={userMeta}
          />
        </ChatFlowContainer>
      </div>
    </div>
  );
};

export default ChatFlowContainerDemo;
