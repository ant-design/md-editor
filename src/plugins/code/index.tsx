/**
 * @fileoverview 代码编辑器插件主文件
 * 提供基于 Ace Editor 的代码编辑功能，支持多种编程语言语法高亮
 * @author Code Plugin Team
 */

import React from 'react';
import { CodeNode, ElementProps } from '../../MarkdownEditor/el';
import { CodeRenderer } from './components';

/**
 * 代码编辑器组件
 * 已重构为更小的组件，提升可维护性
 */
export function CodeElement(props: ElementProps<CodeNode>) {
  return <CodeRenderer {...props} />;
}
