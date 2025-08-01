import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { Image, Spin } from 'antd';
import React, { type FC, useEffect, useRef, useState } from 'react';
import {
  MarkdownEditor,
  type MarkdownEditorInstance,
  type MarkdownEditorProps,
} from '../../MarkdownEditor';
import { FileNode } from '../types';
import {
  getFileTypeIcon,
  getMimeType,
  getPreviewSource,
  isImageFile,
  isPdfFile,
  isTextFile,
  isVideoFile,
} from './utils';

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
  const handleDownload = () => {
    onDownload?.(file);
  };

  const previewSource = getPreviewSource(file);
  const mimeType = getMimeType(file);
  const [textContent, setTextContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 获取文本内容
  useEffect(() => {
    if (!isTextFile(file)) return;

    // 如果有直接的内容，直接使用
    if (typeof file.content === 'string') {
      setTextContent(file.content);
      return;
    }

    // 否则尝试从 URL 加载内容
    if (previewSource) {
      setIsLoading(true);
      fetch(previewSource)
        .then((response) => response.text())
        .then(setTextContent)
        .catch((error) => {
          console.error('加载文本内容失败:', error);
          setTextContent('加载文本内容失败');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [file, previewSource]);

  // 监听 textContent 变化
  useEffect(() => {
    if (editorRef.current?.store && textContent) {
      editorRef.current.store.setMDContent(textContent);
    }
  }, [textContent]);

  // 清理 Blob URL
  useEffect(() => {
    return () => {
      if (previewSource?.startsWith('blob:')) {
        URL.revokeObjectURL(previewSource);
      }
    };
  }, [previewSource]);

  const renderPreviewContent = () => {
    // 文本预览（包括 markdown 和 plainText）
    if (isTextFile(file)) {
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
    }

    // 其他类型文件需要预览源
    if (!previewSource) {
      return (
        <PlaceholderContent file={file} showFileInfo>
          <p>暂不支持预览此文件类型</p>
        </PlaceholderContent>
      );
    }

    // 图片预览
    if (isImageFile(file)) {
      return (
        <div className={`${PREFIX}__image`}>
          <Image src={previewSource} alt={file.name} />
        </div>
      );
    }

    // 视频预览
    if (isVideoFile(file)) {
      return (
        <video
          className={`${PREFIX}__video`}
          src={previewSource}
          controls
          controlsList="nodownload"
          preload="metadata"
        >
          <track kind="captions" />
          您的浏览器不支持视频播放
        </video>
      );
    }

    // PDF 预览
    if (isPdfFile(file)) {
      return (
        <embed
          className={`${PREFIX}__pdf`}
          src={previewSource}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      );
    }

    // 其他类型，显示下载提示
    return (
      <PlaceholderContent file={file} showFileInfo onDownload={handleDownload}>
        <p>此文件类型不支持预览</p>
        <p>文件类型：{mimeType}</p>
      </PlaceholderContent>
    );
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
              {getFileTypeIcon(file.type, file.icon, file.name)}
            </span>
            <span className={`${PREFIX}__file-name`}>{file.name}</span>
          </div>
          {file.lastModified && (
            <div className={`${PREFIX}__generate-time`}>
              生成时间：{file.lastModified}
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
