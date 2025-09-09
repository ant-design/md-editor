import { memo, MutableRefObject, useContext, useMemo } from 'react';

import { ConfigProvider, Flex } from 'antd';
import cx from 'classnames';
import React from 'react';
import { LoadingIcon } from '../icons/LoadingIcon';
import { BubbleAvatar } from './Avatar';
import { BubbleBeforeNode } from './before';
import { BubbleConfigContext } from './BubbleConfigProvide';
import { BubbleFileView } from './FileView';
import { BubbleMessageDisplay } from './MessagesContent';
import { MessagesContext } from './MessagesContent/BubbleContext';
import { useStyle } from './style';
import { BubbleTitle } from './Title';
import type { BubbleMetaData, BubbleProps } from './type';
export * from './BubbleConfigProvide';
export * from './MessagesContent/BubbleContext';
export * from './type';

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
  ...rest: undefined[]
) => {
  if (render) {
    return render(props, defaultDom, ...rest);
  }
  return defaultDom;
};

/**
 * Bubble 组件 - 聊天气泡组件
 *
 * 该组件是聊天气泡的核心组件，用于显示单条聊天消息。
 * 支持左右布局、头像显示、标题、时间、消息内容等功能。
 *
 * @component
 * @description 聊天气泡组件，用于显示单条聊天消息
 * @param {BubbleProps & {deps?: any[], bubbleRef?: MutableRefObject<any>}} props - 组件属性
 * @param {string} [props.placement='left'] - 气泡位置，'left' 或 'right'
 * @param {BubbleAvatarProps} [props.avatar] - 头像配置
 * @param {string | number | Date} [props.time] - 消息时间
 * @param {React.ReactNode} [props.children] - 消息内容
 * @param {string} [props.className] - 自定义CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {BubbleRenderConfig} [props.bubbleRenderConfig] - 气泡渲染配置
 * @param {BubbleClassNames} [props.classNames] - 自定义类名配置
 * @param {BubbleStyles} [props.styles] - 自定义样式配置
 * @param {Function} [props.onAvatarClick] - 头像点击回调
 * @param {any[]} [props.deps] - 依赖数组
 * @param {MutableRefObject} [props.bubbleRef] - 气泡引用
 *
 * @example
 * ```tsx
 * <Bubble
 *   placement="left"
 *   avatar={{
 *     avatar: "https://example.com/avatar.jpg",
 *     title: "用户"
 *   }}
 *   time={new Date()}
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
    time,
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

  const { compact, standalone, locale } = useContext(BubbleConfigContext) || {};

  const prefixClass = getPrefixCls('agent-list');

  const { wrapSSR, hashId } = useStyle(prefixClass);

  const titleDom = useMemo(() => {
    return runRender(
      bubbleRenderConfig?.titleRender,
      props,
      <BubbleTitle
        className={classNames?.bubbleListItemTitleClassName}
        style={styles?.bubbleListItemTitleStyle}
        prefixClass={cx(`${prefixClass}-bubble-title`)}
        title={avatar?.title}
        placement={placement}
        time={time}
      />,
    );
  }, [
    bubbleRenderConfig?.titleRender,
    classNames?.bubbleListItemTitleClassName,
    props.originData?.updateAt,
    time,
    styles?.bubbleListItemTitleStyle,
    avatar?.title,
    placement,
  ]);

  const avatarDom = useMemo(
    () =>
      runRender(
        bubbleRenderConfig?.avatarRender,
        props,
        <BubbleAvatar
          className={classNames?.bubbleListItemAvatarClassName}
          avatar={avatar?.avatar}
          background={avatar?.backgroundColor}
          title={avatar?.title}
          onClick={onAvatarClick}
          prefixCls={`${prefixClass}-bubble-avatar`}
          style={styles?.bubbleListItemAvatarStyle}
        />,
      ),
    [
      avatar?.backgroundColor,
      avatar?.title,
      props.originData?.updateAt,
      avatar?.avatar,
      classNames?.bubbleListItemAvatarClassName,
      styles?.bubbleListItemAvatarStyle,
    ],
  );

  const messageContent = (
    <BubbleMessageDisplay
      markdownRenderConfig={props.markdownRenderConfig}
      docListProps={props.docListProps}
      bubbleListRef={props.bubbleListRef}
      bubbleListItemExtraStyle={styles?.bubbleListItemExtraStyle}
      bubbleRef={props.bubbleRef}
      content={props?.originData?.content}
      key={props?.originData?.id}
      data-id={props?.originData?.id}
      avatar={props?.originData?.meta as BubbleMetaData}
      readonly={props.readonly ?? false}
      slidesModeProps={props.slidesModeProps}
      onReply={props.onReply}
      id={props.id}
      originData={props.originData}
      placement={props.originData?.role === 'user' ? 'right' : 'left'}
      time={props.originData?.updateAt || props.originData?.createAt}
      onDisLike={props.onDisLike}
      onLike={props.onLike}
      customConfig={props?.bubbleRenderConfig?.customConfig}
      pure={props.pure}
      onCancelLike={props.onCancelLike}
      shouldShowCopy={props.shouldShowCopy}
      useSpeech={props.useSpeech}
      shouldShowVoice={props.shouldShowVoice}
      bubbleRenderConfig={props.bubbleRenderConfig}
    />
  );

  const childrenDom = useMemo(() => {
    return runRender(bubbleRenderConfig?.contentRender, props, messageContent);
  }, [
    props.originData?.content,
    props.originData?.feedback,
    props.originData?.isAborted,
    props.originData?.isFinished,
    props.deps,
  ]);

  const contentBeforeDom = useMemo(() => {
    if (props.placement !== 'left') return null;
    if (props.originData?.role === 'bot') return null;
    return runRender(
      bubbleRenderConfig?.contentBeforeRender,
      props,
      <BubbleBeforeNode
        bubbleListRef={props.bubbleListRef}
        bubble={props as any}
      />,
    );
  }, [
    bubbleRenderConfig?.contentBeforeRender,
    props.originData?.extra?.white_box_process,
    props.originData?.isAborted,
    props.originData?.isFinished,
    props.originData?.updateAt,
    props.deps,
  ]);

  const contentAfterDom = runRender(
    bubbleRenderConfig?.contentAfterRender,
    props,
    null,
  );

  const itemDom = wrapSSR(
    <BubbleConfigContext.Provider
      value={{
        compact,
        standalone: !!standalone,
        locale: locale as any,
        bubble: props as any,
      }}
    >
      <Flex
        className={cx(
          `${prefixClass}-bubble`,
          hashId,
          `${prefixClass}-bubble-${placement}`,
          className,
          {
            [`${prefixClass}-compact`]: compact,
          },
        )}
        style={style}
        vertical
        id={props.id}
        data-id={props.id}
        gap={12}
      >
        {placement === 'right' || preMessageSameRole ? null : (
          <div
            className={cx(
              `${prefixClass}-bubble-avatar-title`,
              `${prefixClass}-bubble-avatar-title-${placement}`,
              hashId,
            )}
          >
            {avatarDom}
            {typing && <LoadingIcon style={{ fontSize: 16 }} />}
            <span>{avatar?.name ?? 'Agentar'}</span>
            {titleDom}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            gap: 4,
            flexDirection: 'column',
          }}
          className={cx(
            `${prefixClass}-bubble-container`,
            `${prefixClass}-bubble-container-${placement}`,
            {
              [`${prefixClass}-bubble-container-pure`]: props.pure,
            },
            hashId,
          )}
          data-testid="chat-message"
        >
          {contentBeforeDom ? (
            <div
              style={styles?.bubbleListItemExtraStyle}
              className={cx(
                `${prefixClass}-bubble-before`,
                `${prefixClass}-bubble-before-${placement}`,
                classNames?.bubbleListItemBeforeClassName || '',
                hashId,
              )}
              data-testid="message-before"
            >
              {contentBeforeDom}
            </div>
          ) : null}
          <div
            style={{
              minWidth: standalone ? 'min(16px,100%)' : '0px',
              ...styles?.bubbleListItemContentStyle,
            }}
            className={cx(
              `${prefixClass}-bubble-content`,
              classNames?.bubbleListItemContentClassName,
              `${prefixClass}-bubble-content-${placement}`,
              {
                [`${prefixClass}-bubble-content-pure`]: props.pure,
              },
              hashId,
            )}
            onDoubleClick={props.onDoubleClick}
            data-testid="message-content"
          >
            {childrenDom}
          </div>
          {contentAfterDom || (props?.originData?.fileMap?.size || 0) > 0 ? (
            <div
              style={{
                minWidth: standalone ? 'min(296px,100%)' : '0px',
                ...styles?.bubbleListItemExtraStyle,
              }}
              className={cx(
                classNames?.bubbleListItemAfterClassName,
                `${prefixClass}-bubble-after`,
                `${prefixClass}-bubble-after-${placement}`,
                hashId,
              )}
              data-testid="message-after"
            >
              <BubbleFileView
                bubbleListRef={props.bubbleListRef}
                bubble={props as any}
              />
              {contentAfterDom}
            </div>
          ) : null}
        </div>
      </Flex>
    </BubbleConfigContext.Provider>,
  );

  if (bubbleRenderConfig?.render === false) return null;
  return (
    <MessagesContext.Provider
      value={{
        message: props.originData,
        hidePadding,
        setHidePadding,
        setMessage: (message) => {
          props?.bubbleRef?.current?.setMessageItem?.(
            props.id!,
            message as any,
          );
        },
      }}
    >
      <>
        {bubbleRenderConfig?.render?.(
          props,
          {
            avatar: (
              <BubbleAvatar avatar={avatar?.avatar} title={avatar?.title} />
            ),
            title: (
              <BubbleTitle
                title={avatar?.title}
                time={time}
                prefixClass={cx(`${prefixClass}-bubble-title`)}
              />
            ),
            messageContent: messageContent,
            itemDom,
          },
          itemDom,
        ) || itemDom}
      </>
    </MessagesContext.Provider>
  );
});
