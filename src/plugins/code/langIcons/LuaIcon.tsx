import React from 'react';

interface LuaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const LuaIcon: React.FC<LuaIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(-.203 -.102)">
        <circle
          cx="12.203"
          cy="12.102"
          r="10.322"
          fill="none"
          stroke="#42a5f5"
        />
        <path
          d="M12.33 5.746a6.483 6.381 0 0 0-6.482 6.381 6.483 6.381 0 0 0 6.482 6.38 6.483 6.381 0 0 0 6.484-6.38 6.483 6.381 0 0 0-6.484-6.38zm1.86 1.916a2.329 2.292 0 0 1 2.33 2.293 2.329 2.292 0 0 1-2.33 2.291 2.329 2.292 0 0 1-2.329-2.29 2.329 2.292 0 0 1 2.328-2.294z"
          fill="#42a5f5"
          fillRule="evenodd"
        />
        <ellipse
          cx="19.631"
          cy="4.615"
          rx="2.329"
          ry="2.292"
          fill="#42a5f5"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export default LuaIcon;
