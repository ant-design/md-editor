import { observer } from 'mobx-react-lite';
import React from 'react';
import { MarkdownEditorInstance, MarkdownEditorProps } from '..';
import { MEditor } from './Editor';

export const EditorFrame = observer(
  ({
    instance,
    ...props
  }: MarkdownEditorProps & {
    instance: MarkdownEditorInstance;
  }) => {
    if (!instance.current) return null as React.ReactNode;
    return (
      <div className="markdown-editor-content" style={{ flex: 1 }}>
        <MEditor instance={instance} note={instance.current} {...props} />
      </div>
    );
  },
);
