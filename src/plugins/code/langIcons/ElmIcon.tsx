import React from 'react';

interface ElmIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ElmIcon: React.FC<ElmIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 323 323"
    >
      <path fill="#f0ad00" d="m106.716 99.763 54.785 54.782 54.779-54.782z" />
      <path
        fill="#7fd13b"
        d="M96.881 89.93H216.83l-55.18-55.184H41.7zm131.546 11.593 59.705 59.704L228.16 221.2l-59.705-59.704z"
      />
      <path fill="#60b5cc" d="m175.552 34.746 112.703 112.695V34.746z" />
      <path fill="#5a6378" d="m34.746 281.3 119.8-119.8-119.8-119.8z" />
      <path fill="#f0ad00" d="m288.255 175.01-53.148 53.149 53.148 53.14z" />
      <path fill="#60b5cc" d="M281.3 288.254 161.5 168.455l-119.8 119.8z" />
    </svg>
  );
};

export default ElmIcon;
