import React from 'react';

interface BatIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const BatIcon: React.FC<BatIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
    >
      <defs>
        <radialGradient
          id="a"
          cx="22.737"
          cy="22.737"
          r="3.628"
          gradientTransform="translate(-4.708 41.626) rotate(-81.5) scale(1 1.071)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#bedcdc" />
          <stop offset="0.5" stopColor="#8e9e9e" stopOpacity="0.74" />
          <stop offset="1" stopColor="#404f5c" stopOpacity="0.84" />
        </radialGradient>
        <radialGradient
          id="b"
          cx="11.336"
          cy="11.336"
          r="5.201"
          gradientTransform="translate(-2.347 20.753) rotate(-81.5) scale(1 1.071)"
          xlinkHref="#a"
        />
      </defs>
      <title>file_type_bat</title>
      <polygon
        points="24.811 27.318 27.215 24.914 28.417 27.318 27.215 28.52 24.811 27.318"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="20.964 27.443 24.365 27.443 23.515 29.993 21.815 29.993 20.964 27.443"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="18.157 24.811 20.561 27.215 18.157 28.417 16.954 27.215 18.157 24.811"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="18.032 20.964 18.032 24.365 15.482 23.515 15.482 21.815 18.032 20.964"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="20.664 18.157 18.26 20.561 17.058 18.157 18.26 16.954 20.664 18.157"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="24.51 18.032 21.11 18.032 21.96 15.482 23.66 15.482 24.51 18.032"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="27.318 20.664 24.914 18.26 27.318 17.058 28.52 18.26 27.318 20.664"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="27.443 24.51 27.443 21.11 29.993 21.96 29.993 23.66 27.443 24.51"
        style={{
          fill: 'silver',
        }}
      />
      <path
        d="M27.776,22.737A5.039,5.039,0,1,1,26.3,19.175,5.023,5.023,0,0,1,27.776,22.737Zm-5.039-1.9a1.9,1.9,0,1,0,1.344.557A1.894,1.894,0,0,0,22.737,20.837Z"
        style={{
          fill: 'silver',
        }}
      />
      <path
        d="M22.656,18.074A4.664,4.664,0,1,0,27.4,22.656,4.664,4.664,0,0,0,22.656,18.074Zm.15,8.61a3.947,3.947,0,1,1,3.877-4.015A3.947,3.947,0,0,1,22.806,26.684Z"
        style={{
          fill: '#a9a9a9',
        }}
      />
      <path
        d="M22.674,19.11a3.628,3.628,0,1,0,3.69,3.564A3.628,3.628,0,0,0,22.674,19.11Zm.1,5.7A2.073,2.073,0,1,1,24.811,22.7,2.073,2.073,0,0,1,22.774,24.81Z"
        style={{
          fill: 'url(#a)',
        }}
      />
      <path
        d="M22.7,20.665A2.073,2.073,0,1,0,24.81,22.7,2.073,2.073,0,0,0,22.7,20.665Zm.067,3.826a1.754,1.754,0,1,1,1.723-1.784A1.754,1.754,0,0,1,22.768,24.491Z"
        style={{
          fill: '#a9a9a9',
        }}
      />
      <polygon
        points="6.563 16.976 8.838 18.238 7.374 19.806 6.009 19.049 6.563 16.976"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="4.382 13.834 5.722 16.064 3.67 16.69 2.866 15.352 4.382 13.834"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="4.065 10.023 4.11 12.624 2.02 12.14 1.993 10.579 4.065 10.023"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="5.696 6.563 4.434 8.838 2.866 7.374 3.623 6.009 5.696 6.563"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="8.838 4.382 6.608 5.722 5.982 3.67 7.32 2.866 8.838 4.382"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="12.65 4.065 10.048 4.11 10.532 2.02 12.093 1.993 12.65 4.065"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="16.109 5.696 13.834 4.434 15.298 2.866 16.663 3.623 16.109 5.696"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="18.29 8.838 16.95 6.608 19.002 5.982 19.806 7.32 18.29 8.838"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="18.607 12.65 18.562 10.048 20.652 10.532 20.679 12.093 18.607 12.65"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="16.976 16.109 18.238 13.834 19.806 15.298 19.049 16.663 16.976 16.109"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="13.834 18.29 16.064 16.95 16.69 19.002 15.352 19.806 13.834 18.29"
        style={{
          fill: 'silver',
        }}
      />
      <polygon
        points="10.023 18.607 12.624 18.562 12.14 20.652 10.579 20.679 10.023 18.607"
        style={{
          fill: 'silver',
        }}
      />
      <path
        d="M11.467,18.831a7.5,7.5,0,1,1,5.261-2.288A7.473,7.473,0,0,1,11.467,18.831Zm2.682-7.544a2.814,2.814,0,1,0-.789,2A2.8,2.8,0,0,0,14.149,11.287Z"
        style={{
          fill: 'silver',
        }}
      />
      <path
        d="M11.218,4.6a6.737,6.737,0,1,0,6.854,6.619A6.737,6.737,0,0,0,11.218,4.6Zm.217,12.436a5.7,5.7,0,1,1,5.6-5.8A5.7,5.7,0,0,1,11.436,17.036Z"
        style={{
          fill: '#a9a9a9',
        }}
      />
      <path
        d="M11.245,6.136a5.2,5.2,0,1,0,5.29,5.109A5.2,5.2,0,0,0,11.245,6.136Zm.14,8.036a2.837,2.837,0,1,1,2.787-2.886A2.837,2.837,0,0,1,11.386,14.172Z"
        style={{
          fill: 'url(#b)',
        }}
      />
      <path
        d="M11.282,8.227a3.109,3.109,0,1,0,3.163,3.055A3.109,3.109,0,0,0,11.282,8.227Zm.1,5.74a2.631,2.631,0,1,1,2.585-2.677A2.631,2.631,0,0,1,11.382,13.967Z"
        style={{
          fill: '#a9a9a9',
        }}
      />
    </svg>
  );
};

export default BatIcon;
