import React from 'react';

interface CadenceIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CadenceIcon: React.FC<CadenceIconProps> = ({
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
      <path
        className="st1"
        d="M14.633 9.366h4.22v4.22h-4.22zm-4.22 5.806c0 .868-.718 1.586-1.586 1.586s-1.586-.718-1.586-1.586.719-1.586 1.586-1.586h1.586v-4.22H8.827c-3.202 0-5.805 2.604-5.805 5.806s2.603 5.806 5.805 5.806 5.806-2.604 5.806-5.806v-1.586h-4.22zm5.807-7.93h4.758v-4.22H16.22a5.81 5.81 0 0 0-5.806 5.806v.538h4.22v-.538c0-.868.718-1.586 1.586-1.586z"
        fill="#00e676"
        strokeWidth="2.56"
      />
    </svg>
  );
};

export default CadenceIcon;
