import { memo, MutableRefObject, useContext, useMemo } from 'react';

import { ConfigProvider, Flex } from 'antd';
import cx from 'classnames';
import React from 'react';
import { LoadingIcon } from '../icons/LoadingIcon';
import { BubbleAvatar } from './Avatar';
import { BubbleBeforeNode } from './before';
import { BubbleConfigContext } from './BubbleConfigProvide';
import { BubbleMessageDisplay } from './MessagesContent';
import { MessagesContext } from './MessagesContent/BubbleContext';
import { useStyle } from './style';
import { BubbleTitle } from './Title';
import type { BubbleMetaData, BubbleProps } from './type';

export const runRender = (
  render: any,
  props: BubbleProps,
  defaultDom:
    | string
    | number
    | boolean
    | Iterable<React.ReactNode>
    | React.JSX.Element
    | null
    | undefined,
) => {
  if (render === false) {
    return null;
  }
  if (typeof render === 'function') {
    return render(props, defaultDom);
  }
  return defaultDom;
};

/**
 * Bubble 组件 - 聊天气泡组件
 *
 * 该组件用于渲染单个聊天气泡，支持用户和助手的消息显示、头像、时间戳等功能。
 * 组件支持自定义样式、渲染配置、事件回调等。
 *
 * @component
 * @description 聊天气泡组件，渲染单个聊天消息
 * @param {BubbleProps} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {'left' | 'right'} [props.placement='left'] - 气泡位置
 * @param {BubbleMetaData} [props.avatar] - 头像元数据
 * @param {number} [props.time] - 消息时间戳
 * @param {BubbleRenderConfig} [props.bubbleRenderConfig] - 气泡渲染配置
 * @param {BubbleStyles} [props.styles] - 自定义样式配置
 * @param {BubbleClassNames} [props.classNames] - 自定义类名配置
 * @param {Function} [props.onAvatarClick] - 头像点击事件
 * @param {Function} [props.onDoubleClick] - 双击事件
 * @param {MessageBubbleData} [props.originData] - 原始消息数据
 * @param {string} [props.id] - 消息ID
 * @param {React.RefObject} [props.bubbleListRef] - 气泡列表引用
 * @param {boolean} [props.readonly] - 是否只读模式
 * @param {MarkdownRenderConfig} [props.markdownRenderConfig] - Markdown渲染配置
 * @param {CustomConfig} [props.customConfig] - 自定义配置
 * @param {any[]} [props.deps] - 依赖项数组
 * @param {Function} [props.onDisLike] - 不喜欢回调
 * @param {Function} [props.onLike] - 喜欢回调
 * @param {Function} [props.onReply] - 回复回调
 * @param {SlidesModeProps} [props.slidesModeProps] - 幻灯片模式配置
 * @param {DocListProps} [props.docListProps] - 文档列表配置
 * @param {React.RefObject} [props.bubbleRef] - 气泡引用
 * @param {Function} [props.onCancelLike] - 取消点赞回调
 * @param {boolean | Function} [props.shouldShowCopy] - 控制复制按钮显示
 * @param {boolean} [props.shouldShowVoice] - 控制语音按钮显示
 * @param {UseSpeechAdapter} [props.useSpeech] - 外部语音适配器
 * @param {MessageBubbleData} [props.preMessage] - 预加载消息
 *
 * @example
 * ```tsx
 * <Bubble
 *   originData={messageData}
 *   placement="left"
 *   avatar={userAvatar}
 *   time={Date.now()}
 *   className="custom-bubble"
 *   style={itemStyle}
 * >
 *   这是一条消息内容
 * </Bubble>
 * ```
 *
 * @returns {React.ReactElement} 渲染的聊天气泡组件
 */
export const Bubble: React.FC<
  BubbleProps & {
    deps?: any[];
    bubbleRef?: MutableRefObject<any | undefined>;
  }
> = memo((props) => {
  const {
    onAvatarClick,
    className,
    placement = 'left',
    avatar,
    style,
    bubbleRenderConfig,
    classNames,
    styles,
  } = props;

  const typing = useMemo(() => {
    return (
      props.originData?.isAborted !== true &&
      props.originData?.isFinished === false &&
      props?.originData?.extra?.isHistory === undefined &&
      props.originData?.isFinished !== undefined
    );
  }, [
    props.originData?.isAborted,
    props.originData?.isFinished,
    props.originData?.extra?.isHistory,
  ]);

  const preMessageSameRole = useMemo(() => {
    return props.preMessage?.role === props.originData?.role;
  }, [props.preMessage, props.originData]);

  const [hidePadding, setHidePadding] = React.useState(false);

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const { compact, standalone } = useContext(BubbleConfigContext) || {};

  const prefixClass = getPrefixCls('agent-list');

  const { wrapSSR, hashId } = useStyle(prefixClass);

  const bubbleClassName = cx(
    prefixClass,
    `${prefixClass}-item`,
    {
      [`${prefixClass}-item-${placement}`]: placement,
      [`${prefixClass}-item-compact`]: compact,
      [`${prefixClass}-item-standalone`]: standalone,
      [`${prefixClass}-item-typing`]: typing,
      [`${prefixClass}-item-hide-padding`]: hidePadding,
    },
    className,
    classNames?.bubbleClassName,
    hashId,
  );

  const bubbleStyle = {
    ...style,
    ...styles?.bubbleStyle,
  };

  const bubbleAvatarTitleClassName = cx(
    `${prefixClass}-item-avatar-title`,
    classNames?.bubbleAvatarTitleClassName,
  );

  const bubbleAvatarTitleStyle = {
    ...styles?.bubbleAvatarTitleStyle,
  };

  const bubbleContainerClassName = cx(
    `${prefixClass}-item-container`,
    classNames?.bubbleContainerClassName,
  );

  const bubbleContainerStyle = {
    ...styles?.bubbleContainerStyle,
  };

  const bubbleLoadingIconClassName = cx(
    `${prefixClass}-item-loading-icon`,
    classNames?.bubbleLoadingIconClassName,
  );

  const bubbleLoadingIconStyle = {
    ...styles?.bubbleLoadingIconStyle,
  };

  const bubbleNameClassName = cx(
    `${prefixClass}-item-name`,
    classNames?.bubbleNameClassName,
  );

  const bubbleNameStyle = {
    ...styles?.bubbleNameStyle,
  };

  const bubbleListItemContentClassName = cx(
    `${prefixClass}-item-content`,
    classNames?.bubbleListItemContentClassName,
  );

  const bubbleListItemContentStyle = {
    ...styles?.bubbleListItemContentStyle,
  };

  const bubbleListItemBeforeClassName = cx(
    `${prefixClass}-item-before`,
    classNames?.bubbleListItemBeforeClassName,
  );

  const bubbleListItemBeforeStyle = {
    ...styles?.bubbleListItemBeforeStyle,
  };

  const bubbleListItemAfterClassName = cx(
    `${prefixClass}-item-after`,
    classNames?.bubbleListItemAfterClassName,
  );

  const bubbleListItemAfterStyle = {
    ...styles?.bubbleListItemAfterStyle,
  };

  const bubbleListItemAvatarClassName = cx(
    `${prefixClass}-item-avatar`,
    classNames?.bubbleListItemAvatarClassName,
  );

  const bubbleListItemAvatarStyle = {
    ...styles?.bubbleListItemAvatarStyle,
  };

  const bubbleListItemExtraClassName = cx(
    `${prefixClass}-item-extra`,
    classNames?.bubbleListItemExtraClassName,
  );

  const bubbleListItemExtraStyle = {
    ...styles?.bubbleListItemExtraStyle,
  };

  const avatarDom = runRender(
    bubbleRenderConfig?.avatarRender,
    props,
    <BubbleAvatar
      avatar={avatar?.avatar}
      onClick={onAvatarClick}
      className={bubbleListItemAvatarClassName}
      style={bubbleListItemAvatarStyle}
    />,
  );

  const titleDom = runRender(
    bubbleRenderConfig?.titleRender,
    props,
    <BubbleTitle
      title={avatar?.title}
      className={bubbleNameClassName}
      style={bubbleNameStyle}
    />,
  );

  const messageContentDom = runRender(
    bubbleRenderConfig?.contentRender,
    props,
    <BubbleMessageDisplay
      {...props}
      className={bubbleListItemContentClassName}
      style={bubbleListItemContentStyle}
    />,
  );

  const beforeContentDom = runRender(
    bubbleRenderConfig?.beforeMessageRender,
    props,
    <BubbleBeforeNode
      {...props}
      bubble={props.originData as any}
      className={bubbleListItemBeforeClassName}
      style={bubbleListItemBeforeStyle}
    />,
  );

  const afterContentDom = runRender(
    bubbleRenderConfig?.afterMessageRender,
    props,
    <div
      className={bubbleListItemAfterClassName}
      style={bubbleListItemAfterStyle}
    />,
  );

  const itemDom = (
    <Flex
      className={bubbleClassName}
      style={bubbleStyle}
      onDoubleClick={props.onDoubleClick}
      data-id={props.id}
    >
      <div
        className={bubbleAvatarTitleClassName}
        style={bubbleAvatarTitleStyle}
      >
        {avatarDom}
        {titleDom}
      </div>
      <div className={bubbleContainerClassName} style={bubbleContainerStyle}>
        {beforeContentDom}
        {messageContentDom}
        {afterContentDom}
        <div
          className={bubbleListItemExtraClassName}
          style={bubbleListItemExtraStyle}
        />
      </div>
      {typing && (
        <div
          className={bubbleLoadingIconClassName}
          style={bubbleLoadingIconStyle}
        >
          <LoadingIcon />
        </div>
      )}
    </Flex>
  );

  const finalDom = runRender(bubbleRenderConfig?.render, props, {
    avatar: avatarDom,
    title: titleDom,
    messageContent: messageContentDom,
    itemDom,
  });

  return wrapSSR(
    <MessagesContext.Provider
      value={{
        hidePadding,
        setHidePadding,
        preMessageSameRole,
        typing,
      }}
    >
      {finalDom}
    </MessagesContext.Provider>,
  );
});
