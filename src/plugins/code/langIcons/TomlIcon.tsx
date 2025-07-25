import React from 'react';

interface TomlIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TomlIcon: React.FC<TomlIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <title>file_type_toml</title>
      <path
        d="M22.76,6.83v3.25h-5V25.17H14.26V10.08h-5V6.83Z"
        style={{
          fill: '#7f7f7f',
        }}
      />
      <path
        d="M2,2H8.2V5.09H5.34v21.8H8.2V30H2Z"
        style={{
          fill: '#bfbfbf',
        }}
      />
      <path
        d="M30,30H23.8V26.91h2.86V5.11H23.8V2H30Z"
        style={{
          fill: '#bfbfbf',
        }}
      />
    </svg>
  );
};

export default TomlIcon;
