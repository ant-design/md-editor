import classNames from 'classnames';
import { useMergedState } from 'rc-util';
import React from 'react';
import { ThinkIcon } from '../icons/ThinkIcon';
import { useStyle } from './thinkStyle';

function ExpandDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={14}
      height={14}
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
          d="M9.504 12.08L7 9.574l-2.504 2.504a.584.584 0 01-.825-.825l2.917-2.916a.583.583 0 01.824 0l2.917 2.916a.583.583 0 11-.825.825zM3.5 2.332c0 .155.061.303.17.413l2.918 2.916a.583.583 0 00.824 0l2.917-2.916a.583.583 0 10-.825-.825L7 4.425 4.496 1.921a.583.583 0 00-.996.412z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
function ExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={14}
      height={14}
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
          d="M9.504 5.662L7 3.158 4.496 5.662a.584.584 0 11-.825-.824L6.588 1.92a.583.583 0 01.824 0l2.917 2.917a.583.583 0 01-.825.824zM7 10.842L4.496 8.338a.583.583 0 10-.825.824l2.917 2.917a.583.583 0 00.824 0l2.917-2.916a.584.584 0 10-.825-.825L7 10.842z"
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export interface ToolUseBarThinkProps {
  toolName: React.ReactNode;
  toolTarget: React.ReactNode;
  time: React.ReactNode;
  icon?: React.ReactNode;
  thinkContent?: React.ReactNode;
  testId?: string;
  status?: 'loading' | 'success' | 'error';
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  floatingExpanded?: boolean;
  defaultFloatingExpanded?: boolean;
  onFloatingExpandedChange?: (floatingExpanded: boolean) => void;
}

export const ToolUseBarThink: React.FC<ToolUseBarThinkProps> = ({
  toolName,
  toolTarget,
  time,
  icon,
  thinkContent,
  status,
  testId,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  floatingExpanded,
  defaultFloatingExpanded = false,
  onFloatingExpandedChange,
}) => {
  const prefixCls = 'tool-use-bar-think';
  const { wrapSSR, hashId } = useStyle(prefixCls);
  const [expandedState, setExpandedState] = useMergedState(defaultExpanded, {
    value: expanded,
    onChange: onExpandedChange,
  });
  const [floatingExpandedState, setFloatingExpandedState] = useMergedState(
    defaultFloatingExpanded,
    {
      value: floatingExpanded,
      onChange: onFloatingExpandedChange,
    },
  );
  const [isHovered, setIsHovered] = React.useState(false);

  // Think 模块的默认图标
  const defaultIcon = <ThinkIcon />;

  const handleToggleExpand = () => {
    setExpandedState(!expandedState);
  };

  const handleToggleFloatingExpand = () => {
    setFloatingExpandedState(!floatingExpandedState);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return wrapSSR(
    <div
      data-testid={testId || 'ToolUseBarThink'}
      className={classNames(prefixCls, hashId, {
        [`${prefixCls}-expanded`]: !expandedState,
        [`${prefixCls}-loading`]: status === 'loading',
      })}
    >
      <div
        className={`${prefixCls}-bar ${hashId}`}
        data-testid="tool-use-bar-think-bar"
      >
        <div
          className={`${prefixCls}-header ${hashId}`}
          data-testid="tool-use-bar-think-header"
        >
          <div className={`${prefixCls}-header-left ${hashId}`}>
            <div className={`${prefixCls}-image-wrapper ${hashId}`}>
              {icon || (
                <div className={`${prefixCls}-image ${hashId}`}>
                  {defaultIcon}
                </div>
              )}
            </div>
            {toolName && (
              <div className={`${prefixCls}-name ${hashId}`}>{toolName}</div>
            )}
          </div>
        </div>
        {toolTarget && (
          <div className={`${prefixCls}-target ${hashId}`}>{toolTarget}</div>
        )}
        {time && <div className={`${prefixCls}-time ${hashId}`}>{time}</div>}
        <div
          className={`${prefixCls}-expand ${hashId}`}
          onClick={handleToggleExpand}
        >
          {expandedState ? <ExpandDownIcon /> : <ExpandIcon />}
        </div>
      </div>
      {thinkContent && (
        <div
          className={classNames(`${prefixCls}-container`, hashId, {
            [`${prefixCls}-container-expanded`]: expandedState,
            [`${prefixCls}-container-loading`]:
              status === 'loading' && !floatingExpandedState,
            [`${prefixCls}-container-floating-expanded`]: floatingExpandedState,
          })}
          data-testid="tool-use-bar-think-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={
            expandedState
              ? {}
              : {
                  height: 1,
                  padding: 0,
                  margin: 0,
                  overflow: 'hidden',
                  minHeight: 0,
                  visibility: 'hidden',
                }
          }
        >
          <div className={classNames(`${prefixCls}-content`, hashId)}>
            {thinkContent}
          </div>
          {status === 'loading' && isHovered && (
            <div
              className={`${prefixCls}-floating-expand ${hashId}`}
              onClick={handleToggleFloatingExpand}
              data-testid="tool-use-bar-think-floating-expand"
            >
              {floatingExpandedState ? <ExpandDownIcon /> : <ExpandIcon />}
              {floatingExpandedState ? '收起' : '展开'}
            </div>
          )}
        </div>
      )}
    </div>,
  );
};
