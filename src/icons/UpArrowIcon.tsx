import React from 'react';

/**
 * UpArrowIcon 组件 - 向上箭头图标组件
 *
 * 基于原始设计的向上箭头组件，保持完整的滤镜效果和阴影。
 * 包含圆形背景和精确的向上箭头图标，适用于滚动到顶部等场景。
 *
 * @component
 * @description 向上箭头图标组件，保持原始SVG设计
 * @param {React.SVGProps<SVGSVGElement>} props - SVG属性
 * @param {string} [props.width] - 图标宽度
 * @param {string} [props.height] - 图标高度
 * @param {string} [props.className] - CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 *
 * @example
 * ```tsx
 * import { UpArrowIcon } from './icons/UpArrowIcon';
 *
 * // 基本用法
 * <UpArrowIcon />
 *
 * // 自定义样式
 * <UpArrowIcon className="custom-icon" />
 * <UpArrowIcon width="60" height="60" />
 * <UpArrowIcon style={{ cursor: 'pointer' }} />
 * ```
 *
 * @returns {React.ReactElement} 渲染的向上箭头图标组件
 *
 * @remarks
 * - 基于原始SVG设计，保持所有视觉效果
 * - 包含完整的滤镜效果和阴影
 * - 默认尺寸为80x80像素
 * - 圆形白色背景，灰色箭头图标
 * - 支持所有标准SVG属性
 * - 适合用作滚动到顶部按钮
 */

export const UpArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
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
          id="master_svg0_3837_036560/548_29137/548_29074"
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
        <clipPath id="master_svg1_3837_036560/548_29137/548_29074/548_28888">
          <rect x="32" y="26" width="16" height="16" rx="0" />
        </clipPath>
      </defs>
      <g filter="url(#master_svg0_3837_036560/548_29137/548_29074)">
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
        <g clipPath="url(#master_svg1_3837_036560/548_29137/548_29074/548_28888)">
          <g>
            <path
              d="M40.666666746139526,30.942806746139524L44.19525674613953,34.47140674613953C44.32028674613953,34.59642674613953,44.48985674613952,34.666666746139526,44.666666746139526,34.666666746139526C45.03486674613953,34.666666746139526,45.333366746139525,34.36818674613953,45.333366746139525,33.99999674613953C45.333366746139525,33.82318674613953,45.26306674613953,33.65361674613953,45.13806674613953,33.52859674613953L40.47194674613952,28.862470746139525L40.47140674613953,28.861928746139526C40.46995674613952,28.860476746139526,40.46849674613953,28.859032746139526,40.46703674613953,28.857596746139528C40.33742674613953,28.730310146139526,40.16870674613953,28.666666746139526,39.99999674613953,28.666666746139526C39.909606746139524,28.666666746139526,39.82341674613953,28.684657146139525,39.744806746139524,28.717252646139528C39.66617674613953,28.749785646139525,39.59251674613952,28.798010746139525,39.52859674613953,28.861928746139526L34.861928746139526,33.52859674613953C34.73690454613953,33.65361674613953,34.666666746139526,33.82318674613953,34.666666746139526,33.99999674613953C34.666666746139526,34.36818674613953,34.965143746139525,34.666666746139526,35.33333374613952,34.666666746139526C35.510144746139524,34.666666746139526,35.679716746139526,34.59642674613953,35.80521674613953,34.470926746139526L39.33333674613952,30.942806746139524L39.33333674613952,38.666666746139526C39.33333674613952,39.03486674613953,39.631806746139524,39.333366746139525,39.99999674613953,39.333366746139525C40.36818674613953,39.333366746139525,40.666666746139526,39.03486674613953,40.666666746139526,38.666666746139526L40.666666746139526,30.942806746139524Z"
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