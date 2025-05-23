import React from 'react';

interface ProtoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ProtoIcon: React.FC<ProtoIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g strokeWidth="1.786">
        <path
          d="M17.493 82.498 99.999 28.34v35.003L17.493 117.5z"
          fill="#ff5722"
        />
        <path
          d="m17.493 117.501 82.506 54.159v-35.003L17.493 82.498z"
          fill="#03a9f4"
        />
        <path
          d="M182.506 117.501 100 171.66v-35.003l82.506-54.159z"
          fill="#ffeb3b"
        />
        <path
          d="M182.506 82.498 100 28.34v35.003l82.506 54.158z"
          fill="#00e676"
        />
      </g>
    </svg>
  );
};

export default ProtoIcon;
