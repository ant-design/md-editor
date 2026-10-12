'use client';

import {
  motion,
  useAnimationControls,
  useInView,
  type Transition,
  type UseInViewOptions,
} from 'framer-motion';
import * as React from 'react';
import { useAnimationVisibility } from '../../../hooks/useAnimationVisibility';

const DEFAULT_TRANSITION: Transition = {
  duration: 0.5,
  delay: 0.1,
  ease: 'easeOut',
};

const ENTRY_ANIMATION = {
  initial: { rotateX: 0 },
  animate: { rotateX: 90 },
};

const EXIT_ANIMATION = {
  initial: { rotateX: 90 },
  animate: { rotateX: 0 },
};

const formatCharacter = (char: string) => (char === ' ' ? '\u00A0' : char);

// 屏幕阅读器专用样式 (替代 Tailwind 的 sr-only)
const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
};

export type RollingTextProps = Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  transition?: Transition;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  text: string;
};

const RollingText = React.forwardRef<HTMLSpanElement, RollingTextProps>(
  (
    {
      transition = DEFAULT_TRANSITION,
      inView = false,
      inViewMargin = '0px',
      inViewOnce = true,
      text,
      style,
      ...props
    },
    ref,
  ) => {
    const localRef = React.useRef<HTMLSpanElement>(null);
    const entryControls = useAnimationControls();
    const exitControls = useAnimationControls();
    const { isVisible, reducedMotion } = useAnimationVisibility(localRef);

    // 合并外部 ref 和内部 ref
    React.useImperativeHandle(ref, () => localRef.current!);

    const inViewResult = useInView(localRef, {
      once: inViewOnce,
      margin: inViewMargin,
    });
    const isInView = !inView || inViewResult;

    const characters = React.useMemo(() => Array.from(text), [text]);
    const shouldAnimate = isInView && isVisible && !reducedMotion;

    // Replay the existing nodes instead of remounting every character each cycle.
    React.useEffect(() => {
      if (!shouldAnimate || !characters.length) return;
      let cancelled = false;
      let timer: ReturnType<typeof setTimeout>;
      const duration =
        'duration' in transition ? (transition.duration ?? 0.5) : 0.5;
      const stagger = transition.delay ?? 0.1;

      const runCycle = async () => {
        entryControls.set(ENTRY_ANIMATION.initial);
        exitControls.set({ ...EXIT_ANIMATION.initial, opacity: 1, y: '1px' });
        await Promise.all([
          entryControls.start((index: number) => ({
            ...ENTRY_ANIMATION.animate,
            transition: { ...transition, delay: index * stagger },
          })),
          exitControls.start((index: number) => ({
            ...EXIT_ANIMATION.animate,
            transition: { ...transition, delay: index * stagger + 0.3 },
          })),
        ]);
        if (!cancelled) timer = setTimeout(runCycle, duration * 1000 + 500);
      };
      void runCycle();

      return () => {
        cancelled = true;
        clearTimeout(timer);
        entryControls.stop();
        exitControls.stop();
      };
    }, [characters, entryControls, exitControls, shouldAnimate, transition]);

    if (reducedMotion) {
      return (
        <span ref={localRef} data-slot="rolling-text" style={style} {...props}>
          {text}
        </span>
      );
    }

    return (
      <span
        ref={localRef}
        data-slot="rolling-text"
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          ...style,
        }}
        {...props}
      >
        {characters.map((char, idx) => (
          <span
            key={idx}
            aria-hidden="true"
            style={{
              position: 'relative',
              display: 'inline-block',
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              width: 'auto',
              height: '1em',
              lineHeight: '1em',
              overflow: 'hidden',
            }}
          >
            {/* 第一层文字 */}
            <motion.span
              custom={idx}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'inline-block',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transformOrigin: '50% 25%',
                overflow: 'hidden',
                height: '1em',
                lineHeight: '1em',
              }}
              initial={ENTRY_ANIMATION.initial}
              animate={entryControls}
            >
              {formatCharacter(char)}
            </motion.span>

            {/* 第二层文字 */}
            <motion.span
              custom={idx}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'inline-block',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transformOrigin: '50% 100%',
                overflow: 'hidden',
                height: '1em',
                lineHeight: '1em',
              }}
              initial={{ ...EXIT_ANIMATION.initial, y: '1px' }}
              animate={exitControls}
            >
              {formatCharacter(char)}
            </motion.span>

            {/* 占位符，用于撑起高度 */}
            <span
              style={{
                visibility: 'hidden',
                display: 'inline-block',
                height: '1em',
                lineHeight: '1em',
              }}
            >
              {formatCharacter(char)}
            </span>
          </span>
        ))}

        {/* 辅助功能：文本读取 */}
        <span style={srOnlyStyle}>{text}</span>
      </span>
    );
  },
);

RollingText.displayName = 'RollingText';

export { RollingText };
