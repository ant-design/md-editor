import React from 'react';

interface KustoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const KustoIcon: React.FC<KustoIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      version="1.0"
      viewBox="0 0 318 315"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.778 280.589c-4.91-2.139-4.99-2.852-4.99-34.058v-28.118H97.36v63.364H69.876c-21.702-.08-28.118-.317-30.098-1.188zm69.462-30.494v-31.682h62.573v63.364H109.24zm-.791-89.027c0-51.72.158-54.414 4.435-67.958 4.119-13.068 11.802-25.424 21.94-35.246 16.079-15.603 35.009-23.682 57.582-24.553 16.633-.634 29.702 2.217 43.959 9.504 52.117 26.93 62.968 98.531 21.306 140.272-14.653 14.653-33.187 23.128-54.572 25.03-4.753.395-28.039.791-51.642.791H108.45zm61.78-15.92v-35.246H140.13v70.492h30.098zm40.394 10.297v-24.95h-30.098v49.9h30.098zm40.395-20.198V90.102H220.92v90.293h30.098zm-216.23 40.791V143.96H97.36v64.156H34.788z"
        fill="#1e88e5"
      />
    </svg>
  );
};

export default KustoIcon;
