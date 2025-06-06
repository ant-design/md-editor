import React from 'react';

interface CssIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CssIcon: React.FC<CssIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m5 3-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81-5.48 1.81-4.75-1.81.33-1.64H2.85l-.79 4 7.85 3 9.05-3 1.2-6.03.24-1.21L21.94 3H5z"
        fill="#42a5f5"
      />
    </svg>
  );
};

export default CssIcon;
