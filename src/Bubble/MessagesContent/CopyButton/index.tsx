import { memo } from 'react';

import React from 'react';
import { useCopied } from '../../../hooks/useCopied';
import { ActionIconBox, ActionIconBoxProps } from '../../../index';

export const CopyIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="none"
      version="1.1"
      width="1em"
      height="1em"
      viewBox="0 0 14.087890625 14.66650390625"
    >
      <g>
        <path
          d="M10.8199,0.195262C10.6771,0.0702379,10.4834,0,10.2815,0L4.95203,0C3.69058,0,2.66797,0.895431,2.66797,2L2.66797,10C2.66797,11.1046,3.69058,12,4.95203,12L11.8042,12C13.0657,12,14.0883,11.1046,14.0883,10L14.0883,3.33333C14.0883,3.15652,14.0081,2.98695,13.8653,2.86193L10.8199,0.195262ZM10.2841,3.33333L12.0595,3.33333L9.7745,1.33252L9.52271,1.33255L9.52271,2.66667C9.52271,3.03486,9.86358,3.33333,10.2841,3.33333ZM4.76136,1.33319L8,1.33276L8,2.66667C8,3.77124,9.02261,4.66667,10.2841,4.66667L12.374,4.66667L12.3749,9.99985C12.3749,10.368,12.034,10.6665,11.6136,10.6665L4.76136,10.6665C4.34087,10.6665,4,10.368,4,9.99985L4,1.99985C4,1.63166,4.34087,1.33319,4.76136,1.33319ZM1.33333,4.40006C1.33333,4.03188,1.03486,3.7334,0.666667,3.7334C0.298477,3.7334,0,4.03188,0,4.40006L0,12.9334C0,13.8907,0.77604,14.6667,1.73333,14.6667L8.26667,14.6667C8.63486,14.6667,8.93333,14.3683,8.93333,14.0001C8.93333,13.6319,8.63486,13.3334,8.26667,13.3334L1.73333,13.3334C1.51242,13.3334,1.33333,13.1543,1.33333,12.9334L1.33333,4.40006Z"
          fillRule="evenodd"
          fill="currentColor"
          fillOpacity={1}
        />
      </g>
    </svg>
  );
};

export type CopyButtonProps = {
  className?: string;
  onClick?: (e: any) => any;
  children?: any;
} & Omit<ActionIconBoxProps, 'children'>;

export const CopyButton = memo<CopyButtonProps>(
  ({ className, onClick, ...props }) => {
    const { copied, setCopied } = useCopied();
    return (
      <ActionIconBox
        onClick={async (e) => {
          await onClick?.(e);
          setCopied();
        }}
        {...props}
        title={copied ? '✅ 复制成功' : props.title}
      >
        {props.children || <CopyIcon className={className} />}
      </ActionIconBox>
    );
  },
);
