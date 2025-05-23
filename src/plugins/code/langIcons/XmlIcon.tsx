import React from 'react';

interface XmlIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const XmlIcon: React.FC<XmlIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m.12 13.5 3.74 3.74 1.42-1.41-2.33-2.33 2.33-2.33-1.42-1.41-3.74 3.74m11.16 0-3.74-3.74-1.42 1.41 2.33 2.33-2.33 2.33 1.42 1.41 3.74-3.74z"
        fill="#8bc34a"
      />
    </svg>
  );
};

export default XmlIcon;
