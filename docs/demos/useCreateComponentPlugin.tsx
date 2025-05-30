import {
  BaseMarkdownEditor,
  MarkdownEditorPlugin,
  parserMdToSchema,
} from '@ant-design/md-editor';
import React, { useEffect, useMemo, useRef } from 'react';

const useCreateComponentPlugin = (tagName: string, targetType: string) => {
  const matchStr = `<${tagName}`;
  const spliceStr = `</${tagName}>`;

  const loopMatch = (node: any) => {
    if (
      node.type === 'html' &&
      (node.value.includes(matchStr) || node.value.includes(spliceStr))
    ) {
      return true;
    }
    return false;
  };
  const loopConvert = (node: any) => {
    if (node.type === 'html' && node.value.includes(matchStr)) {
      const context = node.value.match(/context='(.*)'/)?.[1];
      return {
        type: targetType,
        context,
        children: [
          {
            text: '  ',
          },
        ],
        value: node.value,
      };
    }
    if (node.type === 'html' && node.value.includes(spliceStr)) {
      return {
        text: '',
      };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(loopConvert).filter(Boolean),
      };
    }
    return node;
  };
  const customComponentPlugin: MarkdownEditorPlugin = {
    parseMarkdown: [
      {
        match: (node: any) => {
          return loopMatch(node);
        },
        convert: (node: any) => {
          return loopConvert(node);
        },
      },
    ],
    toMarkdown: [
      {
        match: (node: any) => {
          return node.type === targetType;
        },
        convert: (node: any) => {
          return {
            type: 'html',
            value: `<${tagName} context='${node.context}'></${tagName}>`,
          };
        },
      },
    ],
    elements: {
      [targetType]: ({ attributes, element, children }: any) => {
        return (
          <span
            {...attributes}
            contentEditable={false}
            style={{
              color: 'red',
              display: 'inline-block',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'none' }}>{children}</div>^
          </span>
        );
      },
    },
  };
  return useMemo(() => {
    return customComponentPlugin;
  }, []);
};

export default () => {
  const mdTagPlugin = useCreateComponentPlugin('md-tag', 'customTag');
  const markdownRef = useRef<any>(null);
  useEffect(() => {
    const schema = parserMdToSchema(
      '123<md-tag context="时间"/>789 123<md-tag context="s"/>789',
      [mdTagPlugin],
    ).schema;
    markdownRef?.current?.store?.setContent(schema);
  }, []);
  return (
    <BaseMarkdownEditor
      initValue='123<md-tag context="时间"/>789'
      editorRef={markdownRef}
      onChange={(value) => console.log(value)}
      width="100%"
      plugins={[mdTagPlugin]}
      height="400px"
    />
  );
};
