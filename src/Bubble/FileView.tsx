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
  // 默认行为：打开预览链接、新窗口下载等
  const defaultHandlers = {
    onPreview: (file: any) => {
      const url = file?.previewUrl || file?.url;
      if (url && typeof window !== 'undefined') window.open(url, '_blank');
    },
    onDownload: (file: any) => {
      const url = file?.url || file?.previewUrl;
      if (!url || typeof document === 'undefined') return;
      const a = document.createElement('a');
      a.href = url;
      a.download = file?.name || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    onMore: (_file: any) => {},
    onViewAll: (_files: any[]) => {},
  } as const;

  // 提供默认实现给外部包装，若外部返回覆盖，则优先用覆盖
  const override = props.bubble.onFileConfig?.(defaultHandlers) || {};
  const handlers = {
    onPreview: override.onPreview || defaultHandlers.onPreview,
    onDownload: override.onDownload || defaultHandlers.onDownload,
    onMore: override.onMore || defaultHandlers.onMore,
    onViewAll: override.onViewAll || defaultHandlers.onViewAll,
  };
  return (
    <FileMapView
      fileMap={_.originData?.fileMap}
      onPreview={(file) => handlers.onPreview(file)}
      onDownload={(file) => handlers.onDownload(file)}
      onMore={(file) => handlers.onMore(file)}
      onViewAll={() =>
        handlers.onViewAll(Array.from(_.originData?.fileMap?.values() || []))
      }
      data-testid="file-item"
    />
  );
};
