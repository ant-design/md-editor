import { ApiOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React from 'react';
import { useStyle } from './style';

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
        tool.status === 'loading' && `${prefixCls}-tool-loading`,
        tool.status === 'error' && `${prefixCls}-tool-error`,
        tool.status === 'idle' && `${prefixCls}-tool-idle`,
      )}
    >
      <div className={`${prefixCls}-tool-header ${hashId}`}>
        <div className={`${prefixCls}-tool-header-left ${hashId}`}>
          <div className={`${prefixCls}-tool-image-wrapper ${hashId}`}>
            {tool.icon || (
              <ApiOutlined className={`${prefixCls}-tool-image ${hashId}`} />
            )}
          </div>
          <div className={`${prefixCls}-tool-name ${hashId}`}>
            {tool.toolName}
          </div>
        </div>
      </div>
      <div className={`${prefixCls}-tool-target ${hashId}`}>
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
