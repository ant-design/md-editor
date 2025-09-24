import React from 'react';

export function DownOutlined(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={14} height={14} rx={0} />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="M10.088 13.83L7 10.741l-3.087 3.087a.583.583 0 11-.825-.825l3.5-3.5a.583.583 0 01.824 0l3.5 3.5a.583.583 0 11-.824.825z"
          fillRule="evenodd"
          fill="currentColor"
          transform="matrix(1 0 0 -1 0 18.667)"
        />
      </g>
    </svg>
  );
}
