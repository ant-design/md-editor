import React from 'react';

interface MermaidIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MermaidIcon: React.FC<MermaidIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      version="1.1"
      viewBox="0 0 64 64"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      {' '}
      <path
        d="m56.954 11.425c-11.047-0.47281-21.191 6.3243-24.954 16.721-3.7636-10.397-13.907-17.194-24.954-16.721-0.36801 8.7661 3.8257 17.126 11.073 22.072 3.7136 2.5506 5.9328 6.7811 5.9205 11.286v7.8151h15.924v-7.8151c-0.0129-4.5048 2.2058-8.7355 5.919-11.286 7.249-4.9441 11.443-13.305 11.073-22.072z"
        fill="#ff4081"
        fillRule="nonzero"
        strokeWidth=".15366"
      />{' '}
    </svg>
  );
};

export default MermaidIcon;
