import { ConfigProvider, Popover } from 'antd';
import classNames from 'classnames';
import React, { CSSProperties, useContext } from 'react';
import { Editor, Transforms } from 'slate';

import { ExportOutlined } from '@ant-design/icons';
import { MarkdownEditorProps } from '../..';
import {
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from '../slate-react';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { InlineChromiumBugfix } from '../utils/InlineChromiumBugfix';
import { Blockquote } from './blockquote';
import { WarpCard } from './card';
import { Chart } from './chart/index';
import { AceElement } from './code';
import { InlineKatex } from './code/CodeUI/Katex/InlineKatex';
import { ColumnCell, ColumnGroup } from './column';
import { CommentView } from './Comment';
import { Description } from './description';
import { FootnoteDefinition } from './FootnoteDefinition';
import { FootnoteReference } from './FootnoteReference';
import { Head } from './head';
import { LinkCard } from './LinkCard';
import { List, ListItem } from './list';
import { Media } from './media';
import { Paragraph } from './paragraph';
import { Schema } from './schema';
import { Table, TableCell } from './Table/index';

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
    case 'list-item':
      return <ListItem {...props} />;
    case 'list':
      return <List {...props} />;
    case 'schema':
      return <Schema {...props} />;
    case 'apaasify':
      return <Schema {...props} />;
    case 'code':
      return <AceElement {...props}>{props.children}</AceElement>;
    case 'table':
      return <Table {...props}>{props.children}</Table>;
    case 'description':
      return <Description {...props}>{props.children}</Description>;
    case 'chart':
      return <Chart {...props} />;
    case 'table-row':
      return <tr {...props.attributes}>{props.children}</tr>;
    case 'table-cell':
      return <TableCell {...props}>{props.children}</TableCell>;
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
            fontWeight: 800,
            position: 'relative',
            zIndex: 99,
            fontSize: '2em',
            display: 'none',
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
            alignSelf: 'end',
            position: 'relative',
            zIndex: 99,

            fontSize: '2em',
            display: props.readonly ? 'none' : 'block',
          }}
          data-be={'card-after'}
          {...props.attributes}
        >
          {props.children}
        </span>
      );

    case 'inline-katex':
      return <InlineKatex {...props} />;
    default:
      return <Paragraph {...props} />;
  }
};

export const MLeaf = (
  props: RenderLeafProps & {
    hashId: string;
    comment: MarkdownEditorProps['comment'];
    fncProps: MarkdownEditorProps['fncProps'];
  },
) => {
  const { markdownEditorRef, readonly } = useEditorStore();
  const context = useContext(ConfigProvider.ConfigContext);
  const mdEditorBaseClass = context.getPrefixCls('md-editor-content');

  const leaf = props.leaf;
  const style: CSSProperties = {};
  let className = props.hashId + ' ';
  let children = <>{props.children}</>;
  if (leaf.code)
    children = (
      <code
        className={classNames(mdEditorBaseClass + '-inline-code', props.hashId)}
      >
        {children}
      </code>
    );
  if (leaf.highColor) style.color = leaf.highColor;
  if (leaf.color) style.color = leaf.color;
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.strikethrough) children = <s>{children}</s>;
  if (leaf.italic) children = <i>{children}</i>;
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

  if (leaf?.url) {
    return (
      <Popover
        trigger={'click'}
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
          data-be={'link'}
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
          {!!props.text?.text && <InlineChromiumBugfix />}
          {children}
          {!!props.text?.text && <InlineChromiumBugfix />}
        </span>
      </Popover>
    );
  }

  let dom = (
    <span
      {...props.attributes}
      data-be={'text'}
      draggable={false}
      onDragStart={dragStart}
      onClick={(e) => {
        if (e.detail === 2) {
          selectFormat();
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
        ...style,
      }}
    >
      {!!dirty && !!leaf.text && <InlineChromiumBugfix />}
      {leaf.fnc || leaf.identifier
        ? leaf.text?.replaceAll(']', '')?.replaceAll('[^DOC_', '')
        : children}
      {!!dirty && !!leaf.text && <InlineChromiumBugfix />}
    </span>
  );
  if (props.fncProps?.render && (leaf.fnc || leaf.identifier)) {
    dom = (
      <>
        {props.fncProps.render?.(
          {
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
  AceElement,
  Blockquote,
  Chart,
  Head,
  List,
  ListItem,
  Media,
  Paragraph,
  Schema,
  Table,
  TableCell,
};
