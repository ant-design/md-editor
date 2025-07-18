import React from 'react';

interface DocIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const DocIcon: React.FC<DocIconProps> = ({ size = 16, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      data-testid="doc-icon"
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.33333 1.33333C2.59695 1.33333 2 1.93028 2 2.66667V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V5.33333L10 1.33333H3.33333ZM3.33333 2.66667H9.33333V6H12.6667V13.3333H3.33333V2.66667Z"
        fill="#4E5969"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.33333 8H10.6667V9.33333H5.33333V8ZM5.33333 10.6667H10.6667V12H5.33333V10.6667Z"
        fill="#4E5969"
      />
    </svg>
  );
};
