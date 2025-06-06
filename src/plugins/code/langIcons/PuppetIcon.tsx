import React from 'react';

interface PuppetIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PuppetIcon: React.FC<PuppetIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#fbc02d">
        <path d="M10.268 2.406h13.587v13.587H10.268zm15.876 15.59h13.587v13.587H26.144zm-15.876 16.01h13.587v13.587H10.268z" />
        <path d="M15.327 4.553 33.63 22.858l-3.236 3.236L12.09 7.789z" />
        <path d="M36.54 24.267 18.235 42.572l-3.237-3.237L33.303 21.03z" />
      </g>
    </svg>
  );
};

export default PuppetIcon;
