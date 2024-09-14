import React, { CSSProperties, useContext, useMemo } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import {
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react/dist/components/editable';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { InlineChromiumBugfix } from '../utils/InlineChromiumBugfix';
import { Blockquote } from './blockquote';
import { Chart } from './chart';
import { CodeCtx, CodeElement, CodeLine } from './code';
import { ColumnCell, ColumnGroup } from './column';
import { Description } from './description';
import { FootnoteDefinition } from './FootnoteDefinition';
import { FootnoteReference } from './FootnoteReference';
import { Head } from './head';
import { LinkCard } from './LinkCard';
import { List, ListItem } from './list';
import { Media } from './media';
import { Paragraph } from './paragraph';
import { Schema } from './schema';
import { Table, TableCell } from './table';

const dragStart = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const MElement = (props: RenderElementProps) => {
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
          className={'m-hr select-none'}
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
    case 'code':
      return <CodeElement {...props}>{props.children}</CodeElement>;
    case 'code-line':
      return <CodeLine {...props} />;
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
    default:
      return <Paragraph {...props} />;
  }
};

export const MLeaf = (props: RenderLeafProps) => {
  const code = useContext(CodeCtx);
  const store = useEditorStore();
  return useMemo(() => {
    const leaf = props.leaf;
    const style: CSSProperties = {};
    let className = '';
    let children = <>{props.children}</>;
    if (leaf.code) children = <code className={'inline-code'}>{children}</code>;
    if (leaf.highColor) style.color = leaf.highColor;
    if (leaf.color) style.color = leaf.color;
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.strikethrough) children = <s>{children}</s>;
    if (leaf.italic) children = <i>{children}</i>;
    if (leaf.highlight) className = 'high-text';
    if (leaf.html) className += ' dark:text-gray-500 text-gray-400';
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
          const path = ReactEditor.findPath(store.editor, props.text);
          if (path) {
            Transforms.select(store.editor, {
              anchor: Editor.start(store.editor, path),
              focus: Editor.end(store.editor, path),
            });
          }
        }
      } catch (e) {}
    };

    if (leaf.url) {
      return (
        <span
          data-be={'link'}
          draggable={false}
          onDragStart={dragStart}
          data-url={leaf.url}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.metaKey || e.ctrlKey || store.readonly) {
              if (!leaf.url) return;
              window.open(leaf.url);
            } else if (e.detail === 2) {
              selectFormat();
            }
          }}
          id={leaf.url}
          data-slate-inline={true}
          className={`${className}`}
          style={{
            ...style,
            textDecorationColor: '#1677ff',
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
      );
    }

    return (
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
        data-fnc={leaf.fnc || leaf.identifier ? 'fnc' : undefined}
        data-fnd={leaf.fnd ? 'fnd' : undefined}
        data-fnc-name={
          leaf.fnc ? leaf.text?.replace(/\[\^(.+)]:?/g, '$1') : undefined
        }
        data-fnd-name={
          leaf.fnd ? leaf.text?.replace(/\[\^(.+)]:?/g, '$1') : undefined
        }
        className={`${!!dirty ? 'mx-[1px]' : ''} ${className}`}
        style={{
          fontSize: leaf.fnc ? 10 : undefined,
          ...style,
        }}
        id={
          'md-editor-ref' +
          //@ts-ignore
          (leaf.identifier || '')
        }
      >
        {!!dirty && !!leaf.text && <InlineChromiumBugfix />}
        {leaf.fnc || leaf.identifier
          ? leaf.text?.replaceAll('[^', '').replaceAll(']', '')
          : children}
        {!!dirty && !!leaf.text && <InlineChromiumBugfix />}
      </span>
    );
  }, [props.leaf, props.leaf.text, code.lang]);
};

export {
  Blockquote,
  Chart,
  CodeCtx,
  CodeElement,
  CodeLine,
  Head,
  List,
  ListItem,
  Media,
  Paragraph,
  Schema,
  Table,
  TableCell,
};
