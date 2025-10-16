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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // 事件：使用 fileViewEvents（仅在覆写存在时透传，避免覆盖子组件默认行为）
  const override = props.bubble.fileViewEvents?.(defaultHandlers) || {};
  const allFiles = Array.from(_.originData?.fileMap?.values() || []);
  const onPreviewProp = override.onPreview
    ? (file: AttachmentFile) => override.onPreview?.(file)
    : undefined;
  const onDownloadProp = override.onDownload
    ? (file: AttachmentFile) => override.onDownload?.(file)
    : undefined;
  const onViewAllProp = override.onViewAll
    ? () => override.onViewAll?.(allFiles)
    : undefined;

  // 配置：仅从 fileViewConfig 读取
  const viewCfg = _.fileViewConfig || {};
  const className = viewCfg.className;
  const style = viewCfg.style;
  const maxDisplayCount = viewCfg.maxDisplayCount;

  const renderFileMoreAction = (
    file: AttachmentFile,
  ): React.ReactNode | undefined => {
    const cfg = viewCfg?.renderFileMoreAction;
    if (!cfg) return undefined;
    // 直接传入 ReactNode
    if (React.isValidElement(cfg) || typeof cfg !== 'function') {
      return cfg as React.ReactNode;
    }
    // 函数：可能是 (file)=>node 或 ()=>node 或 ()=> (file)=>node
    try {
      if (cfg.length === 0) {
        const res = (
          cfg as () =>
            | React.ReactNode
            | ((f: AttachmentFile) => React.ReactNode)
        )();
        return typeof res === 'function'
          ? (res as (f: AttachmentFile) => React.ReactNode)(file)
          : (res as React.ReactNode);
      }
      return (cfg as (f: AttachmentFile) => React.ReactNode)(file);
    } catch (_e) {
      return undefined;
    }
  };
  return (
    <FileMapView
      className={className}
      style={style}
      maxDisplayCount={maxDisplayCount}
      showMoreButton={viewCfg?.showMoreButton}
      onPreview={onPreviewProp}
      onDownload={onDownloadProp}
      onViewAll={onViewAllProp}
      renderMoreAction={renderFileMoreAction}
      customSlot={viewCfg?.customSlot}
      placement={props.placement}
      fileMap={_.originData?.fileMap}
      data-testid="file-item"
    />
  );
};
