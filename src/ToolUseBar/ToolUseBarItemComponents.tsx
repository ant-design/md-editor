import { Api, ChevronUp, X } from '@sofa-design/icons';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import React, { memo, useMemo } from 'react';
import { ToolCall } from './ToolUseBarItem';

interface ToolImageProps {
  tool: ToolCall;
  prefixCls: string;
  hashId: string;
}

const ToolImageComponent: React.FC<ToolImageProps> = ({
  tool,
  prefixCls,
  hashId,
}) => {
  const toolImageWrapperClassName = useMemo(() => {
    return classnames(`${prefixCls}-tool-image-wrapper`, hashId, {
      [`${prefixCls}-tool-image-wrapper-rotating`]: tool.status === 'loading',
      [`${prefixCls}-tool-image-wrapper-loading`]: tool.status === 'loading',
    });
  }, [prefixCls, hashId, tool.status]);

  const toolImageClassName = useMemo(() => {
    return classnames(`${prefixCls}-tool-image`, hashId);
  }, [prefixCls, hashId]);

  const animationProps = useMemo(() => {
    if (tool.status === 'loading') {
      return {
        animate: {
          '--rotate': ['0deg', '360deg'],
        },
        transition: {
          '--rotate': {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          },
        },
        style: {
          '--rotation': '360deg',
        } as React.CSSProperties,
      };
    }
    return {
      style: {
        '--rotation': '0deg',
      } as React.CSSProperties,
    };
  }, [tool.status]);

  return (
    <motion.div className={toolImageWrapperClassName} {...animationProps}>
      <div className={toolImageClassName}>
        {tool.icon ? tool.icon : <Api />}
      </div>
    </motion.div>
  );
};

export const ToolImage = memo(ToolImageComponent);

interface ToolHeaderRightProps {
  tool: ToolCall;
  prefixCls: string;
  hashId: string;
  light: boolean;
}

const ToolHeaderRightComponent: React.FC<ToolHeaderRightProps> = ({
  tool,
  prefixCls,
  hashId,
  light,
}) => {
  const toolHeaderRightClassName = useMemo(() => {
    return classnames(
      `${prefixCls}-tool-header-right`,
      {
        [`${prefixCls}-tool-header-right-light`]: light,
      },
      hashId,
    );
  }, [prefixCls, hashId, light]);

  const toolNameClassName = useMemo(() => {
    return classnames(`${prefixCls}-tool-name`, hashId, {
      [`${prefixCls}-tool-name-loading`]: tool.status === 'loading',
    });
  }, [prefixCls, hashId, tool.status]);

  const toolTargetClassName = useMemo(() => {
    return classnames(`${prefixCls}-tool-target`, hashId, {
      [`${prefixCls}-tool-target-loading`]: tool.status === 'loading',
      [`${prefixCls}-tool-target-light`]: light,
    });
  }, [prefixCls, hashId, tool.status, light]);

  const animationProps = useMemo(() => {
    if (tool.status === 'loading') {
      return {
        animate: {
          maskImage: [
            'linear-gradient(to right, rgba(0,0,0,0.99)  -50%, rgba(0,0,0,0.15)   -50%,rgba(0,0,0,0.99)  150%)',
            'linear-gradient(to right, rgba(0,0,0,0.99)  -50%,  rgba(0,0,0,0.15)  150%,rgba(0,0,0,0.99)  150%)',
          ],
        },
        transition: {
          maskImage: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          },
        },
        style: {
          maskImage:
            'linear-gradient(to right, rgba(0,0,0,0.99) -30%, rgba(0,0,0,0.15) -50%, rgba(0,0,0,0.99) 120%)',
        } as React.CSSProperties,
      };
    }
    return {};
  }, [tool.status]);

  return (
    <motion.div className={toolHeaderRightClassName} {...animationProps}>
      {tool.toolName && (
        <div className={toolNameClassName}>{tool.toolName}</div>
      )}
      {tool.toolTarget && (
        <div
          className={toolTargetClassName}
          title={tool.toolTarget?.toString() ?? undefined}
        >
          {tool.toolTarget}
        </div>
      )}
    </motion.div>
  );
};

export const ToolHeaderRight = memo(ToolHeaderRightComponent);

interface ToolTimeProps {
  tool: ToolCall;
  prefixCls: string;
  hashId: string;
}

const ToolTimeComponent: React.FC<ToolTimeProps> = ({
  tool,
  prefixCls,
  hashId,
}) => {
  const toolTimeClassName = useMemo(() => {
    return classnames(`${prefixCls}-tool-time`, hashId);
  }, [prefixCls, hashId]);

  if (!tool.time) return null;

  return <div className={toolTimeClassName}>{tool.time}</div>;
};

export const ToolTime = memo(ToolTimeComponent);

interface ToolExpandProps {
  showContent: boolean;
  expanded: boolean;
  prefixCls: string;
  hashId: string;
  onExpandClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ToolExpandComponent: React.FC<ToolExpandProps> = ({
  showContent,
  expanded,
  prefixCls,
  hashId,
  onExpandClick,
}) => {
  const toolExpandClassName = useMemo(() => {
    return classnames(`${prefixCls}-tool-expand`, hashId);
  }, [prefixCls, hashId]);

  const chevronStyle = useMemo(() => {
    return {
      transition: 'transform 0.3s ease-in-out',
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    };
  }, [expanded]);

  if (!showContent) return null;

  return (
    <div className={toolExpandClassName} onClick={onExpandClick}>
      <ChevronUp style={chevronStyle} />
    </div>
  );
};

export const ToolExpand = memo(ToolExpandComponent);

interface ToolContentProps {
  tool: ToolCall;
  prefixCls: string;
  hashId: string;
  light: boolean;
  showContent: boolean;
  expanded: boolean;
}

const ToolContentComponent: React.FC<ToolContentProps> = ({
  tool,
  prefixCls,
  hashId,
  light,
  showContent,
  expanded,
}) => {
  const toolContainerClassName = useMemo(() => {
    return classnames(`${prefixCls}-tool-container`, hashId, {
      [`${prefixCls}-tool-container-light`]: light,
    });
  }, [prefixCls, hashId, light]);

  const errorDom = useMemo(() => {
    return tool.status === 'error' && tool.errorMessage ? (
      <div className={classnames(`${prefixCls}-tool-content-error`, hashId)}>
        <div
          className={classnames(`${prefixCls}-tool-content-error-icon`, hashId)}
        >
          <X />
        </div>
        <div
          className={classnames(`${prefixCls}-tool-content-error-text`, hashId)}
        >
          {tool.errorMessage}
        </div>
      </div>
    ) : null;
  }, [tool.status, tool.errorMessage, prefixCls, hashId]);

  const contentDom = useMemo(() => {
    return tool.content ? (
      <div className={classnames(`${prefixCls}-tool-content`, hashId)}>
        {tool.content}
      </div>
    ) : null;
  }, [tool.content, prefixCls, hashId]);

  if (!showContent || !expanded) return null;

  return (
    <div
      className={toolContainerClassName}
      data-testid="tool-user-item-tool-container "
    >
      {contentDom}
      {errorDom}
    </div>
  );
};

export const ToolContent = memo(ToolContentComponent);
