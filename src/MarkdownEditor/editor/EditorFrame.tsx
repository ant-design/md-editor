import { observer } from 'mobx-react-lite';
import React from 'react';
import { MarkdownEditorProps, Tab } from '..';
import { MEditor } from './Editor';
import { InsertAutocomplete } from './tools/InsertAutocomplete';
import { InsertLink } from './tools/InsertLink';
import { TableAttr } from './tools/TableAttr';

export const EditorFrame = observer(
  ({
    tab,
    readonly,
    ...props
  }: MarkdownEditorProps & {
    tab: Tab;
  }) => {
    if (!tab.current) return null as React.ReactNode;
    return (
      <div className="content" style={{ flex: 1 }}>
        <MEditor note={tab.current} {...props} />
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
