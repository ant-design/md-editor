import React from 'react';

export function ExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={14} height={14} rx={0} />
        </clipPath>
      </defs>
      <g>
        <path
          d="M9.504 5.662L7 3.158 4.496 5.662a.584.584 0 11-.825-.824L6.588 1.92a.583.583 0 01.824 0l2.917 2.917a.583.583 0 01-.825.824zM7 10.842L4.496 8.338a.583.583 0 10-.825.824l2.917 2.917a.583.583 0 00.824 0l2.917-2.916a.584.584 0 10-.825-.825L7 10.842z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
