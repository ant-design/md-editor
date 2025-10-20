import { Api, ChevronUp, X } from '@sofa-design/icons';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useMergedState } from 'rc-util';
import React, { useMemo } from 'react';

export interface ToolCall {
  id: string;
  toolName: React.ReactNode;
  toolTarget: React.ReactNode;
  time: React.ReactNode;
  icon?: React.ReactNode;
  errorMessage?: string;
  type?: 'summary' | 'normal' | string;
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
  light?: boolean;
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
  light = false,
}) => {
  // 使用 useMergedState 来管理展开状态
  const [expanded, setExpanded] = useMergedState(defaultExpanded ?? false, {
    value: isExpanded,
    onChange: onExpandedChange
      ? (value) => onExpandedChange(tool.id, value)
      : undefined,
  });

  const errorDom = useMemo(() => {
    return tool.status === 'error' && tool.errorMessage ? (
      <div className={classNames(`${prefixCls}-tool-content-error`, hashId)}>
        <div
          className={classNames(`${prefixCls}-tool-content-error-icon`, hashId)}
        >
          <X />
        </div>
        <div
          className={classNames(`${prefixCls}-tool-content-error-text`, hashId)}
        >
          {tool.errorMessage}
        </div>
      </div>
    ) : null;
  }, [tool.status, tool.errorMessage, prefixCls, hashId]);

  const contentDom = useMemo(() => {
    return tool.content ? (
      <div className={classNames(`${prefixCls}-tool-content`, hashId)}>
        {tool.content}
      </div>
    ) : null;
  }, [tool.content, prefixCls, hashId]);

  const showContent = useMemo(() => {
    return !!errorDom || !!contentDom;
  }, [errorDom, contentDom]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(tool.id);
    if (onActiveChange && !showContent) {
      onActiveChange(tool.id, !isActive);
    }

    // 如果没有内容需要展示，则早返回
    if (!showContent) return;

    // 避免在交互性子元素上误触发折叠
    if (e.target instanceof Element) {
      const tag = e.target.tagName.toLowerCase();
      if (['a', 'button', 'input', 'textarea', 'select', 'label'].includes(tag))
        return;
    }

    // 使用函数式更新避免闭包陈旧值问题
    setExpanded((prev) => !prev);
  };

  const handleExpandClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // 阻止事件冒泡到父元素
    setExpanded((prev) => !prev);
  };

  if (tool.type === 'summary') {
    return (
      <div
        className={classNames(`${prefixCls}-tool-container`, hashId)}
        data-testid="tool-user-item-tool-container "
      >
        {contentDom}
      </div>
    );
  }

  return (
    <div
      key={tool.id}
      data-testid="ToolUserItem"
      className={classNames(
        `${prefixCls}-tool ${hashId}`,
        tool.status === 'success' && `${prefixCls}-tool-success`,
        tool.status === 'loading' && `${prefixCls}-tool-loading`,
        tool.status === 'error' && `${prefixCls}-tool-error`,
        tool.status === 'idle' && `${prefixCls}-tool-idle`,
        isActive && !expanded && `${prefixCls}-tool-active`,
        expanded && `${prefixCls}-tool-expanded`,
        light && `${prefixCls}-tool-light`,
      )}
    >
      <div
        className={classNames(`${prefixCls}-tool-bar`, hashId)}
        data-testid="tool-user-item-tool-bar"
        onClick={(e) => {
          handleClick(e);
        }}
      >
        <div
          className={classNames(`${prefixCls}-tool-header`, hashId)}
          data-testid="tool-user-item-tool-header"
        >
          <motion.div
            className={classNames(`${prefixCls}-tool-image-wrapper`, hashId, {
              [`${prefixCls}-tool-image-wrapper-rotating`]:
                tool.status === 'loading',
              [`${prefixCls}-tool-image-wrapper-loading`]:
                tool.status === 'loading',
            })}
            animate={
              tool.status === 'loading'
                ? {
                    '--rotate': ['0deg', '360deg'],
                  }
                : {}
            }
            transition={
              tool.status === 'loading'
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
                '--rotation': tool.status === 'loading' ? '360deg' : '0deg',
              } as React.CSSProperties
            }
          >
            <div className={classNames(`${prefixCls}-tool-image`, hashId)}>
              {tool.icon ? tool.icon : <Api />}
            </div>
          </motion.div>
        </div>
        <motion.div
          className={classNames(`${prefixCls}-tool-header-right`, hashId)}
          animate={
            tool.status === 'loading'
              ? {
                  maskImage: [
                    'linear-gradient(to right, rgba(0,0,0,0.99)  -50%, rgba(0,0,0,0.15)   -50%,rgba(0,0,0,0.99)  150%)',
                    'linear-gradient(to right, rgba(0,0,0,0.99)  -50%,  rgba(0,0,0,0.15)  150%,rgba(0,0,0,0.99)  150%)',
                  ],
                }
              : {}
          }
          transition={
            tool.status === 'loading'
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
                tool.status === 'loading'
                  ? 'linear-gradient(to right, rgba(0,0,0,0.99) -30%, rgba(0,0,0,0.15) -50%, rgba(0,0,0,0.99) 120%)'
                  : undefined,
            } as React.CSSProperties
          }
        >
          {tool.toolName && (
            <div
              className={classNames(`${prefixCls}-tool-name`, hashId, {
                [`${prefixCls}-tool-name-loading`]: tool.status === 'loading',
              })}
            >
              {tool.toolName}
            </div>
          )}
          {tool.toolTarget && (
            <div
              className={classNames(`${prefixCls}-tool-target`, hashId, {
                [`${prefixCls}-tool-target-loading`]: tool.status === 'loading',
              })}
              title={tool.toolTarget?.toString() ?? undefined}
            >
              {tool.toolTarget}
            </div>
          )}
        </motion.div>
        {tool.time && (
          <div className={classNames(`${prefixCls}-tool-time`, hashId)}>
            {tool.time}
          </div>
        )}

        {showContent && !light && (
          <div
            className={classNames(`${prefixCls}-tool-expand`, hashId)}
            onClick={handleExpandClick}
          >
            <ChevronUp
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
          className={classNames(`${prefixCls}-tool-container`, hashId, {
            [`${prefixCls}-tool-container-light`]: light,
          })}
          data-testid="tool-user-item-tool-container "
        >
          {contentDom}
          {errorDom}
        </div>
      ) : null}
    </div>
  );
};
