import React from 'react';
import { AttachmentFile } from '../MarkdownInputField/AttachmentButton/types';
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
  placement: 'left' | 'right';
};

// 默认行为：打开预览链接、新窗口下载等
const defaultHandlers: {
  onPreview: (file: AttachmentFile) => void;
  onDownload: (file: AttachmentFile) => void;
  onMore: (file: AttachmentFile) => void;
  onViewAll: (files: AttachmentFile[]) => void;
} = {
  onPreview: (file: AttachmentFile) => {
    const url = file?.previewUrl || file?.url;
    if (url && typeof window !== 'undefined') window.open(url, '_blank');
  },
  onDownload: (file: AttachmentFile) => {
    const url = file?.url || file?.previewUrl;
    if (!url || typeof document === 'undefined') return;
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
  onMore: (_file: AttachmentFile) => {},
  onViewAll: (_files: AttachmentFile[]) => {},
} as const;

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

  // 事件：使用 fileViewEvents
  const override = props.bubble.fileViewEvents?.(defaultHandlers) || {};
  const handlers = {
    onPreview: override.onPreview || defaultHandlers.onPreview,
    onDownload: override.onDownload || defaultHandlers.onDownload,
    onMore: override.onMore || defaultHandlers.onMore,
    onViewAll: override.onViewAll || defaultHandlers.onViewAll,
  };
  // 配置：从 fileViewConfig 读取，兼容历史 renderFileMoreAction/className/style
  const viewCfg = _.fileViewConfig || {};
  const className = viewCfg.className || _.className;
  const style = viewCfg.style || _.style;
  const maxDisplayCount = viewCfg.maxDisplayCount;
  const renderFileMoreAction = (
    file: AttachmentFile,
  ): React.ReactNode | undefined => {
    const cfg = viewCfg?.renderFileMoreAction;
    if (!cfg) return undefined;
    const result = cfg(file) as
      | React.ReactNode
      | ((file: AttachmentFile) => React.ReactNode);
    return typeof result === 'function' ? result(file) : result;
  };
  return (
    <FileMapView
      className={className}
      style={style}
      maxDisplayCount={maxDisplayCount}
      showMoreButton={viewCfg?.showMoreButton}
      onPreview={(file) => handlers.onPreview(file)}
      onDownload={(file) => handlers.onDownload(file)}
      onMore={(file) => handlers.onMore(file)}
      onViewAll={() =>
        handlers.onViewAll(Array.from(_.originData?.fileMap?.values() || []))
      }
      renderMoreAction={renderFileMoreAction}
      customSlot={viewCfg?.customSlot}
      placement={props.placement}
      fileMap={_.originData?.fileMap}
      data-testid="file-item"
    />
  );
};
