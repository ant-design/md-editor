import { observer } from 'mobx-react-lite';
import React from 'react';
import { MarkdownEditorInstance, MarkdownEditorProps } from '..';
import { MEditor } from './Editor';
import { InsertAutocomplete } from './tools/InsertAutocomplete';
import { InsertLink } from './tools/InsertLink';
import { TableAttr } from './tools/TableAttr';

export const EditorFrame = observer(
  ({
    instance,
    readonly,
    ...props
  }: MarkdownEditorProps & {
    instance: MarkdownEditorInstance;
  }) => {
    if (!instance.current) return null as React.ReactNode;
    return (
      <div className="markdown-editor-content" style={{ flex: 1 }}>
        <MEditor instance={instance} note={instance.current} {...props} />
        {readonly ? (
          <></>
        ) : (
          <>
            <InsertLink />
            <TableAttr />
            <InsertAutocomplete />
          </>
        )}
      </div>
    );
  },
);
