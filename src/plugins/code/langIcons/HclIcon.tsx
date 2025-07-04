import React from 'react';

interface HclIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const HclIcon: React.FC<HclIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      style={{
        clipRule: 'evenodd',
        fillRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: '1.4142',
      }}
      viewBox="0 0 24 24"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        style={{
          fill: '#eceff1',
        }}
      >
        <path
          d="M44.5 0 0 25.7v61.7l16.7 9.7V35.3l27.8-16z"
          style={{
            fillRule: 'nonzero',
            fill: '#eceff1',
          }}
          transform="translate(2.764 2.229) scale(.17279)"
        />
        <path
          d="M62.3 0v49.2H44.5V30.8l-16.7 9.7v62.9l16.7 9.7v-49h17.8v18.2l16.8-9.6v-63z"
          style={{
            fillRule: 'nonzero',
            fill: '#eceff1',
          }}
          transform="translate(2.764 2.229) scale(.17279)"
        />
        <path
          d="m62.3 113.1 44.6-25.7V25.7l-16.8-9.6v61.7l-27.8 16z"
          style={{
            fillRule: 'nonzero',
            fill: '#eceff1',
          }}
          transform="translate(2.764 2.229) scale(.17279)"
        />
      </g>
    </svg>
  );
};

export default HclIcon;
