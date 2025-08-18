import React from 'react';

interface DocIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * DocIcon 组件 - 文档图标组件
 *
 * 该组件显示一个文档图标，支持自定义大小和 SVG 属性。
 * 主要用于表示文档相关的 UI 元素。
 *
 * @component
 * @description 文档图标组件，支持自定义大小和 SVG 属性
 * @param {DocIconProps} props - 组件属性
 * @param {number} [props.size=16] - 图标大小（像素）
 * @param {React.SVGProps<SVGSVGElement>} props - 其他 SVG 属性
 *
 * @example
 * ```tsx
 * import { DocIcon } from './components/icons/DocIcon';
 *
 * // 基本用法
 * <DocIcon size={24} />
 *
 * // 自定义样式
 * <DocIcon size={20} className="custom-icon" />
 * ```
 *
 * @returns {React.ReactElement} 渲染的文档图标组件
 *
 * @remarks
 * - 默认大小为 16px
 * - 支持所有标准的 SVG 属性
 * - 包含 data-testid="doc-icon" 用于测试
 */
export const DocIcon: React.FC<DocIconProps> = ({ size = 16, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      data-testid="doc-icon"
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.33333 1.33333C2.59695 1.33333 2 1.93028 2 2.66667V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V5.33333L10 1.33333H3.33333ZM3.33333 2.66667H9.33333V6H12.6667V13.3333H3.33333V2.66667Z"
        fill="#4E5969"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.33333 8H10.6667V9.33333H5.33333V8ZM5.33333 10.6667H10.6667V12H5.33333V10.6667Z"
        fill="#4E5969"
      />
    </svg>
  );
};
