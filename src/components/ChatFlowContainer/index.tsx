import useAutoScroll from '@ant-design/md-editor/hooks/useAutoScroll';
import { PanelLeftIcon, ShareIcon } from '@ant-design/md-editor/icons';
import React from 'react';
import { useStyle } from './style';
import type { ChatFlowContainerProps } from './types';

const COMPONENT_NAME = 'chat-flow-container';

/**
 * ChatFlowContainer 组件 - 对话流容器组件
 *
 * 该组件提供了一个完整的对话流容器，包含头部区域、内容区域和底部区域。
 * 头部区域包含标题、左侧折叠按钮、分享按钮和右侧折叠按钮。
 * 内容区域用于放置对话内容（如 BubbleList）。
 * 底部区域固定在底部，用于放置输入框或AI对话按钮等组件。
 *
 * @component
 * @description 对话流容器组件，提供完整的对话界面布局
 * @param {ChatFlowContainerProps} props - 组件属性
 *
 * @example
 * ```tsx
 * import { ChatFlowContainer } from './components/ChatFlowContainer';
 *
 * // 基本用法
 * <ChatFlowContainer
 *   title="AI 助手"
 *   onLeftCollapse={() => console.log('左侧折叠')}
 *   onRightCollapse={() => console.log('右侧折叠')}
 *   onShare={() => console.log('分享')}
 * >
 *   <div>对话内容</div>
 * </ChatFlowContainer>
 *
 * // 自定义底部
 * <ChatFlowContainer
 *   title="AI 助手"
 *   footer={<div>自定义底部内容</div>}
 * >
 *   <div>对话内容</div>
 * </ChatFlowContainer>
 * ```
 *
 * @returns {React.ReactElement} 渲染的对话流容器组件
 */
const ChatFlowContainer: React.FC<ChatFlowContainerProps> = ({
  title = 'AI 助手',
  showLeftCollapse = true,
  showRightCollapse = false,
  showShare = true,
  onLeftCollapse,
  onRightCollapse,
  onShare,
  children,
  footer,
  className,
  style,
}) => {
  const { wrapSSR, hashId } = useStyle(COMPONENT_NAME);
  const { containerRef } = useAutoScroll({
    SCROLL_TOLERANCE: 30,
    onResize: (size) => console.log('容器尺寸:', size),
    timeout: 200,
  });

  const handleLeftCollapse = () => {
    onLeftCollapse?.();
  };

  const handleRightCollapse = () => {
    onRightCollapse?.();
  };

  const handleShare = () => {
    onShare?.();
  };

  return wrapSSR(
    <div
      className={`${COMPONENT_NAME} ${hashId} ${className || ''}`}
      style={style}
    >
      {/* 头部区域 */}
      <div className={`${COMPONENT_NAME}-header ${hashId}`}>
        {/* 左侧区域：标题和左侧折叠按钮 */}
        <div className={`${COMPONENT_NAME}-header-left ${hashId}`}>
          {showLeftCollapse && (
            <button
              className={`${COMPONENT_NAME}-header-left-collapse-btn ${hashId}`}
              onClick={handleLeftCollapse}
              aria-label="折叠左侧边栏"
              type="button"
            >
              <PanelLeftIcon />
            </button>
          )}
          <h1 className={`${COMPONENT_NAME}-header-left-title ${hashId}`}>
            {title}
          </h1>
        </div>

        {/* 右侧区域：分享按钮和右侧折叠按钮 */}
        <div className={`${COMPONENT_NAME}-header-right ${hashId}`}>
          {showShare && (
            <button
              className={`${COMPONENT_NAME}-header-right-share-btn ${hashId}`}
              onClick={handleShare}
              aria-label="分享对话"
              type="button"
            >
              <ShareIcon />
              &nbsp;分享
            </button>
          )}
          {showRightCollapse && (
            <button
              className={`${COMPONENT_NAME}-header-right-collapse-btn ${hashId}`}
              onClick={handleRightCollapse}
              aria-label="折叠右侧边栏"
              type="button"
            >
              <PanelLeftIcon />
            </button>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className={`${COMPONENT_NAME}-content ${hashId}`}>
        <div
          className={`${COMPONENT_NAME}-content-scrollable ${hashId}`}
          ref={containerRef}
        >
          {children}
        </div>
      </div>

      {/* 底部区域 */}
      {footer && (
        <div className={`${COMPONENT_NAME}-footer ${hashId}`}>{footer}</div>
      )}
    </div>,
  );
};

export default ChatFlowContainer;
export type { ChatFlowContainerProps } from './types';
export { ChatFlowContainer };
