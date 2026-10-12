/**
 * 懒加载 PDF 跳转工具函数
 * 用于处理懒加载场景下的段落定位和强制加载
 */

import React, { useEffect, useRef, useState } from 'react';

/**
 * 获取元素相对于容器的偏移量
 */
export const getOffsetTop = (
  element: HTMLElement,
  container: HTMLElement,
): number => {
  return (
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    container.clientTop
  );
};

const pendingScrolls = new WeakMap<object, () => void>();

/**
 * 滚动到指定段落并强制加载（如果是占位符）
 *
 * @param paragraphId - 段落唯一ID
 * @param options - 配置选项
 * @returns 是否找到目标元素
 *
 * @example
 * ```tsx
 * // 基本使用
 * scrollToAndLoadParagraph('para-1');
 *
 * // 自定义容器
 * scrollToAndLoadParagraph('para-1', {
 *   containerRef: editorContainerRef
 * });
 *
 * // 自定义加载回调
 * scrollToAndLoadParagraph('para-1', {
 *   onLoad: (id) => console.log(`段落 ${id} 已加载`),
 * });
 * ```
 */
export const scrollToAndLoadParagraph = (
  paragraphId: string,
  options?: {
    /** 滚动容器的 ref */
    containerRef?: React.RefObject<HTMLElement | null>;
    /** 滚动动画持续时间（ms） */
    scrollDuration?: number;
    /** 强制加载延迟（ms），等待滚动动画完成 */
    forceLoadDelay?: number;
    /** 加载完成回调 */
    onLoad?: (paragraphId: string) => void;
    /** 是否启用滚动抖动（触发 IntersectionObserver） */
    enableScrollJitter?: boolean;
    /** 卸载或切换目标时取消待执行的加载和滚动 */
    signal?: AbortSignal;
  },
): boolean => {
  if (typeof document === 'undefined' || options?.signal?.aborted) return false;
  const {
    containerRef,
    forceLoadDelay = 600,
    onLoad,
    enableScrollJitter = true,
    signal,
  } = options || {};
  const container = containerRef?.current;
  const scope = container ?? document;
  pendingScrolls.get(scope)?.();
  // 限定到当前 demo，避免相同段落 ID 定位到其他演示实例。
  const targetElement = Array.from(
    scope.querySelectorAll<HTMLElement>('[data-content-id]'),
  ).find((element) => element.dataset.contentId === paragraphId);
  if (!targetElement) return false;

  const behavior =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
  if (container) {
    const top =
      getOffsetTop(targetElement, container) -
      container.clientHeight / 2 +
      targetElement.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, top), behavior });
  } else {
    targetElement.scrollIntoView({ behavior, block: 'center' });
  }

  if (targetElement.dataset.placeholder !== 'true') return true;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
    timers.forEach(clearTimeout);
    timers.clear();
    signal?.removeEventListener('abort', cancel);
    if (pendingScrolls.get(scope) === cancel) pendingScrolls.delete(scope);
  };
  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.delete(timer);
      if (!cancelled && !signal?.aborted && targetElement.isConnected)
        callback();
      if (!timers.size) cancel();
    }, delay);
    timers.add(timer);
  };
  pendingScrolls.set(scope, cancel);
  signal?.addEventListener('abort', cancel, { once: true });
  schedule(() => {
    targetElement.dispatchEvent(
      new CustomEvent('forceLoad', { bubbles: true, detail: { paragraphId } }),
    );
    onLoad?.(paragraphId);
  }, forceLoadDelay);

  if (enableScrollJitter) {
    schedule(() => {
      if (container) {
        const currentScroll = container.scrollTop;
        container.scrollTo({ top: currentScroll + 1 });
        schedule(() => {
          // 用户已继续滚动时，不能把位置写回旧值。
          if (container.scrollTop === currentScroll + 1) {
            container.scrollTo({ top: currentScroll });
          }
        }, 50);
      } else {
        const currentScroll = window.scrollY;
        window.scrollBy(0, 1);
        schedule(() => {
          if (window.scrollY === currentScroll + 1) window.scrollBy(0, -1);
        }, 50);
      }
    }, forceLoadDelay + 50);
  }
  return true;
};

/**
 * 自定义占位符组件（支持强制加载）
 */
export const ForceLoadPlaceholder: React.FC<{
  paragraphId: string;
  paragraphIndex: number;
  height: number;
  isIntersecting: boolean;
  style: React.CSSProperties;
  onForceLoad?: (id: string) => void;
}> = ({
  paragraphId,
  paragraphIndex,
  height,
  isIntersecting,
  style,
  onForceLoad,
}) => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let loadingTimer: ReturnType<typeof setTimeout> | undefined;
    const handleForceLoad = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetId = customEvent.detail?.paragraphId;

      if (targetId === paragraphId) {
        if (loadingTimer !== undefined) clearTimeout(loadingTimer);
        setIsLoading(true);
        onForceLoad?.(paragraphId);

        // 模拟加载延迟
        loadingTimer = setTimeout(() => {
          loadingTimer = undefined;
          setIsLoading(false);
        }, 500);
      }
    };

    const element = placeholderRef.current;
    if (element) {
      element.addEventListener('forceLoad', handleForceLoad);
      return () => {
        element.removeEventListener('forceLoad', handleForceLoad);
        if (loadingTimer !== undefined) clearTimeout(loadingTimer);
      };
    }
  }, [paragraphId, onForceLoad]);

  return (
    <div
      ref={placeholderRef}
      style={{
        ...style,
        height,
        minHeight: height,
        border: '2px dashed #d9d9d9',
        borderRadius: 8,
        backgroundColor: isLoading ? '#e6f7ff' : '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.2s',
      }}
      data-content-id={paragraphId}
      data-placeholder="true"
      className="pml-item pml-placeholder"
    >
      {isLoading ? (
        <div style={{ color: '#1890ff', fontSize: '14px' }}>
          🔄 强制加载中...
        </div>
      ) : (
        <>
          <div
            style={{
              color: isIntersecting ? '#52c41a' : '#999',
              fontSize: '14px',
              marginBottom: 8,
            }}
          >
            {isIntersecting ? '🔄 正在加载...' : '💤 等待加载'}
          </div>
          <div style={{ color: '#bbb', fontSize: '12px' }}>
            段落 #{paragraphIndex + 1}
          </div>
          <div
            style={{
              color: '#ddd',
              fontSize: '11px',
              fontFamily: 'monospace',
              marginTop: 4,
            }}
          >
            ID: {paragraphId}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * 批量绑定段落 ID 到元素
 *
 * @example
 * ```tsx
 * <BaseMarkdownEditor
 *   eleItemRender={(eleProps, defaultDom) => {
 *     return bindParagraphId(eleProps, defaultDom, paragraphIdList);
 *   }}
 * />
 * ```
 */
export const bindParagraphId = (
  eleProps: any,
  defaultDom: React.ReactElement,
  paragraphIdList: string[],
): React.ReactElement => {
  const elementIndex = eleProps.element?.index;
  const paragraphId = paragraphIdList[elementIndex] || '';

  return (
    <div data-content-id={paragraphId} className="pml-item">
      {defaultDom}
    </div>
  );
};
