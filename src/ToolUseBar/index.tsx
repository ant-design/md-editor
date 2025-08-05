import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import React, { useMemo } from 'react';
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

function ErrorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 12.25330924987793 12.836221694946289"
      {...props}
    >
      <path
        d="M11.145 4.133q-.461-.953-1.248-1.648-.76-.672-1.72-1.014-.961-.341-1.975-.3-1.049.043-2.008.492-.96.448-1.664 1.226-.682.751-1.036 1.708-.354.956-.325 1.97.03 1.05.465 2.014.437.965 1.205 1.68.743.691 1.695 1.057.951.366 1.966.35 1.049-.015 2.018-.438h.002a.583.583 0 11.467 1.068h-.001q-1.185.518-2.468.537-1.24.02-2.403-.428-1.162-.447-2.07-1.292-.94-.874-1.474-2.053Q.038 7.883.003 6.6-.032 5.36.4 4.192q.432-1.168 1.265-2.087.863-.951 2.035-1.5Q4.87.059 6.154.006q1.24-.05 2.413.367Q9.741.789 10.67 1.61q.962.85 1.525 2.015a.584.584 0 01-1.05.508zM6.42 2.337a.583.583 0 00-.583.583v3.5c0 .221.124.423.322.522L8.492 8.11a.583.583 0 00.522-1.044L7.004 6.06V2.92a.583.583 0 00-.584-.583zm4.083 3.792a.583.583 0 111.167 0v3.5a.583.583 0 11-1.167 0v-3.5zm.584 6.416a.583.583 0 100-1.166.583.583 0 000 1.166z"
        fillRule="evenodd"
        fill="currentColor"
      />
    </svg>
  );
}

interface ToolCall {
  id: string;
  toolName: React.ReactNode;
  toolTarget: React.ReactNode;
  time: React.ReactNode;
  icon?: React.ReactNode;
  errorMessage?: string;
  status?: 'idle' | 'loading' | 'success' | 'error';
}

interface ToolUseBarProps {
  tools?: ToolCall[];
  onToolClick?: (id: string) => void;
  className?: string;
  activeKeys?: string[];
  defaultActiveKeys?: string[];
  onActiveKeysChange?: (activeKeys: string[]) => void;
}

const ToolUseBarItem = ({
  tool,
  prefixCls,
  hashId,
  onClick,
  isActive,
  onActiveChange,
}: {
  tool: ToolCall;
  prefixCls: string;
  hashId: string;
  onClick?: (id: string) => void;
  isActive?: boolean;
  onActiveChange?: (id: string, active: boolean) => void;
}) => {
  const handleClick = () => {
    onClick?.(tool.id);
    if (onActiveChange) {
      onActiveChange(tool.id, !isActive);
    }
  };

  const errorDom = useMemo(() => {
    return tool.status === 'error' && tool.errorMessage ? (
      <div className={`${prefixCls}-tool-content-error ${hashId}`}>
        <div className={`${prefixCls}-tool-content-error-icon ${hashId}`}>
          <ErrorIcon />
        </div>
        <div className={`${prefixCls}-tool-content-error-text ${hashId}`}>
          {tool.errorMessage}
        </div>
      </div>
    ) : null;
  }, [tool.status, tool.errorMessage, prefixCls, hashId]);

  return (
    <div
      onClick={handleClick}
      key={tool.id}
      className={classNames(
        `${prefixCls}-tool ${hashId}`,
        tool.status === 'success' && `${prefixCls}-tool-success`,
        tool.status === 'loading' && `${prefixCls}-tool-loading`,
        tool.status === 'error' && `${prefixCls}-tool-error`,
        tool.status === 'idle' && `${prefixCls}-tool-idle`,
        isActive && `${prefixCls}-tool-active`,
      )}
    >
      <div className={`${prefixCls}-tool-bar ${hashId}`}>
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
      {errorDom ? (
        <div className={`${prefixCls}-tool-content ${hashId}`}>{errorDom}</div>
      ) : null}
    </div>
  );
};

export const ToolUseBar: React.FC<ToolUseBarProps> = ({
  tools,
  onActiveKeysChange,
  ...props
}) => {
  const prefixCls = 'tool-use-bar';
  const { wrapSSR, hashId } = useStyle(prefixCls);

  const [activeKeys, setActiveKeys] = useMergedState(
    props.defaultActiveKeys || [],
    {
      defaultValue: props.activeKeys,
      onChange: onActiveKeysChange,
    },
  );

  const handleActiveChange = (id: string, active: boolean) => {
    if (onActiveKeysChange) {
      const newActiveKeys = active
        ? [...activeKeys, id]
        : activeKeys.filter((key) => key !== id);
      setActiveKeys(newActiveKeys);
    }
  };

  if (!tools?.length)
    return <div className={classNames(prefixCls, hashId, props.className)} />;

  return wrapSSR(
    <div className={classNames(prefixCls, hashId, props.className)}>
      {tools.map((tool) => (
        <ToolUseBarItem
          key={tool.id}
          tool={tool}
          onClick={props.onToolClick}
          isActive={activeKeys.includes(tool.id)}
          onActiveChange={handleActiveChange}
          prefixCls={prefixCls}
          hashId={hashId}
        />
      ))}
    </div>,
  );
};
