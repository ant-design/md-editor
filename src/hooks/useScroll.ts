import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ObserveDOM from '@better-scroll/observe-dom';
import ScrollBar from '@better-scroll/scroll-bar';
import { useEffect, useRef } from 'react';

BScroll.use(ObserveDOM);
BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

export const useScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollInstance = useRef<BScroll | null>(null);
  const timer = useRef<number | null>(null);
  const lock = useRef(false);
  const observer = useRef<MutationObserver | null>(null);

  const lockScroll = () => {
    lock.current = true;
  };
  const unlockScroll = () => {
    lock.current = false;
  };
  const scrollToBottom = () => {
    if (lock.current) return;
    setTimeout(() => {
      scrollInstance.current?.scrollTo(
        0,
        scrollInstance.current?.maxScrollY,
        300,
      );
    }, 100);
  };
  const watchDom = (node: HTMLDivElement) => {
    if (!node) return;
    observer.current = new MutationObserver(() => {
      scrollToBottom();
    });
    observer.current.observe(node, {
      childList: true, // 监听子元素变化
      subtree: true, // 监听所有后代
      attributes: false,
      characterData: false,
    });
  };
  useEffect(() => {
    timer.current = window.setInterval(() => {
      if (containerRef.current) {
        scrollInstance.current = new BScroll(containerRef.current, {
          //probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
          probetype: 3,
          //  可以使用原生的点击
          click: true,
          //  检测dom变化
          observeDOM: true,
          //  鼠标滚轮设置
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300,
          },
          //  显示滚动条
          scrollY: true,
          scrollbar: true,
          //  过度动画, 在下载更多的时候滚动条会有个过度动画
          useTransition: true,
        });
        watchDom(containerRef.current);
        scrollToBottom();
        scrollInstance.current?.on('mousewheelEnd', () => {
          const scrollY = scrollInstance.current?.y;
          if (scrollY === scrollInstance.current?.maxScrollY) {
            lock.current = false;
          } else {
            lock.current = true;
          }
        });
        clearInterval(timer.current as number);
      }
    }, 100);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        scrollInstance.current?.destroy();
      }
    };
  }, []);

  return {
    containerRef,
    scrollToBottom,
    lockScroll,
    unlockScroll,
  };
};
