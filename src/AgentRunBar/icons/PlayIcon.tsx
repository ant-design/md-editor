import { Tooltip } from 'antd';
import * as React from 'react';

interface PlayIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export function PlayIcon(props: PlayIconProps) {
  const { title = '继续', ...svgProps } = props;
  return (
    <Tooltip title={title}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={32}
        height={32}
        role="img"
        aria-label="PlayIcon"
        viewBox="0 0 32 32"
        {...svgProps}
      >
        <defs>
          <filter
            id="objectBoundingBoxsss"
            filterUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
            x={0}
            y={0}
            width={1}
            height={1}
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation={10} />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_foregroundBlur"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_foregroundBlur"
              result="shape"
            />
          </filter>
          <clipPath id="b">
            <rect x={8} y={8} width={16} height={16} rx={0} />
          </clipPath>
        </defs>
        <g filter="url(#objectBoundingBoxsss)">
          <rect
            width={32}
            height={32}
            rx={16}
            fill="#001C39"
            fillOpacity={0.03530000150203705}
          />
          <g clipPath="url(#b)">
            <path
              d="M11.333 22V10a.667.667 0 011.028-.56l9.333 6a.667.667 0 010 1.12l-9.333 6a.667.667 0 01-1.028-.56z"
              fillRule="evenodd"
              fill="#767E8B"
            />
          </g>
        </g>
      </svg>
    </Tooltip>
  );
}
