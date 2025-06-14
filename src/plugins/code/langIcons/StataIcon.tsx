import React from 'react';

interface StataIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const StataIcon: React.FC<StataIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
    >
      <defs>
        <linearGradient
          id="a"
          x1="16"
          y1="2"
          x2="16"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#8aa7c0" />
          <stop offset="1" stopColor="#3c6e8f" />
        </linearGradient>
      </defs>
      <title>file_type_stata</title>
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="1.556"
        ry="1.556"
        style={{
          fill: 'url(#a)',
        }}
      />
      <rect
        x="13.171"
        y="6.015"
        width="5.756"
        height="5.756"
        style={{ fill: '#fff' }}
      />
      <rect
        x="20.326"
        y="6.015"
        width="5.756"
        height="5.756"
        style={{ fill: '#fff' }}
      />
      <rect
        x="20.326"
        y="13.171"
        width="5.756"
        height="5.756"
        style={{ fill: '#fff' }}
      />
      <rect
        x="13.171"
        y="13.171"
        width="5.756"
        height="5.756"
        style={{ fill: '#fff' }}
      />
      <rect
        x="6.015"
        y="13.171"
        width="5.756"
        height="5.756"
        style={{ fill: '#fff' }}
      />
      <rect
        x="6.015"
        y="20.326"
        width="5.756"
        height="5.756"
        style={{ fill: '#fff' }}
      />
      <rect
        x="13.171"
        y="20.326"
        width="5.756"
        height="5.756"
        style={{ fill: '#fff' }}
      />
    </svg>
  );
};

export default StataIcon;
