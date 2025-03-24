import {
  MarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
  parserMdToSchema,
} from '@ant-design/md-editor';
import React, { useEffect } from 'react';

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
      parserMdToSchema(toListMarkdown(props.initValue || '')).schema,
    );
  }, [props.initValue]);

  useEffect(() => {
    if (props.isFinished) {
      editorRef.current?.store?.setMDContent(props.initValue);
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
      {...props}
      initValue=""
    />
  );
};
