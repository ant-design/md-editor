import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { ConfigProvider, Divider } from 'antd';
import { motion } from 'framer-motion';
import React, { useContext, useEffect, useMemo } from 'react';
import { ActionIconBox } from '../../index';
import { BubbleConfigContext } from '../BubbleConfigProvide';
import { BubbleProps, MessageBubbleData } from '../type';
import { CopyButton } from './CopyButton';
import { ReloadIcon } from './icons';

/**
 * 聊天项额外操作组件的属性接口
 * @interface BubbleExtraProps
 */
export type BubbleExtraProps = {
  /**
   * 回复消息的回调函数
   * @description 当用户点击回复按钮时触发，传入要回复的消息内容
   * @param message - 要回复的消息内容
   * @callback
   * @optional
   */
  onReply?: (message: string) => void;

  /**
   * 点踩的回调函数
   * @description 当用户点击点踩按钮时触发
   * @callback
   * @optional
   */
  onDisLike?: () => void;

  /**
   * 点赞的回调函数
   * @description 当用户点击点赞按钮时触发
   * @callback
   * @optional
   */
  onLike?: () => void;

  /**
   * 额外操作组件的自定义样式
   * @description 用于自定义额外操作区域的样式
   * @optional
   */
  style?: React.CSSProperties;

  /**
   * 是否为只读模式
   * @description 当设置为 true 时，所有操作按钮将被禁用
   * @default false
   * @optional
   */
  readonly?: boolean;

  /**
   * 是否为最新消息
   * @description 用于标识当前消息是否为对话中的最新消息
   * @default false
   * @optional
   */
  isLatest?: boolean;

  /**
   * 聊天项的数据
   * @description 包含聊天消息的完整信息
   */
  bubble: BubbleProps<{
    /**
     * 聊天内容
     * @description 消息的具体文本内容
     */
    content: string;

    /**
     * 聊天项的唯一标识
     * @description 用于唯一标识一条消息
     */
    uuid: number;

    /**
     * 额外信息
     * @description 包含消息相关的额外数据
     */
    extra: {
      /**
       * 预设消息
       * @description 用于快速回复的预设消息内容
       */
      preMessage: {
        /**
         * 预设消息的内容
         * @description 预设消息的具体文本内容
         */
        content: string;
      };
    };
  }>;

  /**
   * 打开幻灯片模式的回调函数
   * @description 当用户点击打开幻灯片模式时触发
   * @callback
   * @optional
   */
  onOpenSlidesMode?: () => void;

  /**
   * 幻灯片模式的配置属性
   * @description 继承自 BubbleChatProps 的幻灯片模式配置
   */
  slidesModeProps?: {
    /** 是否启用幻灯片模式 */
    enable?: boolean;
    /** 幻灯片切换后的回调 */
    afterOpenChange?: (message: MessageBubbleData<Record<string, any>>) => void;
  };

  /**
   * 额外内容为空时的回调函数
   * @description 当额外内容为空时触发，用于通知父组件
   * @param isNull - 是否为空
   * @callback
   * @optional
   */
  onRenderExtraNull?: (isNull: boolean) => void;

  /**
   * 自定义渲染函数
   * @description 用于完全自定义额外操作区域的渲染
   * @param props - 当前组件的所有属性
   * @param defaultDoms - 默认的操作按钮 DOM 节点
   * @returns 自定义的额外操作区域 React 节点
   * @optional
   */
  render?: (
    props: BubbleExtraProps,
    defaultDoms: {
      /**
       * 点赞按钮的 DOM 节点
       */
      like: React.ReactNode;
      /**
       * 点踩按钮的 DOM 节点
       */
      disLike: React.ReactNode;
      /**
       * 复制按钮的 DOM 节点
       */
      copy: React.ReactNode;
      /**
       * 回复按钮的 DOM 节点
       */
      reply: React.ReactNode;
    },
  ) => React.ReactNode;
};

const listItemVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 10 },
};

/**
 * BubbleExtra 组件用于显示聊天项的额外操作按钮，如点赞、踩、复制等。
 *
 * @param {BubbleExtraProps} props - 组件的属性。
 * @param {Function} props.onReply - 回复操作的回调函数。
 * @param {Object} props.bubble - 聊天项的数据对象。
 * @param {boolean} props.readonly - 是否为只读模式。
 * @param {Function} [props.onLike] - 点赞操作的回调函数。
 * @param {Function} [props.onDisLike] - 踩操作的回调函数。
 *
 * @returns {JSX.Element} 返回一个包含操作按钮的 JSX 元素。
 *
 * @example
 * ```tsx
 * <BubbleExtra
 *   onReply={handleReply}
 *   bubble={bubbleData}
 *   readonly={false}
 *   onLike={handleLike}
 *   onDisLike={handleDisLike}
 * />
 * ```
 */
export const BubbleExtra = ({
  onReply,
  bubble,
  readonly,
  ...props
}: BubbleExtraProps) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const context = useContext(BubbleConfigContext);

  // 获取聊天项的原始数据
  const originalData = bubble?.originData;

  const prefixCls = getPrefixCls('chat-item-extra');

  // 判断是否已经点过赞或踩
  const alreadyFeedback = ['thumbsDown', 'thumbsUp'].includes(
    originalData?.feedback || '',
  );

  // 判断是否应该显示点赞
  const shouldShowLike =
    !originalData?.extra?.answerStatus &&
    !readonly &&
    (props.onLike || originalData?.feedback) &&
    originalData?.feedback !== 'thumbsDown';

  // 判断是否应该显示踩
  const shouldShowDisLike =
    !originalData?.extra?.answerStatus &&
    !readonly &&
    (props.onDisLike || originalData?.feedback) &&
    originalData?.feedback !== 'thumbsUp';
  const like = useMemo(
    () =>
      shouldShowLike ? (
        <ActionIconBox
          data-testid="chat-item-like-button"
          scale
          style={{
            color: '#666F8D',
          }}
          active={alreadyFeedback}
          title={
            alreadyFeedback
              ? context?.locale?.['chat.message.feedback-success'] ||
                '已经反馈过了哦'
              : context?.locale?.['chat.message.like'] || '喜欢'
          }
          onClick={async () => {
            try {
              if (alreadyFeedback) {
                // message.error('您已经点过赞或踩了');
                return;
              }
              await props.onLike?.();
            } catch (error) {
              // message.error('点赞失败，请重试');
            }
          }}
        >
          <LikeOutlined />
        </ActionIconBox>
      ) : null,
    [shouldShowLike, alreadyFeedback, originalData?.isFinished],
  );

  const disLike = useMemo(
    () =>
      shouldShowDisLike ? (
        <ActionIconBox
          data-testid="chat-item-dislike-button"
          style={{
            color: '#666F8D',
          }}
          scale
          active={alreadyFeedback}
          title={
            alreadyFeedback
              ? context?.locale?.['chat.message.feedback-success'] ||
                '已经反馈过了哦'
              : context?.locale?.['chat.message.dislike'] || '不喜欢'
          }
          onClick={async () => {
            try {
              if (alreadyFeedback) {
                // message.error('您已经点过赞或踩了');
                return;
              }
              await props.onDisLike?.();
            } catch (error) {}
          }}
        >
          <DislikeOutlined />
        </ActionIconBox>
      ) : null,
    [shouldShowDisLike, alreadyFeedback, originalData?.isFinished],
  );

  /**
   * 判断是否应该显示复制选项。
   *
   * 复制选项显示的条件是：
   * - `navigator.clipboard` API 可用。
   * - 聊天项的原始数据包含内容。
   * - 聊天项的原始数据在额外字段中没有回答状态。
   * - 聊天项的内容不等于本地化的 'chat.message.aborted' 消息或其默认值 '回答已停止生成'。
   *
   * @constant
   * @type {boolean}
   */
  const shouldShowCopy =
    originalData?.content &&
    !originalData?.extra?.answerStatus &&
    originalData?.content !==
      (context?.locale?.['chat.message.aborted'] || '回答已停止生成');

  const copyDom = shouldShowCopy ? (
    <CopyButton
      data-testid="chat-item-copy-button"
      title={context?.locale?.['chat.message.copy'] || '复制'}
      scale
      style={{
        color: '#666F8D',
      }}
      onClick={
        navigator.clipboard
          ? async () => {
              await navigator.clipboard.writeText(
                bubble.originData?.content || '',
              );
            }
          : () => {
              const input = document.createElement('input');
              document.body.appendChild(input);
              input.setAttribute('value', bubble.originData?.content || '');
              input.select();
              document.execCommand('copy');
              document.body.removeChild(input);
            }
      }
      showTitle={false}
    >
      <CopyOutlined />
    </CopyButton>
  ) : null;

  const warpDivAnimation = (divDom: React.ReactNode) => {
    if (!bubble.isLast) {
      return divDom;
    }
    if (process.env.NODE_ENV === 'test') {
      return divDom;
    }

    return <motion.div variants={listItemVariants}>{divDom}</motion.div>;
  };

  const dom =
    copyDom || like || disLike ? (
      <motion.div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
        variants={{
          visible: {
            opacity: 1,
            transition: {
              when: 'beforeChildren',
              staggerChildren: 0.1,
              delayChildren: 0.5,
            },
          },
          hidden: {
            opacity: 0,
            transition: {
              when: 'afterChildren',
            },
          },
        }}
        whileInView="visible"
        initial="hidden"
        animate="visible"
        className={`${prefixCls}-action-box`}
      >
        {copyDom ? warpDivAnimation(copyDom) : null}
        {navigator.clipboard &&
        copyDom &&
        (like || disLike) &&
        bubble.isLast ? (
          <motion.div variants={listItemVariants}>
            <Divider
              type="vertical"
              style={{
                margin: '0px 2px',
              }}
            />
          </motion.div>
        ) : null}
        <>
          {like ? warpDivAnimation(like) : null}
          {disLike ? warpDivAnimation(disLike) : null}
        </>
        {props.slidesModeProps?.enable
          ? warpDivAnimation(
              <ActionIconBox
                onClick={props.onOpenSlidesMode}
                title="幻灯片模式"
                style={{
                  color: '#666F8D',
                }}
              >
                <SelectOutlined />
              </ActionIconBox>,
            )
          : null}
      </motion.div>
    ) : null;

  const reSend = useMemo(() => {
    if (originalData?.isAborted && !originalData.isFinished) {
      return (
        <span>
          {context?.locale?.['chat.message.aborted'] || '回答已停止生成'}
        </span>
      );
    }
    if (!originalData?.extra?.preMessage?.content) return null;

    return (
      <ActionIconBox
        data-testid="chat-item-reply-button"
        borderLess
        style={{
          color: '#666F8D',
        }}
        title={context?.locale?.['chat.message.retrySend'] || '重新生成'}
      >
        <div
          style={{
            gap: 4,
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            color: '#666F8D',
          }}
          onClick={async () => {
            onReply?.(
              bubble.originData?.extra?.preMessage?.content ||
                context?.locale?.['chat.message.retrySend'] ||
                '重新生成',
            );
          }}
        >
          <ReloadIcon />
          <span>
            {context?.locale?.['chat.message.retrySend'] || '重新生成'}
          </span>
        </div>
      </ActionIconBox>
    );
  }, [originalData?.isAborted, originalData?.isFinished]);

  useEffect(() => {
    props.onRenderExtraNull?.(!dom && !reSend);
  }, [dom]);

  if (!bubble.isLast) {
    return dom;
  }

  const typing =
    originalData?.isAborted !== true &&
    originalData?.isFinished === false &&
    originalData?.extra?.isHistory === undefined &&
    originalData?.isFinished !== undefined;

  if (typing) return null;

  if (!dom && !reSend) return null;

  if (!copyDom && originalData?.isAborted && !reSend) {
    return null;
  }

  return (
    <motion.div
      variants={{
        visible: {
          x: 0,
          opacity: 1,
          transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1,
            delayChildren: 0.5,
          },
        },
        hidden: {
          opacity: 0,
          x: 4,
          transition: {
            when: 'afterChildren',
          },
        },
      }}
      whileInView="visible"
      initial="hidden"
      animate="visible"
      className={prefixCls}
      style={{
        display: 'flex',
        gap: 8,
        height: context?.compact ? '2em' : '2.8em',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        minWidth: '215px',
        padding: context?.compact ? '0 8px' : '0px 12px',
        color: '#666F8D',
        ...props.style,
      }}
    >
      <motion.div variants={listItemVariants}>{reSend || <div />}</motion.div>
      {originalData?.isAborted ? (
        <motion.div variants={listItemVariants}>{copyDom}</motion.div>
      ) : (
        props.render?.(
          {
            ...props,
            bubble,
            onReply,
            onRenderExtraNull: props.onRenderExtraNull,
            slidesModeProps: props.slidesModeProps,
          },
          {
            like,
            disLike,
            copy: copyDom,
            reply: reSend,
          },
        ) || dom
      )}
    </motion.div>
  );
};
