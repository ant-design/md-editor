import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { Alert, Image, Spin, Segmented } from 'antd';
import React, { type FC, useEffect, useRef, useState } from 'react';
import {
  MarkdownEditor,
  type MarkdownEditorInstance,
  type MarkdownEditorProps,
} from '../../MarkdownEditor';
import { HtmlPreview } from '../HtmlPreview';
import { FileNode } from '../types';
import { formatLastModified } from '../utils';
import {
  getLanguageFromFilename,
  wrapContentInCodeBlock,
} from '../utils/codeLanguageUtils';
import { FileProcessResult, fileTypeProcessor } from './FileTypeProcessor';
import { getFileTypeIcon } from './utils';

interface PreviewComponentProps {
  file: FileNode | React.ReactNode;
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
  // Check if file is a ReactNode (not a FileNode)
  const isReactNode =
    React.isValidElement(file) ||
    typeof file === 'string' ||
    typeof file === 'number' ||
    typeof file === 'boolean';

  // If it's a ReactNode, render it directly with minimal wrapper
  if (isReactNode) {
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
              <span className={`${PREFIX}__file-name`}>自定义预览</span>
            </div>
          </div>
        </div>
        <div className={`${PREFIX}__content`}>
          <div className={`${PREFIX}__custom-content`}>
            {file as React.ReactNode}
          </div>
        </div>
      </div>
    );
  }

  // Cast to FileNode for the rest of the component since we know it's not a ReactNode
  const fileNode = file as FileNode;

  const editorRef = useRef<MarkdownEditorInstance>();
  const [processResult, setProcessResult] = useState<FileProcessResult | null>(
    null,
  );

  type ContentState =
    | {
        status: 'idle' | 'loading' | 'ready';
        mdContent: string;
        rawContent?: string;
      }
    | { status: 'error'; error: string };

  const [contentState, setContentState] = useState<ContentState>({
    status: 'idle',
    mdContent: '',
    rawContent: '',
  });
  const [htmlViewMode, setHtmlViewMode] = useState<'preview' | 'code'>('preview');

  const handleDownload = () => {
    onDownload?.(fileNode);
  };

  // 处理文件
  useEffect(() => {
    try {
      const result = fileTypeProcessor.processFile(fileNode);
      setProcessResult(result);
    } catch (err) {
      setContentState({
        status: 'error',
        error: err instanceof Error ? err.message : '文件处理失败',
      });
    }
  }, [fileNode]);

  // 获取并准备 Markdown/HTML 内容
  useEffect(() => {
    if (!processResult) return;

    const { typeInference, dataSource } = processResult;

    // 只处理文本类型和代码类型文件
    if (typeInference.category !== 'text' && typeInference.category !== 'code')
      return;

    const buildMd = (raw: string): string => {
      if (typeInference.category === 'code') {
        const language = getLanguageFromFilename(fileNode.name);
        return wrapContentInCodeBlock(raw, language);
      }
      return raw;
    };

    const setReady = (raw: string) => {
      setContentState({
        status: 'ready',
        mdContent: buildMd(raw),
        rawContent: raw,
      });
    };

    // 直接内容
    if (dataSource.content) {
      setReady(dataSource.content);
      return;
    }

    // 通过 URL 拉取内容
    if (dataSource.previewUrl) {
      setContentState({ status: 'loading', mdContent: '', rawContent: '' });

      fetch(dataSource.previewUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then((raw) => setReady(raw))
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : '加载文本内容失败';
          setContentState({ status: 'error', error: errorMessage });
          console.error('加载文本内容失败:', err);
        });
    }
  }, [processResult, fileNode.name]);

  // 更新编辑器内容
  useEffect(() => {
    if (
      editorRef.current?.store &&
      contentState.status === 'ready' &&
      contentState.mdContent
    ) {
      editorRef.current.store.setMDContent(contentState.mdContent);
    }
  }, [contentState]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (processResult) {
        fileTypeProcessor.cleanupResult(processResult);
      }
    };
  }, [processResult]);

  // 文件变化时重置 HTML 预览模式
  useEffect(() => {
    setHtmlViewMode('preview');
  }, [fileNode.name]);

  const isHtmlFile = (): boolean => {
    const name = fileNode.name?.toLowerCase() || '';
    const byExt = name.endsWith('.html') || name.endsWith('.htm');
    const byMime = processResult?.dataSource.mimeType === 'text/html';
    return Boolean(byExt || byMime);
  };

  const renderPreviewContent = () => {
    if (!processResult) {
      return (
        <PlaceholderContent>
          <Spin size="large" tip="正在处理文件..." />
        </PlaceholderContent>
      );
    }

    if (contentState.status === 'error') {
      return (
        <PlaceholderContent>
          <Alert
            message="文件处理失败"
            description={contentState.error}
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
          file={fileNode}
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
      case 'code': {
        if (isHtmlFile()) {
          const toHtmlStatus = (
            s: ContentState,
          ): 'loading' | 'error' | 'done' => {
            if ('error' in s) return 'error';
            return s.status === 'loading' ? 'loading' : 'done';
          };
          const htmlStatus = toHtmlStatus(contentState);
          return (
            <div className={`${PREFIX}__text`}>
              <HtmlPreview
                html={contentState.rawContent || ''}
                status={htmlStatus as any}
                viewMode={htmlViewMode}
                onViewModeChange={setHtmlViewMode}
                iframeProps={{ sandbox: 'allow-scripts' }}
                showSegmented={false}
              />
            </div>
          );
        }

        if (contentState.status === 'loading') {
          return (
            <PlaceholderContent>
              <Spin size="large" tip="正在加载文件内容..." />
            </PlaceholderContent>
          );
        }

        return (
          <div className={`${PREFIX}__text`}>
            <MarkdownEditor
              editorRef={editorRef}
              {...{ initValue: '', readonly: true, contentStyle: { padding: 0 } }}
              {...markdownEditorProps}
            />
          </div>
        );
      }

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
            <Image src={dataSource.previewUrl} alt={fileNode.name} />
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
            file={fileNode}
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
                fileTypeProcessor.inferFileType(fileNode).fileType,
                fileNode.icon,
                fileNode.name,
              )}
            </span>
            <span className={`${PREFIX}__file-name`}>{fileNode.name}</span>
          </div>
          {fileNode.lastModified && (
            <div className={`${PREFIX}__generate-time`}>
              生成时间：{formatLastModified(fileNode.lastModified)}
            </div>
          )}
        </div>

        <div className={`${PREFIX}__actions`}>
          {isHtmlFile() && (
            <Segmented
              size="small"
              options={[
                { label: '预览', value: 'preview' },
                { label: '代码', value: 'code' },
              ]}
              value={htmlViewMode}
              onChange={(val) => setHtmlViewMode(val as 'preview' | 'code')}
            />
          )}
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
