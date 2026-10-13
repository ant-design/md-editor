/**
 * @fileoverview Ace编辑器容器组件
 * 负责Ace编辑器DOM的渲染和内容副本的显示
 */

import React, { RefObject } from 'react';
import { getCodeBlockPlainText } from '../../../MarkdownEditor/editor/utils/codeBlockPlainText';
import { CodeNode } from '../../../MarkdownEditor/el';

interface AceEditorContainerProps {
  dom: RefObject<HTMLDivElement | null>;
  element: CodeNode;
  children: React.ReactNode;
  active?: boolean;
  loading?: boolean;
}

export function AceEditorContainer({
  dom,
  element,
  children,
  active = true,
  loading = false,
}: AceEditorContainerProps) {
  return (
    <>
      {active && (
        <div
          data-testid="ace-editor-container"
          ref={dom}
          style={{ height: loading ? 0 : 200, lineHeight: 1.6 }}
        />
      )}
      {active && loading && (
        <pre
          style={{
            margin: 0,
            padding: '0 12px',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          }}
        >
          <code>{getCodeBlockPlainText(element)}</code>
        </pre>
      )}

      {/* Slate 仍需要子节点锚点；Ace 已渲染正文，无需再复制整份代码。 */}
      <div
        data-testid="code-content-copy"
        aria-hidden="true"
        style={{
          height: '0.5px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </>
  );
}
