import { ApiOutlined, DownOutlined } from '@ant-design/icons';
import React from 'react';
import { useStyle } from './style';

interface ToolCall {
  id: string;
  toolName: string;
  result?: string;
}

interface ToolUseBarProps {
  tools?: ToolCall[];
  activeId?: string;
}

export const ToolUseBar: React.FC<ToolUseBarProps> = ({ tools, activeId }) => {
  const prefixCls = 'tool-use-bar';
  const { wrapSSR, hashId } = useStyle(prefixCls);

  if (!tools?.length) return <div />;

  return wrapSSR(
    <>
      {tools.map((tool) => (
        <div
          key={tool.id}
          className={
            tool.result
              ? `${prefixCls}-tool-collapse ${hashId}`
              : `${prefixCls}-tool ${hashId}`
          }
        >
          <div className={`${prefixCls}-tool-header ${hashId}`}>
            <div className={`${prefixCls}-tool-header-left ${hashId}`}>
              <ApiOutlined className={`${prefixCls}-image ${hashId}`} />
              <div className={`${prefixCls}-tool-name ${hashId}`}>
                {tool.toolName}
              </div>
            </div>
            <div className={`${prefixCls}-tool-description ${hashId}`}>
              {tool.id === activeId ? '执行完成' : '正在调用'}
            </div>
            <DownOutlined className={`${prefixCls}-tool-arrow ${hashId}`} />
          </div>
          {tool.result && (
            <div className={`${prefixCls}-tool-result ${hashId}`}>
              {tool.result}
            </div>
          )}
        </div>
      ))}
    </>,
  );
};
