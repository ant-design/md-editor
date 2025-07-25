import React from 'react';

interface CodeqlIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CodeqlIcon: React.FC<CodeqlIconProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <title>file_type_codeql</title>
      <path
        d="M26.889,24H5.111A3.061,3.061,0,0,1,2,21V11A3.061,3.061,0,0,1,5.111,8H26.889A3.061,3.061,0,0,1,30,11V21A3.061,3.061,0,0,1,26.889,24ZM5.111,10a1.02,1.02,0,0,0-1.037,1V21a1.02,1.02,0,0,0,1.037,1H26.889a1.02,1.02,0,0,0,1.037-1V11a1.02,1.02,0,0,0-1.037-1Z"
        style={{
          fill: '#2088ff',
        }}
      />
      <path
        d="M22.741,15H20.667a1,1,0,1,1,0-2h2.074a1,1,0,1,1,0,2Z"
        style={{
          fill: '#2088ff',
        }}
      />
      <path
        d="M24.815,19H20.667a1,1,0,1,1,0-2h4.148a1,1,0,1,1,0,2Z"
        style={{
          fill: '#2088ff',
        }}
      />
      <path
        d="M12.217,16a3.412,3.412,0,0,1-.256,1.369,2.661,2.661,0,0,1-.7.972l.863,1.045h-1.19l-.487-.576a3.075,3.075,0,0,1-1.057.179,2.941,2.941,0,0,1-1.444-.353,2.539,2.539,0,0,1-1.01-1.021A3.276,3.276,0,0,1,6.566,16a3.281,3.281,0,0,1,.372-1.619,2.54,2.54,0,0,1,1.01-1.019,3.138,3.138,0,0,1,2.884,0,2.545,2.545,0,0,1,1.012,1.019A3.271,3.271,0,0,1,12.217,16Zm-3.267.886h1.084l.448.554a1.7,1.7,0,0,0,.325-.6A2.718,2.718,0,0,0,10.924,16a2.109,2.109,0,0,0-.419-1.413A1.393,1.393,0,0,0,9.392,14.1a1.4,1.4,0,0,0-1.114.488A2.109,2.109,0,0,0,7.86,16a2.112,2.112,0,0,0,.418,1.412,1.392,1.392,0,0,0,1.114.489,1.664,1.664,0,0,0,.33-.032ZM13.6,19V13h1.276v4.986h2.587V19Z"
        style={{
          fill: '#2088ff',
        }}
      />
    </svg>
  );
};

export default CodeqlIcon;
