import * as React from 'react';

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={32}
      height={32}
      role="img"
      aria-label="PauseIcon"
      viewBox="0 0 32 32"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect x={8} y={8} width={16} height={16} rx={0} />
        </clipPath>
      </defs>
      <circle
        cx="50%"
        cy="50%"
        r="14"
        strokeWidth="3"
        stroke="#F2F2F2"
        fill="none"
      ></circle>
      <circle
        id="ring"
        className="pause-icon-ring"
        cx="50%"
        cy="50%"
        r="14"
        strokeLinecap="round"
        strokeWidth="3"
        stroke="currentColor"
        fill="none"
        transform=""
        strokeDasharray="42, 914"
      ></circle>
      <g clipPath="url(#a)">
        <path
          d="M10.667 14.053c0-1.445 0-1.968.203-2.367.18-.351.465-.637.816-.816.4-.203.922-.203 2.367-.203h3.894c1.445 0 1.968 0 2.367.203.351.18.637.465.816.816.203.4.203.922.203 2.367v3.894c0 1.445 0 1.968-.203 2.367a1.867 1.867 0 01-.816.816c-.4.203-.922.203-2.367.203h-3.894c-1.445 0-1.968 0-2.367-.203a1.867 1.867 0 01-.816-.816c-.203-.4-.203-.922-.203-2.367v-3.894z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export default PauseIcon;
