import React from 'react';

interface BicepIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const BicepIcon: React.FC<BicepIconProps> = ({
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
        d="M3.45 18.021s.95-10.685 3.8-14.57l4.748.95-.95 2.935h-1.9v6.8h.95c1.9-2.915 5.833-3.98 8.207-2.915 3.134 1.453 2.85 5.831 0 7.769-2.28 1.558-9.156 2.916-14.855-.969z"
        style={{
          fill: '#fbc02d',
          strokeWidth: '.94982',
        }}
      />
    </svg>
  );
};

export default BicepIcon;
