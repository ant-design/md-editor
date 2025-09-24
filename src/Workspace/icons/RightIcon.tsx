import React from 'react';

const RightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    version="1.1"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      d="M5.25 3.5L8.75 7L5.25 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default RightIcon;
