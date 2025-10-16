import React, { useContext, useMemo } from 'react';
import {
  ThoughtChainList,
  WhiteBoxProcessInterface,
} from '../ThoughtChainList';
import { BubbleConfigContext } from './BubbleConfigProvide';
import { BubbleProps } from './type';

type BubbleBeforeNodeProps = {
  /**
   * 聊天项的数据
   */
  bubble: BubbleProps<{
    /**
     * 聊天内容
     */
    content: string;
    /**
     * 聊天项的唯一标识
     */
    uuid: number;
    /**
     * 额外信息
     */
    extra: {
      white_box_process: WhiteBoxProcessInterface[] | WhiteBoxProcessInterface;
      /**
       * 预设消息
       */
      preMessage: {
        /**
         * 预设消息的内容
         */
        content: string;
      };
    };
  }>;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * BubbleBeforeNode 组件 - 聊天气泡前置节点组件
 *
 * 该组件用于在聊天气泡之前渲染思维链或任务列表节点。
 * 主要用于显示AI的思考过程、工具调用等白盒处理信息。
 *
 * @component
 * @description 聊天气泡前置节点组件，用于显示思维链和任务列表
 * @param {BubbleBeforeNodeProps} props - 组件属性
 * @param {BubbleProps} props.bubble - 聊天气泡数据
 * @param {any} props.bubbleListRef - 气泡列表引用
 *
 * @example
 * ```tsx
 * <BubbleBeforeNode
 *   bubble={bubbleData}
 *   bubbleListRef={listRef}
 * />
 * ```
 *
 * @returns {React.ReactElement|null} 渲染的思维链组件或null
 *
 * @description
 * 渲染条件：
 * - 气泡位置必须为 'left'
 * - 角色不能为 'bot'
 * - 任务列表不为空或配置为始终渲染
 * - 思维链功能已启用
 */
export const BubbleBeforeNode: React.FC<BubbleBeforeNodeProps> = (props) => {
  const _ = props.bubble;
  const context = useContext(BubbleConfigContext);

  const renderResult = useMemo(() => {
    // 判断位置是否为左侧
    if (_.placement !== 'left') return null;

    // 判断角色是否为 bot
    if (_.originData?.role === 'bot') return null;

    // 判断思维链功能是否启用
    if (context?.thoughtChain?.enable === false) return null;

    // 处理任务列表
    const taskList = (
      [_?.originData?.extra?.white_box_process].flat(
        2,
      ) as WhiteBoxProcessInterface[]
    ).filter((item) => item?.info) as WhiteBoxProcessInterface[];

    // 判断是否需要渲染
    if (taskList.length < 1 && !context?.thoughtChain?.alwaysRender) {
      return null;
    }

    // 使用自定义渲染函数
    if (context?.thoughtChain?.render) {
      return (context?.thoughtChain.render as any)(_, taskList.join(','));
    }

    // 渲染默认思维链组件
    return (
      <ThoughtChainList
        {...context?.thoughtChain}
        className={props.className}
        style={props.style}
        bubble={{
          ..._.originData,
          isFinished: _.originData?.isFinished || _.originData?.isAborted,
        }}
        finishAutoCollapse={true}
        thoughtChainList={
          taskList.length
            ? taskList
            : [
                {
                  info: '理解问题',
                },
              ]
        }
        loading={_.originData?.content === '...'}
      />
    );
  }, [
    _.placement,
    _.originData,
    context?.thoughtChain,
    props.className,
    props.style,
  ]);

  return renderResult;
};
