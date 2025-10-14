import gsap from 'gsap';
import React, { useEffect, useId, useRef } from 'react';
import { useStyle } from './style';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 自定义类名前缀
   */
  prefixCls?: string;
}

/**
 * Loading 组件 - 加载动画组件
 *
 * 使用 GSAP 和 SVG mask 实现复杂的 3D 旋转动画效果
 *
 * @component
 * @description 加载动画组件，提供流畅的 3D 旋转动画效果
 * @param {LoadingProps} props - 组件属性
 * @param {string} [props.prefixCls='ant-loading-container'] - 自定义类名前缀
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {string} [props.className] - 自定义类名
 *
 * @example
 * ```tsx
 * // 基础用法
 * <Loading />
 *
 * // 自定义大小
 * <Loading style={{ fontSize: 64 }} />
 *
 * // 在文本中使用
 * <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 *   <span>加载中</span>
 *   <Loading />
 * </div>
 * ```
 *
 * @returns {React.ReactElement} 渲染的加载动画组件
 *
 * @remarks
 * - 使用 GSAP 动画库实现流畅的动画效果
 * - 使用 SVG mask 实现椭圆形遮罩
 * - 使用 conic-gradient 创建渐变背景
 * - 支持响应式缩放（使用 em 单位）
 * - 支持多实例（自动生成唯一的 mask ID）
 */
export const Loading: React.FC<LoadingProps> = ({
  prefixCls = 'ant-loading-container',
  style,
  className,
  ...rest
}) => {
  const wrapper1Ref = useRef<HTMLDivElement>(null);
  const wrapper2Ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // 生成唯一的 mask ID，确保多实例不冲突
  const uniqueId = useId();
  const circle1MaskId = `circle1-mask-${uniqueId}`;
  const circle2MaskId = `circle2-mask-${uniqueId}`;

  const { wrapSSR, hashId } = useStyle(prefixCls);

  useEffect(() => {
    if (!wrapper1Ref.current || !wrapper2Ref.current) return;

    // 初始化位置和旋转角度
    gsap.set(wrapper1Ref.current, { rotationY: 0, rotation: 30 });
    gsap.set(wrapper2Ref.current, { rotationY: 90, rotation: 300 });

    // 创建时间轴动画
    const tl = gsap.timeline({ repeat: -1 });

    // 第一个圆环的动画
    tl.to(
      wrapper1Ref.current,
      {
        rotationY: 360,
        duration: 2,
        ease: 'linear',
      },
      0,
    );

    // 第二个圆环的动画（偏移 90 度）
    tl.to(
      wrapper2Ref.current,
      {
        rotationY: 450,
        duration: 2,
        ease: 'linear',
      },
      0,
    );

    timelineRef.current = tl;

    // 清理动画
    return () => {
      tl.kill();
    };
  }, []);

  return wrapSSR(
    <div
      data-testid="loading-container"
      className={`${prefixCls} ${hashId} ${className || ''}`}
      style={style}
      {...rest}
    >
      <div
        style={{
          position: 'relative',
          width: '1em',
          height: '1em',
        }}
      >
        {/* 第一个 wrapper */}
        <div
          ref={wrapper1Ref}
          className={`${prefixCls}-wrapper1`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `conic-gradient(
              from 240deg at 55% 55%,
              transparent 0%,
              #5EF050 15%,
              #5EF050 40%,
              #37ABFF 60%,
              #37ABFF 65%,
              #D7B9FF 80%,
              transparent 90%
            )`,
            mask: `url(#${circle1MaskId})`,
            WebkitMask: `url(#${circle1MaskId})`,
          }}
        />

        {/* 第二个 wrapper */}
        <div
          ref={wrapper2Ref}
          className={`${prefixCls}-wrapper2`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `conic-gradient(
              from 225deg at 20% 80%,
              transparent 0%,
              #5EF050 50%,
              #37ABFF 60%,
              transparent 100%
            )`,
            mask: `url(#${circle2MaskId})`,
            WebkitMask: `url(#${circle2MaskId})`,
          }}
        />
      </div>

      {/* SVG mask 定义 */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <defs>
          <mask id={circle1MaskId}>
            <ellipse
              rx="32"
              ry="32"
              cx="50"
              cy="50"
              fill="none"
              stroke="white"
              strokeWidth="8"
            />
          </mask>
          <mask id={circle2MaskId}>
            <ellipse
              rx="12"
              ry="32"
              cx="50"
              cy="50"
              fill="none"
              stroke="white"
              strokeWidth="8"
            />
          </mask>
        </defs>
      </svg>
    </div>,
  );
};

export default Loading;
