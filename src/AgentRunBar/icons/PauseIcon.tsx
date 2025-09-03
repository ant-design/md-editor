import { Tooltip } from 'antd';
import * as React from 'react';

export function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Tooltip title="暂停">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={32}
        height={32}
        role="img"
        aria-label="PauseIcon"
        viewBox="0 0 32 32"
        {...props}
      >
        <defs>
          <filter
            id="dadadadadadadadad"
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
        <g filter="url(#dadadadadadadadad)">
          <rect
            width={32}
            height={32}
            rx={16}
            fill="#001C39"
            fillOpacity={0.03530000150203705}
          />
          <g clipPath="url(#b)">
            <path
              d="M11.333 11.333v9.334q0 .552.39.942.391.391.944.391H14q.552 0 .943-.39.39-.391.39-.943v-9.334q0-.552-.39-.942Q14.553 10 14 10h-1.333q-.553 0-.943.39-.39.391-.39.943zm5.334 0v9.334q0 .552.39.942.39.391.943.391h1.333q.553 0 .943-.39.39-.391.39-.943v-9.334q0-.552-.39-.942-.39-.391-.943-.391H18q-.552 0-.943.39-.39.391-.39.943z"
              fillRule="evenodd"
              fill="#767E8B"
            />
          </g>
        </g>
      </svg>
    </Tooltip>
  );
}
