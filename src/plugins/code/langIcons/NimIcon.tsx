import React from 'react';

interface NimIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const NimIcon: React.FC<NimIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.383 15.808 2.207 3.839l5.985 7.617L12 3.839l3.808 7.617 5.985-7.617-2.176 11.969H4.383m15.234 3.264a1.088 1.088 0 0 1-1.088 1.089H5.47a1.088 1.088 0 0 1-1.088-1.089v-1.088h15.234z"
        style={{
          fill: '#ffca28',
          strokeWidth: '1.0881',
        }}
      />
    </svg>
  );
};

export default NimIcon;
