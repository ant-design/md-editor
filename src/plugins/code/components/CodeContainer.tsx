/**
 * @fileoverview 代码编辑器容器组件
 * 负责代码编辑器的布局、样式和状态管理
 */

import React, { ReactNode, useRef } from 'react';
import { CodeNode } from '../../../MarkdownEditor/el';

interface CodeContainerProps {
  element?: CodeNode;
  showBorder: boolean;
  hide: boolean;
  onEditorClick: () => void;
  children: ReactNode;
  readonly?: boolean;
}

export function CodeContainer({
  element,
  showBorder,
  hide,
  onEditorClick,
  children,
}: CodeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理未定义的 element
  const safeElement = element || {
    language: undefined,
    frontmatter: false,
  };

  return (
    <div
      contentEditable={false}
      className="ace-el drag-el"
      data-be="code"
      data-testid="code-container"
      ref={containerRef}
      tabIndex={-1}
      onBlur={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      data-lang={safeElement.language}
    >
      <div
        data-testid="code-editor-container"
        onClick={(e) => {
          e.stopPropagation();
          onEditorClick();
        }}
        style={{
          padding: hide ? 0 : undefined,
          marginBottom: hide ? 0 : undefined,
          boxSizing: 'border-box',
          backgroundColor: showBorder
            ? 'rgba(59, 130, 246, 0.1)'
            : hide
              ? 'transparent'
              : 'rgb(252, 252, 252)',
          maxHeight: 400,
          overflow: 'auto',
          position: 'relative',
          height: hide ? 0 : 'auto',
          opacity: hide ? 0 : 1,
          transition: 'border-color 0.2s ease-in-out',
          borderRadius: '12px',
          background: '#FFFFFF',
          boxShadow:
            '0px 0px 1px 0px rgba(0, 19, 41, 0.2),0px 1.5px 4px -1px rgba(0, 19, 41, 0.04)',
        }}
        className={`ace-container drag-el ${
          safeElement.frontmatter ? 'frontmatter' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
}
