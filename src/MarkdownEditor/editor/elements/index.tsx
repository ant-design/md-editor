import { ConfigProvider, Popover } from 'antd';
import classNames from 'classnames';
import React, { CSSProperties, useContext } from 'react';
import { Editor, Path, Transforms } from 'slate';

import { ExportOutlined } from '@ant-design/icons';
import { MarkdownEditorProps } from '../../BaseMarkdownEditor';
import {
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from '../slate-react';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { Blockquote } from './blockquote';
import { WarpCard } from './card';
import { ColumnCell, ColumnGroup } from './column';
import { CommentView } from './Comment';
import { Description } from './description';
import { FootnoteDefinition } from './FootnoteDefinition';
import { FootnoteReference } from './FootnoteReference';
import { Head } from './head';
import { EditorImage } from './image';
import { LinkCard } from './LinkCard';
import { List, ListItem } from './list';
import { Media } from './media';
import { Paragraph } from './paragraph';
import { Schema } from './schema';
import { Table, TableCell } from './Table/index';
import { TagPopup } from './TagPopup';

const dragStart = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const MElement = (
  props: RenderElementProps & {
    readonly?: boolean;
  },
) => {
  switch (props.element.type) {
    case 'link-card':
      return <LinkCard {...props} />;
    case 'blockquote':
      return <Blockquote {...props} />;
    case 'head':
      return <Head {...props} />;
    case 'column-group':
      return <ColumnGroup {...props} />;
    case 'column-cell':
      return <ColumnCell {...props} />;
    case 'hr':
      return (
        <div
          {...props.attributes}
          contentEditable={false}
          className={'select-none'}
          style={{
            height: '1px',
            backgroundColor: 'rgb(229 231 235 / 1)',
            margin: '2em 0',
            border: 'none',
          }}
        >
          {props.children}
        </div>
      );
    case 'break':
      return (
        <span {...props.attributes} contentEditable={false}>
          {props.children}
          <br />
        </span>
      );
    case 'katex':
      return (
        <pre
          {...props.attributes}
          style={{
            background: 'rgb(242, 241, 241)',
            color: 'rgb(27, 27, 27)',
            padding: '1em',
            borderRadius: '0.5em',
            margin: '1em 0',
            fontSize: '0.8em',
            fontFamily: 'monospace',
            lineHeight: '1.5',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            wordWrap: 'break-word',
          }}
        >
          <code>{props.element.value}</code>
          <div
            style={{
              display: 'none',
            }}
          >
            {props.children}
          </div>
        </pre>
      );
    case 'inline-katex':
      return (
        <code
          {...props.attributes}
          style={{
            display: 'inline-block',
          }}
        >
          {props.element.value}
          <div
            style={{
              display: 'none',
            }}
          >
            {props.children}
          </div>
        </code>
      );
    case 'mermaid':
      return (
        <pre
          {...props.attributes}
          style={{
            background: 'rgb(242, 241, 241)',
            color: 'rgb(27, 27, 27)',
            padding: '1em',
            borderRadius: '0.5em',
            margin: '1em 0',
            fontSize: '0.8em',
            fontFamily: 'monospace',
            lineHeight: '1.5',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            wordWrap: 'break-word',
          }}
        >
          <code>{props.children}</code>
        </pre>
      );
    case 'code':
      return (
        <pre
          {...props.attributes}
          style={{
            background: 'rgb(242, 241, 241)',
            color: 'rgb(27, 27, 27)',
            padding: '1em',
            borderRadius: '0.5em',
            margin: '1em 0',
            fontSize: '0.8em',
            fontFamily: 'monospace',
            lineHeight: '1.5',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            wordWrap: 'break-word',
          }}
        >
          <code>{props.children}</code>
        </pre>
      );
    case 'list-item':
      return <ListItem {...props} />;
    case 'list':
      return <List {...props} />;
    case 'schema':
      return <Schema {...props} />;
    case 'apaasify':
      return <Schema {...props} />;
    case 'table':
      return <Table {...props}>{props.children}</Table>;
    case 'description':
      return <Description {...props}>{props.children}</Description>;
    case 'table-row':
      return <tr {...props.attributes}>{props.children}</tr>;
    case 'table-cell':
      return <TableCell {...props}>{props.children}</TableCell>;
    case 'image':
      return <EditorImage {...props} />;
    case 'media':
      return <Media {...props} />;
    case 'footnoteDefinition':
      return <FootnoteDefinition {...props} />;
    case 'footnoteReference':
      return <FootnoteReference {...props} />;
    case 'card':
      return <WarpCard {...props} />;
    case 'card-before':
      return (
        <span
          style={{
            minWidth: 4,
            height: '100%',
            position: 'relative',
            lineHeight: 1,
            zIndex: 99,
            fontSize: '2em',
            overflow: 'hidden',
            display: props.readonly ? 'none' : 'inline-block',
          }}
          data-be={'card-before'}
          {...props.attributes}
        >
          {props.children}
        </span>
      );
    case 'card-after':
      return (
        <span
          style={{
            minWidth: 4,
            height: '100%',
            position: 'relative',
            lineHeight: 1,
            zIndex: 99,
            fontSize: '2em',
            overflow: 'hidden',
            display: props.readonly ? 'none' : 'inline-block',
          }}
          data-be={'card-after'}
          {...props.attributes}
        >
          {props.children}
        </span>
      );

    default:
      return <Paragraph {...props} />;
  }
};

export const MLeaf = (
  props: RenderLeafProps & {
    hashId: string;
    comment: MarkdownEditorProps['comment'];
    fncProps: MarkdownEditorProps['fncProps'];
    tagInputProps: MarkdownEditorProps['tagInputProps'];
  },
) => {
  const { markdownEditorRef, markdownContainerRef, readonly } =
    useEditorStore();
  const context = useContext(ConfigProvider.ConfigContext);
  const mdEditorBaseClass = context.getPrefixCls('md-editor-content');
  const leaf = props.leaf;
  const style: CSSProperties = {};
  let className = props.hashId + ' ';
  let children = <>{props.children}</>;

  if (leaf.code || leaf.tag) {
    const { text, tag, placeholder, autoOpen, triggerText } = (props?.leaf ||
      {}) as any;
    const { enable, tagTextRender } = props.tagInputProps || {};
    if (enable && tag) {
      children = (
        <>
          <TagPopup
            {...props}
            autoOpen={autoOpen}
            {...props.tagInputProps}
            text={text}
            onSelect={(v, path) => {
              if (!v) return;
              if (!path?.length) return;
              if (!markdownEditorRef.current) return;

              Editor.withoutNormalizing(markdownEditorRef.current, () => {
                const newText =
                  tagTextRender?.(
                    {
                      ...props,
                      ...props.tagInputProps,
                      text: v,
                    },
                    `${triggerText ?? '$'}${v}`,
                  ) || `${triggerText ?? '$'}${v}`;

                Transforms.insertText(markdownEditorRef.current, newText, {
                  at: path,
                });

                Transforms.setNodes(
                  markdownEditorRef.current,
                  { text: newText, tag: true, code: true, placeholder },
                  { at: path },
                );
                Transforms.insertNodes(
                  markdownEditorRef.current,
                  [{ text: '\uFEFF' }],
                  {
                    at: Path.previous(path),
                  },
                );
              });

              const focusElement = markdownContainerRef.current?.querySelector(
                'div[data-slate-node="value"]',
              ) as HTMLDivElement;

              if (focusElement) {
                focusElement?.focus();
              }

              setTimeout(() => {
                if (!markdownEditorRef.current) return;
                if (!path?.length) return;
                const nextPath = Path.next(path);
                if (!Editor.hasPath(markdownEditorRef.current, nextPath)) {
                  Transforms.insertNodes(
                    markdownEditorRef.current,
                    [{ text: ' ' }],
                    {
                      select: true,
                    },
                  );
                } else {
                  Transforms.select(markdownEditorRef.current, {
                    anchor: Editor.end(markdownEditorRef.current, path),
                    focus: Editor.end(markdownEditorRef.current, path),
                  });
                }
              }, 0);
            }}
            placeholder={placeholder || '请输入'}
          >
            {children}
          </TagPopup>
        </>
      );
    } else {
      children = (
        <code
          className={classNames(
            mdEditorBaseClass + '-inline-code',
            props.hashId,
          )}
        >
          {children}
        </code>
      );
    }
  }

  if (leaf.highColor) style.color = leaf.highColor;
  if (leaf.color) style.color = leaf.color;
  if (leaf.bold) style.fontWeight = 'bold';
  if (leaf.strikethrough) children = <s>{children}</s>;
  if (leaf.italic) style.fontStyle = 'italic';
  if (leaf.html) className += ' ' + mdEditorBaseClass + '-m-html';
  if (leaf.current) {
    style.background = '#f59e0b';
  }

  const dirty =
    leaf.bold ||
    leaf.code ||
    leaf.italic ||
    leaf.strikethrough ||
    leaf.highColor;

  const selectFormat = () => {
    try {
      if (EditorUtils.isDirtLeaf(props.leaf)) {
        const path = ReactEditor.findPath(
          markdownEditorRef.current,
          props.text,
        );
        if (path) {
          Transforms.select(markdownEditorRef.current, {
            anchor: Editor.start(markdownEditorRef.current, path),
            focus: Editor.end(markdownEditorRef.current, path),
          });
        }
      }
    } catch (e) {}
  };

  if (leaf?.url && readonly) {
    return (
      <Popover
        trigger="click"
        content={
          <div
            style={{
              display: 'flex',
              gap: 4,
            }}
          >
            {leaf.url}
            <ExportOutlined
              onClick={() => {
                if (!leaf?.url) return;
                window.open(leaf?.url);
              }}
            />
          </div>
        }
      >
        <span
          data-be="link"
          draggable={false}
          onDragStart={dragStart}
          data-url={leaf?.url}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.metaKey || e.ctrlKey || readonly) {
              if (!leaf?.url) return;
              window.open(leaf?.url);
            } else if (e.detail === 2) {
              selectFormat();
            }
          }}
          id={leaf?.url}
          data-slate-inline={true}
          className={`${className}`}
          style={{
            ...style,
            textDecoration: 'underline',
            textDecorationColor: style?.color || '#1677ff',
            textUnderlineOffset: '4px',
            color: '#1677ff',
            cursor: 'pointer',
          }}
          {...props.attributes}
        >
          {children}
        </span>
      </Popover>
    );
  }

  let dom = (
    <span
      {...props.attributes}
      data-be="text"
      draggable={false}
      onDragStart={dragStart}
      onClick={(e) => {
        if (e.detail === 2) {
          selectFormat();
        }
        if (props.fncProps?.onOriginUrlClick) {
          props.fncProps.onOriginUrlClick(leaf?.identifier);
        }
      }}
      contentEditable={leaf.fnc ? false : undefined}
      data-fnc={leaf.fnc || leaf.identifier ? 'fnc' : undefined}
      data-fnd={leaf.fnd ? 'fnd' : undefined}
      data-comment={leaf.comment ? 'comment' : undefined}
      data-fnc-name={
        leaf.fnc ? leaf.text?.replace(/\[\^(.+)]:?/g, '$1') : undefined
      }
      data-fnd-name={
        leaf.fnd ? leaf.text?.replace(/\[\^(.+)]:?/g, '$1') : undefined
      }
      className={classNames(className, props.hashId, {
        [`${mdEditorBaseClass}-fnc`]: leaf.fnc,
        [`${mdEditorBaseClass}-fnd`]: leaf.fnd,
        [`${mdEditorBaseClass}-comment`]: leaf.comment,
      })}
      style={{
        fontSize: leaf.fnc ? 10 : undefined,
        ...(leaf.url
          ? {
              ...style,
              textDecoration: 'underline',
              textDecorationColor: style?.color || '#1677ff',
              textUnderlineOffset: '4px',
              color: '#1677ff',
              cursor: 'pointer',
            }
          : style),
      }}
    >
      {leaf.fnc || leaf.identifier
        ? leaf.text
            ?.replaceAll(']', '')
            ?.replaceAll('[^DOC_', '')
            ?.replaceAll('[^', '')
        : children}
    </span>
  );
  if (props.fncProps?.render && (leaf.fnc || leaf.identifier)) {
    dom = (
      <>
        {props.fncProps.render?.(
          {
            ...leaf,
            children:
              leaf.text
                ?.toLocaleUpperCase()
                ?.replaceAll('[^', '')
                .replaceAll(']', '') || '',
          },
          dom,
        )}
      </>
    );
  }
  if (!props.leaf.comment) return dom;

  return (
    <CommentView
      comment={props.comment}
      commentItem={leaf?.comment ? (leaf.data as any) : null}
    >
      <span id={`comment-${props.leaf?.id}`}>{dom}</span>
    </CommentView>
  );
};

export {
  Blockquote,
  Head,
  List,
  ListItem,
  Media,
  Paragraph,
  Schema,
  Table,
  TableCell,
};
