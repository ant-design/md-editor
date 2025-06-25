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
  title: BubbleProps['avatar']['title'];

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
 * prochat 的标题组件
 * @param param0
 * @returns
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
