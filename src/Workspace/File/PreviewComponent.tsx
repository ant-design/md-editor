import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import React, { type FC } from 'react';
import { FileNode } from '../types';
import { getFileTypeIcon, isTextFile } from './utils';

interface PreviewComponentProps {
  file: FileNode;
  onBack: () => void;
  onDownload?: (file: FileNode) => void;
}

export const PreviewComponent: FC<PreviewComponentProps> = ({
  file,
  onBack,
  onDownload,
}) => {
  const handleDownload = () => {
    onDownload?.(file);
  };
  const renderPreviewContent = () => {
    // 如果有预览链接，优先使用iframe
    if (file.previewUrl) {
      return (
        <iframe
          src={file.previewUrl}
          className="workspace-preview__iframe"
          title={`预览：${file.name}`}
        />
      );
    }

    // 文本文件预览（如果有url）
    if (file.url && isTextFile(file)) {
      return (
        <iframe
          src={file.url}
          className="workspace-preview__iframe"
          title={`预览：${file.name}`}
        />
      );
    }

    // 默认提示
    return (
      <div className="workspace-preview__placeholder">
        <div className="workspace-preview__placeholder-content">
          <p>暂不支持预览此文件类型</p>
          <p>文件名：{file.name}</p>
          {file.size && <p>文件大小：{file.size}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="workspace-preview">
      <div className="workspace-preview__header">
        <button
          className="workspace-preview__back-button"
          onClick={onBack}
          aria-label="返回文件列表"
        >
          <ArrowLeftOutlined className="workspace-preview__back-icon" />
        </button>

        <div className="workspace-preview__file-info">
          <div className="workspace-preview__file-title">
            <span className="workspace-preview__file-icon">
              {getFileTypeIcon(file.type, file.icon)}
            </span>
            <span className="workspace-preview__file-name">{file.name}</span>
          </div>
          {file.lastModified && (
            <div className="workspace-preview__generate-time">
              生成时间：{file.lastModified}
            </div>
          )}
        </div>

        <div className="workspace-preview__actions">
          <button
            className="workspace-preview__action-button"
            onClick={handleDownload}
            aria-label="下载文件"
          >
            <DownloadOutlined />
          </button>
        </div>
      </div>
      <div className="workspace-preview__content">{renderPreviewContent()}</div>
    </div>
  );
};
