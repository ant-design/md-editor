/**
 * @fileoverview 思考块组件
 * 只读模式下渲染思考类型的代码块
 */

import React from 'react';
import { CodeNode } from '../../../MarkdownEditor/el';

interface ThinkBlockProps {
  element: CodeNode;
}

export function ThinkBlock({ element }: ThinkBlockProps) {
  return (
    <div
      style={{
        color: '#8b8b8b',
        whiteSpace: 'pre-wrap',
        margin: 0,
        borderLeft: '2px solid #e5e5e5',
        paddingLeft: '1em',
        fontFamily: 'Monaco, Consolas, monospace',
      }}
    >
      {element?.value}
    </div>
  );
}
