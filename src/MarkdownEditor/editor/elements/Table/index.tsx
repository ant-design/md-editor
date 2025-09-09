/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import React from 'react';
import { useSelStatus } from '../../../hooks/editor';
import { TableCursor } from '../../../utils/slate-table';
import {
  RenderElementProps,
  useSlateSelection,
  useSlateStatic,
} from '../../slate-react';
import { SimpleTable } from './SimpleTable';

export type {
  TableCustomElement,
  TableFooterNode,
  TableHeadNode,
  TableNode,
  TdNode,
  ThNode,
  TrNode,
} from '../../types/Table';

/**
 * Th 组件 - 表格头部单元格组件
 *
 * 该组件用于渲染表格的头部单元格，支持选择状态显示和样式自定义。
 * 集成到 Slate 编辑器中，提供表格编辑功能。
 *
 * @component
 * @description 表格头部单元格组件，渲染表格头部
 * @param {RenderElementProps & {style?: React.CSSProperties}} props - 组件属性
 * @param {Object} props.attributes - 元素属性
 * @param {React.ReactNode} props.children - 子组件内容
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {Element} props.element - 表格头部元素
 *
 * @example
 * ```tsx
 * <Th
 *   attributes={attributes}
 *   element={headerElement}
 *   style={{ fontWeight: 'bold' }}
 * >
 *   表头内容
 * </Th>
 * ```
 *
 * @returns {React.ReactElement} 渲染的表格头部单元格组件
 *
 * @remarks
 * - 集成 Slate 编辑器
 * - 支持选择状态高亮
 * - 提供自定义样式支持
 * - 类型安全检查
 * - 响应式布局
 */
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

/**
 * Td 组件 - 表格数据单元格组件
 *
 * 该组件用于渲染表格的数据单元格，支持选择状态、对齐方式、宽度设置等功能。
 * 集成到 Slate 编辑器中，提供表格编辑功能。
 *
 * @component
 * @description 表格数据单元格组件，渲染表格数据
 * @param {RenderElementProps & {style?: React.CSSProperties, cellPath?: number[]}} props - 组件属性
 * @param {Object} props.attributes - 元素属性
 * @param {React.ReactNode} props.children - 子组件内容
 * @param {React.CSSProperties} [props.style] - 自定义样式
 * @param {Element} props.element - 表格数据元素
 * @param {number[]} [props.cellPath] - 单元格路径
 *
 * @example
 * ```tsx
 * <Td
 *   attributes={attributes}
 *   element={dataElement}
 *   style={{ textAlign: 'center' }}
 *   cellPath={[0, 1]}
 * >
 *   单元格内容
 * </Td>
 * ```
 *
 * @returns {React.ReactElement} 渲染的表格数据单元格组件
 *
 * @remarks
 * - 集成 Slate 编辑器
 * - 支持选择状态高亮
 * - 支持单元格对齐方式
 * - 支持单元格宽度设置
 * - 支持行合并和列合并
 * - 支持隐藏单元格
 * - 提供文本溢出处理
 * - 类型安全检查
 */
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
            fontSize: '13px',
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
