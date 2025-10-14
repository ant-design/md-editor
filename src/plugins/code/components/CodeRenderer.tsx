/**
 * @fileoverview 代码渲染器组件
 * 封装代码编辑器的所有渲染逻辑
 */

import React, { useMemo, useState } from 'react';
import { MarkdownEditor } from '../../../MarkdownEditor';
import { useEditorStore } from '../../../MarkdownEditor/editor/store';
import { CodeNode, ElementProps } from '../../../MarkdownEditor/el';
import {
  useCodeEditorState,
  useRenderConditions,
  useToolbarConfig,
} from '../hooks';
import {
  AceEditor,
  AceEditorContainer,
  CodeContainer,
  CodeToolbar,
  HtmlPreview,
  ThinkBlock,
} from './index';

/**
 * 代码渲染器组件
 *
 * 功能特性：
 * - 基于 Ace Editor 的代码编辑
 * - 支持 100+ 种编程语言语法高亮
 * - 支持代码复制、全屏编辑
 * - 支持 HTML 代码实时预览
 * - 支持拖拽排序
 * - 响应式布局适配
 * - 支持代码框选中状态管理
 */
export function CodeRenderer(props: ElementProps<CodeNode>) {
  const { editorProps, readonly } = useEditorStore();

  // 使用状态管理Hook
  const {
    state,
    update,
    path,
    handleCloseClick,
    handleHtmlPreviewClose,
    handleShowBorderChange,
    handleHideChange,
  } = useCodeEditorState(props.element);

  // 选中状态管理
  const [isSelected, setIsSelected] = React.useState(false);

  // 视图模式状态管理（用于HTML和Markdown）
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('code');

  // 使用Ace编辑器Hook
  const { dom, setLanguage, focusEditor } = AceEditor({
    element: props.element,
    onUpdate: update,
    onShowBorderChange: handleShowBorderChange,
    onHideChange: handleHideChange,
    path,
    isSelected,
    onSelectionChange: setIsSelected,
  });

  // 使用渲染条件Hook
  const {
    shouldHideConfigHtml,
    shouldRenderAsThinkBlock,
    shouldRenderAsCodeEditor,
  } = useRenderConditions(props.element, readonly);

  // 视图模式切换处理函数
  const handleViewModeToggle = () => {
    setViewMode((prev) => (prev === 'preview' ? 'code' : 'preview'));
  };

  // 使用工具栏配置Hook
  const { toolbarProps } = useToolbarConfig({
    element: props.element,
    readonly,
    onCloseClick: handleCloseClick,
    setLanguage,
    onSelectionChange: setIsSelected,
    onViewModeToggle: handleViewModeToggle,
    viewMode,
  });

  // 渲染组件
  return useMemo(() => {
    // 隐藏配置型 HTML 代码块
    if (shouldHideConfigHtml) {
      return null;
    }

    // 只读模式下的思考块特殊渲染
    if (shouldRenderAsThinkBlock) {
      return <ThinkBlock element={props.element} />;
    }

    // 主要的代码编辑器渲染
    if (shouldRenderAsCodeEditor) {
      return (
        <div {...props.attributes}>
          <CodeContainer
            element={props.element}
            showBorder={state.showBorder}
            hide={state.hide}
            onEditorClick={focusEditor}
          >
            {/* 工具栏 */}
            {!props.element.frontmatter &&
              !editorProps.codeProps?.hideToolBar && (
                <CodeToolbar {...toolbarProps} />
              )}

            <div
              className="code-editor-content"
              style={{
                borderBottomLeftRadius: 'inherit',
                borderBottomRightRadius: 'inherit',
              }}
            >
              {viewMode === 'preview' && props.element.language === 'html' && (
                <HtmlPreview htmlStr={props.element?.value} />
              )}
              {viewMode === 'preview' &&
                props.element.language &&
                props.element.language === 'markdown' && (
                  <MarkdownEditor initValue={props.element?.value} />
                )}
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 'inherit',
                  padding: 12,
                  display: viewMode === 'code' ? 'block' : 'none',
                }}
              >
                <AceEditorContainer dom={dom} element={props.element}>
                  {props.children}
                </AceEditorContainer>
              </div>
            </div>
          </CodeContainer>
        </div>
      );
    }

    return null;
  }, [
    shouldHideConfigHtml,
    shouldRenderAsThinkBlock,
    shouldRenderAsCodeEditor,
    props.element,
    props.attributes,
    props.children,
    state.showBorder,
    state.hide,
    state.htmlStr,
    isSelected,
    editorProps.codeProps?.hideToolBar,
    toolbarProps,
    handleHtmlPreviewClose,
    viewMode,
    handleViewModeToggle,
  ]);
}
