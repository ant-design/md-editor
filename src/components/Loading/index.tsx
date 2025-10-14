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
  const circle1Ref = useRef<SVGEllipseElement>(null);
  const circle2Ref = useRef<SVGEllipseElement>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // 生成唯一的 mask ID，确保多实例不冲突
  const uniqueId = useId();
  const circle1MaskId = `circle1-mask-${uniqueId}`;
  const circle2MaskId = `circle2-mask-${uniqueId}`;

  const { wrapSSR, hashId } = useStyle(prefixCls);

  useEffect(() => {
    if (
      !wrapper1Ref.current ||
      !wrapper2Ref.current ||
      !circle1Ref.current ||
      !circle2Ref.current
    ) {
      return;
    }

    const circle1 = circle1Ref.current;
    const circle2 = circle2Ref.current;
    const wrapper1 = wrapper1Ref.current;
    const wrapper2 = wrapper2Ref.current;

    // 初始化 circle1
    gsap.set(circle1, {
      rotation: 30,
      transformOrigin: 'center center',
      attr: { rx: 32 },
    });

    // 旋转第一个圆环
    const rotateCircle1 = gsap.timeline();
    rotateCircle1
      .to(circle1, {
        rotation: 30 - 30 - 30 - 15 - 90 - 45,
        duration: 1.58,
      })
      .to(circle1, {
        rotation: 30 - 30 - 30 - 15 - 90 - 45 + 30 + 30 + 30 + 120,
        duration: 1.42,
      });

    // 模拟 circle1 的 3D 效果（通过改变 rx）
    const fake3dCircle1 = gsap.timeline();
    fake3dCircle1
      .to(circle1, { attr: { rx: 0 }, duration: 0.77 })
      .to(circle1, { attr: { rx: 8 }, duration: 0.27 })
      .to(circle1, { attr: { rx: 0 }, duration: 0.1 })
      .to(circle1, { attr: { rx: 24 }, duration: 0.32 })
      .to(circle1, { attr: { rx: 0 }, duration: 0.33 })
      .to(circle1, { attr: { rx: 16 }, duration: 0.33 })
      .to(circle1, { attr: { rx: 0 }, duration: 0.33 })
      .to(circle1, { attr: { rx: 30 }, duration: 0.38 })
      .to(circle1, { attr: { rx: 32 }, duration: 0.5 });

    // 初始化 circle2
    gsap.set(circle2, {
      rotation: 300,
      transformOrigin: 'center center',
      attr: { rx: 12 },
    });

    // 旋转第二个圆环
    const rotateCircle2 = gsap.timeline();
    rotateCircle2
      .to(circle2, {
        rotation: 300 - 25 - 90,
        duration: 1.25,
      })
      .to(circle2, {
        rotation: 300 - 25 - 90 + 180,
        duration: 1.05,
      })
      .to(circle2, {
        rotation: 300 - 25 - 90 + 180 - 25 - 40,
        duration: 0.7,
      });

    // 模拟 circle2 的 3D 效果（通过改变 rx）
    const fake3dCircle2 = gsap.timeline();
    fake3dCircle2
      .to(circle2, { attr: { rx: 0 }, duration: 0.45 })
      .to(circle2, { attr: { rx: 16 }, duration: 0.32 })
      .to(circle2, { attr: { rx: 0 }, duration: 0.48 })
      .to(circle2, { attr: { rx: 8 }, duration: 0.25 })
      .to(circle2, { attr: { rx: 0 }, duration: 0.1 })
      .to(circle2, { attr: { rx: 28 }, duration: 0.4 })
      .to(circle2, { attr: { rx: 0 }, duration: 0.3 })
      .to(circle2, {
        attr: { rx: 12 },
        duration: 0.7,
        ease: 'slow(0.7,0.7,true)',
      });

    // 设置渐变初始状态
    gsap.set([wrapper1, wrapper2], {
      rotation: 0,
      transformOrigin: 'center center',
    });

    // 旋转 wrapper1 渐变（顺时针）
    const rotateGradientCircle1 = gsap.timeline();
    rotateGradientCircle1.to(wrapper1, {
      rotation: 360,
      duration: 3,
    });

    // 旋转 wrapper2 渐变（逆时针）
    const rotateGradientCircle2 = gsap.timeline();
    rotateGradientCircle2.to(wrapper2, {
      rotation: -360,
      duration: 3,
    });

    // 创建主时间线，包含所有动画
    const masterTimeline = gsap.timeline({
      repeat: -1,
      ease: 'sine.inOut',
    });

    // 将所有动画添加到主时间线中（同时开始）
    masterTimeline
      .add(rotateCircle1, 0)
      .add(fake3dCircle1, 0)
      .add(rotateCircle2, 0)
      .add(fake3dCircle2, 0)
      .add(rotateGradientCircle1, 0)
      .add(rotateGradientCircle2, 0);

    masterTimelineRef.current = masterTimeline;

    // 清理动画
    return () => {
      masterTimeline.kill();
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
              ref={circle1Ref}
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
              ref={circle2Ref}
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
