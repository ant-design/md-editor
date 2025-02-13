import { Popover, Typography } from 'antd';
import classNames from 'classnames';
import { default as React, useEffect, useMemo, useState } from 'react';
import { Editor, Node, Transforms } from 'slate';
import stringWidth from 'string-width';
import { useSelStatus } from '../../../hooks/editor';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import './table.css';

const numberValidationRegex = /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/;

/**
 * TableThCell 组件用于渲染表格标题单元格。
 * @param props
 * @returns
 */
export const TableThCell = (
  props: RenderElementProps & {
    minWidth: number;
    align?: string;
    text?: string;
    width?: number;
  },
) => {
  const { minWidth, align, text } = props;

  const justifyContent = useMemo(() => {
    return align
      ? align
      : numberValidationRegex.test(text?.replaceAll(',', '') || '')
        ? 'left'
        : 'right';
  }, [align, text]);

  return (
    <th
      {...props.attributes}
      data-be={'th'}
      style={{
        minWidth: minWidth,
        width: props.width,
        textAlign: justifyContent as 'left',
      }}
    >
      {props.children}
    </th>
  );
};

export const TableTdCell = (
  props: RenderElementProps & {
    minWidth: number;
    align?: string;
    text?: string;
    domWidth: number;
    width?: number;
  },
) => {
  const [, cellPath] = useSelStatus(props.element);
  const { readonly } = useEditorStore();
  const { minWidth, domWidth, align, text } = props;
  const { selected } = props.element;
  const [editing, setEditing] = useState(false);

  const justifyContent = useMemo(() => {
    return align
      ? align
      : numberValidationRegex.test(text?.replaceAll(',', '') || '')
        ? 'right'
        : 'left';
  }, [align, text]);

  const dom = useMemo(() => {
    if (readonly && domWidth > 200) {
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
  }, [props.width, domWidth, minWidth, props.children, readonly, text]);

  const isSelecting = selected;

  const { markdownEditorRef } = useEditorStore();
  useEffect(() => {
    if (!isSelecting) {
      setEditing(false);
    }
  }, [isSelecting]);

  return (
    <td
      {...props.attributes}
      data-be={'td'}
      className={classNames('group', {
        'selected-cell-td': isSelecting,
        'editing-cell-td': editing,
        'td-cell-select': !readonly && !isSelecting && !editing,
      })}
      style={{
        backgroundColor: editing ? 'transparent' : undefined,
        textAlign: justifyContent as 'left',
        minWidth: minWidth,
        maxWidth: '200px',
        width: props.width,
      }}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditing(true);
        Transforms.select(
          markdownEditorRef.current,
          Editor.end(markdownEditorRef.current, cellPath),
        );
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
  return React.useMemo(() => {
    const domWidth = stringWidth(Node.string(props.element)) * 8 + 20;
    const minWidth = Math.min(domWidth, 200);
    const text = Node.string(props.element);
    const align = props.element?.align;
    const width = props.element?.width;

    return props.element.title ? (
      <TableThCell
        {...props}
        minWidth={minWidth}
        align={align}
        text={text}
        width={width}
      />
    ) : (
      <TableTdCell
        {...props}
        domWidth={domWidth}
        minWidth={minWidth}
        align={align}
        text={text}
        width={width}
      />
    );
  }, [
    props.element.children,
    props.element?.align,
    props.element?.width,
    props.element.selected,
  ]);
}
