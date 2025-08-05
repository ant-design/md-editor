import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { Alert, Image, Spin } from 'antd';
import React, { type FC, useEffect, useRef, useState } from 'react';
import {
  MarkdownEditor,
  type MarkdownEditorInstance,
  type MarkdownEditorProps,
} from '../../MarkdownEditor';
import { FileNode } from '../types';
import { formatLastModified } from '../utils';
import { FileProcessResult, fileTypeProcessor } from './FileTypeProcessor';
import { getFileTypeIcon } from './utils';

interface PreviewComponentProps {
  file: FileNode;
  onBack: () => void;
  onDownload?: (file: FileNode) => void;
  /**
   * MarkdownEditor 的配置项，用于自定义预览效果
   * @description 这里的配置会覆盖默认的预览配置
   */
  markdownEditorProps?: Partial<
    Omit<MarkdownEditorProps, 'editorRef' | 'initValue' | 'readonly'>
  >;
}

const PREFIX = 'workspace-preview';

// 提取通用的占位符组件
const PlaceholderContent: FC<{
  children: React.ReactNode;
  showFileInfo?: boolean;
  file?: FileNode;
  onDownload?: () => void;
}> = ({ children, showFileInfo, file, onDownload }) => (
  <div className={`${PREFIX}__placeholder`}>
    <div className={`${PREFIX}__placeholder-content`}>
      {children}
      {showFileInfo && file && (
        <>
          <p>文件名：{file.name}</p>
          {file.size && <p>文件大小：{file.size}</p>}
          {onDownload && (
            <button
              className={`${PREFIX}__download-button`}
              onClick={onDownload}
              aria-label="下载文件"
            >
              点击下载
            </button>
          )}
        </>
      )}
    </div>
  </div>
);

export const PreviewComponent: FC<PreviewComponentProps> = ({
  file,
  onBack,
  onDownload,
  markdownEditorProps,
}) => {
  const editorRef = useRef<MarkdownEditorInstance>();
  const [processResult, setProcessResult] = useState<FileProcessResult | null>(
    null,
  );
  const [textContent, setTextContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    onDownload?.(file);
  };

  // 处理文件
  useEffect(() => {
    try {
      const result = fileTypeProcessor.processFile(file);
      setProcessResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件处理失败');
    }
  }, [file]);

  // 获取文本内容
  useEffect(() => {
    if (!processResult) return;

    const { typeInference, dataSource } = processResult;

    // 只处理文本类型文件
    if (typeInference.category !== 'text') return;

    // 如果数据源直接提供了内容
    if (dataSource.content) {
      setTextContent(dataSource.content);
      return;
    }

    // 否则通过URL加载内容
    if (dataSource.previewUrl) {
      setIsLoading(true);
      setError(null);

      fetch(dataSource.previewUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then(setTextContent)
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : '加载文本内容失败';
          setError(errorMessage);
          console.error('加载文本内容失败:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [processResult]);

  // 更新编辑器内容
  useEffect(() => {
    if (editorRef.current?.store && textContent) {
      editorRef.current.store.setMDContent(textContent);
    }
  }, [textContent]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (processResult) {
        fileTypeProcessor.cleanupResult(processResult);
      }
    };
  }, [processResult]);

  const renderPreviewContent = () => {
    if (!processResult) {
      return (
        <PlaceholderContent>
          <Spin size="large" tip="正在处理文件..." />
        </PlaceholderContent>
      );
    }

    if (error) {
      return (
        <PlaceholderContent>
          <Alert
            message="文件处理失败"
            description={error}
            type="error"
            showIcon
          />
        </PlaceholderContent>
      );
    }

    const { typeInference, dataSource, canPreview, previewMode } =
      processResult;

    // 如果不支持预览
    if (!canPreview || previewMode === 'none') {
      return (
        <PlaceholderContent
          file={file}
          showFileInfo
          onDownload={handleDownload}
        >
          <p>此文件类型不支持预览</p>
          <p>文件类型：{typeInference.fileType}</p>
          <p>MIME类型：{dataSource.mimeType}</p>
        </PlaceholderContent>
      );
    }

    // 根据文件类型渲染预览内容
    switch (typeInference.category) {
      case 'text':
        if (isLoading) {
          return (
            <PlaceholderContent>
              <Spin size="large" tip="正在加载文本内容..." />
            </PlaceholderContent>
          );
        }

        return (
          <div className={`${PREFIX}__text`}>
            <MarkdownEditor
              {...markdownEditorProps}
              editorRef={editorRef}
              initValue=""
              readonly
            />
          </div>
        );

      case 'image':
        if (!dataSource.previewUrl) {
          return (
            <PlaceholderContent>
              <p>无法获取图片预览</p>
            </PlaceholderContent>
          );
        }

        return (
          <div className={`${PREFIX}__image`}>
            <Image src={dataSource.previewUrl} alt={file.name} />
          </div>
        );

      case 'video':
        if (!dataSource.previewUrl) {
          return (
            <PlaceholderContent>
              <p>无法获取视频预览</p>
            </PlaceholderContent>
          );
        }

        return (
          <video
            className={`${PREFIX}__video`}
            src={dataSource.previewUrl}
            controls
            controlsList="nodownload"
            preload="metadata"
          >
            <track kind="captions" />
            您的浏览器不支持视频播放
          </video>
        );

      case 'audio':
        if (!dataSource.previewUrl) {
          return (
            <PlaceholderContent>
              <p>无法获取音频预览</p>
            </PlaceholderContent>
          );
        }

        return (
          <audio
            className={`${PREFIX}__audio`}
            src={dataSource.previewUrl}
            controls
            controlsList="nodownload"
            preload="metadata"
          >
            您的浏览器不支持音频播放
          </audio>
        );

      case 'pdf':
        if (!dataSource.previewUrl) {
          return (
            <PlaceholderContent>
              <p>无法获取PDF预览</p>
            </PlaceholderContent>
          );
        }

        return (
          <embed
            className={`${PREFIX}__pdf`}
            src={dataSource.previewUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        );

      default:
        return (
          <PlaceholderContent
            file={file}
            showFileInfo
            onDownload={handleDownload}
          >
            <p>未知的文件类型</p>
            <p>文件类型：{typeInference.fileType}</p>
          </PlaceholderContent>
        );
    }
  };

  return (
    <div className={PREFIX}>
      <div className={`${PREFIX}__header`}>
        <button
          className={`${PREFIX}__back-button`}
          onClick={onBack}
          aria-label="返回文件列表"
        >
          <ArrowLeftOutlined className={`${PREFIX}__back-icon`} />
        </button>

        <div className={`${PREFIX}__file-info`}>
          <div className={`${PREFIX}__file-title`}>
            <span className={`${PREFIX}__file-icon`}>
              {getFileTypeIcon(
                fileTypeProcessor.inferFileType(file).fileType,
                file.icon,
                file.name,
              )}
            </span>
            <span className={`${PREFIX}__file-name`}>{file.name}</span>
          </div>
          {file.lastModified && (
            <div className={`${PREFIX}__generate-time`}>
              生成时间：{formatLastModified(file.lastModified)}
            </div>
          )}
        </div>

        <div className={`${PREFIX}__actions`}>
          <button
            className={`${PREFIX}__action-button`}
            onClick={handleDownload}
            aria-label="下载文件"
          >
            <DownloadOutlined />
          </button>
        </div>
      </div>
      <div className={`${PREFIX}__content`}>{renderPreviewContent()}</div>
    </div>
  );
};
