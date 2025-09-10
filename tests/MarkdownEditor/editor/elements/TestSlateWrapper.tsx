import React from 'react';
import { createEditor, Descendant } from 'slate';
import { ReactEditor, Slate } from 'slate-react';

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
