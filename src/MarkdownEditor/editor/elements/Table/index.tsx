/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import React, { useContext, useMemo } from 'react';
import { BaseElement } from 'slate/dist/interfaces';
import { useSelStatus } from '../../../hooks/editor';
import { TableCursor } from '../../../utils/slate-table';
import {
  RenderElementProps,
  useSlateSelection,
  useSlateStatic,
} from '../../slate-react';
import { SimpleTable } from './SimpleTable';
import { TablePropsContext } from './TableContext';

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
      rowspan: number;
      colspan: number;
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
> = ({ attributes, children, style, element, cellPath }) => {
  if (element.type !== 'table-cell') {
    throw new Error('Element "Td" must be of type "table-cell"');
  }
  const align = element?.align;
  const width = element?.width;
  useSlateSelection();
  const editor = useSlateStatic();
  const selected = TableCursor.isSelected(editor, element);

  const { tableNode } = useContext(TablePropsContext);

  const mergeCell = useMemo(() => {
    // 如果没有定义合并单元格，提前返回
    if (!tableNode?.otherProps?.mergeCells?.length) return null;

    const row = cellPath?.at(-2);
    const col = cellPath?.at(-1);

    // 如果单元格坐标无效，提前返回
    if (row === undefined || col === undefined) return null;

    // 查找此单元格的合并配置
    const cellConfig = tableNode.otherProps.mergeCells.find(
      (item) =>
        item.row <= row &&
        item.row + item.rowspan > row &&
        item.col <= col &&
        item.col + item.colspan > col,
    );

    // 如果没有匹配的合并单元格，提前返回
    if (!cellConfig) return null;

    // 如果这是合并的主单元格
    if (cellConfig.row === row && cellConfig.col === col) {
      return cellConfig;
    }

    // 如果这是合并的一部分被隐藏的单元格
    return {
      hidden: true,
      ...cellConfig,
    };
  }, [
    tableNode?.otherProps?.mergeCells,
    cellPath?.at(-2), // 行
    cellPath?.at(-1), // 列
  ]);

  if ((mergeCell as any)?.hidden) {
    return null;
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
      rowSpan={mergeCell?.rowspan}
      colSpan={mergeCell?.colspan}
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
