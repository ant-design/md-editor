/**
 * EditorContainer 组件 - 编辑器容器组件
 *
 * 从 MarkdownInputField.tsx 中提取，用于包装编辑器内容区域
 */

import classNames from 'classnames';
import React, { type FC, type ReactNode } from 'react';

export interface EditorContainerProps {
  children: ReactNode;
  baseCls: string;
  hashId: string;
  borderRadius: number;
  isEnlarged: boolean;
  isLoading: boolean;
  disabled?: boolean;
  isMultiRowLayout: boolean;
  minHeight?: number | string;
}

export const EditorContainer: FC<EditorContainerProps> = ({
  children,
  baseCls,
  hashId,
  borderRadius,
  isEnlarged,
  isLoading,
  disabled,
  isMultiRowLayout,
  minHeight,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        width: 'calc(100% - 4px)',
        height: isEnlarged ? 'calc(100% - 4px)' : 'calc(100% - 4px)',
        maxHeight: isEnlarged ? 'calc(100% - 4px)' : 'calc(100% - 4px)',
        display: 'flex',
        zIndex: 9,
        flexDirection: 'column',
        boxSizing: 'border-box',
        borderRadius: (borderRadius || 16) - 2 || 10,
        cursor: isLoading || disabled ? 'not-allowed' : 'auto',
        opacity: disabled ? 0.5 : 1,
        minHeight: isEnlarged ? 'auto' : isMultiRowLayout ? 106 : minHeight,
      }}
    >
      {children}
    </div>
  );
};

