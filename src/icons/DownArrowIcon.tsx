import React from 'react';

/**
 * DownArrowIcon 组件 - 向下箭头图标组件
 *
 * 基于原始设计的向下箭头组件，保持完整的滤镜效果和阴影。
 * 包含圆形背景和精确的向下箭头图标，适用于展开菜单、向下滚动等场景。
 *
 * @component
 * @description 向下箭头图标组件，保持原始SVG设计
 * @param {React.SVGProps<SVGSVGElement>} props - SVG属性
 * @param {string} [props.width] - 图标宽度
 * @param {string} [props.height] - 图标高度
 * @param {string} [props.className] - CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 *
 * @example
 * ```tsx
 * import { DownArrowIcon } from './icons/DownArrowIcon';
 *
 * // 基本用法
 * <DownArrowIcon />
 *
 * // 自定义样式
 * <DownArrowIcon className="custom-icon" />
 * <DownArrowIcon width="60" height="60" />
 * <DownArrowIcon style={{ cursor: 'pointer' }} />
 * ```
 *
 * @returns {React.ReactElement} 渲染的向下箭头图标组件
 *
 * @remarks
 * - 基于原始SVG设计，保持所有视觉效果
 * - 包含完整的滤镜效果和阴影
 * - 默认尺寸为80x80像素
 * - 圆形白色背景，灰色箭头图标
 * - 支持所有标准SVG属性
 * - 适合用作展开菜单、下拉指示器等
 */

export const DownArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      version="1.1"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      {...props}
    >
      <defs>
        <filter
          id="master_svg0_3837_036560/548_29137/3987_38598"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
          x="-1.0625"
          y="-0.875"
          width="3"
          height="3"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="0" dx="0" />
          <feGaussianBlur stdDeviation="0.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.05895425006747246 0 0 0 0 0.16078431904315948 0 0 0 0.05000000074505806 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="6" dx="0" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0.05895425006747246 0 0 0 0 0.16078431904315948 0 0 0 0.07999999821186066 0"
          />
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
        <clipPath id="master_svg1_3837_036560/548_29137/3987_38598/548_28888">
          <rect x="32" y="26" width="16" height="16" rx="0" />
        </clipPath>
      </defs>
      <g filter="url(#master_svg0_3837_036560/548_29137/3987_38598)">
        <rect
          x="24"
          y="18"
          width="32"
          height="32"
          rx="16"
          fill="#FFFFFF"
          fillOpacity="1"
          style={{ mixBlendMode: 'passthrough' as any }}
        />
        <rect
          x="24.5"
          y="18.5"
          width="31"
          height="31"
          rx="15.5"
          fillOpacity="0"
          strokeOpacity="0.06270000338554382"
          stroke="#001020"
          fill="none"
          strokeWidth="1"
          style={{ mixBlendMode: 'passthrough' as any }}
        />
        <g clipPath="url(#master_svg1_3837_036560/548_29137/3987_38598/548_28888)">
          <g>
            <path
              d="M39.99999674613953,28.666666746139526C39.631806746139524,28.666666746139526,39.33333674613952,28.965143746139525,39.33333674613952,29.333333746139527L39.33333674613952,37.05718674613953L35.80494674613953,33.52880674613952C35.679716746139526,33.403566746139525,35.510144746139524,33.33333674613952,35.33333374613952,33.33333674613952C34.965143746139525,33.33333674613952,34.666666746139526,33.631806746139524,34.666666746139526,33.99999674613953C34.666666746139526,34.176806746139526,34.73690464613953,34.346376746139526,34.861928746139526,34.47140674613953L39.52859674613953,39.13806674613953C39.64923674613953,39.258666746139525,39.815906746139525,39.333366746139525,39.99999674613953,39.333366746139525C40.176806746139526,39.333366746139525,40.346376746139526,39.26306674613953,40.47140674613953,39.13806674613953L40.472246746139525,39.137266746139524L45.137766746139526,34.471686746139525C45.26306674613953,34.346376746139526,45.333366746139525,34.176806746139526,45.333366746139525,33.99999674613953C45.333366746139525,33.631806746139524,45.03486674613953,33.33333674613952,44.666666746139526,33.33333674613952C44.48985674613952,33.33333674613952,44.32028674613953,33.403566746139525,44.19525674613953,33.52859674613953L40.666666746139526,37.05718674613953L40.666666746139526,29.333333746139527C40.666666746139526,28.965143746139525,40.36818674613953,28.666666746139526,39.99999674613953,28.666666746139526Z"
              fillRule="evenodd"
              fill="#767E8B"
              fillOpacity="1"
              style={{ mixBlendMode: 'passthrough' as any }}
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
