import React from 'react';

interface CoffeeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CoffeeIcon: React.FC<CoffeeIconProps> = ({
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
        d="M2 21h18v-2H2M20 8h-2V5h2m0-2H4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-3h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
        fill="#42a5f5"
      />
    </svg>
  );
};

export default CoffeeIcon;
