import { motion } from 'framer-motion';
import React from 'react';

const icon = {
  hidden: {
    fill: 'rgb(82,196,26,0.1)',
    x: -10,
  },
  visible: {
    fill: '#52C41A',
    x: 0,
  },
};

/**
 * FinishedIcon 组件 - 完成图标组件
 *
 * 该组件显示一个动画的完成图标，使用 framer-motion 实现动画效果。
 * 主要用于表示任务完成、成功状态或确认操作的 UI 元素。
 *
 * @component
 * @description 动画完成图标组件，支持动画效果
 * @example
 * ```tsx
 * import { FinishedIcon } from './icons/FinishedIcon';
 *
 * // 基本用法
 * <FinishedIcon />
 * ```
 *
 * @returns {React.ReactElement} 渲染的动画完成图标组件
 *
 * @remarks
 * - 使用 framer-motion 实现动画效果
 * - 包含隐藏和可见两种状态
 * - 动画包括颜色变化和位置移动
 * - 使用绿色主题色 (#52C41A)
 * - 使用 16x16 的 viewBox
 */
export const FinishedIcon = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      version="1.1"
      width="1em"
      height="1em"
      viewBox="0 0 16.33333396911621 16.333332061767578"
    >
      <motion.path
        d="M16.3333,8.16667C16.3333,12.677,12.677,16.3333,8.16667,16.3333C3.65634,16.3333,0,12.677,0,8.16667C0,3.65634,3.65634,0,8.16667,0C12.677,0,16.3333,3.65634,16.3333,8.16667ZM14.8482,8.16666C14.8482,11.8569,11.8566,14.8485,8.16636,14.8485C4.47609,14.8485,1.48454,11.8569,1.48454,8.16666C1.48454,4.47639,4.47609,1.48484,8.16636,1.48484C11.8566,1.48484,14.8482,4.47639,14.8482,8.16666ZM10.919,6.15685C10.629,5.86691,10.159,5.86691,9.86902,6.15685L7.42392,8.60062L6.46442,7.6417C6.17448,7.35176,5.70441,7.35176,5.41447,7.6417C5.12454,7.93163,5.12454,8.40171,5.41447,8.69164L6.89932,10.1765C7.18926,10.4664,7.65933,10.4664,7.94927,10.1765L10.919,7.20679C11.2089,6.91686,11.2089,6.44678,10.919,6.15685Z"
        fillRule="evenodd"
        fill="#52C41A"
        variants={icon}
        initial="hidden"
        animate="visible"
        whileInView="visible"
        transition={{
          fill: { duration: 0.5, ease: 'easeInOut' },
        }}
      />
    </motion.svg>
  );
};
