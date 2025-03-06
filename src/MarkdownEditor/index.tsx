import React from 'react';
import { standardPlugins } from '../plugins/defaultPlugins';
import { BaseMarkdownEditor, MarkdownEditorProps } from './BaseMarkdownEditor';
export * from './BaseMarkdownEditor';

export const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  console.log([...(standardPlugins || []), ...(props.plugins || [])]);
  return (
    <BaseMarkdownEditor
      {...props}
      plugins={[...(standardPlugins || []), ...(props.plugins || [])]}
    />
  );
};
