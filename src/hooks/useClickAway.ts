import { useEffect } from 'react';

const EVENT = 'mousedown';

/**
 * 监听鼠标点击事件，并对点击事件的目标元素执行回调函数
 *
 * @param ref - 被监听的元素引用
 * @param callback - 点击事件的回调函数
 */
const useClickAway = (callback: any, ref: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    /**
     * 鼠标点击事件的监听函数
     *
     * @param event - 鼠标点击事件对象
     */
    const listener = (event: { target: any }) => {
      // 如果ref为null或ref.current为null，或者ref.current包含事件目标元素，则不做任何操作
      if (
        !ref ||
        !ref.current ||
        ref.current.contains(event.target) ||
        ref.current.parentNode?.contains(event.target)
      ) {
        return;
      }
      // 执行回调函数，并传递事件对象
      callback(event);
    };
    // 监听全局鼠标点击事件，并执行listener函数
    document.addEventListener(EVENT, listener);
    // 在组件卸载时，移除鼠标点击事件监听
    return () => {
      document.removeEventListener(EVENT, listener);
    };
  }, [ref, callback]);
};

export default useClickAway;
