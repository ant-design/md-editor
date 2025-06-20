import React from 'react';

interface JsonnetIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const JsonnetIcon: React.FC<JsonnetIconProps> = ({
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
      <title>file_type_jsonnet</title>
      <path
        d="M30,16A14,14,0,1,1,16,2,14,14,0,0,1,30,16Z"
        style={{
          fill: '#0064bd',
        }}
      />
      <path
        d="M20.086,22.537,16.817,20.9V17.634l3.269,1.634Z"
        style={{
          fill: '#fff',
          fillRule: 'evenodd',
        }}
      />
      <path
        d="M7.012,12.732,10.28,11.1l3.269,1.635L10.28,14.366ZM10.28,11.1l3.269-1.634L16.817,11.1l-3.268,1.635ZM13.549,16l3.268-1.634L20.086,16l-3.269,1.634Zm3.268-4.9,3.269-1.634L23.354,11.1l-3.268,1.635Zm0,6.537L20.086,16l3.268,1.634-3.268,1.634Z"
        style={{
          fill: '#bfbfbf',
          fillRule: 'evenodd',
        }}
      />
      <path
        d="M13.549,22.537V19.268l3.268-1.634V20.9ZM20.086,16V12.732L23.354,11.1v3.269Zm0,6.537V19.268l3.268-1.634V20.9ZM16.817,20.9V17.634L20.086,16v3.268ZM13.549,16V12.732L16.817,11.1v3.269Z"
        style={{
          fill: 'gray',
          fillRule: 'evenodd',
        }}
      />
      <path
        d="M7.012,16l3.268,1.634V20.9l3.269,1.634V19.268L16.817,20.9V17.634L13.549,16V12.732L10.28,11.1v3.269L7.012,12.732Zm13.074,0-3.269-1.634V11.1l3.269,1.635Z"
        style={{
          fill: '#fff',
          fillRule: 'evenodd',
        }}
      />
    </svg>
  );
};

export default JsonnetIcon;
