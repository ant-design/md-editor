import React from 'react';

interface HackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const HackIcon: React.FC<HackIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 253.6 253.6"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#607d8b"
        d="M56.244 166.749v64.673l63.681-64.673zm66.438-145.186L56.246 86.457v67.758l66.436-66.436z"
      />
      <path fill="#eceff1" d="M130.699 88.16v63.352L194.82 88.16z" />
      <path
        fill="#607d8b"
        d="m198.898 95.792-68.2 67.869v67.758l68.2-67.979z"
      />
      <path fill="#ffa000" d="m60.638 160.268 62.03.11V98.57z" />
    </svg>
  );
};

export default HackIcon;
