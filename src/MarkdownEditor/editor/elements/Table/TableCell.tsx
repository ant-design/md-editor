import { Popover, Typography } from 'antd';
import { default as React, useContext, useMemo } from 'react';
import { Node } from 'slate';
import { TablePropsContext } from '.';
import { useSelStatus } from '../../../hooks/editor';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import './table.css';

/**
 * TableThCell 组件用于渲染表格标题单元格。
 * @param props
 * @returns
 */
export const TableThCell = (
  props: RenderElementProps & {
    align?: string;
    text?: string;
    width?: number;
  },
) => {
  const { readonly } = useEditorStore();
  const { align, text } = props;
  const justifyContent = useMemo(() => {
    return align || !readonly ? align : undefined;
  }, [align, text]);

  return (
    <th
      {...props.attributes}
      data-be={'th'}
      style={{
        textAlign: justifyContent as 'left',
        width: props.width,
      }}
    >
      {props.children}
    </th>
  );
};

export const TableTdCell = (
  props: RenderElementProps & {
    align?: string;
    text?: string;
    width?: number;
    cellPath?: number[];
  },
) => {
  const { readonly } = useEditorStore();

  const { tableNode } = useContext(TablePropsContext);

  const { align, text } = props;

  const justifyContent = useMemo(() => {
    return align || !readonly ? align : undefined;
  }, [align, text]);

  const mergeCell = useMemo(() => {
    if (tableNode?.otherProps?.mergeCells) {
      const row = props.cellPath?.at(-2);
      const col = props.cellPath?.at(-1);
      if (row === undefined || col === undefined) return null;
      const cellConfig = tableNode?.otherProps?.mergeCells?.find(
        (item) =>
          item.row <= row &&
          item.row + item.rowspan > row &&
          item.col <= col &&
          item.col + item.colspan > col,
      );
      if (cellConfig && cellConfig.row === row && cellConfig.col === col) {
        return cellConfig;
      }
      if (
        cellConfig &&
        (cellConfig.row < row ||
          cellConfig.col < col ||
          cellConfig.row + cellConfig.rowspan > row ||
          cellConfig.col + cellConfig.colspan > col)
      ) {
        return {
          hidden: true,
          ...cellConfig,
        };
      }
    }
    return null;
  }, [tableNode?.otherProps?.mergeCells]);

  const dom = useMemo(() => {
    if (readonly && (props.width || 0) > 200) {
      return (
        <Popover
          title={
            <div
              style={{
                maxWidth: 400,
                maxHeight: 400,
                fontWeight: 400,
                fontSize: '1em',
                overflow: 'auto',
              }}
            >
              <Typography.Text copyable={{ text: text }}>
                {text}
              </Typography.Text>
            </div>
          }
        >
          {text}
        </Popover>
      );
    }
    return props.children;
  }, [props.width, props.children, readonly, text]);

  if ((mergeCell as any)?.hidden) return null;
  return (
    <td
      {...props.attributes}
      data-be={'td'}
      rowSpan={mergeCell?.rowspan}
      colSpan={mergeCell?.colspan}
      style={{
        textAlign: justifyContent as 'left',
        maxWidth: '200px',
        overflow: 'auto',
        textWrap: 'wrap',
        width: props.width,
      }}
    >
      {dom}
    </td>
  );
};

/**
 * TableCell 组件用于渲染表格单元格，根据元素的 title 属性决定渲染 <th> 或 <td>。
 *
 * @param {RenderElementProps} props - 传递给组件的属性。
 * @returns {JSX.Element} 渲染的表格单元格。
 *
 * @example
 * ```tsx
 * <TableCell element={element} attributes={attributes} children={children} />
 * ```
 *
 * @remarks
 * - 使用 `useEditorStore` 获取编辑器的 store。
 * - 使用 `useSelStatus` 获取选择状态。
 * - 使用 `useCallback` 创建上下文菜单的回调函数。
 * - 使用 `React.useMemo` 优化渲染性能。
 *
 * @internal
 * - `minWidth` 根据元素内容的字符串宽度计算，最小值为 20，最大值为 200。
 * - `textWrap` 设置为 'wrap'，`maxWidth` 设置为 '200px'。
 * - `onContextMenu` 事件处理函数根据元素是否有 title 属性传递不同的参数。
 */
export function TableCell(props: RenderElementProps) {
  const [, path] = useSelStatus(props.element);
  const text = Node.string(props.element);
  const align = props.element?.align;
  const width = props.element?.width;
  return props.element.title ? (
    <TableThCell {...props} align={align} text={text} width={width} />
  ) : (
    <TableTdCell
      {...props}
      align={align}
      text={text}
      width={width}
      cellPath={path}
    />
  );
}
