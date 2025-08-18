import { Flex } from 'antd';
import cx from 'classnames';
import React from 'react';

import {
  ChatTokenType,
  GenerateStyle,
  resetComponent,
  useEditorStyleRegister,
} from '../hooks/useStyle';
import { formatTime } from '../utils/formatTime';
import { BubbleProps, MessageBubbleData } from './type';

/**
 * Props for the BubbleChatTitle component.
 */
export interface TitleProps {
  /**
   * The title of the chat item's avatar.
   */
  title: React.ReactNode;

  /**
   * The placement of the chat item.
   */
  placement?: BubbleProps['placement'];

  /**
   * The time of the chat item.
   */
  time?: MessageBubbleData['updateAt'] | MessageBubbleData['createAt'];

  /**
   * Additional class name for the component.
   */
  className?: string;

  /**
   * Prefix class name for the component.
   */
  prefixClass?: string;

  /**
   * Inline style for the component.
   */
  style?: React.CSSProperties;
}

const genStyle: GenerateStyle<ChatTokenType> = (token) => {
  return {
    [token.componentCls]: {
      fontSize: 12,
      color: token.colorTextDescription,
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      '&-time': {
        visibility: 'hidden',
        opacity: 0,
        color: token.colorTextTertiary,
        lineHeight: 1,
        transition: 'all 0.3s ' + token.motionEaseInOut,
      },
      '&:hover': {
        [`${token.componentCls}-time`]: {
          visibility: 'visible',
        },
      },
    },
  };
};

/**
 * BubbleChat 的标题组件
 * @param prefixCls
 * @returns
 */
function useStyle(prefixCls?: string) {
  return useEditorStyleRegister('Title', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };
    return [resetComponent(proChatToken), genStyle(proChatToken)];
  });
}

/**
 * BubbleTitle 组件 - 聊天气泡标题组件
 *
 * 该组件用于显示聊天气泡的标题信息，包括标题文本和时间。
 * 支持左右布局，当鼠标悬停时显示时间信息。
 *
 * @component
 * @description 聊天气泡标题组件，显示标题和时间信息
 * @param {TitleProps} props - 组件属性
 * @param {React.ReactNode} [props.title] - 标题内容
 * @param {string | number | Date} [props.time] - 时间信息
 * @param {'left' | 'right'} [props.placement='left'] - 布局方向
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string} [props.prefixClass] - 前缀类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 *
 * @example
 * ```tsx
 * <BubbleTitle
 *   title="用户消息"
 *   time={new Date()}
 *   placement="left"
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的标题组件
 */
export const BubbleTitle: React.FC<TitleProps> = ({
  style,
  prefixClass,
  className,
  placement,
  time,
  title,
}) => {
  const { wrapSSR, hashId } = useStyle(prefixClass);

  return wrapSSR(
    <Flex
      className={cx(hashId, prefixClass, className)}
      style={{
        flexDirection: placement === 'left' ? 'row' : 'row-reverse',
        ...style,
      }}
      gap={8}
      data-testid="bubble-title"
    >
      {title}
      {time && (
        <time
          className={cx(`${prefixClass}-time`, hashId)}
          data-testid="bubble-time"
        >
          {formatTime(time)}
        </time>
      )}
    </Flex>,
  );
};
