import React from 'react';

interface DocumentIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  size = 22,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.66667 1.83333C2.74619 1.83333 2 2.57952 2 3.5V18.5C2 19.4205 2.74619 20.1667 3.66667 20.1667H18.3333C19.2538 20.1667 20 19.4205 20 18.5V7.33333L14.6667 1.83333H3.66667ZM3.66667 3.66667H13.3333V8.25H17.6667V18.5H3.66667V3.66667Z"
        fill="#4E5969"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.33333 11H15.6667V12.8333H6.33333V11ZM6.33333 14.6667H15.6667V16.5H6.33333V14.6667Z"
        fill="#4E5969"
      />
    </svg>
  );
};
