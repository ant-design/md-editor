import React, { useEffect } from 'react';
import {
  MarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
  parserMdToSchema,
} from '../MarkdownEditor';
import { MarkdownFormatter } from '../plugins/formatter';

const toListMarkdown = (content: string) => {
  return content;
};

export const MarkdownEditorUpdate = (
  props: MarkdownEditorProps & {
    isFinished?: boolean;
  },
) => {
  const editorRef = React.useRef<MarkdownEditorInstance>();
  useEffect(() => {
    editorRef.current?.store?.updateNodeList(
      parserMdToSchema(
        toListMarkdown(
          MarkdownFormatter.format(props.initValue || '') || '',
        ).trim(),
        props.plugins,
      ).schema,
    );
  }, [props.initValue]);

  useEffect(() => {
    if (props.isFinished) {
      editorRef.current?.store?.setMDContent(
        MarkdownFormatter.format(props.initValue || ''),
        props.plugins,
      );
    }
  }, [props.isFinished]);

  return (
    <MarkdownEditor
      editorRef={editorRef}
      style={{
        padding: 0,
        width: '100%',
      }}
      toc={false}
      readonly
      contentStyle={{
        padding: 0,
        width: '100%',
      }}
      codeProps={{
        showLineNumbers: false,
      }}
      {...props}
      typewriter={props.typewriter && !props.isFinished}
      initValue=""
    />
  );
};
