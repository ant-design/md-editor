import React from 'react';

interface ObjectiveCppIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ObjectiveCppIcon: React.FC<ObjectiveCppIconProps> = ({
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
        d="m10 15.97.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96C1.06 15.77.5 14.16.5 12.21c.05-2.31.72-4.08 2-5.32C3.82 5.64 5.46 5 7.44 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4L10 8.08l-1.06-.34c-.4-.1-.86-.15-1.39-.15-1.16-.01-2.12.36-2.87 1.1-.76.73-1.15 1.85-1.18 3.34 0 1.36.37 2.42 1.08 3.2.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32m.5-4.97h2V9h2v2h2v2h-2v2h-2v-2h-2v-2m7 0h2V9h2v2h2v2h-2v2h-2v-2h-2z"
        style={{
          fill: '#FFAB40',
        }}
      />
    </svg>
  );
};

export default ObjectiveCppIcon;
