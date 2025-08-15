import { memo, MutableRefObject, useContext, useMemo } from 'react';

import { ConfigProvider, Flex } from 'antd';
import cx from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
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
 * Represents a chat item component.
 *
 * @component
 * @example
 * ```tsx
 * <Bubble
 *   onAvatarClick={handleAvatarClick}
 *   className="chat-item"
 *   placement="left"
 *   avatar={avatarData}
 *   style={itemStyle}
 *   time={messageTime}
 * >
 *   {messageContent}
 * </Bubble>
 * ```
 *
 * @param {BubbleProps} props - The props for the Bubble component.
 * @returns {React.ReactElement} The rendered Bubble component.
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

  const [hidePadding, setHidePadding] = React.useState(false);

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const { compact, standalone, locale } = useContext(BubbleConfigContext) || {};

  const prefixClass = getPrefixCls('agent-list');

  const { wrapSSR, hashId } = useStyle(prefixClass);

  const titleDom = useMemo(
    () =>
      runRender(
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
      ),
    [
      bubbleRenderConfig?.titleRender,
      classNames?.bubbleListItemTitleClassName,
      props.originData?.updateAt,
      time,
      styles?.bubbleListItemTitleStyle,
      avatar?.title,
      placement,
    ],
  );

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

  const contentBeforeDom = useMemo(
    () =>
      runRender(
        bubbleRenderConfig?.contentBeforeRender,
        props,
        <BubbleBeforeNode
          bubbleListRef={props.bubbleListRef}
          bubble={props as any}
        />,
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
          prefixClass,
          hashId,
          `${prefixClass}-${placement}`,
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
        <motion.div
          initial="hidden"
          animate="visible"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0, scale: 1 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.1,
                delayChildren: 0.3,
                staggerChildren: 0.2,
              },
            },
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'flex-start',
            ...style,
          }}
          className={cx(`${prefixClass}-bubble-container`, hashId)}
        >
          {placement === 'right' ? null : (
            <motion.div
              className={cx(
                `${prefixClass}-bubble-avatar-title`,
                `${prefixClass}-bubble-avatar-title-${placement}`,
                hashId,
              )}
            >
              {avatarDom}
              <span>{avatar?.name ?? 'Agentar'}</span>
              {titleDom}
            </motion.div>
          )}
          <motion.div
            style={{
              display: 'flex',
              gap: 4,
              flexDirection: 'column',
            }}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            variants={{
              hidden: { opacity: 0, scale: 1 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.1,
                  delayChildren: 0.3,
                  staggerChildren: 0.2,
                },
              },
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
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.5,
                    },
                  },
                }}
                style={styles?.bubbleListItemExtraStyle}
                className={cx(
                  `${prefixClass}-bubble-before`,
                  `${prefixClass}-bubble-before-${placement}`,
                  hashId,
                )}
                data-testid="message-before"
              >
                {contentBeforeDom}
              </motion.div>
            ) : null}
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                  },
                },
              }}
              style={{
                minWidth: standalone ? 'min(16px,100%)' : '0px',
                ...styles?.bubbleListItemContentStyle,
              }}
              className={cx(
                `${prefixClass}-bubble-content`,
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
            </motion.div>
            {contentAfterDom || (props?.originData?.fileMap?.size || 0) > 0 ? (
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.5,
                    },
                  },
                }}
                style={{
                  minWidth: standalone ? 'min(296px,100%)' : '0px',
                  ...styles?.bubbleListItemExtraStyle,
                }}
                className={cx(
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
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>
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
