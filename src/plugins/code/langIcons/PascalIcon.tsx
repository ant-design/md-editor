import React from 'react';

interface PascalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PascalIcon: React.FC<PascalIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      version="1.1"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {' '}
      <g fill="#0288d1" strokeWidth="1.796" aria-label="P">
        {' '}
        <path d="m8.8626 14.765-1.1574 6.5974h-3.7681l3.2537-18.725 6.5588 0.01286q3.035 0 4.7712 1.6847 1.7361 1.6847 1.5175 4.3982-0.20576 2.7521-2.302 4.3982-2.0834 1.6461-5.3242 1.6461zm0.52727-3.1251 3.1379 0.02572q1.5175 0 2.5206-0.78448 1.0031-0.78448 1.196-2.122 0.1929-1.3375-0.43725-2.1348-0.6173-0.79734-1.839-0.84878l-3.5495-0.01286z" />{' '}
      </g>{' '}
    </svg>
  );
};

export default PascalIcon;
