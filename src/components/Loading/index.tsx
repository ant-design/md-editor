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
            <stop offset="55%" stopColor="#D7B9FF" stopOpacity="1" />
            <stop offset="75%" stopColor="#D7B9FF" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* 第一个椭圆 */}
      <motion.svg
        width="1em"
        height="1em"
        viewBox="0 0 100 100"
        style={{ position: 'absolute' }}
        animate={{
          rotate: [60, 420],
        }}
        transition={{
          duration: 2,
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
          strokeWidth="6"
          animate={{
            rx: [28, 32, 28],
            ry: [28, 10, 28],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </motion.svg>

      {/* 第二个椭圆 */}
      <motion.svg
        width="1em"
        height="1em"
        viewBox="0 0 100 100"
        style={{ position: 'absolute' }}
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 2,
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
          strokeWidth="6"
          animate={{
            rx: [10, 32, 28],
            ry: [32, 10, 28],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </motion.svg>
    </div>,
  );
};
