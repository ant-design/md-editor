import React, { useContext } from 'react';
import {
  ThoughtChainList,
  WhiteBoxProcessInterface,
} from '../ThoughtChainList';
import { ChatConfigContext } from './BubbleConfigProvide';
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
  chatListRef: any;
};

/**
 * BubbleBeforeNode 组件用于在聊天项之前渲染一个节点。
 *
 * @param props - 组件的属性，包含 bubble 和上下文配置。
 *
 * @returns 如果满足特定条件，返回一个 ThoughtChainList 组件或自定义渲染函数的结果，否则返回 null。
 *
 * 条件包括：
 * - bubble 的 placement 属性必须为 'left'。
 * - taskList 不为空或上下文配置中的 thoughtChain.alwaysRender 为 true。
 * - 上下文配置中的 thoughtChain.enable 不为 false。
 *
 * 如果上下文配置中的 thoughtChain.render 存在，则调用该自定义渲染函数。
 * 否则，返回一个 ThoughtChainList 组件，传递必要的属性。
 */
export const BubbleBeforeNode: React.FC<BubbleBeforeNodeProps> = (props) => {
  const _ = props.bubble;
  const context = useContext(ChatConfigContext);
  if (_.placement !== 'left') return null;
  if (_.originData?.role === 'bot') return null;

  const taskList = (
    [_?.originData?.extra?.white_box_process].flat(
      2,
    ) as WhiteBoxProcessInterface[]
  ).filter((item) => item?.info) as WhiteBoxProcessInterface[];

  if (taskList.length < 1 && !context?.thoughtChain?.alwaysRender) {
    return null;
  }

  if (context?.thoughtChain?.enable === false) return null;

  if (context?.thoughtChain?.render) {
    return context?.thoughtChain.render(_, taskList.join(','));
  }

  return (
    <>
      <ThoughtChainList
        {...context?.thoughtChain}
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
    </>
  );
};
