import React from 'react';
import { FileMapView } from '../MarkdownInputField/FileMapView';
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
  }>;
  bubbleListRef: any;
};

/**
 * @description 聊天项文件视图组件，用于展示聊天项中的文件
 * @param props - 聊天项前置节点属性
 * @param props.bubble - 聊天项数据
 * @returns 如果聊天项中包含文件映射且不为空，则返回FileMapView组件；否则返回null
 */
export const BubbleFileView: React.FC<BubbleBeforeNodeProps> = (props) => {
  const _ = props.bubble;
  if (!_.originData?.fileMap || _.originData?.fileMap.size === 0) {
    return null;
  }
  return (
    <FileMapView
      placement={props.bubble.placement}
      fileMap={_.originData?.fileMap}
      data-testid="file-item"
    />
  );
};
