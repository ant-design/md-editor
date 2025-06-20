import React from 'react';

interface CobolIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CobolIcon: React.FC<CobolIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      style={{
        clipRule: 'evenodd',
        fillRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: '2',
      }}
      viewBox="0 0 24 24"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.593 1.116a10.973 10.973 0 0 0-3.186 0L9.71 2.935a9.345 9.345 0 0 0-2.501 1.036L5.43 3.178A10.975 10.975 0 0 0 3.178 5.43l.793 1.779A9.345 9.345 0 0 0 2.935 9.71l-1.819.697a10.973 10.973 0 0 0 0 3.186l1.819.697a9.345 9.345 0 0 0 1.036 2.501l-.793 1.779a10.975 10.975 0 0 0 2.252 2.252l1.779-.793a9.345 9.345 0 0 0 2.501 1.036l.697 1.819c1.056.155 2.13.155 3.186 0l.697-1.819a9.345 9.345 0 0 0 2.501-1.036l1.779.793a10.975 10.975 0 0 0 2.252-2.252l-.793-1.779a9.345 9.345 0 0 0 1.036-2.501l1.819-.697c.155-1.056.155-2.13 0-3.186l-1.819-.697a9.345 9.345 0 0 0-1.036-2.501l.793-1.779a10.975 10.975 0 0 0-2.252-2.252l-1.779.793a9.345 9.345 0 0 0-2.501-1.036zM12 4.951c3.89 0 7.049 3.159 7.049 7.049S15.89 19.049 12 19.049 4.951 15.89 4.951 12 8.11 4.951 12 4.951z"
        style={{
          fill: '#0288d1',
        }}
        transform="translate(.655 .655) scale(.94546)"
      />
      <path
        d="M14.83 14.825A3.985 3.985 0 0 1 12 16c-2.208 0-4-1.792-4-4s1.792-4 4-4c1.105 0 2.106.449 2.83 1.175l-1.414 1.413a2 2 0 1 0 0 2.824z"
        style={{
          fill: '#0288d1',
        }}
        transform="translate(.655 .655) scale(.94546)"
      />
    </svg>
  );
};

export default CobolIcon;
