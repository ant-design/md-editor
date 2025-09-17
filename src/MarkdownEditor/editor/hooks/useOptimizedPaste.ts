import { message } from 'antd';
import { useCallback, useRef } from 'react';
import { Editor, Transforms } from 'slate';

/** 性能优化相关常量配置 */
const PASTE_DEBOUNCE_DELAY = 100; // 粘贴防抖延迟（毫秒）
const LARGE_CONTENT_THRESHOLD = 5000; // 大内容阈值（字符数）

/**
 * 优化粘贴处理 Hook 的配置选项
 */
interface UseOptimizedPasteOptions {
  /** 粘贴开始时的回调函数 */
  onPasteStart?: () => void;
  /** 粘贴结束时的回调函数 */
  onPasteEnd?: () => void;
  /** 粘贴错误时的回调函数 */
  onPasteError?: (error: Error) => void;
}

/**
 * 优化的粘贴处理 Hook
 *
 * 提供以下优化功能：
 * - 防抖处理：避免频繁的粘贴操作
 * - 分段处理：大内容分批处理，避免阻塞UI
 * - 进度反馈：提供粘贴开始/结束/错误状态
 * - 队列管理：处理并发粘贴操作
 *
 * @param options - 配置选项
 * @returns 包含优化粘贴方法的对象
 *
 * @example
 * ```typescript
 * const { debouncedPaste, processBatchPaste } = useOptimizedPaste({
 *   onPasteStart: () => setLoading(true),
 *   onPasteEnd: () => setLoading(false),
 *   onPasteError: (error) => message.error('粘贴失败')
 * });
 * ```
 */
export const useOptimizedPaste = (options: UseOptimizedPasteOptions = {}) => {
  const pasteTimeoutRef = useRef<NodeJS.Timeout>();
  const isProcessingRef = useRef(false);
  const pasteQueueRef = useRef<Array<() => Promise<void>>>([]);

  /**
   * 防抖的粘贴处理函数
   *
   * 避免频繁的粘贴操作影响性能，通过队列管理并发请求
   *
   * @param pasteHandler - 实际执行粘贴操作的异步函数
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await debouncedPaste(async () => {
   *   // 执行具体的粘贴逻辑
   *   Editor.insertText(editor, pastedText);
   * });
   * ```
   */
  const debouncedPaste = useCallback(
    async (pasteHandler: () => Promise<void>) => {
      // 清除之前的定时器
      if (pasteTimeoutRef.current) {
        clearTimeout(pasteTimeoutRef.current);
      }

      // 如果正在处理，加入队列
      if (isProcessingRef.current) {
        pasteQueueRef.current.push(pasteHandler);
        return;
      }

      // 设置防抖延迟
      pasteTimeoutRef.current = setTimeout(async () => {
        try {
          isProcessingRef.current = true;
          options.onPasteStart?.();

          await pasteHandler();

          // 处理队列中的其他粘贴操作
          while (pasteQueueRef.current.length > 0) {
            const nextHandler = pasteQueueRef.current.shift();
            if (nextHandler) {
              await nextHandler();
            }
          }
        } catch (error) {
          console.error('粘贴处理失败:', error);
          options.onPasteError?.(error as Error);
        } finally {
          isProcessingRef.current = false;
          options.onPasteEnd?.();
        }
      }, PASTE_DEBOUNCE_DELAY);
    },
    [options],
  );

  /**
   * 检测内容大小并给出提示
   */
  const checkContentSize = useCallback((content: string) => {
    if (content.length > LARGE_CONTENT_THRESHOLD) {
      message.info(`检测到大量内容 (${content.length} 字符)，正在优化处理...`);
      return true;
    }
    return false;
  }, []);

  /**
   * 优化的文本插入函数
   */
  const optimizedInsertText = useCallback(
    async (editor: Editor, text: string, at?: any) => {
      const isLargeContent = checkContentSize(text);

      if (isLargeContent) {
        // 大内容分段插入
        const chunks = text.match(/.{1,1000}/g) || [text];

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];

          if (i === 0) {
            Transforms.insertText(editor, chunk, { at });
          } else {
            // 计算下一个插入位置
            const currentPath = at || editor.selection?.anchor.path;
            if (currentPath) {
              const nextPath = [
                ...currentPath.slice(0, -1),
                currentPath[currentPath.length - 1] + i,
              ];
              Transforms.insertText(editor, chunk, { at: nextPath });
            }
          }

          // 让出主线程
          if (i < chunks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 16));
          }
        }
      } else {
        // 小内容直接插入
        Transforms.insertText(editor, text, { at });
      }
    },
    [checkContentSize],
  );

  /**
   * 优化的节点插入函数
   */
  const optimizedInsertNodes = useCallback(
    async (
      editor: Editor,
      nodes: any[],
      at?: any,
      options?: { select?: boolean },
    ) => {
      const totalSize = JSON.stringify(nodes).length;
      const isLargeContent = totalSize > LARGE_CONTENT_THRESHOLD;

      if (isLargeContent) {
        message.info(`检测到大量节点 (${nodes.length} 个)，正在分段插入...`);

        // 分批插入节点
        const batchSize = 5;
        for (let i = 0; i < nodes.length; i += batchSize) {
          const batch = nodes.slice(i, i + batchSize);

          if (i === 0) {
            Transforms.insertNodes(editor, batch, { at, ...options });
          } else {
            const currentPath = at || editor.selection?.anchor.path;
            if (currentPath) {
              const nextPath = [
                ...currentPath.slice(0, -1),
                currentPath[currentPath.length - 1] + i,
              ];
              Transforms.insertNodes(editor, batch, {
                at: nextPath,
                select: options?.select && i + batchSize >= nodes.length,
              });
            }
          }

          // 让出主线程
          if (i + batchSize < nodes.length) {
            await new Promise((resolve) => setTimeout(resolve, 16));
          }
        }
      } else {
        // 小内容直接插入
        Transforms.insertNodes(editor, nodes, { at, ...options });
      }
    },
    [],
  );

  /**
   * 清理函数
   */
  const cleanup = useCallback(() => {
    if (pasteTimeoutRef.current) {
      clearTimeout(pasteTimeoutRef.current);
    }
    pasteQueueRef.current = [];
    isProcessingRef.current = false;
  }, []);

  return {
    debouncedPaste,
    optimizedInsertText,
    optimizedInsertNodes,
    checkContentSize,
    cleanup,
    isProcessing: isProcessingRef.current,
  };
};
