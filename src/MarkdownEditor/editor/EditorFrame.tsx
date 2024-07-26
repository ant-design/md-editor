import { observer } from 'mobx-react-lite';
import React from 'react';
import { MarkdownEditorProps, Tab } from '..';
import { MEditor } from './Editor';

export const EditorFrame = observer(
  ({
    tab,
    ...props
  }: MarkdownEditorProps & {
    tab: Tab;
  }) => {
    if (!tab.current) return null as React.ReactNode;
    return (
      <div className="content" style={{ flex: 1 }}>
        <MEditor note={tab.current} {...props} />
      </div>
    );
  },
);
