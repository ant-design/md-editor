import React from 'react';

/**
 * PlayIcon 组件 - 播放图标组件
 *
 * 该组件提供一个播放的SVG图标，通常用于表示播放等功能。
 *
 * @component
 * @description 播放图标组件，用于表示播放等功能
 * @param {React.SVGProps<SVGSVGElement>} props - SVG属性
 * @param {string} [props.width] - 图标宽度
 * @param {string} [props.height] - 图标高度
 * @param {string} [props.className] - CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 *
 * @example
 * ```tsx
 * <PlayIcon width="24px" height="24px" />
 * <PlayIcon className="custom-icon" style={{ color: 'gray' }} />
 * ```
 *
 * @returns {React.ReactElement} 渲染的播放图标组件
 *
 * @remarks
 * - 使用SVG格式，支持无损缩放
 * - 默认尺寸为1em，继承父元素字体大小
 * - 支持所有标准SVG属性
 * - 响应式设计，适配不同尺寸
 * - 使用currentColor继承父元素颜色
 */

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      version="1.1"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
    >
      <defs>
        <clipPath id="master_svg0_3460_33211/1432_039324">
          <rect x="0" y="0" width="1em" height="1em" rx="0" />
        </clipPath>
      </defs>
      <g clipPath="url(#master_svg0_3460_33211/1432_039324)">
        <g>
          <path
            d="M2.916595458984375,12.249966626930236L2.916595458984375,1.749999626930237C2.916595458984375,1.4278336269302367,3.177762458984375,1.1666666269302368,3.499928458984375,1.1666666269302368C3.611783458984375,1.1666666269302368,3.721280458984375,1.1988260269302369,3.815370458984375,1.2593125269302368L11.982035458984376,6.509316626930237C12.253035458984375,6.683526626930237,12.331495458984374,7.044446626930236,12.157285458984376,7.315436626930237C12.112095458984374,7.385736626930237,12.052325458984376,7.445496626930237,11.982035458984376,7.490686626930237L3.815370458984375,12.740666626930237C3.544371458984375,12.914866626930237,3.183455458984375,12.836466626930237,3.009241358984375,12.565466626930236C2.948754858984375,12.471366626930237,2.916595458984375,12.361866626930237,2.916595458984375,12.249966626930236ZM10.587865458984375,6.999996626930237L4.083265458984375,11.181566626930238L4.083265458984375,2.8184666269302365L10.587865458984375,6.999996626930237Z"
            fillRule="evenodd"
            fill="currentColor"
            fillOpacity="1"
            style={{ mixBlendMode: 'normal' }}
          />
        </g>
      </g>
    </svg>
  );
};
