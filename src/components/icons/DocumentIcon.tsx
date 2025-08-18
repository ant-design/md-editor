import React from 'react';

interface DocumentIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * DocumentIcon 组件 - 文档图标组件
 *
 * 该组件显示一个文档图标，支持自定义大小和 SVG 属性。
 * 主要用于表示文档相关的 UI 元素，与 DocIcon 类似但尺寸更大。
 *
 * @component
 * @description 文档图标组件，支持自定义大小和 SVG 属性
 * @param {DocumentIconProps} props - 组件属性
 * @param {number} [props.size=22] - 图标大小（像素）
 * @param {React.SVGProps<SVGSVGElement>} props - 其他 SVG 属性
 *
 * @example
 * ```tsx
 * import { DocumentIcon } from './components/icons/DocumentIcon';
 *
 * // 基本用法
 * <DocumentIcon size={24} />
 *
 * // 自定义样式
 * <DocumentIcon size={20} className="custom-icon" />
 * ```
 *
 * @returns {React.ReactElement} 渲染的文档图标组件
 *
 * @remarks
 * - 默认大小为 22px（比 DocIcon 稍大）
 * - 支持所有标准的 SVG 属性
 * - 使用 22x22 的 viewBox
 */
export const DocumentIcon: React.FC<DocumentIconProps> = ({
  size = 22,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.66667 1.83333C2.74619 1.83333 2 2.57952 2 3.5V18.5C2 19.4205 2.74619 20.1667 3.66667 20.1667H18.3333C19.2538 20.1667 20 19.4205 20 18.5V7.33333L14.6667 1.83333H3.66667ZM3.66667 3.66667H13.3333V8.25H17.6667V18.5H3.66667V3.66667Z"
        fill="#4E5969"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.33333 11H15.6667V12.8333H6.33333V11ZM6.33333 14.6667H15.6667V16.5H6.33333V14.6667Z"
        fill="#4E5969"
      />
    </svg>
  );
};
