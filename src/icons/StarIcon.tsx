import React from 'react';

/**
 * StarIcon 组件 - 空心星星图标组件
 *
 * 该组件提供一个空心星星的SVG图标，通常用于表示收藏、评分等功能。
 * 图标采用五角星设计，轮廓样式表示未选中或默认状态。
 *
 * @component
 * @description 空心星星图标组件，用于表示收藏、评分等未选中状态
 * @param {React.SVGProps<SVGSVGElement>} props - SVG属性
 * @param {string} [props.width] - 图标宽度
 * @param {string} [props.height] - 图标高度
 * @param {string} [props.className] - CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 *
 * @example
 * ```tsx
 * <StarIcon width="24px" height="24px" />
 * <StarIcon className="custom-icon" style={{ color: 'gray' }} />
 * ```
 *
 * @returns {React.ReactElement} 渲染的空心星星图标组件
 *
 * @remarks
 * - 使用SVG格式，支持无损缩放
 * - 默认尺寸为1em，继承父元素字体大小
 * - 支持所有标准SVG属性
 * - 响应式设计，适配不同尺寸
 * - 使用currentColor继承父元素颜色
 * - 五角星设计，适合评分和收藏功能
 * - 与StarFilledIcon配对使用
 */
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={14} height={14} rx={0} />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="M4.853 3.81L6.2 1.08q.246-.497.8-.497t.8.497l1.348 2.73q.152.308.492.358l3.013.44q.548.08.72.608.172.527-.226.915l-2.18 2.122q-.246.24-.188.58l.515 2.997q.096.547-.355.875-.452.328-.944.066l-2.691-1.415q-.304-.16-.609 0l-2.692 1.416q-.491.26-.942-.068-.45-.327-.354-.876l.514-2.995q.058-.34-.189-.58L.853 6.132q-.4-.386-.227-.916.172-.53.724-.608l3.01-.44q.34-.05.493-.358zm1.046.517q-.424.857-1.37.995l-2.465.36 1.782 1.735q.687.669.525 1.613l-.42 2.451 2.202-1.158q.847-.445 1.694 0l2.203 1.159-.42-2.453q-.162-.943.524-1.612l1.781-1.734-2.465-.361q-.945-.139-1.368-.996L7 2.096 5.9 4.325z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};
