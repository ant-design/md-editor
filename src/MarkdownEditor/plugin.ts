import { Node } from 'mdast';
import React from 'react';
import { Editor, NodeEntry } from 'slate';
import { ElementProps, Elements } from './el';

export type MarkdownEditorPlugin = {
  // ------------------ 自定义节点渲染 ------------------
  elements?: Record<string, React.ComponentType<ElementProps<any>>>;

  // ------------------ Markdown 双向转换 ------------------
  parseMarkdown?: {
    // 匹配 Markdown 语法（如 ```code, > quote 等）
    match: (node: Node) => boolean;
    // 将 Markdown 节点转换为 Slate Element
    convert: (node: Node) => Elements | NodeEntry<Text>;
  }[];

  toMarkdown?: {
    // 匹配 Slate 元素类型
    match: (node: Elements) => boolean;
    convert: (node: Elements) => Node;
  }[];

  // ------------------ 编辑器行为扩展 ------------------
  withEditor?: (editor: Editor) => Editor; // 扩展编辑器实例

  hotkeys?: Record<string, (editor: Editor) => void>; // 自定义快捷键

  onPaste?: (text: string) => boolean; // 自定义粘贴处理
};

// 使用 Context 传递插件配置
export const PluginContext = React.createContext<MarkdownEditorPlugin[]>([]);
