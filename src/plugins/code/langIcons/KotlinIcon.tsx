import React from 'react';

interface KotlinIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const KotlinIcon: React.FC<KotlinIconProps> = ({
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
      <defs>
        <linearGradient
          id="a"
          x1="1.725"
          x2="22.185"
          y1="22.67"
          y2="1.982"
          gradientTransform="translate(1.306 1.129) scale(.89324)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0296d8" offset="0" />
          <stop stopColor="#8371d9" offset="1" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="1.869"
          x2="22.798"
          y1="22.382"
          y2="3.377"
          gradientTransform="translate(1.323 1.129) scale(.89324)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#cb55c0" offset="0" />
          <stop stopColor="#f28e0e" offset="1" />
        </linearGradient>
      </defs>
      <path
        d="M2.975 2.976v18.048h18.05v-.03l-4.478-4.511-4.48-4.515 4.48-4.515 4.443-4.477z"
        fill="url(#a)"
      />
      <path
        d="m12.223 2.976-9.23 9.23v8.818h.083l9.032-9.032-.024-.024 4.48-4.515 4.443-4.477h-8.784z"
        fill="url(#b)"
      />
    </svg>
  );
};

export default KotlinIcon;
