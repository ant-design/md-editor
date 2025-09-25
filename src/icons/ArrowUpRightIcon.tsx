import * as React from 'react';

function ArrowUpRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={'1em'}
      height={'1em'}
      viewBox="0 0 16 16"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          d="M4.667 4h6.666c.369 0 .667.298.667.667v6.666a.667.667 0 01-1.333 0V6.276l-5.529 5.529a.667.667 0 11-.943-.943l5.529-5.529H4.667a.667.667 0 110-1.333z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export default ArrowUpRightIcon;
