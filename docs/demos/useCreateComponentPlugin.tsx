﻿import {
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
      [targetType]: ({ attributes, children }: any) => {
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
  const mdFieldPlugin = useCreateComponentPlugin('md-field', 'customField');
  const mdBoldPlugin = useCreateComponentPlugin('md-bold', 'customBold');
  const mdDownPlugin = useCreateComponentPlugin('md-down', 'customDown');
  const mdAlertPlugin = useCreateComponentPlugin('md-alert', 'customAlert');
  const mdTagPlugin2 = useCreateComponentPlugin('md-tag2', 'customTag2');

  const markdownRef = useRef<any>(null);
  useEffect(() => {
    const schema = parserMdToSchema(
      `123<md-tag context="时间"/>789 123<md-tag context="s"/>789\n\n 1. 在<md-field placeholder='topic_id'></md-field>为<md-bold placeholder='test-ningzhi'></md-bold>的情况下，<md-field placeholder='sql_id'></md-field>的数量达到了<md-bold placeholder='620'></md-bold>，远高于其他<md-field placeholder='topic_id'></md-field>的值，例如<md-bold placeholder='test001'></md-bold>仅有一个<md-field placeholder='sql_id'></md-field>，这表明<md-down placeholder='下降明显'></md-down>的数据分布不均。 \n2. 数据显示<md-field placeholder='topic_id'></md-field>为<md-bold placeholder='test001'></md-bold>时存在<md-alert placeholder='异常低值'></md-alert>的情况，可能需要进一步调查原因。`,
      [
        mdTagPlugin,
        mdFieldPlugin,
        mdBoldPlugin,
        mdDownPlugin,
        mdAlertPlugin,
        mdTagPlugin2,
      ],
    ).schema;
    markdownRef?.current?.store?.setContent(schema);
  }, []);
  return (
    <BaseMarkdownEditor
      initValue='123<md-tag context="时间"/>789'
      editorRef={markdownRef}
      onChange={(value) => console.log(value)}
      width="100%"
      plugins={[
        mdTagPlugin,
        mdFieldPlugin,
        mdBoldPlugin,
        mdDownPlugin,
        mdAlertPlugin,
        mdTagPlugin2,
      ]}
      height="400px"
    />
  );
};
