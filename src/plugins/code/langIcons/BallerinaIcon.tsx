import React from 'react';

interface BallerinaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const BallerinaIcon: React.FC<BallerinaIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      version="1.0"
      viewBox="0 0 50 50"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        style={{
          fill: '#00bfa5',
        }}
        d="m23.281 18.589-11.638-4.452V.237h11.638zm-11.638-.1 7.965 3.047-7.965 3.046zm0 31.274V28.935l11.638-4.451v6.731l-5.659 18.548zm15.671-31.174 11.639-4.452V.237H27.314zm11.639-.1-7.967 3.047 7.967 3.046zm0 31.274V28.935l-11.639-4.451v6.731l5.658 18.548z"
        transform="translate(2.842 3.103) scale(.87588)"
      />
    </svg>
  );
};

export default BallerinaIcon;
