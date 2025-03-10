import { useDebounceFn } from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';

const SCROLL_TOLERANCE = 20; // 滚动到底部的容差阈值

export const useAutoScroll = <T extends HTMLDivElement>(
  props: {
    SCROLL_TOLERANCE?: number;
    onResize?: (size: { width: number; height: number }) => void;
    deps?: any[];
  } = {
    SCROLL_TOLERANCE,
  },
) => {
  const containerRef = useRef<T | null>(null);
  const lastScrollHeight = useRef(0);
  const isLocked = useRef(false); // 用户滚动锁定状态
  const observer = useRef<MutationObserver | null>(null);

  // 主滚动逻辑
  const _checkScroll = async (force = false) => {
    const container = containerRef.current;
    if (!container) return;

    props.onResize?.({
      width: container.clientWidth,
      height: container.clientHeight,
    });

    const currentScrollHeight = container.scrollHeight;
    const prevScrollHeight = lastScrollHeight.current;

    // 计算用户是否在底部区域
    const isNearBottom =
      container.scrollTop + container.clientHeight >=
      prevScrollHeight - (props?.SCROLL_TOLERANCE || SCROLL_TOLERANCE);

    // 触发滚动的情况：
    // 1. 强制滚动（手动触发）
    // 2. 内容高度增加且用户原本在底部
    const shouldScroll =
      force ||
      (currentScrollHeight > prevScrollHeight &&
        (isNearBottom || isLocked.current));

    if (shouldScroll) {
      container.scrollTo({
        top: currentScrollHeight,
        behavior: 'smooth',
      });
      isLocked.current = false; // 滚动后解除锁定
    }

    lastScrollHeight.current = currentScrollHeight;
  };
  const checkScroll = useDebounceFn(_checkScroll, 32);
  // DOM 变化监听（MutationObserver）
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observer.current = new MutationObserver((mutations) => {
      checkScroll.cancel();
      // 过滤出添加节点的变化
      const hasAddedNodes = mutations.some((m) => m.addedNodes.length > 0);
      if (hasAddedNodes) checkScroll.run();
    });

    observer.current.observe(container, {
      childList: true, // 监听子元素变化
      subtree: true, // 监听所有后代
      attributes: false,
      characterData: false,
    });

    return () => observer.current?.disconnect();
  }, [...(props.deps || [])]);

  // 暴露手动滚动方法
  const scrollToBottom = () => {
    checkScroll.run(true);
  };

  return {
    containerRef,
    scrollToBottom,
  } as const;
};

export default useAutoScroll;
