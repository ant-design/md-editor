import React from 'react';

interface YamlIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const YamlIcon: React.FC<YamlIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2m12 16v-2H9v2h9m-4-4v-2H6v2z"
        fill="#FF5252"
      />
    </svg>
  );
};

export default YamlIcon;
