import SkeletonList from './SkeletonList';

import { MutableRefObject, useContext, useMemo } from 'react';

import type { BubbleMetaData, BubbleProps, MessageBubbleData } from '../type';

import { ConfigProvider } from 'antd';
import cx from 'classnames';
import React from 'react';
import { BubbleConfigContext } from '../BubbleConfigProvide';
import { Bubble } from '../index';
import { useStyle } from './style';

export type BubbleListProps = {
  /**
   * 聊天消息列表
   */
  bubbleList: MessageBubbleData[];

  readonly?: boolean;

  /**
   * 聊天列表的引用
   */
  bubbleListRef?: MutableRefObject<HTMLDivElement | null>;

  bubbleRef?: MutableRefObject<any | undefined>;
  /**
   * 是否正在加载
   */
  loading?: boolean;

  pure?: boolean;

  /**
   * 组件的类名
   */
  className?: string;

  /**
   * 聊天项的渲染配置
   */
  bubbleRenderConfig?: BubbleProps['bubbleRenderConfig'];

  /**
   * 组件的样式
   */
  style?: React.CSSProperties;

  /**
   * 用户元数据
   */
  userMeta?: BubbleMetaData;

  /**
   * 助手元数据
   */
  assistantMeta?: BubbleMetaData;

  styles?: {
    /**
     * 聊天项的样式
     */
    bubbleListItemStyle?: React.CSSProperties;

    /**
     * 聊天项内容的样式
     */
    bubbleListItemContentStyle?: React.CSSProperties;

    /**
     * 聊天项左侧内容的样式
     */
    bubbleListLeftItemContentStyle?: React.CSSProperties;

    /**
     * 聊天项右侧内容的样式
     */
    bubbleListRightItemContentStyle?: React.CSSProperties;

    /**
     * 聊天项标题的样式
     */
    bubbleListItemTitleStyle?: React.CSSProperties;

    /**
     * 聊天项头像的样式
     */
    bubbleListItemAvatarStyle?: React.CSSProperties;

    /**
     * 聊天项额外内容的样式
     */
    bubbleListItemExtraStyle?: React.CSSProperties;
  };
  classNames?: {
    /**
     * 聊天项的类名
     */
    bubbleListItemClassName?: string;

    /**
     * 聊天项内容的类名
     */
    bubbleListItemContentClassName?: string;

    /**
     * 聊天项标题的类名
     */
    bubbleListItemTitleClassName?: string;

    /**
     * 聊天项头像的类名
     */
    bubbleListItemAvatarClassName?: string;
  };

  onDisLike?: BubbleProps['onDisLike'];
  onLike?: BubbleProps['onLike'];
  onReply?: BubbleProps['onReply'];
  slidesModeProps?: BubbleProps['slidesModeProps'];
  markdownRenderConfig?: BubbleProps['markdownRenderConfig'];
  docListProps?: BubbleProps['docListProps'];
};

/**
 * BubbleList组件
 * @component
 * @param {BubbleListProps} props - The component props.
 * @returns {JSX.Element} BubbleList组件的JSX元素
 */
export const BubbleList: React.FC<BubbleListProps> = (props) => {
  const {
    bubbleListRef,
    bubbleRenderConfig,
    className,
    loading,
    styles,
    classNames,
    markdownRenderConfig,
    userMeta,
    assistantMeta,
    bubbleList = [],
    style,
  } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const { compact } = useContext(BubbleConfigContext) || {};

  const prefixClass = getPrefixCls('agent-bubble-list');
  const { wrapSSR, hashId } = useStyle(prefixClass);
  const deps = useMemo(() => [props.style], [JSON.stringify(props.style)]);

  const bubbleListDom = useMemo(() => {
    const bubbleCount = bubbleList.length;
    return bubbleList.map((item, index) => {
      if (bubbleCount === index + 1) {
        item.isLatest = true;
      } else {
        item.isLatest = false;
      }
      return (
        <Bubble
          key={item.id}
          data-id={item.id}
          avatar={{
            ...(item.role === 'user' ? userMeta : assistantMeta),
            ...(item as any).meta,
          }}
          id={item.id}
          style={{
            ...styles?.bubbleListItemStyle,
          }}
          originData={item}
          placement={item.role === 'user' ? 'right' : 'left'}
          time={item.updateAt || item.createAt}
          deps={deps}
          pure={props.pure}
          bubbleListRef={bubbleListRef}
          bubbleRenderConfig={bubbleRenderConfig}
          classNames={classNames}
          bubbleRef={props.bubbleRef}
          markdownRenderConfig={markdownRenderConfig}
          docListProps={props.docListProps}
          styles={{
            ...styles,
            bubbleListItemContentStyle: {
              ...styles?.bubbleListItemContentStyle,
              ...(item.role === 'user'
                ? styles?.bubbleListRightItemContentStyle
                : styles?.bubbleListLeftItemContentStyle),
            },
          }}
          readonly={props.readonly}
          slidesModeProps={props.slidesModeProps}
          onReply={props.onReply}
          onDisLike={props.onDisLike}
          onLike={props.onLike}
          customConfig={props?.bubbleRenderConfig?.customConfig}
        />
      );
    });
  }, [bubbleList, props.style]);

  if (loading)
    return wrapSSR(
      <div
        className={cx(
          `${prefixClass} ${prefixClass}-loading`,
          className,
          hashId,
        )}
        ref={bubbleListRef}
        style={{
          padding: 24,
        }}
      >
        <SkeletonList />
      </div>,
    );

  return wrapSSR(
    <div
      className={cx(`${prefixClass}`, className, hashId, {
        [`${prefixClass}-readonly`]: props.readonly,
        [`${prefixClass}-compact`]: compact,
      })}
      data-chat-list={bubbleList.length}
      style={style}
      ref={bubbleListRef}
    >
      <div>{bubbleListDom}</div>
    </div>,
  );
};

export default BubbleList;
