import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
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
  hashId: string;
}) => {
  const { setShowComment } = useContext(EditorStoreContext) || {};
  const context = useContext(ConfigProvider.ConfigContext);
  const mdEditorBaseClass = context?.getPrefixCls('md-editor-content');
  const thisComment = useMemo(() => {
    return props.commentItem?.find?.(
      (c) => `${c.id}` === props.id.split('-').at(-1),
    );
  }, [props.id]);
  if (!props.commentItem?.length) {
    return <>{props.children}</>;
  }
  const type = thisComment?.commentType || 'comment';
  return (
    <span
      data-be="comment-text"
      data-testid="comment-view"
      id={props.id}
      className={classNames(props.hashId, {
        [`${mdEditorBaseClass}-comment-${type}`]: type,
      })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowComment?.(
          props.commentItem?.filter((item: any) => Boolean(item.content)),
        );
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
