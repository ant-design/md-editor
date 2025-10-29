import React from 'react';
import { AttachmentFile } from '../MarkdownInputField/AttachmentButton/types';
import { FileMapView } from '../MarkdownInputField/FileMapView';
import { BubbleProps } from './type';

type BubbleFileViewProps = {
  bubble: BubbleProps<{
    content: string;
    uuid: number;
  }>;
  bubbleListRef: any;
  placement: 'left' | 'right';
};

const DEFAULT_DOWNLOAD_FILENAME = 'download';

const openFileInNewWindow = (file: AttachmentFile) => {
  const url = file?.previewUrl || file?.url;
  if (url && typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
};

const downloadFile = (file: AttachmentFile) => {
  const url = file?.url || file?.previewUrl;
  if (!url || typeof document === 'undefined') return;

  const link = document.createElement('a');
  link.href = url;
  link.download = file?.name || DEFAULT_DOWNLOAD_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const defaultHandlers = {
  onPreview: openFileInNewWindow,
  onDownload: downloadFile,
  onViewAll: () => {},
} as const;

const renderMoreAction = (
  cfg: any,
  file: AttachmentFile,
): React.ReactNode | undefined => {
  if (!cfg) return undefined;

  if (React.isValidElement(cfg) || typeof cfg !== 'function') {
    return cfg as React.ReactNode;
  }

  try {
    if (cfg.length === 0) {
      const result = cfg();
      return typeof result === 'function' ? result(file) : result;
    }
    return cfg(file);
  } catch {
    return undefined;
  }
};

const createEventHandler = <T extends (...args: any[]) => void>(
  handler: T | undefined,
): T | undefined => {
  return handler ? (((...args) => handler(...args)) as T) : undefined;
};

/**
 * BubbleFileView 组件
 *
 * 展示聊天气泡中的文件列表
 *
 * @example
 * ```tsx
 * <BubbleFileView bubble={bubbleData} placement="left" />
 * ```
 */
export const BubbleFileView: React.FC<BubbleFileViewProps> = ({
  bubble,
  placement,
}) => {
  const { originData, fileViewEvents, fileViewConfig } = bubble;

  if (!originData?.fileMap || originData.fileMap.size === 0) {
    return null;
  }

  const allFiles = Array.from(originData.fileMap.values());
  const eventOverrides = fileViewEvents?.(defaultHandlers) || {};
  const config = fileViewConfig || {};

  return (
    <FileMapView
      className={config.className}
      style={config.style}
      maxDisplayCount={config.maxDisplayCount}
      showMoreButton={config.showMoreButton}
      onPreview={createEventHandler(eventOverrides.onPreview)}
      onDownload={createEventHandler(eventOverrides.onDownload)}
      onViewAll={
        eventOverrides.onViewAll
          ? () => eventOverrides.onViewAll?.(allFiles)
          : undefined
      }
      renderMoreAction={(file) =>
        renderMoreAction(config.renderFileMoreAction, file)
      }
      customSlot={config.customSlot}
      placement={placement}
      fileMap={originData.fileMap}
      data-testid="file-item"
    />
  );
};
