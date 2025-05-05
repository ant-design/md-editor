import React from 'react';
import { Editor, Transforms } from 'slate';
import { useSelStatus } from '../../../../MarkdownEditor/hooks/editor';
import { RenderElementProps, useSlate } from '../../slate-react';

export const WarpCard = (props: RenderElementProps) => {
  const [selected, path] = useSelStatus(props.element);
  const editor = useSlate();
  return React.useMemo(() => {
    return (
      <div
        {...props.attributes}
        data-be={'card'}
        onClick={(e) => {
          e.stopPropagation();
          const start = Editor.start(editor, path);
          const end = Editor.end(editor, path);
          Transforms.select(editor, {
            anchor: start,
            focus: end,
          });
          e.preventDefault();
        }}
        style={{
          ...props.element.style,
          display: props.element.block === false ? 'inline-flex' : 'flex',
          gap: 4,
          maxWidth: '100%',
          alignItems: 'flex-end',
        }}
      >
        {props.children}
      </div>
    );
  }, [props.element.children, selected, path, props.element.block]);
};
