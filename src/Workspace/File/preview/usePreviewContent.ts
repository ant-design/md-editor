import { useEffect, useMemo, useRef, useState } from 'react';
import type { FileNode } from '../../types';
import {
  fileTypeProcessor,
  type FileProcessResult,
} from '../FileTypeProcessor';
import type { ContentState } from './types';
import { buildMarkdownContent } from './utils';

const INITIAL_STATE: ContentState = {
  status: 'idle',
  mdContent: '',
  rawContent: '',
};

export interface UsePreviewContentResult {
  /** 文件类型 + 数据源处理结果，未就绪时为 null */
  processResult: FileProcessResult | null;
  /** 文本/代码内容加载状态机 */
  contentState: ContentState;
}

interface PreviewState extends UsePreviewContentResult {
  source: FileNode;
}

/**
 * 按预览数据而非父级对象引用加载；一个 effect 同时拥有请求和 Blob URL，
 * 切换文件时取消请求并释放资源，过期响应不能覆盖当前文件。
 */
export const usePreviewContent = (
  file: FileNode,
  customContent: React.ReactNode | undefined,
  locale?: Record<string, any>,
): UsePreviewContentResult => {
  const localeRef = useRef(locale);
  localeRef.current = locale;
  const hasCustomContent = Boolean(customContent);
  const lastModified =
    file.lastModified instanceof Date
      ? file.lastModified.getTime()
      : file.lastModified;
  const source = useMemo(
    () => ({ ...file }),
    [
      file.id,
      file.name,
      file.type,
      file.displayType,
      file.content,
      file.url,
      file.previewUrl,
      file.file,
      file.loading,
      file.metadata,
      file.size,
      lastModified,
      hasCustomContent,
    ],
  );
  const [state, setState] = useState<PreviewState>({
    source,
    processResult: null,
    contentState: INITIAL_STATE,
  });

  useEffect(() => {
    if (hasCustomContent || source.loading) return;

    let active = true;
    let result: FileProcessResult | null = null;
    let controller: AbortController | undefined;

    const update = (contentState: ContentState) => {
      if (active) {
        setState({ source, processResult: result, contentState });
      }
    };
    const setReadyContent = (raw: string) => {
      if (!active || !result) return;
      update({
        status: 'ready',
        mdContent: buildMarkdownContent(
          raw,
          result.typeInference.category,
          source.name,
        ),
        rawContent: raw,
      });
    };

    try {
      result = fileTypeProcessor.processFile(source);
      const { typeInference, dataSource } = result;
      const isTextOrCode =
        typeInference.category === 'text' || typeInference.category === 'code';

      if (!isTextOrCode || !result.canPreview) {
        update(INITIAL_STATE);
      } else if (dataSource.content !== undefined) {
        setReadyContent(dataSource.content);
      } else if (dataSource.previewUrl) {
        update({ status: 'loading', mdContent: '', rawContent: '' });
        controller = new AbortController();
        fetch(dataSource.previewUrl, { signal: controller.signal })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`,
              );
            }
            return response.text();
          })
          .then(setReadyContent)
          .catch((err: unknown) => {
            if (!active) return;
            update({
              status: 'error',
              error:
                err instanceof Error
                  ? err.message
                  : localeRef.current?.['common.loadTextFailed'] ||
                    '加载文本内容失败',
            });
          });
      } else {
        update(INITIAL_STATE);
      }
    } catch (err) {
      update({
        status: 'error',
        error:
          err instanceof Error
            ? err.message
            : localeRef.current?.['workspace.file.processFailed'] ||
              '文件处理失败',
      });
    }

    return () => {
      active = false;
      controller?.abort();
      if (result) {
        fileTypeProcessor.cleanupResult(result);
      }
    };
  }, [source, hasCustomContent]);

  if (hasCustomContent || source.loading || state.source !== source) {
    return { processResult: null, contentState: INITIAL_STATE };
  }
  return {
    processResult: state.processResult,
    contentState: state.contentState,
  };
};
