import React, { useEffect } from 'react';
import {
  MarkdownEditor,
  MarkdownEditorInstance,
  MarkdownEditorProps,
  parserMdToSchema,
} from '../MarkdownEditor';

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
      parserMdToSchema(toListMarkdown(props.initValue || '').trim()).schema,
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
      codeProps={{
        hideToolBar: true,
        showLineNumbers: false,
      }}
      {...props}
      typewriter={props.typewriter && !props.isFinished}
      initValue=""
    />
  );
};
