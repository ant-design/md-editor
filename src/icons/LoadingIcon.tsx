import { Keyframes } from '@ant-design/cssinjs';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';
import { useEditorStyleRegister } from '../hooks/useStyle';

const C = 2 * 7 * Math.PI;
const loadingDash = new Keyframes('loadingDash', {
  '0%': {
    strokeDasharray: `${0.7 * C}, ${0.3 * C}`,
    strokeDashoffset: '0',
  },
  '50%': {
    strokeDasharray: `${0.7 * C}, ${0.3 * C}`,
    strokeDashoffset: -0.4 * C,
  },
  '100%': {
    strokeDasharray: `${0.7 * C}, ${0.3 * C}`,
    strokeDashoffset: -C,
  },
});

const loadingRotate = new Keyframes('rotate', {
  '0%': {
    transform: 'rotate(0)',
  },

  '100%': {
    transform: 'rotate(0deg)',
  },
});

const icon = {
  hidden: {
    x: -10,
  },
  visible: {
    x: 0,
  },
};

/**
 * ActionItemBox
 * @param prefixCls
 * @returns
 */
function useIconStyle(prefixCls?: string) {
  return useEditorStyleRegister('ThoughtChainList-loading-icon', (token) => {
    const proChatToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [
      {
        [`${proChatToken.componentCls}`]: {
          animationName: loadingRotate,
          animationDuration: '2s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          '&-loading-icon': {
            animationName: loadingDash,
            animationDuration: '1.5s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          },
        },
      },
    ];
  });
}

/**
 * LoadingIcon 组件 - 加载图标组件
 *
 * 该组件显示一个动画的加载图标，使用 framer-motion 和 CSS 动画实现旋转和描边动画效果。
 * 主要用于表示加载状态、处理中或等待的 UI 元素。
 *
 * @component
 * @description 动画加载图标组件，支持旋转和描边动画效果
 * @example
 * ```tsx
 * import { LoadingIcon } from './icons/LoadingIcon';
 *
 * // 基本用法
 * <LoadingIcon />
 * ```
 *
 * @returns {React.ReactElement} 渲染的动画加载图标组件
 *
 * @remarks
 * - 使用 framer-motion 实现位置动画
 * - 使用 CSS Keyframes 实现旋转和描边动画
 * - 包含渐变色彩效果
 * - 使用 1em x 1em 的尺寸
 * - 使用 16x16 的 viewBox
 * - 双圆环设计，外圆为背景，内圆为动画进度
 */
export const LoadingIcon = (props: { style?: React.CSSProperties }) => {
  const { wrapSSR, hashId } = useIconStyle('thoughtChainList');
  return wrapSSR(
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      version="1.1"
      width="1em"
      height="1em"
      className={classNames(`thoughtChainList`, hashId)}
      viewBox="0 0 16 16"
      variants={icon}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      transition={{
        fill: { duration: 0.5, ease: 'easeInOut' },
      }}
      style={props.style}
    >
      <defs>
        <linearGradient
          x1="0.009207146242260933"
          y1="0.05352184548974037"
          x2={1}
          y2="0.5"
          id="master_svg0_55_45978"
        >
          <stop offset="0%" stopColor="#FFC5F8" stopOpacity={1} />
          <stop
            offset="18.979576230049133%"
            stopColor="#FFEB9B"
            stopOpacity={1}
          />
          <stop offset="100%" stopColor="#38FAFF" stopOpacity={1} />
        </linearGradient>
        <linearGradient
          x1="9.054389182860945e-15"
          y1="0.5"
          x2={1}
          y2="0.5"
          id="master_svg1_55_45979"
        >
          <stop
            offset="0%"
            stopColor="#9544FF"
            stopOpacity="0.7799999713897705"
          />
          <stop
            offset="28.77579629421234%"
            stopColor="#805DFF"
            stopOpacity={1}
          />
          <stop
            offset="58.91807675361633%"
            stopColor="#4177FF"
            stopOpacity={1}
          />
          <stop
            offset="100%"
            stopColor="#4BFFB4"
            stopOpacity="0.6399999856948853"
          />
        </linearGradient>
      </defs>
      <motion.circle
        fillRule="evenodd"
        cx="8"
        cy="8"
        stroke="#eee"
        strokeWidth="2"
        r={7}
      />
      <motion.circle
        fillRule="evenodd"
        cx="8"
        cy="8"
        stroke="url(#master_svg1_55_45979)"
        strokeWidth="2"
        className={classNames(`thoughtChainList-loading-icon`, hashId)}
        r={7}
      />
    </motion.svg>,
  );
};
