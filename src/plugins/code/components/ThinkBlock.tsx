/**
 * @fileoverview 思考块组件
 * 只读模式下渲染思考类型的代码块
 */

import React, { useContext } from 'react';
import { I18nContext } from '../../../i18n';
import { EditorStoreContext } from '../../../MarkdownEditor/editor/store';
import { CodeNode } from '../../../MarkdownEditor/el';
import { ToolUseBarThink } from '../../../ToolUseBar';

interface ThinkBlockProps {
  element: CodeNode;
}

export function ThinkBlock({ element }: ThinkBlockProps) {
  const { locale } = useContext(I18nContext);
  const { editorProps } = useContext(EditorStoreContext) || {};

  const content =
    element?.value !== null && element?.value !== undefined
      ? String(element.value).trim()
      : '';

  const isLoading = content.endsWith('...');
  const toolNameText = isLoading
    ? locale?.['think.deepThinkingInProgress'] || '深度思考...'
    : locale?.['think.deepThinking'] || '深度思考';

  return (
    <ToolUseBarThink
      testId="think-block"
      styles={{
        root: {
          boxSizing: 'border-box',
          maxWidth: '680px',
        },
      }}
      expanded={
        editorProps?.codeProps?.alwaysExpandedDeepThink ? true : undefined
      }
      toolName={toolNameText}
      thinkContent={content}
      status={isLoading ? 'loading' : 'success'}
    />
  );
}
