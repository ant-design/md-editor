import useAutoScroll from '@ant-design/md-editor/hooks/useAutoScroll';
import { PanelLeftFill, SquareArrowOutUpRight } from '@sofa-design/icons';
import { Button, ConfigProvider } from 'antd';
import { useMergedState } from 'rc-util';
import React, { forwardRef, useContext, useImperativeHandle } from 'react';
import { ActionIconBox } from '../components/ActionIconBox';
import { I18nContext } from '../i18n';
import { useStyle } from './style';
import type { ChatFlowContainerProps, ChatFlowContainerRef } from './types';

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
 * import { ChatFlowContainer } from './ChatFlowContainer';
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
 * // 受控模式 - 折叠状态
 * <ChatFlowContainer
 *   title="AI 助手"
 *   leftCollapsed={leftCollapsed}
 *   rightCollapsed={rightCollapsed}
 *   onLeftCollapse={setLeftCollapsed}
 *   onRightCollapse={setRightCollapsed}
 * >
 *   <div>对话内容</div>
 * </ChatFlowContainer>
 *
 * // 非受控模式 - 默认折叠状态
 * <ChatFlowContainer
 *   title="AI 助手"
 *   leftDefaultCollapsed={true}
 *   rightDefaultCollapsed={false}
 *   onLeftCollapse={(collapsed) => console.log('左侧折叠状态:', collapsed)}
 *   onRightCollapse={(collapsed) => console.log('右侧折叠状态:', collapsed)}
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
const ChatFlowContainer = forwardRef<
  ChatFlowContainerRef,
  ChatFlowContainerProps
>(
  (
    {
      title = 'AI 助手',
      showLeftCollapse = true,
      showRightCollapse = false,
      showShare = true,
      leftCollapsible = true,
      rightCollapsible = true,
      leftCollapsed: controlledLeftCollapsed,
      rightCollapsed: controlledRightCollapsed,
      leftDefaultCollapsed = false,
      rightDefaultCollapsed = false,
      onLeftCollapse,
      onRightCollapse,
      onShare,
      children,
      footer,
      className,
      style,
    },
    ref,
  ) => {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const { locale } = useContext(I18nContext);
    const prefixCls = getPrefixCls('chat-flow-container');
    const { wrapSSR, hashId } = useStyle(prefixCls);
    const { containerRef } = useAutoScroll({
      SCROLL_TOLERANCE: 30,
      onResize: () => {},
      timeout: 200,
    });

    // 使用 useMergedState 管理左侧折叠状态
    const [leftCollapsed, setLeftCollapsed] = useMergedState(
      leftDefaultCollapsed,
      {
        value: controlledLeftCollapsed,
        onChange: onLeftCollapse,
      },
    );

    // 使用 useMergedState 管理右侧折叠状态
    const [rightCollapsed, setRightCollapsed] = useMergedState(
      rightDefaultCollapsed,
      {
        value: controlledRightCollapsed,
        onChange: onRightCollapse,
      },
    );

    const handleLeftCollapse = () => {
      if (leftCollapsible) {
        setLeftCollapsed(!leftCollapsed);
      }
    };

    const handleRightCollapse = () => {
      if (rightCollapsible) {
        setRightCollapsed(!rightCollapsed);
      }
    };

    const handleShare = () => {
      onShare?.();
    };

    useImperativeHandle(ref, () => ({
      scrollContainer: containerRef.current,
    }));

    return wrapSSR(
      <div
        className={`${prefixCls} ${className || ''} ${hashId}`}
        style={style}
      >
        {/* 头部区域 */}
        <div className={`${prefixCls}-header ${hashId}`}>
          {/* 左侧区域：标题和左侧折叠按钮 */}
          <div className={`${prefixCls}-header-left ${hashId}`}>
            {showLeftCollapse && (
              <ActionIconBox
                onClick={handleLeftCollapse}
                aria-label={locale?.['chatFlow.collapseLeft'] || '折叠左侧边栏'}
                title={locale?.['chatFlow.collapseLeft'] || '折叠左侧边栏'}
              >
                <PanelLeftFill />
              </ActionIconBox>
            )}
            <h1 className={`${prefixCls}-header-left-title ${hashId}`}>
              {title}
            </h1>
          </div>

          {/* 右侧区域：分享按钮和右侧折叠按钮 */}
          <div className={`${prefixCls}-header-right ${hashId}`}>
            {showShare && (
              <Button
                className={`${prefixCls}-header-right-share-btn ${hashId}`}
                onClick={handleShare}
                aria-label={locale?.['chatFlow.shareDialog'] || '分享对话'}
                icon={<SquareArrowOutUpRight />}
                color="default"
              >
                {locale?.['chatFlow.share'] || '分享'}
              </Button>
            )}
            {showRightCollapse && (
              <ActionIconBox
                onClick={handleRightCollapse}
                aria-label={
                  locale?.['chatFlow.collapseRight'] || '折叠右侧边栏'
                }
              >
                <PanelLeftFill />
              </ActionIconBox>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div className={`${prefixCls}-content ${hashId}`}>
          <div
            className={`${prefixCls}-content-scrollable ${hashId}`}
            ref={containerRef}
          >
            {children}
          </div>
        </div>

        {/* 底部区域 */}
        {footer && (
          <div className={`${prefixCls}-footer ${hashId}`}>{footer}</div>
        )}
      </div>,
    );
  },
);
export type { ChatFlowContainerProps, ChatFlowContainerRef } from './types';
export { ChatFlowContainer };
