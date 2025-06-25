import { memo, MutableRefObject, useContext, useMemo } from 'react';

import { ConfigProvider, Flex } from 'antd';
import cx from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import { BubbleAvatar } from './Avatar';
import { BubbleBeforeNode } from './before';
import { ChatConfigContext } from './BubbleConfigProvide';
import { BubbleFileView } from './FileView';
import { MessagesContext } from './MessagesContent/BubbleContext';
import { useStyle } from './style';
import { BubbleTitle } from './Title';
import type { BubbleProps } from './type';

const runRender = (
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
 *   messageExtra={extraContent}
 *   chatListItemContentStyle={contentStyle}
 *   chatListItemTitleStyle={titleStyle}
 *   bubbleRenderConfig={renderConfig}
 *   chatListItemAvatarStyle={avatarStyle}
 *   chatListItemExtraStyle={extraStyle}
 *   onDoubleClick={handleDoubleClick}
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
    deps: any[];
    chatRef: MutableRefObject<any | undefined>;
  }
> = memo((props) => {
  const {
    onAvatarClick,
    className,
    children,
    placement = 'left',
    avatar,
    style,
    time,
    animation,
    chatListItemAvatarClassName,
    chatListItemContentClassName,
    chatListItemTitleClassName,
    chatListItemContentStyle,
    chatListItemTitleStyle,
    bubbleRenderConfig,
    chatListItemAvatarStyle,
    chatListItemExtraStyle,
  } = props;

  const [hidePadding, setHidePadding] = React.useState(false);

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const { compact, standalone } = useContext(ChatConfigContext) || {};

  const prefixClass = getPrefixCls('agent-chat-list-item');

  const { wrapSSR, hashId } = useStyle(prefixClass);

  const titleDom = useMemo(
    () =>
      runRender(
        bubbleRenderConfig?.titleRender,
        props,
        <BubbleTitle
          className={chatListItemTitleClassName}
          style={chatListItemTitleStyle}
          prefixClass={cx(`${prefixClass}-message-title`)}
          title={avatar?.title}
          placement={placement}
          time={time}
        />,
      ),
    [
      bubbleRenderConfig?.titleRender,
      chatListItemTitleClassName,
      props.originData?.updateAt,
      time,
      chatListItemTitleStyle,
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
          className={chatListItemAvatarClassName}
          avatar={avatar?.avatar}
          background={avatar?.backgroundColor}
          title={avatar?.title}
          onClick={onAvatarClick}
          prefixCls={`${prefixClass}-message-avatar`}
          style={chatListItemAvatarStyle}
        />,
      ),
    [
      avatar?.backgroundColor,
      avatar?.title,
      props.originData?.updateAt,
      avatar?.avatar,
      chatListItemAvatarClassName,
      chatListItemAvatarStyle,
    ],
  );

  const childrenDom = useMemo(() => {
    return runRender(bubbleRenderConfig?.contentRender, props, children);
  }, [
    props.originData?.content,
    props.originData?.feedback,
    props.originData?.isAborted,
    props.originData?.isFinished,
    props.isLast,
    props.deps,
  ]);

  const contentBeforeDom = useMemo(
    () =>
      runRender(
        bubbleRenderConfig?.contentBeforeRender,
        props,
        <BubbleBeforeNode
          chatListRef={props.chatListRef}
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

  const itemDom = useMemo(() => {
    return wrapSSR(
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
          className={cx(`${prefixClass}-message-container`, hashId)}
        >
          {placement === 'right' ? null : (
            <motion.div
              className={cx(
                `${prefixClass}-message-avatar-title`,
                `${prefixClass}-message-avatar-title-${placement}`,
                hashId,
              )}
            >
              {avatarDom}
              <span>{avatar.name ?? 'LUI Chat'}</span>
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
              `${prefixClass}-message-container`,
              `${prefixClass}-message-container-${placement}`,
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
                style={{
                  width: '100%',
                  minWidth: standalone ? 'min(296px,100%)' : '0px',
                  maxWidth: 'min(860px,100%)',
                  ...chatListItemExtraStyle,
                }}
                className={cx(
                  `${prefixClass}-message-before`,
                  `${prefixClass}-message-before-${placement}`,
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
                width: 'max-content',
                minWidth: standalone ? 'min(16px,100%)' : '0px',
                maxWidth: 'min(860px,100%)',
                ...chatListItemContentStyle,
              }}
              className={cx(
                `${prefixClass}-message-content`,
                `${prefixClass}-message-content-${placement}`,
                hashId,
              )}
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
                  width: '100%',
                  minWidth: standalone ? 'min(296px,100%)' : '0px',
                  maxWidth: 'min(860px,100%)',
                  ...chatListItemExtraStyle,
                }}
                className={cx(
                  `${prefixClass}-message-after`,
                  `${prefixClass}-message-after-${placement}`,
                  hashId,
                )}
                data-testid="message-after"
              >
                <BubbleFileView
                  chatListRef={props.chatListRef}
                  bubble={props as any}
                />
                {contentAfterDom}
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>
      </Flex>,
    );
  }, [
    avatarDom,
    titleDom,
    childrenDom,
    contentBeforeDom,
    contentAfterDom,
    chatListItemContentClassName,
    chatListItemContentStyle,
    chatListItemExtraStyle,
    className,
    hashId,
    placement,
    prefixClass,
    props.id,
    style,
    animation,
    avatar.name,
  ]);

  if (bubbleRenderConfig?.render === false) return null;
  return (
    <MessagesContext.Provider
      value={{
        message: props.originData,
        hidePadding,
        setHidePadding,
        setMessage: (message) => {
          props.chatRef.current?.setMessageItem(props.id!, message as any);
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
                prefixClass={cx(`${prefixClass}-message-title`)}
              />
            ),
            messageContent: children,
            itemDom,
          },
          itemDom,
        ) || itemDom}
      </>
    </MessagesContext.Provider>
  );
});
