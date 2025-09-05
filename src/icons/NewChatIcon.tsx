import React from 'react';

/**
 * NewChatIcon 组件 - 新建聊天图标组件
 *
 * 该组件提供一个新建聊天的SVG图标，使用简洁的设计风格。
 * 图标包含聊天气泡和加号元素，表示创建新的聊天会话。
 *
 * @component
 * @description 新建聊天图标组件，用于表示创建新聊天会话
 * @param {React.SVGProps<SVGSVGElement>} props - SVG属性
 * @param {string} [props.width] - 图标宽度
 * @param {string} [props.height] - 图标高度
 * @param {string} [props.className] - CSS类名
 * @param {React.CSSProperties} [props.style] - 自定义样式
 *
 * @example
 * ```tsx
 * <NewChatIcon width="24px" height="24px" />
 * <NewChatIcon className="custom-icon" style={{ color: 'blue' }} />
 * ```
 *
 * @returns {React.ReactElement} 渲染的新建聊天图标组件
 *
 * @remarks
 * - 使用SVG格式，支持无损缩放
 * - 默认尺寸为1em，继承父元素字体大小
 * - 支持所有标准SVG属性
 * - 响应式设计，适配不同尺寸
 * - 使用currentColor继承父元素颜色
 */
export const NewChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={16} height={16} rx={0} />
        </clipPath>
      </defs>
      <g>
        <path
          d="M12.198 7.487c.67 0 1.327-.203 1.888-.583.057.356.087.723.087 1.096 0 3.682-2.874 6.667-6.42 6.667a6.203 6.203 0 01-3.023-.784l-3.397.784.755-3.528A6.842 6.842 0 011.333 8c0-3.682 2.874-6.667 6.42-6.667.622 0 1.223.092 1.791.263a3.674 3.674 0 00-.803 2.301c0 1.983 1.547 3.59 3.457 3.59zM9.235 4.154l.81.312a2.77 2.77 0 011.605 1.666l.3.842.3-.842a2.77 2.77 0 011.605-1.666l.812-.312-.812-.312a2.77 2.77 0 01-1.604-1.666l-.3-.843-.3.843a2.77 2.77 0 01-1.605 1.666l-.811.312zM4.543 8c0 1.84 1.437 3.333 3.21 3.333s3.21-1.492 3.21-3.333H9.679c0 1.105-.862 2-1.926 2s-1.926-.895-1.926-2H4.543z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};
