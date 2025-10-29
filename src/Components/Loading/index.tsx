import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { useStyle } from './style';

/**
 * Loading 组件 - 加载动画组件
 *
 * 该组件提供一个简单的加载动画效果，包含两个旋转的椭圆形。
 * 主要用于在数据加载或处理过程中提供视觉反馈。
 *
 * @component
 * @description 加载动画组件，显示两个旋转变形的椭圆
 * @example
 * ```tsx
 * import { Loading } from './Components/Loading';
 *
 * function App() {
 *   return (
 *     <div>
 *       <Loading />
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {React.ReactElement} 渲染的加载动画组件
 */
export const Loading = (props: React.SVGProps<HTMLDivElement>) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('loading-container');
  const { wrapSSR, hashId } = useStyle(prefixCls);

  return wrapSSR(
    <div
      className={classNames(prefixCls, hashId)}
      data-testid="loading-container"
      {...props}
    >
      {/* 定义渐变 */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="60%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5EF050" stopOpacity="1" />
            <stop offset="20%" stopColor="#37ABFF" stopOpacity="1" />
            <stop offset="55%" stopColor="#D7B9FF" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#D7B9FF" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="gradient1" x1="60%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5EF050" stopOpacity="1" />
            <stop offset="20%" stopColor="#37ABFF" stopOpacity="1" />
            <stop offset="55%" stopColor="#D7B9FF" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#D7B9FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>

      <div
        style={{
          ...props.style,
          width: '1em',
          height: '1em',
        }}
      >
        {/* 第一个椭圆 - Circle2 (对应 wrapper2) */}
        <motion.svg
          width="1em"
          height="1em"
          viewBox="0 0 100 100"
          style={{ position: 'absolute' }}
          animate={{
            rotate: [-360, 0], // wrapper2 逆时针旋转渐变
          }}
          transition={{
            duration: 3,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          <motion.ellipse
            cx="50"
            cy="50"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="10"
            style={{ transformOrigin: 'center center' }}
            animate={{
              // 旋转动画：rotation: 300 → (300-25-90=185) → (185+180=365) → (365-25-40=300)
              rotate: [300, 185, 365, 300],
              // rx 动画：12 → 0 → 16 → 0 → 8 → 0 → 28 → 0 → 12
              rx: [12, 0, 16, 0, 8, 0, 28, 0, 12],
              ry: 32, // 保持固定
            }}
            transition={{
              rotate: {
                duration: 3,
                ease: 'linear',
                times: [0, 0.4167, 0.7667, 1], // 1.25/3, 2.3/3, 1
                repeat: Infinity,
                repeatType: 'loop',
              },
              rx: {
                duration: 3,
                ease: 'linear',
                times: [
                  0, 0.15, 0.2567, 0.4167, 0.5, 0.5333, 0.6667, 0.7667, 1,
                ],
                repeat: Infinity,
                repeatType: 'loop',
              },
            }}
          />
        </motion.svg>

        {/* 第二个椭圆 - Circle1 (对应 wrapper1) */}
        <motion.svg
          width="1em"
          height="1em"
          viewBox="0 0 100 100"
          style={{ position: 'absolute' }}
          animate={{
            rotate: [0, -360], // wrapper1 顺时针旋转渐变
          }}
          transition={{
            duration: 3,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          <motion.ellipse
            cx="50"
            cy="50"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="10"
            style={{ transformOrigin: 'center center' }}
            animate={{
              // 旋转动画：rotation: 30 → (30-30-30-15-90-45=-180) → (-180+30+30+30+120=30)
              rotate: [30, -280, 30],
              // rx 动画：32 → 0 → 8 → 0 → 24 → 0 → 16 → 0 → 30 → 32
              rx: [32, 0, 8, 0, 24, 0, 16, 0, 30, 32],
              ry: 32, // 保持固定
            }}
            transition={{
              rotate: {
                duration: 3,
                ease: 'linear',
                times: [0, 0.5267, 1], // 1.58/3, 1
                repeat: Infinity,
                repeatType: 'loop',
              },
              rx: {
                duration: 3,
                ease: 'linear',
                times: [
                  0, 0.2567, 0.3467, 0.38, 0.4867, 0.5967, 0.7067, 0.8167,
                  0.9433, 1,
                ],
                repeat: Infinity,
                repeatType: 'loop',
              },
            }}
          />
        </motion.svg>
      </div>
    </div>,
  );
};
