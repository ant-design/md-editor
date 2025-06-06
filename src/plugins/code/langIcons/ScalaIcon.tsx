import React from 'react';

interface ScalaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ScalaIcon: React.FC<ScalaIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 256 256"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#f44336" fillRule="evenodd">
        <path d="m53.461 50.891 149.1-21.982v49.488l-149.1 21.982zm-.014 63.437 149.1-21.982v49.488l-149.1 21.982zm-.005 63.272 149.098-21.983v49.488L53.442 227.087z" />
        <path d="m56.28 91.659 95.604 30.921-2.832 8.757-95.604-30.921zm50.66-30.285 95.604 30.922-2.832 8.757-95.604-30.922zm-50.662 93.663 95.604 30.921-2.832 8.758-95.604-30.922zm50.67-30.386 95.604 30.922-2.833 8.757-95.603-30.922z" />
      </g>
    </svg>
  );
};

export default ScalaIcon;
