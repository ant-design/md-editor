import React, { useEffect, useRef, useState } from 'react';

/**
 * LazyElement 组件属性
 */
export interface LazyElementProps {
  /** 元素在文档中的位置信息 */
  elementInfo: {
    /** 元素类型 */
    type: string;
    /** 元素在文档中的索引 */
    index: number;
    /** 元素总数量 */
    total: number;
  };
  /** 子元素 */
  children: React.ReactNode;
  /** 占位符高度，默认 100px */
  placeholderHeight?: number;
  /** 根边距，用于提前加载，默认 '200px' */
  rootMargin?: string;
  /** 占位符样式 */
  placeholderStyle?: React.CSSProperties;
  /** 自定义占位符渲染函数 */
  renderPlaceholder?: (props: {
    /** 占位符高度 */
    height: number;
    /** 占位符样式 */
    style: React.CSSProperties;
    /** 元素是否即将进入视口 */
    isIntersecting: boolean;
    /** 元素在文档中的位置信息 */
    elementInfo: {
      /** 元素类型 */
      type: string;
      /** 元素在文档中的索引 */
      index: number;
      /** 元素总数量 */
      total: number;
    };
  }) => React.ReactNode;
}

/**
 * LazyElement 组件 - 懒加载元素包裹器
 *
 * 使用 IntersectionObserver API 实现元素的懒加载渲染。
 * 只有当元素进入视口时才会真正渲染内容，否则显示占位符。
 * 这可以显著提升大型文档的渲染性能。
 *
 * @component
 * @description 基于 IntersectionObserver 的懒加载包裹器
 * @param {LazyElementProps} props - 组件属性
 * @param {React.ReactNode} props.children - 需要懒加载的子元素
 * @param {number} [props.placeholderHeight=100] - 占位符高度
 * @param {string} [props.rootMargin='200px'] - 提前加载的距离
 * @param {React.CSSProperties} [props.placeholderStyle] - 自定义占位符样式
 * @param {Function} [props.renderPlaceholder] - 自定义占位符渲染函数
 *
 * @example
 * ```tsx
 * // 基本使用
 * <LazyElement placeholderHeight={150} rootMargin="300px">
 *   <div>这是需要懒加载的内容</div>
 * </LazyElement>
 *
 * // 自定义占位符渲染
 * <LazyElement
 *   placeholderHeight={150}
 *   renderPlaceholder={({ height, style, isIntersecting }) => (
 *     <div style={style}>
 *       <div>加载中... {isIntersecting ? '(即将显示)' : ''}</div>
 *     </div>
 *   )}
 * >
 *   <div>这是需要懒加载的内容</div>
 * </LazyElement>
 * ```
 *
 * @returns {React.ReactElement} 渲染的懒加载元素
 *
 * @remarks
 * - 使用 IntersectionObserver 监听元素是否进入视口
 * - 元素一旦被渲染后将保持渲染状态（不会卸载）
 * - 提供 rootMargin 参数可以提前加载元素
 * - 占位符保持与内容相同的高度以避免布局抖动
 */
export const LazyElement: React.FC<LazyElementProps> = ({
  children,
  placeholderHeight = 25,
  rootMargin = '200px',
  placeholderStyle,
  renderPlaceholder,
  elementInfo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 创建 IntersectionObserver 实例
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasRendered(true);
            // 元素已经渲染后，不再需要观察
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  // 一旦渲染过就保持渲染状态
  if (hasRendered || isVisible) {
    return <div ref={containerRef}>{children}</div>;
  }

  // 渲染占位符
  const computedPlaceholderStyle: React.CSSProperties = {
    minHeight: placeholderHeight,
    ...placeholderStyle,
  };

  // 如果提供了自定义渲染函数，使用它来渲染占位符
  if (renderPlaceholder) {
    return (
      <div ref={containerRef} aria-hidden="true">
        {renderPlaceholder({
          height: placeholderHeight,
          style: computedPlaceholderStyle,
          isIntersecting,
          elementInfo,
        })}
      </div>
    );
  }

  // 默认占位符渲染
  return (
    <div
      ref={containerRef}
      style={computedPlaceholderStyle}
      aria-hidden="true"
    />
  );
};
