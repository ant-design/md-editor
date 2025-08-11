/**
 * @fileoverview 代码编辑器容器组件
 * 负责代码编辑器的布局、样式和状态管理
 */

import React, { ReactNode, RefObject, useRef } from 'react';
import { DragHandle } from '../../../MarkdownEditor/editor/tools/DragHandle';
import { CodeNode } from '../../../MarkdownEditor/el';

interface CodeContainerProps {
  element?: CodeNode;
  showBorder: boolean;
  hide: boolean;
  onEditorClick: () => void;
  children: ReactNode;
  readonly?: boolean;
  fullScreenNode: RefObject<HTMLDivElement>;
  isFullScreen: boolean;
  isSelected?: boolean;
}

export function CodeContainer({
  element,
  showBorder,
  hide,
  onEditorClick,
  children,
  fullScreenNode,
  isFullScreen,
  isSelected = false,
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
      {/* 拖拽手柄 */}
      {!safeElement.frontmatter && <DragHandle />}

      {/* 全屏容器 */}
      <div
        contentEditable={false}
        ref={fullScreenNode}
        style={{
          backgroundColor: isFullScreen ? 'rgb(252, 252, 252)' : 'transparent',
          padding: isFullScreen ? '2em' : undefined,
          userSelect: 'none',
        }}
      >
        {/* 编辑器主容器 */}
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
            border: isFullScreen
              ? '1px solid #0000001a'
              : isSelected
                ? '1px solid #1890ff'
                : '1px solid #E7E9E8',
            transition: 'border-color 0.2s ease-in-out',
          }}
          className={`ace-container drag-el ${
            safeElement.frontmatter ? 'frontmatter' : ''
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
