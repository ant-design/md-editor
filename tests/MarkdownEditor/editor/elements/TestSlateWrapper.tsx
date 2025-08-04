import React from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate } from '../../../../src/MarkdownEditor/editor/slate-react/components/slate';
import { ReactEditor } from '../../../../src/MarkdownEditor/editor/slate-react/plugin/react-editor';

interface TestSlateWrapperProps {
  children: React.ReactNode;
  initialValue?: Descendant[];
  editor?: ReactEditor;
}

export const TestSlateWrapper: React.FC<TestSlateWrapperProps> = ({
  children,
  initialValue = [{ type: 'paragraph', children: [{ text: '' }] }],
  editor = createEditor() as ReactEditor,
}) => {
  return (
    <Slate editor={editor} initialValue={initialValue} onChange={() => {}}>
      {children}
    </Slate>
  );
};
