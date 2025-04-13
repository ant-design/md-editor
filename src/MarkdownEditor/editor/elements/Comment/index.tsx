import React, { useContext } from 'react';
import {
  CommentDataType,
  MarkdownEditorProps,
} from '../../../BaseMarkdownEditor';
import { EditorStoreContext } from '../../store';

export const CommentView = (props: {
  children: React.ReactNode;
  comment: MarkdownEditorProps['comment'];
  commentItem: CommentDataType[];
}) => {
  const { setShowComment } = useContext(EditorStoreContext) || {};
  if (!props.commentItem?.length) {
    return <>{props.children}</>;
  }
  if (props.commentItem?.length) {
    return (
      <span
        onClick={() => {
          setShowComment?.(props.commentItem);
        }}
      >
        {props.children}
      </span>
    );
  }
};

export const CommentCreate = (props: {
  comment: MarkdownEditorProps['comment'];
}) => {
  const dom = <div></div>;
  if (props.comment?.editorRender) {
    return props.comment.editorRender(dom);
  }
  return <div></div>;
};
