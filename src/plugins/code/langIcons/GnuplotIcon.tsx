import React from 'react';

interface GnuplotIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GnuplotIcon: React.FC<GnuplotIconProps> = ({
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
      <title>file_type_gnuplot</title>
      <rect
        x="2.571"
        y="2.571"
        width="26.812"
        height="26.813"
        style={{
          fill: '#eaeaea',
        }}
      />
      <path
        d="M5.032,29.691a.5.5,0,0,1-.367-.838L18.65,13.7a.448.448,0,0,1,.376-.161.5.5,0,0,1,.37.173l4.287,4.976,5.348-6.095a.5.5,0,1,1,.752.659l-5.728,6.527a.5.5,0,0,1-.376.17h0a.5.5,0,0,1-.377-.174l-4.3-4.985L5.4,29.53A.5.5,0,0,1,5.032,29.691Z"
        style={{
          fill: '#0303fe',
        }}
      />
      <path
        d="M6.321,21.577h0a.5.5,0,0,1-.38-.177L2.251,17.056a.5.5,0,0,1,.763-.648l3.309,3.9,7.654-8.952a.5.5,0,0,1,.378-.175h0a.5.5,0,0,1,.378.172l1.588,1.832L24.24,2.467a.5.5,0,0,1,.805.595L16.757,14.279a.5.5,0,0,1-.383.2.474.474,0,0,1-.4-.171L14.36,12.445,6.7,21.4A.5.5,0,0,1,6.321,21.577Z"
        style={{
          fill: '#03fe03',
        }}
      />
      <path
        d="M29.407,28.839a.5.5,0,0,1-.377-.172L21.708,20.26,16.73,25.938a.5.5,0,0,1-.376.169h0a.5.5,0,0,1-.376-.172L2.259,10.092a.5.5,0,1,1,.756-.654L16.357,24.847l4.976-5.677a.5.5,0,0,1,.376-.17h0a.5.5,0,0,1,.376.172l7.7,8.839a.5.5,0,0,1-.377.828Z"
        style={{
          fill: '#fd0303',
        }}
      />
      <path d="M29,3V29H3V3H29m1-1H2V30H30V2Z" />
    </svg>
  );
};

export default GnuplotIcon;
