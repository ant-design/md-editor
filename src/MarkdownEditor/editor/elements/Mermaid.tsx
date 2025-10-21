import React from 'react';
import { RenderElementProps } from 'slate-react';
import { Mermaid as MermaidRenderer } from '../../../plugins/mermaid/Mermaid';
import { CodeNode } from '../../el';

export const Mermaid = ({ attributes, children, element }: RenderElementProps) => {
  // 将 Slate 元素转换为 CodeNode 格式
  const codeNode: CodeNode = {
    type: 'code',
    language: 'mermaid',
    value: element?.value || '',
    ...element,
  };

  return (
    <div {...attributes}>
      <MermaidRenderer el={codeNode} />
      {children}
    </div>
  );
};
