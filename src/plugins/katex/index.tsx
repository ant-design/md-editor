/**
 * @fileoverview Katex 数学公式渲染插件
 * 提供基于 KaTeX 的数学公式渲染功能，支持块级和内联公式
 * @author Katex Plugin Team
 */

import React, { useMemo } from 'react';
import { useEditorStore } from '../../MarkdownEditor/editor/store';
import { DragHandle } from '../../MarkdownEditor/editor/tools/DragHandle';
import { CodeNode, ElementProps } from '../../MarkdownEditor/el';
import { Katex } from './Katex';

/**
 * Katex 块级公式组件
 *
 * 功能特性：
 * - 基于 KaTeX 的数学公式渲染
 * - 支持 LaTeX 数学语法
 * - 实时渲染预览
 * - 支持拖拽排序
 * - 响应式布局适配
 *
 * @param props - 代码节点的属性，包含 LaTeX 公式内容
 * @returns React Katex 渲染元素
 *
 * @example
 * ```tsx
 * // 在 Slate 编辑器中使用
 * <KatexElement
 *   element={{
 *     type: 'katex',
 *     katex: true,
 *     value: '\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n'
 *   }}
 *   attributes={slateAttributes}
 *   children={slateChildren}
 * />
 * ```
 */
export function KatexElement(props: ElementProps<CodeNode>) {
  const { readonly } = useEditorStore();

  // 渲染组件
  return useMemo(() => {
    // 只处理 katex 类型的节点
    if (!props.element.katex) {
      return null;
    }
    // 只读模式下的简化渲染
    if (readonly) {
      return (
        <div
          {...props.attributes}
          contentEditable={false}
          style={{
            margin: '1em 0',
            userSelect: 'none',
          }}
        >
          <Katex el={props.element} />
          {/* 隐藏的内容副本（用于搜索和 SEO） */}
          <div
            style={{
              height: '0.5px',
              overflow: 'hidden',
              opacity: 0,
              pointerEvents: 'none',
            }}
          >
            {props.element?.value}
            {props.children}
          </div>
        </div>
      );
    }

    // 编辑模式下的完整渲染
    return (
      <div
        {...props.attributes}
        contentEditable={false}
        className={'katex-el drag-el'}
        data-be={'katex'}
        tabIndex={-1}
        style={{
          margin: '1em 0',
          userSelect: 'none',
        }}
        onBlur={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* 拖拽手柄 */}
        <DragHandle />

        {/* Katex 渲染容器 */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'rgb(252, 252, 252)',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            border: '1px solid #e5e5e5',
          }}
        >
          <Katex el={props.element} />

          {/* 隐藏的内容副本（用于搜索和 SEO） */}
          <div
            style={{
              height: '0.5px',
              overflow: 'hidden',
              opacity: 0,
              pointerEvents: 'none',
            }}
          >
            {props.element?.value}
            {props.children}
          </div>
        </div>
      </div>
    );
  }, [props.element, props.element.value, props.element.katex, readonly]);
}

// 导出内联 KaTeX 组件
export { InlineKatex } from './InlineKatex';

// 导出核心 Katex 渲染组件
export { Katex } from './Katex';
