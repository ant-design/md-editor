import React from 'react';

interface ElixirIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ElixirIcon: React.FC<ElixirIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.173 22.681c-3.86 0-6.99-3.64-6.99-8.13 0-3.678 2.773-8.172 4.916-10.91 1.014-1.296 2.93-2.322 2.93-2.322s-.982 5.239 1.683 7.319c2.366 1.847 4.106 4.25 4.106 6.363 0 4.232-2.784 7.68-6.645 7.68z"
        style={{
          fill: '#9575cd',
          strokeWidth: '1.2565',
        }}
      />
    </svg>
  );
};

export default ElixirIcon;
