import React from 'react';

/**
 * PlusIcon 组件 - 加号图标组件
 *
 * 该组件显示一个加号图标，支持自定义 SVG 属性。
 * 主要用于表示添加、创建或扩展相关的 UI 元素。
 *
 * @component
 * @description 加号图标组件，支持自定义 SVG 属性
 * @param {React.SVGProps<SVGSVGElement>} props - SVG 属性
 *
 * @example
 * ```tsx
 * import { PlusIcon } from './icons/PlusIcon';
 *
 * // 基本用法
 * <PlusIcon />
 *
 * // 自定义样式
 * <PlusIcon className="custom-icon" />
 * ```
 *
 * @returns {React.ReactElement} 渲染的加号图标组件
 *
 * @remarks
 * - 使用 1em x 1em 的尺寸
 * - 支持所有标准的 SVG 属性
 * - 使用 10x10 的 viewBox
 * - 使用 currentColor 继承父元素颜色
 * - 显示十字形状的加号图标
 */
export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      version="1.1"
      width={'1em'}
      height={'1em'}
      viewBox="0 0 10.65625 10.6640625"
    >
      <g>
        <path
          d="M4.65792,0.665C4.65792,0.297731,4.95565,0,5.32292,0C5.69019,0,5.98792,0.297731,5.98792,0.665L5.98958,0.665L5.98958,4.66406L9.99833,4.66406L9.99833,4.66573C10.3656,4.66573,10.6633,4.96346,10.6633,5.33073C10.6633,5.698,10.3656,5.99573,9.99833,5.99573L9.99833,5.9974L5.98958,5.9974L5.98958,9.99833L5.98792,9.99833C5.98792,10.3656,5.69019,10.6633,5.32292,10.6633C4.95565,10.6633,4.65792,10.3656,4.65792,9.99833L4.65625,9.99833L4.65625,5.9974L0.665,5.9974L0.665,5.99573C0.297731,5.99573,0,5.698,0,5.33073C0,4.96346,0.297731,4.66573,0.665,4.66573L0.665,4.66406L4.65625,4.66406L4.65625,0.665L4.65792,0.665Z"
          fillRule="evenodd"
          fill="currentColor"
          fillOpacity={1}
        />
      </g>
    </svg>
  );
};
