import React from 'react';

interface MarkojsIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MarkojsIcon: React.FC<MarkojsIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      preserveAspectRatio="xMidYMid"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g strokeWidth=".984">
        <path
          d="M4.002 5.52c-.655 1.07-1.32 2.138-1.976 3.208C1.371 9.79.718 10.871.063 11.941l.002.002-.002.002c.655 1.07 1.308 2.15 1.963 3.211.655 1.07 1.32 2.14 1.976 3.211h3.33c-.664-1.07-1.318-2.14-1.974-3.21-.653-1.07-1.307-2.146-1.961-3.214.654-1.068 1.308-2.147 1.961-3.215A601.09 601.09 0 0 1 7.332 5.52z"
          fill="#2196f3"
        />
        <path
          d="m3.999 5.52-.002.001c.655 1.07 1.31 2.151 1.964 3.212.655 1.07 1.32 2.14 1.974 3.21h3.331c-.664-1.07-1.319-2.14-1.974-3.21-.653-1.068-1.306-2.145-1.96-3.214z"
          fill="#26a69a"
        />
        <path
          d="m15.203 5.52.002.001c-.655 1.07-1.31 2.151-1.965 3.212-.655 1.07-1.319 2.14-1.974 3.21h-3.33a594.24 594.24 0 0 0 1.973-3.21c.654-1.068 1.307-2.145 1.961-3.214z"
          fill="#8bc34a"
        />
        <path
          d="M11.874 5.52a604.36 604.36 0 0 1 1.974 3.208c.653 1.068 1.307 2.147 1.961 3.215-.654 1.068-1.308 2.145-1.961 3.213a601.09 601.09 0 0 1-1.974 3.21h3.33c.655-1.071 1.319-2.14 1.974-3.21.655-1.06 1.31-2.14 1.966-3.21l-.002-.003.002-.002c-.655-1.07-1.31-2.152-1.966-3.213-.655-1.07-1.319-2.139-1.974-3.209z"
          fill="#ffc107"
        />
        <path
          d="M16.74 5.52a604.36 604.36 0 0 1 1.974 3.208c.653 1.068 1.305 2.147 1.96 3.215-.655 1.068-1.307 2.145-1.96 3.213-.655 1.07-1.31 2.14-1.974 3.211h3.33c.655-1.07 1.319-2.14 1.974-3.21.655-1.062 1.31-2.142 1.966-3.212l-.002-.002.002-.002c-.655-1.07-1.31-2.152-1.966-3.213-.655-1.07-1.319-2.139-1.974-3.209z"
          fill="#f44336"
        />
      </g>
    </svg>
  );
};

export default MarkojsIcon;
