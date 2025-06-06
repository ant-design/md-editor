import React from 'react';

interface VerilogIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const VerilogIcon: React.FC<VerilogIconProps> = ({
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
        d="M17.282 17.282H6.717V6.717h10.565m4.226 4.226V8.83h-2.113V6.717c0-1.173-.95-2.113-2.113-2.113h-2.113V2.491h-2.113v2.113h-2.113V2.491H8.83v2.113H6.717c-1.173 0-2.113.94-2.113 2.113V8.83H2.491v2.113h2.113v2.113H2.491v2.113h2.113v2.113a2.113 2.113 0 0 0 2.113 2.113H8.83v2.113h2.113v-2.113h2.113v2.113h2.113v-2.113h2.113a2.113 2.113 0 0 0 2.113-2.113v-2.113h2.113v-2.113h-2.113v-2.113m-6.339 2.113h-2.113v-2.113h2.113m2.113-2.113H8.83v6.339h6.339z"
        fill="#ff7043"
      />
    </svg>
  );
};

export default VerilogIcon;
