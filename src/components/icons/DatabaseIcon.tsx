import React from 'react';

interface DatabaseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * DatabaseIcon 组件 - 数据库图标组件
 *
 * 该组件显示一个数据库图标，支持自定义大小和 SVG 属性。
 * 主要用于表示数据库、数据存储或数据相关的 UI 元素。
 *
 * @component
 * @description 数据库图标组件，支持自定义大小和 SVG 属性
 * @param {DatabaseIconProps} props - 组件属性
 * @param {number} [props.size=18] - 图标大小（像素）
 * @param {React.SVGProps<SVGSVGElement>} props - 其他 SVG 属性
 *
 * @example
 * ```tsx
 * import { DatabaseIcon } from './components/icons/DatabaseIcon';
 *
 * // 基本用法
 * <DatabaseIcon size={18} />
 *
 * // 自定义样式
 * <DatabaseIcon size={24} className="custom-icon" />
 * ```
 *
 * @returns {React.ReactElement} 渲染的数据库图标组件
 *
 * @remarks
 * - 默认大小为 18px
 * - 支持所有标准的 SVG 属性
 * - 包含 data-testid="database-icon" 用于测试
 * - 使用 18x18 的 viewBox
 * - 显示圆柱形数据库结构
 */
export const DatabaseIcon: React.FC<DatabaseIconProps> = ({
  size = 18,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      data-testid="database-icon"
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2C5.13401 2 2 3.34315 2 5V13C2 14.6569 5.13401 16 9 16C12.866 16 16 14.6569 16 13V5C16 3.34315 12.866 2 9 2ZM4 5C4 4.44772 6.23858 4 9 4C11.7614 4 14 4.44772 14 5C14 5.55228 11.7614 6 9 6C6.23858 6 4 5.55228 4 5ZM4 7.72V10C4 10.5523 6.23858 11 9 11C11.7614 11 14 10.5523 14 10V7.72C12.7435 8.19 10.9317 8.4 9 8.4C7.06831 8.4 5.25651 8.19 4 7.72ZM4 12.72V13C4 13.5523 6.23858 14 9 14C11.7614 14 14 13.5523 14 13V12.72C12.7435 13.19 10.9317 13.4 9 13.4C7.06831 13.4 5.25651 13.19 4 12.72Z"
        fill="#4E5969"
      />
    </svg>
  );
};
