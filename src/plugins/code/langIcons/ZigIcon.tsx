import React from 'react';

interface ZigIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ZigIcon: React.FC<ZigIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        style={{
          fill: '#f7a41d',
        }}
      >
        <g
          style={{
            fill: '#f9a825',
          }}
        >
          <path
            d="M0 10v80h19l6-10 12-10H20V30h15V10zm40 0v20h62V10zm91 0-6 10-12 10h17v40h-15v20h35V10zM48 70v20h62V70z"
            style={{
              fill: '#f9a825',
              shapeRendering: 'crispEdges',
            }}
            transform="translate(1.824 5.214) scale(.13568)"
          />
          <path
            d="M37 70 19 90V75zm76-40 18-20v15zM96.98 10.63 133.26.23 52.97 89.4 16.69 99.8z"
            style={{
              fill: '#f9a825',
            }}
            transform="translate(1.824 5.214) scale(.13568)"
          />
        </g>
      </g>
    </svg>
  );
};

export default ZigIcon;
