/**
 * @fileoverview 代码渲染器组件
 * 封装代码编辑器的所有渲染逻辑
 */

import DOMPurify from 'dompurify';
import React, { useMemo } from 'react';
import { useEditorStore } from '../../../MarkdownEditor/editor/store';
import { CodeNode, ElementProps } from '../../../MarkdownEditor/el';
import {
  useCodeEditorState,
  useFullScreenControl,
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
  const { handle, isFullScreen, handleFullScreenToggle } =
    useFullScreenControl();

  // 使用状态管理Hook
  const {
    state,
    update,
    path,
    handleCloseClick,
    handleRunHtml,
    handleHtmlPreviewClose,
    handleShowBorderChange,
    handleHideChange,
  } = useCodeEditorState(props.element);

  // 选中状态管理
  const [isSelected, setIsSelected] = React.useState(false);

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

  // 使用工具栏配置Hook
  const { toolbarProps } = useToolbarConfig({
    element: props.element,
    readonly,
    isFullScreen,
    onCloseClick: handleCloseClick,
    onRunHtml: handleRunHtml,
    onFullScreenToggle: handleFullScreenToggle,
    setLanguage,
    isSelected,
    onSelectionChange: setIsSelected,
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

    if (props.element?.language === 'html' && readonly) {
      return (
        <div
          {...props.attributes}
          style={{
            display: props.element?.otherProps?.isConfig ? 'none' : 'block',
          }}
        >
          {DOMPurify.sanitize(props.element?.value?.trim())}
        </div>
      );
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
            fullScreenNode={handle.node}
            isFullScreen={isFullScreen}
            isSelected={isSelected}
          >
            {/* 工具栏 */}
            {!props.element.frontmatter &&
              !editorProps.codeProps?.hideToolBar && (
                <CodeToolbar {...toolbarProps} />
              )}

            {/* Ace 编辑器容器 */}
            <AceEditorContainer dom={dom} element={props.element}>
              {props.children}
            </AceEditorContainer>
          </CodeContainer>

          {/* HTML 预览模态框 */}
          <HtmlPreview
            htmlStr={state.htmlStr}
            onClose={handleHtmlPreviewClose}
          />
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
  ]);
}
