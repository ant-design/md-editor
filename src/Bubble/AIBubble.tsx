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
import { BubbleExtra } from './MessagesContent/BubbleExtra';
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
  ...rest: undefined[]
) => {
  if (render) {
    return render(props, defaultDom, ...rest);
  }
  return defaultDom;
};

/**
 * AIBubble 组件 - AI消息气泡组件
 *
 * 该组件专门用于显示AI助手发送的消息，采用左侧布局，支持完整的交互功能。
 * AI消息通常需要显示头像、标题、加载状态、以及各种操作按钮（点赞、点踩、复制等）。
 *
 * @component
 * @description AI消息气泡组件，专门处理AI助手发送的消息
 * @param {BubbleProps & {deps?: any[], bubbleRef?: MutableRefObject<any>}} props - 组件属性
 * @param {string} [props.placement='left'] - 气泡位置，固定为 'left'
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
 * <AIBubble
 *   avatar={{
 *     avatar: "https://example.com/ai.jpg",
 *     title: "AI助手"
 *   }}
 *   time={new Date()}
 *   style={itemStyle}
 * >
 *   这是AI助手的回复
 * </AIBubble>
 * ```
 *
 * @returns {React.ReactElement} 渲染的AI消息气泡组件
 */
export const AIBubble: React.FC<
  BubbleProps & {
    deps?: any[];
    bubbleRef?: MutableRefObject<any | undefined>;
  }
> = memo((props) => {
  const {
    onAvatarClick,
    className,
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
    if (
      props.preMessage?.role === undefined ||
      props.originData?.role === undefined
    ) {
      return false;
    }
    return props.preMessage?.role === props.originData?.role;
  }, [props.preMessage, props.originData]);

  const [hidePadding, setHidePadding] = React.useState(false);

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const { compact, standalone, locale } = useContext(BubbleConfigContext) || {};

  const prefixClass = getPrefixCls('agent');

  const time = props?.originData?.createAt || props.time;
  const avatar = props?.originData?.meta || props.avatar;

  const { wrapSSR, hashId } = useStyle(prefixClass);

  // AI消息的 placement 固定为 'left'
  const placement = 'left';

  const titleDom = useMemo(() => {
    return runRender(
      bubbleRenderConfig?.titleRender,
      props,
      <BubbleTitle
        bubbleNameClassName={classNames?.bubbleNameClassName}
        className={classNames?.bubbleListItemTitleClassName}
        style={styles?.bubbleListItemTitleStyle}
        prefixClass={cx(`${prefixClass}-bubble-title`)}
        title={avatar?.title || avatar?.name}
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
          title={avatar?.title || avatar?.name}
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
      onReply={props.onReply}
      id={props.id}
      originData={props.originData}
      placement={placement}
      time={props.originData?.updateAt || props.originData?.createAt}
      onDisLike={props.onDisLike}
      onLike={props.onLike}
      customConfig={props?.bubbleRenderConfig?.customConfig}
      pure={props.pure}
      onCancelLike={props.onCancelLike}
      shouldShowCopy={props.shouldShowCopy}
      onFileConfig={props.onFileConfig}
      renderFileMoreAction={props.renderFileMoreAction}
      shouldShowVoice={props.shouldShowVoice}
      bubbleRenderConfig={props.bubbleRenderConfig}
      contentAfterDom={
        (props?.originData?.fileMap?.size || 0) > 0 ? (
          <div
            style={{
              minWidth: standalone ? 'min(296px,100%)' : '0px',
              paddingLeft: 12,
              ...styles?.bubbleListItemExtraStyle,
            }}
            className={cx(
              `${prefixClass}-bubble-after`,
              `${prefixClass}-bubble-after-${placement}`,
              `${prefixClass}-bubble-after-ai`, // AI消息 after 特定样式
              hashId,
            )}
            data-testid="message-after"
          >
            <BubbleFileView
              bubbleListRef={props.bubbleListRef}
              bubble={props as any}
            />
          </div>
        ) : null
      }
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

  const contentBeforeDom = useMemo(
    () =>
      runRender(
        bubbleRenderConfig?.contentBeforeRender,
        props,
        <BubbleBeforeNode bubble={props as any} />,
      ),
    [
      bubbleRenderConfig?.contentBeforeRender,
      props.originData?.extra?.white_box_process,
      props.originData?.isAborted,
      props.originData?.isFinished,
      props.originData?.updateAt,
      props.deps,
    ],
  );

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
          hashId,
          className,
          `${prefixClass}-bubble`,
          `${prefixClass}-bubble-${placement}`,
          `${prefixClass}-bubble-ai`, // 添加AI消息特定的类名
          {
            [`${prefixClass}-bubble-compact`]: compact,
          },
          classNames?.bubbleClassName,
        )}
        style={style}
        vertical
        id={props.id}
        data-id={props.id}
        gap={12}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'flex-start', // AI消息左对齐
            ...style,
          }}
          className={cx(`${prefixClass}-bubble-container`, hashId)}
        >
          {preMessageSameRole ? null : (
            <div
              className={cx(
                `${prefixClass}-bubble-avatar-title`,
                `${prefixClass}-bubble-avatar-title-${placement}`,
                `${prefixClass}-bubble-avatar-title-ai`, // AI消息头像标题特定样式
                classNames?.bubbleAvatarTitleClassName,
                hashId,
              )}
            >
              {avatarDom}
              {typing && <LoadingIcon style={{ fontSize: 16 }} />}
              {titleDom}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              gap: 4,
              flexDirection: 'column',
              alignItems: 'flex-start', // AI消息内容左对齐
            }}
            className={cx(
              `${prefixClass}-bubble-container`,
              `${prefixClass}-bubble-container-${placement}`,
              `${prefixClass}-bubble-container-ai`, // AI消息容器特定样式
              {
                [`${prefixClass}-bubble-container-pure`]: props.pure,
              },
              classNames?.bubbleContainerClassName,
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
                  `${prefixClass}-bubble-before-ai`, // AI消息 before 特定样式
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
                `${prefixClass}-bubble-content-${placement}`,
                `${prefixClass}-bubble-content-ai`, // AI消息内容特定样式
                {
                  [`${prefixClass}-bubble-content-pure`]: props.pure,
                },
                classNames?.bubbleListItemContentClassName,
                hashId,
              )}
              onDoubleClick={props.onDoubleClick}
              data-testid="message-content"
            >
              {childrenDom}
            </div>
            {contentAfterDom}
          </div>
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
              <BubbleAvatar
                avatar={avatar?.avatar}
                title={avatar?.title || avatar?.name}
              />
            ),
            title: titleDom,
            header: (
              <div
                className={cx(
                  `${prefixClass}-bubble-avatar-title`,
                  `${prefixClass}-bubble-avatar-title-${placement}`,
                  `${prefixClass}-bubble-avatar-title-ai`,
                  classNames?.bubbleAvatarTitleClassName,
                  hashId,
                )}
              >
                {avatarDom}
                {typing && <LoadingIcon style={{ fontSize: 16 }} />}
                {titleDom}
              </div>
            ),
            extra:
              props?.bubbleRenderConfig?.extraRender === false ? null : (
                <BubbleExtra
                  pure
                  style={props.styles?.bubbleListItemExtraStyle}
                  readonly={props.readonly}
                  rightRender={props?.bubbleRenderConfig?.extraRightRender}
                  onReply={props.onReply}
                  onCancelLike={props.onCancelLike}
                  shouldShowCopy={props.shouldShowCopy}
                  useSpeech={props.useSpeech}
                  shouldShowVoice={props.shouldShowVoice}
                  onDisLike={
                    props.onDisLike
                      ? async () => {
                          try {
                            await props.onDisLike?.(props.originData as any);
                            props.bubbleRef?.current?.setMessageItem?.(
                              props.id!,
                              {
                                feedback: 'thumbsDown',
                              } as any,
                            );
                          } catch (error) {}
                        }
                      : undefined
                  }
                  bubble={props as any}
                  onLike={
                    props.onLike
                      ? async () => {
                          try {
                            await props.onLike?.(props.originData as any);
                            props.bubbleRef?.current?.setMessageItem?.(
                              props.id!,
                              {
                                feedback: 'thumbsUp',
                              } as any,
                            );
                          } catch (error) {}
                        }
                      : undefined
                  }
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
