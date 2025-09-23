import {
  BubbleList,
  BubbleMetaData,
  ChatFlowContainer,
  MessageBubbleData,
  TASK_RUNNING_STATUS,
  TASK_STATUS,
  TaskRunning,
} from '@ant-design/md-editor';
import React, { useState } from 'react';
import './style.css';

const assistantMeta: BubbleMetaData = {
  avatar:
    'https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*ed7ZTbwtgIQAAAAAQOAAAAgAemuEAQ/original',
  title: 'AI助手',
};

const userMeta: BubbleMetaData = {
  avatar:
    'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  title: '用户',
};

// 创建模拟消息
const createMockMessage = (
  id: string,
  role: 'user' | 'assistant',
  content: string,
): MessageBubbleData => ({
  id,
  role,
  content,
  createAt: Date.now(),
  updateAt: Date.now(),
  isFinished: true,
  meta: {
    avatar: role === 'assistant' ? assistantMeta.avatar : userMeta.avatar,
    title: role === 'assistant' ? assistantMeta.title : userMeta.title,
  } as BubbleMetaData,
});

// 初始消息
const initialMessages: MessageBubbleData[] = [
  createMockMessage('1', 'assistant', '欢迎使用 BubbleList 组件！'),
  createMockMessage('2', 'user', '这个组件功能很强大！'),
];

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
  const [rightCollapsed, setRightCollapsed] = useState(true); // 状态管理
  const [bubbleList, setBubbleList] =
    useState<MessageBubbleData[]>(initialMessages);

  // ***************** Header ***************** //
  const handleLeftCollapse = () => {
    setLeftCollapsed(!leftCollapsed);
    console.log('左侧边栏折叠状态:', !leftCollapsed);
  };

  const handleRightCollapse = () => {
    setRightCollapsed(!rightCollapsed);
    console.log('右侧边栏折叠状态:', !rightCollapsed);
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

    if ((window as any).__retrying) return;
    (window as any).__retrying = true;

    let retryCount = 0;
    const MAX_RETRY = 30;
    const timer = setInterval(() => {
      setBubbleList((prev) => {
        const newMessage = createMockMessage(
          `msg-${Date.now()}`,
          prev.length % 2 === 0 ? 'user' : 'assistant',
          `这是第 ${prev.length + 1} 条消息`,
        );
        return [...prev, newMessage];
      });
      retryCount += 1;
      if (retryCount >= MAX_RETRY) {
        clearInterval(timer);
        (window as any).__retrying = false;
      }
    }, 2000);
  };

  const handleViewResult = () => {
    console.log('查看任务结果');
  };
  // ***************** Footer Task Running End ***************** //

  return (
    <div
      style={{ height: '600px', backgroundColor: '#f5f5f5', display: 'flex' }}
    >
      {/* 左侧边栏 */}
      {!leftCollapsed && (
        <div
          style={{
            width: '250px',
            // borderRight: '1px solid #e0e0e0',
            padding: '16px',
          }}
        >
          <h3>左侧边栏</h3>
          <p>这里可以放置历史记录、设置等内容</p>
        </div>
      )}

      {/* 主对话区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatFlowContainer
          className="custom-chat-container"
          title="AI 助手"
          onLeftCollapse={handleLeftCollapse}
          onShare={handleShare}
          footer={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
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
