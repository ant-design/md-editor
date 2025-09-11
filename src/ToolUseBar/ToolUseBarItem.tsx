import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import React, { useMemo } from 'react';
import { ChevronUpIcon } from '../TaskList';

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
      <g>
        <path
          d="M1.167 11.083V2.917q0-.725.512-1.238.513-.512 1.238-.512h8.166q.725 0 1.238.512.512.513.512 1.238v8.166q0 .725-.512 1.238-.513.512-1.238.512H2.917q-.725 0-1.238-.512-.512-.513-.512-1.238zm1.166 0q0 .584.584.584h8.166q.584 0 .584-.584V2.917q0-.584-.584-.584H2.917q-.584 0-.584.584v8.166zm3.33-6.245L4.495 3.67a.583.583 0 10-.825.825l.754.754-.754.754a.583.583 0 10.825.825l1.166-1.167a.583.583 0 000-.824zM6.416 7H8.75a.583.583 0 110 1.167H6.417a.583.583 0 110-1.167z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export interface ToolCall {
  id: string;
  toolName: React.ReactNode;
  toolTarget: React.ReactNode;
  time: React.ReactNode;
  icon?: React.ReactNode;
  errorMessage?: string;
  type?: 'summary' | 'normal';
  content?: React.ReactNode;
  status?: 'idle' | 'loading' | 'success' | 'error';
  testId?: string;
}

export interface ToolUseBarItemProps {
  tool: ToolCall;
  prefixCls: string;
  hashId: string;
  onClick?: (id: string) => void;
  isActive?: boolean;
  onActiveChange?: (id: string, active: boolean) => void;
  isExpanded?: boolean;
  onExpandedChange?: (id: string, expanded: boolean) => void;
  defaultExpanded?: boolean;
}

export const ToolUseBarItem: React.FC<ToolUseBarItemProps> = ({
  tool,
  prefixCls,
  hashId,
  onClick,
  isActive,
  onActiveChange,
  isExpanded,
  onExpandedChange,
  defaultExpanded,
}) => {
  // 使用 useMergedState 来管理展开状态
  const [expanded, setExpanded] = useMergedState(defaultExpanded ?? false, {
    value: isExpanded,
    onChange: onExpandedChange
      ? (value) => onExpandedChange(tool.id, value)
      : undefined,
  });

  const handleClick = () => {
    onClick?.(tool.id);
    if (onActiveChange) {
      onActiveChange(tool.id, !isActive);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 通过 setExpanded 切换状态，useMergedState 会自动处理受控和非受控模式
    setExpanded(!expanded);
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

  const contentDom = useMemo(() => {
    return tool.content ? (
      <div className={`${prefixCls}-tool-content ${hashId}`}>
        {tool.content}
      </div>
    ) : null;
  }, [tool.content, prefixCls, hashId]);

  const showContent = useMemo(() => {
    return !!errorDom || !!contentDom;
  }, [errorDom, contentDom]);

  if (tool.type === 'summary') {
    return (
      <div
        className={`${prefixCls}-tool-container ${hashId}`}
        data-testid="tool-user-item-tool-container "
      >
        {contentDom}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      key={tool.id}
      data-testid="ToolUserItem"
      className={classNames(
        `${prefixCls}-tool ${hashId}`,
        tool.status === 'success' && `${prefixCls}-tool-success`,
        tool.status === 'loading' && `${prefixCls}-tool-loading`,
        tool.status === 'error' && `${prefixCls}-tool-error`,
        tool.status === 'idle' && `${prefixCls}-tool-idle`,
        isActive && `${prefixCls}-tool-active`,
      )}
    >
      <div
        className={`${prefixCls}-tool-bar ${hashId}`}
        data-testid="tool-user-item-tool-bar"
      >
        <div
          className={`${prefixCls}-tool-header ${hashId}`}
          data-testid="tool-user-item-tool-header"
        >
          <div className={`${prefixCls}-tool-header-left ${hashId}`}>
            <div
              className={classNames(`${prefixCls}-tool-image-wrapper`, hashId, {
                [`${prefixCls}-tool-image-wrapper-rotating`]:
                  tool.status === 'loading',
                [`${prefixCls}-tool-image-wrapper-loading`]:
                  tool.status === 'loading',
              })}
            >
              {tool.icon || (
                <div className={`${prefixCls}-tool-image ${hashId}`}>
                  <ToolIcon />
                </div>
              )}
            </div>
            {tool.toolName && (
              <div
                className={classNames(`${prefixCls}-tool-name ${hashId}`, {
                  [`${prefixCls}-tool-name-loading`]: tool.status === 'loading',
                })}
              >
                {tool.toolName}
              </div>
            )}
          </div>
        </div>
        {tool.toolTarget && (
          <div
            className={classNames(`${prefixCls}-tool-target ${hashId}`, {
              [`${prefixCls}-tool-target-loading`]: tool.status === 'loading',
            })}
            title={tool.toolTarget?.toString() ?? undefined}
          >
            {tool.toolTarget}
          </div>
        )}
        {tool.time && (
          <div className={`${prefixCls}-tool-time ${hashId}`}>{tool.time}</div>
        )}
        {showContent && (
          <div
            className={`${prefixCls}-tool-expand ${hashId}`}
            onClick={handleExpandClick}
          >
            <ChevronUpIcon
              style={{
                transition: 'transform 0.3s ease-in-out',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </div>
        )}
      </div>
      {showContent && expanded ? (
        <div
          className={`${prefixCls}-tool-container ${hashId}`}
          data-testid="tool-user-item-tool-container "
        >
          {contentDom}
          {errorDom}
        </div>
      ) : null}
    </div>
  );
};
