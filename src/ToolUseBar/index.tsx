import classNames from 'classnames';
import React from 'react';
import { useStyle } from './style';

function ToolIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect width={14} height={14} rx={0} />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="M1.167 11.083V2.917q0-.725.512-1.238.513-.512 1.238-.512h8.166q.725 0 1.238.512.512.513.512 1.238v8.166q0 .725-.512 1.238-.513.512-1.238.512H2.917q-.725 0-1.238-.512-.512-.513-.512-1.238zm1.166 0q0 .584.584.584h8.166q.584 0 .584-.584V2.917q0-.584-.584-.584H2.917q-.584 0-.584.584v8.166zm3.33-6.245L4.495 3.67a.583.583 0 10-.825.825l.754.754-.754.754a.583.583 0 10.825.825l1.166-1.167a.583.583 0 000-.824zM6.416 7H8.75a.583.583 0 110 1.167H6.417a.583.583 0 110-1.167z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

interface ToolCall {
  id: string;
  toolName: React.ReactNode;
  toolTarget: React.ReactNode;
  time: React.ReactNode;
  icon?: React.ReactNode;
  status?: 'idle' | 'loading' | 'success' | 'error';
}

interface ToolUseBarProps {
  tools?: ToolCall[];
  onToolClick?: (id: string) => void;
}

const ToolUseBarItem = ({
  tool,
  prefixCls,
  hashId,
  onClick,
}: {
  tool: ToolCall;
  prefixCls: string;
  hashId: string;
  onClick?: (id: string) => void;
}) => {
  return (
    <div
      onClick={() => onClick?.(tool.id)}
      key={tool.id}
      className={classNames(
        `${prefixCls}-tool ${hashId}`,
        tool.status === 'success' && `${prefixCls}-tool-success`,
        tool.status === 'loading' && `${prefixCls}-tool-loading loading`,
        tool.status === 'error' && `${prefixCls}-tool-error`,
        tool.status === 'idle' && `${prefixCls}-tool-idle`,
      )}
    >
      <div className={`${prefixCls}-tool-header ${hashId}`}>
        <div className={`${prefixCls}-tool-header-left ${hashId}`}>
          <div
            className={classNames(
              `${prefixCls}-tool-image-wrapper ${hashId}`,
              tool.status === 'loading' && 'rotating',
            )}
          >
            {tool.icon || (
              <ToolIcon className={`${prefixCls}-tool-image ${hashId}`} />
            )}
          </div>
          <div
            className={classNames(
              `${prefixCls}-tool-name ${hashId}`,
              tool.status === 'loading' && 'gradient-text',
            )}
          >
            {tool.toolName}
          </div>
        </div>
      </div>
      <div
        className={classNames(
          `${prefixCls}-tool-target ${hashId}`,
          tool.status === 'loading' && 'gradient-text',
        )}
      >
        {tool.toolTarget}
      </div>
      <div className={`${prefixCls}-tool-time ${hashId}`}>{tool.time}</div>
    </div>
  );
};

export const ToolUseBar: React.FC<ToolUseBarProps> = ({ tools, ...props }) => {
  const prefixCls = 'tool-use-bar';
  const { wrapSSR, hashId } = useStyle(prefixCls);

  if (!tools?.length) return <div />;

  return wrapSSR(
    <div className={`${prefixCls} ${hashId}`}>
      {tools.map((tool) => (
        <ToolUseBarItem
          key={tool.id}
          tool={tool}
          onClick={props.onToolClick}
          prefixCls={prefixCls}
          hashId={hashId}
        />
      ))}
    </div>,
  );
};
