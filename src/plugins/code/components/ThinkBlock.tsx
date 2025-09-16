/**
 * @fileoverview 思考块组件
 * 只读模式下渲染思考类型的代码块
 */

import React from 'react';
import { CodeNode } from '../../../MarkdownEditor/el';
import { ToolUseBarThink } from '../../../ToolUseBar';

interface ThinkBlockProps {
  element: CodeNode;
}

export function ThinkBlock({ element }: ThinkBlockProps) {
  const content =
    element?.value !== null && element?.value !== undefined
      ? String(element.value).trim()
      : '';

  return (
    <ToolUseBarThink
      testId="think-block"
      styles={{
        root: {
          boxSizing: 'border-box',
          maxWidth: '680px',
        },
      }}
      toolName={content.endsWith('...') ? '深度思考...' : '深度思考'}
      thinkContent={content}
      status={content.endsWith('...') ? 'loading' : 'success'}
    />
  );
}
