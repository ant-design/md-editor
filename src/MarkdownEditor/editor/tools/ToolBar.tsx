import { observer } from 'mobx-react-lite';
import React from 'react';
import { BaseToolBar } from './BaseBar';

/**
 * 浮动工具栏,用于设置文本样式
 */
export const ToolBar = observer(
  (props: { prefix?: string; extra?: React.ReactNode[] }) => {
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
          showInsertAction={true}
          {...props}
        />
      </div>
    ) as React.ReactNode;
  },
);
