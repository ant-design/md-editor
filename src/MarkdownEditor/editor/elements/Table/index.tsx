/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import React from 'react';
import { BaseElement } from 'slate/dist/interfaces';
import { useSelStatus } from '../../../hooks/editor';
import { TableCursor } from '../../../utils/slate-table';
import {
  RenderElementProps,
  useSlateSelection,
  useSlateStatic,
} from '../../slate-react';
import { SimpleTable } from './SimpleTable';

export type TableCustomElement =
  | TableNode
  | TableHeadNode
  | TableFooterNode
  | TrNode
  | ThNode
  | TdNode;

export interface TableNode {
  type: 'table';
  children: Array<TableHeadNode | TrNode | TableFooterNode>;
  otherProps?: {
    mergeCells?: Array<{
      row: number;
      col: number;
      rowSpan: number;
      colSpan: number;
    }>;
    columns?: Array<any>; // 用于定义列属性，如宽度、对齐方式等
  };
}

export interface TableHeadNode {
  type: 'table-head';
  children: TrNode[];
}

export interface TableFooterNode {
  type: 'table-footer';
  children: TrNode[];
}

export interface TrNode {
  type: 'table-row';
  children: Array<TdNode | ThNode>;
}

interface ThNode {
  type: 'header-cell';
  rowSpan?: number;
  colSpan?: number;
  children: Array<TableCustomElement | Text>;
}

export const Th: React.FC<
  RenderElementProps & {
    style?: React.CSSProperties;
  }
> = ({ attributes, children, style, element }) => {
  if (element.type !== 'header-cell') {
    throw new Error('Element "Th" must be of type "header-cell"');
  }

  useSlateSelection();
  const editor = useSlateStatic();
  const selected = TableCursor.isSelected(editor, element);

  return (
    <th
      style={{
        backgroundColor: selected ? '#bae6fd' : 'transparent',

        ...style,
      }}
      {...attributes}
    >
      {children}
    </th>
  );
};

export interface TdNode {
  type: 'table-cell';
  rowSpan?: number;
  colSpan?: number;
  children: Array<TableCustomElement | BaseElement['children'] | Text>;
}

export const Td: React.FC<
  RenderElementProps & {
    style?: React.CSSProperties;
    cellPath?: number[];
  }
> = ({ attributes, children, style, element }) => {
  if (element.type !== 'table-cell') {
    throw new Error('Element "Td" must be of type "table-cell"');
  }

  const align = element?.align;
  const width = element?.width;
  useSlateSelection();
  const editor = useSlateStatic();
  const selected = TableCursor.isSelected(editor, element);

  if (element.hidden) {
    return <td style={{ display: 'none' }}></td>;
  }

  return (
    <td
      style={{
        backgroundColor: selected ? '#bae6fd' : 'transparent',
        wordWrap: 'break-word',
        wordBreak: 'break-all',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'pre-wrap',
        textAlign: align || 'left', // 默认左对齐
        width: width || 'auto', // 如果有指定宽度则使用，否则自动
        ...style,
      }}
      rowSpan={element?.rowSpan}
      colSpan={element?.colSpan}
      {...attributes}
    >
      {children}
    </td>
  );
};

// 包装组件，用于在组件内部调用 hooks
const ThWrapper: React.FC<
  RenderElementProps & { style?: React.CSSProperties }
> = (props) => {
  return <Th {...props} />;
};

const TdWrapper: React.FC<
  RenderElementProps & { style?: React.CSSProperties }
> = (props) => {
  const [, path] = useSelStatus(props.element);
  return <Td {...props} cellPath={path} />;
};

export const tableRenderElement = (
  props: RenderElementProps<TableCustomElement>,
) => {
  switch (props.element.type) {
    case 'table':
      return <SimpleTable {...props} />;
    case 'table-head':
      return (
        <thead
          style={{
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#e5e7eb',
            fontSize: '14px',
            textTransform: 'uppercase',
            backgroundColor: '#f1f5f9',
          }}
          {...props.attributes}
        >
          {props.children}
        </thead>
      );
    case 'table-footer':
      return <tfoot {...props.attributes}>{props.children}</tfoot>;
    case 'table-row':
      return <tr {...props.attributes}>{props.children}</tr>;
    case 'header-cell':
      return (
        <ThWrapper
          style={{
            padding: '8px',
            verticalAlign: 'middle',
          }}
          {...props}
        />
      );
    case 'table-cell':
      return (
        <TdWrapper
          style={{
            padding: '8px',
            verticalAlign: 'middle',
          }}
          {...props}
        />
      );
    default:
      return null;
  }
};
