import React from 'react';

export function ExpandDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
          d="M9.504 12.08L7 9.574l-2.504 2.504a.584.584 0 01-.825-.825l2.917-2.916a.583.583 0 01.824 0l2.917 2.916a.583.583 0 11-.825.825zM3.5 2.332c0 .155.061.303.17.413l2.918 2.916a.583.583 0 00.824 0l2.917-2.916a.583.583 0 10-.825-.825L7 4.425 4.496 1.921a.583.583 0 00-.996.412z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
