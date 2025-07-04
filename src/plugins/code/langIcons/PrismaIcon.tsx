import React from 'react';

interface PrismaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PrismaIcon: React.FC<PrismaIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        style={{
          fillRule: 'evenodd',
          fill: '#00bfa5',
        }}
      >
        <path
          d="M19.308 17.864 10.09 20.52c-.282.081-.552-.156-.493-.433L12.89 4.721c.062-.287.47-.333.598-.066l6.098 12.615a.426.426 0 0 1-.278.593zm1.58-.626L13.829 2.63a1.134 1.134 0 0 0-.965-.63 1.129 1.129 0 0 0-1.031.522L4.175 14.606c-.238.376-.233.84.013 1.213l3.743 5.649c.223.337.61.532 1.011.532.114 0 .229-.016.341-.048l10.865-3.13c.333-.097.605-.326.748-.63.142-.304.14-.652-.007-.955z"
          style={{
            fill: '#00bfa5',
          }}
          transform="translate(-.5)"
        />
      </g>
    </svg>
  );
};

export default PrismaIcon;
