import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { useStyle } from './style';

/**
 * Loading 组件 - 抽象艺术加载动画
 *
 * 该组件提供抽象艺术风格的加载动画效果，包含两个厚实的弯曲带状形状，
 * 带有蓝绿紫渐变效果，模仿现代艺术设计风格。
 *
 * @component
 * @description 抽象艺术风格的加载动画组件
 * @example
 * ```tsx
 * import { Loading } from './components/Loading';
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
 * @returns {React.ReactElement} 渲染的抽象艺术加载动画组件
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
          <linearGradient
            id="ribbon-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#37ABFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#5EF050" stopOpacity="1" />
            <stop offset="65%" stopColor="#D7B9FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#37ABFF" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* 第一个弯曲带状形状 - 左侧弧形 */}
      <motion.svg
        width="2em"
        height="2em"
        viewBox="0 0 200 200"
        style={{ position: 'absolute' }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <motion.path
          d="M 30 170 Q 40 30 90 50 Q 140 70 160 120 Q 150 170 110 160 Q 70 150 30 170 Z"
          fill="url(#ribbon-gradient)"
          stroke="none"
          animate={{
            d: [
              'M 30 170 Q 40 30 90 50 Q 140 70 160 120 Q 150 170 110 160 Q 70 150 30 170 Z',
              'M 35 165 Q 45 35 95 55 Q 145 75 165 125 Q 155 175 115 165 Q 75 155 35 165 Z',
              'M 30 170 Q 40 30 90 50 Q 140 70 160 120 Q 150 170 110 160 Q 70 150 30 170 Z',
            ],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </motion.svg>

      {/* 第二个弯曲带状形状 - 右侧D形 */}
      <motion.svg
        width="2em"
        height="2em"
        viewBox="0 0 200 200"
        style={{ position: 'absolute' }}
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <motion.path
          d="M 70 40 Q 90 30 110 50 Q 130 70 150 100 Q 170 140 150 160 Q 130 180 110 160 Q 90 140 70 120 Q 50 100 70 80 Q 90 60 110 60 Q 130 50 150 70 Q 170 90 150 110 Q 130 130 110 110 Q 90 90 70 70 Q 50 50 70 40 Z"
          fill="url(#ribbon-gradient)"
          stroke="none"
          animate={{
            d: [
              'M 70 40 Q 90 30 110 50 Q 130 70 150 100 Q 170 140 150 160 Q 130 180 110 160 Q 90 140 70 120 Q 50 100 70 80 Q 90 60 110 60 Q 130 50 150 70 Q 170 90 150 110 Q 130 130 110 110 Q 90 90 70 70 Q 50 50 70 40 Z',
              'M 75 45 Q 95 35 115 55 Q 135 75 155 105 Q 175 145 155 165 Q 135 185 115 165 Q 95 145 75 125 Q 55 105 75 85 Q 95 65 115 65 Q 135 55 155 75 Q 175 95 155 115 Q 135 135 115 115 Q 95 95 75 75 Q 55 55 75 45 Z',
              'M 70 40 Q 90 30 110 50 Q 130 70 150 100 Q 170 140 150 160 Q 130 180 110 160 Q 90 140 70 120 Q 50 100 70 80 Q 90 60 110 60 Q 130 50 150 70 Q 170 90 150 110 Q 130 130 110 110 Q 90 90 70 70 Q 50 50 70 40 Z',
            ],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </motion.svg>
    </div>,
  );
};
