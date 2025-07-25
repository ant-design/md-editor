import React from 'react';

interface StylusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const StylusIcon: React.FC<StylusIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
    >
      <path
        d="M127.22 155.91c14.639-17.51 16.362-35.594 5.023-69.178-7.176-21.241-19.089-37.603-10.334-50.807 9.33-14.065 29.135-.43 12.63 18.371l3.301 2.296c19.806 2.297 29.566-24.83 14.783-32.58-39.038-20.38-73.197 18.802-58.127 64.155 6.459 19.232 15.501 39.613 8.181 55.831-6.315 13.922-18.515 22.103-26.695 22.39-17.079.862-5.74-38.32 13.922-48.08 1.722-.86 4.162-2.009 1.866-4.88-24.255-2.726-38.464 8.468-46.645 24.113-23.825 45.497 45.21 62.289 82.096 18.37z"
        style={{
          fill: '#c0ca33',
          strokeWidth: '1.4352',
        }}
      />
    </svg>
  );
};

export default StylusIcon;
