import React from 'react';

interface VhdlIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const VhdlIcon: React.FC<VhdlIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <title>file_type_vhdl</title>
      <path
        d="M2,2H30V30H2Zm1.689.067A1.624,1.624,0,0,0,2.063,3.692V28.314A1.625,1.625,0,0,0,3.689,29.94H28.316a1.625,1.625,0,0,0,1.626-1.626V3.692a1.624,1.624,0,0,0-1.626-1.625ZM3.008,28.079a.911.911,0,0,0,.911.912H28.083a.911.911,0,0,0,.911-.912V3.919a.91.91,0,0,0-.911-.911H3.919a.91.91,0,0,0-.911.911Z"
        style={{
          fill: '#0d9b35',
        }}
      />
      <polygon
        points="25.52 5.502 18.858 26.491 13.154 26.491 6.492 5.502 10.508 5.502 16.029 22.795 21.504 5.502 25.52 5.502"
        style={{ fill: '#fff' }}
      />
    </svg>
  );
};

export default VhdlIcon;
