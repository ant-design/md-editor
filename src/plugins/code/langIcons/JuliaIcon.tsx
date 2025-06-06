import React from 'react';

interface JuliaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const JuliaIcon: React.FC<JuliaIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(.21 -247.01)">
        <circle cx="13.497" cy="281.63" r="9.555" fill="#bc342d" />
        <circle cx="36.081" cy="281.63" r="9.555" fill="#864e9f" />
        <circle cx="24.722" cy="262.39" r="9.555" fill="#328a22" />
      </g>
    </svg>
  );
};

export default JuliaIcon;
