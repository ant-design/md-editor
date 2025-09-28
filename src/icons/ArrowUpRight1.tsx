import React from 'react';

/**
 * ArrowUpRight 组件 - 右上角箭头图标
 *
 * 该组件显示一个“右上角箭头”图标，支持自定义 SVG 属性。
 * 常用于表示“在新窗口打开”、“外链跳转”等操作。
 *
 * @component
 * @description 右上角箭头图标组件，支持自定义 SVG 属性
 * @param {React.SVGProps<SVGSVGElement>} props - SVG 属性
 *
 * @example
 * ```tsx
 * import { ArrowUpRight } from './icons/ArrowUpRight';
 *
 * // 基本用法
 * <ArrowUpRight />
 *
 * // 自定义样式
 * <ArrowUpRight className="text-gray-500" />
 * ```
 *
 * @returns {React.ReactElement} 渲染的右上角箭头图标组件
 *
 * @remarks
 * - 使用 1em x 1em 的尺寸
 * - 支持所有标准的 SVG 属性
 * - 使用 24x24 的 viewBox
 * - 使用 currentColor 继承父元素颜色
 */
export const ArrowUpRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      version="1.1"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g>
        <path
          d="M7,6L17,6C17.552300000000002,6,18,6.447715,18,7L18,17C18,17.552300000000002,17.552300000000002,18,17,18C16.447699999999998,18,16,17.552300000000002,16,17L16,9.41421L7.70742,17.7068C7.51957,17.8946,7.26522,18,7,18C6.447715,18,6,17.552300000000002,6,17C6,16.7348,6.105357,16.4804,6.292893,16.2929L14.58579,8L7,8C6.447715,8,6,7.55228,6,7C6,6.447715,6.447715,6,7,6Z"
          fillRule="evenodd"
          fill="currentColor"
          fillOpacity={1}
        />
      </g>
    </svg>
  );
};

export default ArrowUpRight;


