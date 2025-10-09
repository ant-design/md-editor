import {
  Brain,
  ChevronDown,
  ChevronDown as ExpandDownIcon,
  Expand as ExpandIcon,
} from '@sofa-design/icons';
import { ConfigProvider } from 'antd';
import classNamesFn from 'classnames';
import { motion } from 'framer-motion';
import { useMergedState } from 'rc-util';
import React, { useContext } from 'react';
import { useStyle } from './thinkStyle';

export interface ToolUseBarThinkProps {
  toolName: React.ReactNode;
  toolTarget?: React.ReactNode;
  time?: React.ReactNode;
  icon?: React.ReactNode;
  thinkContent?: React.ReactNode;
  testId?: string;
  status?: 'loading' | 'success' | 'error';
  expanded?: boolean;
  light?: boolean;
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
  light = false,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('tool-use-bar-think');
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
  const defaultIcon = <Brain />;

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
  const [hover, setHover] = React.useState(false);

  return wrapSSR(
    <div
      data-testid={testId || 'ToolUseBarThink'}
      className={classNamesFn(prefixCls, hashId, classNames?.root, {
        [`${prefixCls}-expanded`]: !expandedState,
        [`${prefixCls}-loading`]: status === 'loading',
        [`${prefixCls}-active`]: expandedState,
        [`${prefixCls}-success`]: status === 'success',
        [`${prefixCls}-light`]: light,
      })}
      style={styles?.root}
    >
      <div
        className={classNamesFn(`${prefixCls}-bar`, hashId, classNames?.bar)}
        data-testid="tool-use-bar-think-bar"
        style={styles?.bar}
        onClick={handleToggleExpand}
      >
        <div
          className={classNamesFn(
            `${prefixCls}-header`,
            hashId,
            classNames?.header,
            {
              [`${prefixCls}-header-light`]: light,
            },
          )}
          data-testid="tool-use-bar-think-header"
          style={styles?.header}
          onMouseMove={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div
            className={classNamesFn(
              `${prefixCls}-header-left`,
              hashId,
              classNames?.headerLeft,
            )}
            style={styles?.headerLeft}
          >
            {light ? (
              <div
                className={classNamesFn(
                  `${prefixCls}-header-left-icon`,
                  hashId,
                )}
              >
                {hover ? (
                  <ChevronDown
                    style={{
                      transform: expandedState
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                ) : (
                  <Brain />
                )}
              </div>
            ) : (
              <motion.div
                className={classNamesFn(
                  `${prefixCls}-image-wrapper`,
                  hashId,
                  classNames?.imageWrapper,
                  {
                    [`${prefixCls}-image-wrapper-rotating`]:
                      status === 'loading',
                    [`${prefixCls}-image-wrapper-loading`]:
                      status === 'loading',
                  },
                )}
                animate={
                  status === 'loading'
                    ? {
                        '--rotate': ['0deg', '360deg'],
                      }
                    : {}
                }
                transition={
                  status === 'loading'
                    ? {
                        '--rotate': {
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        },
                      }
                    : {}
                }
                style={
                  {
                    '--rotation': status === 'loading' ? '360deg' : '0deg',
                  } as React.CSSProperties
                }
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
              </motion.div>
            )}
          </div>
          <motion.div
            className={classNamesFn(`${prefixCls}-header-right`, hashId)}
            animate={
              status === 'loading'
                ? {
                    maskImage: [
                      'linear-gradient(to right, rgba(0,0,0,0.99)  -50%, rgba(0,0,0,0.15)   -50%,rgba(0,0,0,0.99)  150%)',
                      'linear-gradient(to right, rgba(0,0,0,0.99)  -50%,  rgba(0,0,0,0.15)  150%,rgba(0,0,0,0.99)  150%)',
                    ],
                  }
                : {}
            }
            transition={
              status === 'loading'
                ? {
                    maskImage: {
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }
                : {}
            }
            style={
              {
                maskImage:
                  status === 'loading'
                    ? 'linear-gradient(to right, rgba(0,0,0,0.99) -30%, rgba(0,0,0,0.15) -50%, rgba(0,0,0,0.99) 120%)'
                    : undefined,
              } as React.CSSProperties
            }
          >
            {toolName && (
              <div
                className={classNamesFn(
                  `${prefixCls}-name`,
                  {
                    [`${prefixCls}-name-light`]: light,
                  },
                  hashId,
                  classNames?.name,
                )}
                style={styles?.name}
              >
                {toolName}
              </div>
            )}
            {toolTarget ? (
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
            ) : (
              <div />
            )}
          </motion.div>
        </div>
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
        {thinkContent && !light && (
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
              [`${prefixCls}-container-light`]: light,
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
                  padding: '0 8px',
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
          {status === 'loading' && isHovered && !light ? (
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
          ) : null}
        </div>
      )}
    </div>,
  );
};
