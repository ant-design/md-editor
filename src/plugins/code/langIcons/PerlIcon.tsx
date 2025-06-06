import React from 'react';

interface PerlIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PerlIcon: React.FC<PerlIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 14c-1 0-3 1-3 2 0 2 3 2 3 2v-1a1 1 0 0 1-1-1 1 1 0 0 1 1-1v-1m0 5s-4-.5-4-2.5c0-3 3-3.75 4-3.75V11.5c-1 0-5 1.5-5 4.5 0 4 5 4 5 4v-1M10.57 7.03l1.19.53c.43-2.44 1.58-4.06 1.58-4.06-.43 1.03-.71 1.88-.89 2.55C13.66 3.55 16.11 2 16.11 2a15.916 15.916 0 0 0-2.64 3.53c1.58-1.68 3.77-2.78 3.77-2.78-2.69 1.72-3.9 4.45-4.2 5.21l.55.08c0 .52 0 1 .25 1.38.76 1.89 4.66 2.05 4.66 6.58s-4.03 6-6.17 6-6.83-.97-6.83-6 4.95-5.07 5.83-7.08c.12-.38-.76-1.89-.76-1.89z"
        fill="#9575cd"
      />
    </svg>
  );
};

export default PerlIcon;
