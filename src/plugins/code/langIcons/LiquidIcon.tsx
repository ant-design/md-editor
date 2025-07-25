import React from 'react';

interface LiquidIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const LiquidIcon: React.FC<LiquidIconProps> = ({
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
        d="M12 21.669a6.927 6.927 0 0 1-6.927-6.927C5.073 10.124 12 2.33 12 2.33s6.927 7.793 6.927 12.41A6.927 6.927 0 0 1 12 21.67z"
        style={{
          fill: '#29b6f6',
          strokeWidth: '1.1546',
        }}
      />
    </svg>
  );
};

export default LiquidIcon;
