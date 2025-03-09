import { useLayoutEffect, useRef } from 'react';

const useAutoScroll = ({ SCROLL_TOLERANCE = 5 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollHeight = useRef<number>(0);
  const scrollTo = () => {
    containerRef.current?.scrollTo?.({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentScrollHeight = container.scrollHeight;

    // 判断用户是否在滚动底部附近
    const wasAtBottom =
      container.scrollTop + container.clientHeight >=
      lastScrollHeight.current - SCROLL_TOLERANCE;

    // 当内容高度变化且用户原本在底部时，自动滚动
    if (currentScrollHeight !== lastScrollHeight.current && wasAtBottom) {
      scrollTo();
    }

    // 始终记录最新滚动高度
    lastScrollHeight.current = currentScrollHeight;
  });

  return { containerRef, scrollTo };
};

export default useAutoScroll;
