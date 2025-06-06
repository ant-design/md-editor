import React from 'react';

interface DartIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const DartIcon: React.FC<DartIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.618 1.566a.978.978 0 0 0-.682.281l-.01.007-6.388 3.692 6.372 6.372v.004l7.658 7.659 1.46-2.63-5.264-12.64-2.457-2.457a.972.972 0 0 0-.69-.288z"
        fill="#66C3FA"
      />
      <path
        d="m5.553 5.531-3.69 6.383-.007.01a.967.967 0 0 0 .006 1.371l3.058 3.061 11.963 4.706 2.705-1.502-.073-.073-.019.002-7.5-7.512h-.009L5.553 5.53z"
        fill="#215896"
      />
      <path
        d="m5.537 5.534 6.518 6.525h.01l7.501 7.51 2.856-.544.004-8.449-3.015-2.955c-.66-.647-1.675-1.064-2.695-1.202l.002-.032-11.18-.852z"
        fill="#235997"
      />
      <path
        d="m5.545 5.542 6.522 6.522v.009l7.506 7.506-.546 2.855h-8.449l-2.954-3.017c-.647-.66-1.063-1.676-1.2-2.696l-.033.003-.846-11.182z"
        fill="#58B6F0"
      />
    </svg>
  );
};

export default DartIcon;
