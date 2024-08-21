import React from 'react';
import { BaseToolBar } from './BaseBar';

/**
 * 浮动工具栏,用于设置文本样式
 */
export const ToolBar = (props: {
  prefix?: string;
  extra?: React.ReactNode[];
  min?: boolean;
}) => {
  const baseClassName = `toolbar`;
  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={baseClassName}
    >
      <BaseToolBar
        prefix={baseClassName}
        showEditor={true}
        showInsertAction={true}
        {...props}
      />
    </div>
  ) as React.ReactNode;
};
