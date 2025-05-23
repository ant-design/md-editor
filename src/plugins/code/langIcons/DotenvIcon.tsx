import React from 'react';

interface DotenvIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const DotenvIcon: React.FC<DotenvIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(1.1667 0 0 1.1667 2 2)" fillRule="evenodd">
        <path d="m1 1h22v22h-22z" />
        <path
          d="m24 0v24h-24v-24zm-13.067 15.89h-4.093v5.52h4.198v-0.93h-3.083v-1.503h2.77v-0.93h-2.77v-1.224h2.978v-0.934zm2.146 0h-1.084v5.52h1.035v-3.6l2.226 3.6h1.118v-5.52h-1.036v3.686l-2.259-3.687zm5.117 0h-1.208l1.973 5.52h1.19l1.976-5.52h-1.182l-1.352 4.085-1.397-4.086zm-12.796 3.79h-1.68v1.68h1.68z"
          fill="#ecd53f"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};

export default DotenvIcon;
