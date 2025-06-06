import React from 'react';

interface HaskellIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const HaskellIcon: React.FC<HaskellIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
    >
      <g strokeWidth="2.422">
        <path
          d="m23.928 240.5 59.94-89.852-59.94-89.855h44.955l59.94 89.855-59.94 89.852z"
          fill="#ef5350"
        />
        <path
          d="m83.869 240.5 59.94-89.852-59.94-89.855h44.955l119.88 179.71h-44.95l-37.46-56.156-37.468 56.156z"
          fill="#ffa726"
        />
        <path
          d="m228.72 188.08-19.98-29.953h69.93v29.956h-49.95zm-29.97-44.924-19.98-29.953h99.901v29.953z"
          fill="#ffee58"
        />
      </g>
    </svg>
  );
};

export default HaskellIcon;
