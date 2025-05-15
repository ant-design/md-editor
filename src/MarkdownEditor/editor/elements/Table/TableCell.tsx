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
  const { align } = props;

  return (
    <th
      {...props.attributes}
      data-be={'th'}
      style={{
        textAlign: align as 'left',
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

  const mergeCell = useMemo(() => {
    // 如果没有定义合并单元格，提前返回
    if (!tableNode?.otherProps?.mergeCells?.length) return null;

    const row = props.cellPath?.at(-2);
    const col = props.cellPath?.at(-1);

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
    props.cellPath?.at(-2), // 行
    props.cellPath?.at(-1), // 列
  ]);

  // 使用ref而不是state来标记用户是否正在输入，避免不必要的重新渲染
  const isEditing = React.useRef(false);

  // 设置输入时的标记
  const handleFocus = React.useCallback(() => {
    isEditing.current = true;
  }, []);

  // 清除输入标记
  const handleBlur = React.useCallback(() => {
    isEditing.current = false;
  }, []);

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
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        textAlign: align as 'left',
        overflow: 'auto',
        textWrap: 'wrap',
        width: props.width,
        // 当用户输入时，提供视觉稳定性，防止因计算导致的闪动
        transition: 'text-align 0.2s ease-in-out',
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
