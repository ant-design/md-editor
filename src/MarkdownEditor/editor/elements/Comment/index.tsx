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
  id: string;
}) => {
  const { setShowComment } = useContext(EditorStoreContext) || {};
  if (!props.commentItem?.length) {
    return <>{props.children}</>;
  }
  return (
    <span
      data-be="comment-text"
      data-testid="comment-view"
      id={props.id}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowComment?.(props.commentItem);
      }}
    >
      {props.children}
    </span>
  );
};

export const CommentCreate = (props: {
  comment: MarkdownEditorProps['comment'];
}) => {
  const dom = <div data-testid="comment-create-default"></div>;
  if (props.comment?.editorRender) {
    return props.comment.editorRender(dom);
  }
  return <div data-testid="comment-create-default"></div>;
};
