/**
 * EditorContent 组件 - 编辑器内容区域组件
 *
 * 从 MarkdownInputField.tsx 中提取，用于包装编辑器内容
 */

import classNames from 'classnames';
import React, { type FC, type ReactNode } from 'react';

export interface EditorContentProps {
  children: ReactNode;
  baseCls: string;
  hashId: string;
  borderRadius: number;
  isEnlarged: boolean;
  isHover: boolean;
  disabled?: boolean;
  maxHeight?: string;
  attachmentEnabled?: boolean;
  styleMaxHeight?: number | string;
}

/**
 * 计算编辑器内容的最大高度
 */
const calculateMaxHeight = (
  isEnlarged: boolean,
  attachmentEnabled: boolean,
  styleMaxHeight?: number | string,
): string => {
  if (isEnlarged) return 'none';

  const mh = styleMaxHeight;
  const base =
    typeof mh === 'number'
      ? mh
      : mh
        ? parseFloat(String(mh)) || 400
        : 400;
  const extra = attachmentEnabled ? 90 : 0;
  return `min(${base + extra}px)`;
};

export const EditorContent: FC<EditorContentProps> = ({
  children,
  baseCls,
  hashId,
  borderRadius,
  isEnlarged,
  isHover,
  disabled,
  maxHeight,
  attachmentEnabled,
  styleMaxHeight,
}) => {
  const computedMaxHeight =
    maxHeight || calculateMaxHeight(isEnlarged, !!attachmentEnabled, styleMaxHeight);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: (borderRadius || 16) - 2 || 10,
        maxHeight: computedMaxHeight,
        height: isEnlarged ? '100%' : 'auto',
        flex: 1,
      }}
      className={classNames(`${baseCls}-editor`, hashId, {
        [`${baseCls}-editor-hover`]: isHover,
        [`${baseCls}-editor-disabled`]: disabled,
      })}
    >
      {children}
    </div>
  );
};

