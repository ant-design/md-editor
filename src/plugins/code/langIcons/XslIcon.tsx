import React from 'react';

interface XslIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const XslIcon: React.FC<XslIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <title>file_type_xsl</title>
      <path
        d="M20.42,21.157l2.211,2.211L30,16,22.631,8.631,20.42,10.843,25.58,16Z"
        style={{
          fill: '#33a9dc',
        }}
      />
      <path
        d="M11.58,10.843,9.369,8.631,2,16l7.369,7.369,2.211-2.211L6.42,16Z"
        style={{
          fill: '#33a9dc',
        }}
      />
      <path
        d="M17.411,7.677l1.6.437-4.42,16.209-1.6-.437,4.42-16.209Z"
        style={{
          fill: '#33a9dc',
        }}
      />
    </svg>
  );
};

export default XslIcon;
