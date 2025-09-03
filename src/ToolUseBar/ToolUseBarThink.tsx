import classNamesFn from 'classnames';
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
      <g>
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
      <g>
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
  classNames?: {
    root?: string;
    bar?: string;
    header?: string;
    headerLeft?: string;
    imageWrapper?: string;
    image?: string;
    name?: string;
    target?: string;
    time?: string;
    expand?: string;
    container?: string;
    content?: string;
    floatingExpand?: string;
  };
  styles?: {
    root?: React.CSSProperties;
    bar?: React.CSSProperties;
    header?: React.CSSProperties;
    headerLeft?: React.CSSProperties;
    imageWrapper?: React.CSSProperties;
    image?: React.CSSProperties;
    name?: React.CSSProperties;
    target?: React.CSSProperties;
    time?: React.CSSProperties;
    expand?: React.CSSProperties;
    container?: React.CSSProperties;
    content?: React.CSSProperties;
    floatingExpand?: React.CSSProperties;
  };
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
  classNames,
  styles,
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
      className={classNamesFn(prefixCls, hashId, classNames?.root, {
        [`${prefixCls}-expanded`]: !expandedState,
        [`${prefixCls}-loading`]: status === 'loading',
        [`${prefixCls}-active`]: expandedState,
        [`${prefixCls}-success`]: status === 'success',
      })}
      style={styles?.root}
    >
      <div
        className={classNamesFn(`${prefixCls}-bar`, hashId, classNames?.bar)}
        data-testid="tool-use-bar-think-bar"
        style={styles?.bar}
      >
        <div
          className={classNamesFn(
            `${prefixCls}-header`,
            hashId,
            classNames?.header,
          )}
          data-testid="tool-use-bar-think-header"
          style={styles?.header}
        >
          <div
            className={classNamesFn(
              `${prefixCls}-header-left`,
              hashId,
              classNames?.headerLeft,
            )}
            style={styles?.headerLeft}
          >
            <div
              className={classNamesFn(
                `${prefixCls}-image-wrapper`,
                hashId,
                classNames?.imageWrapper,
              )}
              style={styles?.imageWrapper}
            >
              {icon || (
                <div
                  className={classNamesFn(
                    `${prefixCls}-image`,
                    hashId,
                    classNames?.image,
                  )}
                  style={styles?.image}
                >
                  {defaultIcon}
                </div>
              )}
            </div>
            {toolName && (
              <div
                className={classNamesFn(
                  `${prefixCls}-name`,
                  hashId,
                  classNames?.name,
                )}
                style={styles?.name}
              >
                {toolName}
              </div>
            )}
          </div>
        </div>
        {toolTarget && (
          <div
            className={classNamesFn(
              `${prefixCls}-target`,
              hashId,
              classNames?.target,
            )}
            style={styles?.target}
          >
            {toolTarget}
          </div>
        )}
        {time && (
          <div
            className={classNamesFn(
              `${prefixCls}-time`,
              hashId,
              classNames?.time,
            )}
            style={styles?.time}
          >
            {time}
          </div>
        )}
        {thinkContent && (
          <div
            className={classNamesFn(
              `${prefixCls}-expand`,
              hashId,
              classNames?.expand,
            )}
            onClick={handleToggleExpand}
            style={styles?.expand}
          >
            {expandedState ? <ExpandDownIcon /> : <ExpandIcon />}
          </div>
        )}
      </div>
      {thinkContent && (
        <div
          className={classNamesFn(
            `${prefixCls}-container`,
            hashId,
            classNames?.container,
            {
              [`${prefixCls}-container-expanded`]: expandedState,
              [`${prefixCls}-container-loading`]:
                status === 'loading' && !floatingExpandedState,
              [`${prefixCls}-container-floating-expanded`]:
                floatingExpandedState,
            },
          )}
          data-testid="tool-use-bar-think-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            ...(expandedState
              ? {}
              : {
                  height: 1,
                  padding: 0,
                  margin: 0,
                  overflow: 'hidden',
                  minHeight: 0,
                  visibility: 'hidden',
                }),
            ...styles?.container,
          }}
        >
          <div
            className={classNamesFn(
              `${prefixCls}-content`,
              hashId,
              classNames?.content,
            )}
            style={styles?.content}
          >
            {thinkContent}
          </div>
          {status === 'loading' && isHovered && (
            <div
              className={classNamesFn(
                `${prefixCls}-floating-expand`,
                hashId,
                classNames?.floatingExpand,
              )}
              onClick={handleToggleFloatingExpand}
              data-testid="tool-use-bar-think-floating-expand"
              style={styles?.floatingExpand}
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
