import React from 'react';

interface TexIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TexIcon: React.FC<TexIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="1.414"
      viewBox="0 0 500 500"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#42a5f5" strokeLinejoin="miter">
        <path
          d="M184.43 180.6h-74.684v184.32H81.951V180.6H7.268v-24.707h177.16z"
          aria-label="T"
        />
        <path
          d="M299.52 435.56H161.81V226.53h137.71v24.707H189.6v57.275h109.92v24.707H189.6v77.631h109.92z"
          aria-label="E"
        />
        <path
          d="m492.73 152.17-72.157 103.32 72.015 105.71h-32.147l-56.995-86.053-58.398 86.053h-30.322l72.858-104.44-71.173-104.58h32.007l56.293 84.93 57.556-84.93z"
          aria-label="X"
        />
      </g>
    </svg>
  );
};

export default TexIcon;
