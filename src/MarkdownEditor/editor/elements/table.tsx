import { useDebounceFn } from '@ant-design/pro-components';
import { ConfigProvider, Popover, Typography } from 'antd';
import classNames from 'classnames';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Editor, Node, NodeEntry, Path, Transforms } from 'slate';
import stringWidth from 'string-width';
import { TableCellNode, TableNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { ReactEditor, RenderElementProps } from '../slate-react';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { EditorUtils } from '../utils';
import { ColSideDiv, IntersectionPointDiv, RowSideDiv } from './renderSideDiv';
import './table.css';

const numberValidationRegex = /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/;

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
  const { store, readonly } = useEditorStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_] = useSelStatus(props.element);

  return React.useMemo(() => {
    const domWidth = stringWidth(Node.string(props.element)) * 8 + 20;
    const minWidth = Math.min(domWidth, 200);
    const text = Node.string(props.element);
    const align = props.element?.align;
    const getTextAlign = (align: string | undefined) => {
      if (align === 'left') {
        return 'start';
      } else if (align === 'center') {
        return 'center';
      } else if (align === 'right') {
        return 'end';
      }
    };
    return props.element.title ? (
      <th {...props.attributes} data-be={'th'}>
        <div
          style={{
            minWidth: minWidth,
            textWrap: 'wrap',
            maxWidth: '200px',
            display: 'flex',
            justifyContent: align
              ? getTextAlign(align)
              : numberValidationRegex.test(text?.replaceAll(',', ''))
                ? 'end'
                : 'start',
          }}
        >
          {props.children}
        </div>
      </th>
    ) : (
      <td {...props.attributes} data-be={'td'} className={classNames('group')}>
        {readonly && domWidth > 200 ? (
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
            <div
              style={{
                minWidth: minWidth,
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                maxHeight: 40,
              }}
            >
              {text}
            </div>
          </Popover>
        ) : (
          <div
            style={{
              minWidth: minWidth,
              textWrap: 'wrap',
              maxWidth: '200px',
              display: 'flex',
              justifyContent: align
                ? getTextAlign(align)
                : numberValidationRegex.test(text?.replaceAll(',', ''))
                  ? 'end'
                  : 'start',
            }}
          >
            {props.children}
          </div>
        )}
      </td>
    );
  }, [props.element, props.element.children, store.refreshHighlight]);
}

/**
 * 表格组件，使用 `observer` 包装以响应状态变化。
 *
 * @param {RenderElementProps} props - 渲染元素的属性。
 *
 * @returns {JSX.Element} 表格组件的 JSX 元素。
 *
 * @component
 *
 * @example
 * ```tsx
 * <Table {...props} />
 * ```
 *
 * @remarks
 * 该组件使用了多个 React 钩子函数，包括 `useState`、`useEffect`、`useCallback` 和 `useRef`。
 *
 * - `useState` 用于管理组件的状态。
 * - `useEffect` 用于处理组件挂载和卸载时的副作用。
 * - `useCallback` 用于优化回调函数的性能。
 * - `useRef` 用于获取 DOM 元素的引用。
 *
 * 组件还使用了 `IntersectionObserver` 来检测表格是否溢出，并相应地添加或移除 CSS 类。
 *
 * @see https://reactjs.org/docs/hooks-intro.html React Hooks
 */
export const Table = observer((props: RenderElementProps) => {
  const { store, markdownEditorRef } = useEditorStore();

  const [isShowBar, setIsShowBar] = useState(false);
  const [state, setState] = useState({
    top: 0,
    left: 0,
    width: 0,
    scaleOpen: false,
    enterScale: false,
    align: '' as string | undefined,
    rows: 0,
    cols: 0,
    selectCols: 0,
    selectRows: 0,
  });
  const [selectedTable, tablePath] = useSelStatus(props.element);

  const tableRef = React.useRef<NodeEntry<TableNode>>();
  const overflowShadowContainerRef = React.useRef<HTMLTableElement>(null);
  const tableCellRef = useRef<NodeEntry<TableCellNode>>();
  const [activeDeleteBtn, setActiveDeleteBtn] = useState<string | null>(null);

  const tableNodeEntry = useMemo(() => {
    if (!Editor) return;
    if (!tablePath || tablePath?.length === 0) return;
    if (!markdownEditorRef.current) return;
    if (!markdownEditorRef.current.children) return;
    if (markdownEditorRef.current.children?.length === 0) return;
    return Editor.node(markdownEditorRef.current, tablePath);
  }, [tablePath]);

  // 更新表格的行列数
  const updateTableDimensions = useDebounceFn(async () => {
    const table = tableNodeEntry;
    if (!table) return;
    try {
      const dom = ReactEditor.toDOMNode(
        markdownEditorRef.current,
        table[0],
      ) as HTMLElement;
      if (dom) {
        setState((prev) => ({
          ...prev,
          rows: table[0].children.length,
          cols: table[0].children[0].children.length,
        }));
      }
    } catch (e) {}
  }, 160);

  const setAligns = useCallback(
    (type: 'left' | 'center' | 'right') => {
      const cell = tableCellRef.current!;
      const table = tableNodeEntry!;
      if (cell) {
        const index = cell[1][cell[1].length - 1];
        table?.[0]?.children?.forEach((el: { children: any[] }) => {
          el.children?.forEach((cell, i) => {
            if (i === index) {
              Transforms.setNodes(
                markdownEditorRef.current,
                { align: type },
                { at: EditorUtils.findPath(markdownEditorRef.current, cell) },
              );
            }
          });
        });
      }
      ReactEditor.focus(markdownEditorRef.current);
    },
    [tableNodeEntry],
  );

  const remove = useCallback(() => {
    const table = tableNodeEntry!;

    Transforms.delete(markdownEditorRef.current, { at: table[1] });
    tableCellRef.current = undefined;
    tableRef.current = undefined;
    Transforms.insertNodes(
      markdownEditorRef.current,
      { type: 'paragraph', children: [{ text: '' }] },
      { at: table[1], select: true },
    );
    ReactEditor.focus(markdownEditorRef.current);
  }, [markdownEditorRef.current]);

  const insertRow = useCallback((path: Path, columns: number) => {
    Transforms.insertNodes(
      markdownEditorRef.current,
      {
        type: 'table-row',
        children: Array.from(new Array(columns)).map(() => {
          return {
            type: 'table-cell',
            children: [{ text: '' }],
          } as TableCellNode;
        }),
      },
      {
        at: path,
      },
    );
    Transforms.select(
      markdownEditorRef.current,
      Editor.start(markdownEditorRef.current, path),
    );
  }, []);

  const insertCol = useCallback(
    (tablePath: Path, rows: number, index: number) => {
      Array.from(new Array(rows)).forEach((_, i) => {
        Transforms.insertNodes(
          markdownEditorRef.current,
          {
            type: 'table-cell',
            children: [{ text: '' }],
            title: i === 0,
          },
          {
            at: [...tablePath, i, index],
          },
        );
      });
      Transforms.select(markdownEditorRef.current, [...tablePath, 0, index, 0]);
    },
    [],
  );

  const removeRow = useCallback(
    (path: Path, index: number, columns: number) => {
      if (Path.hasPrevious(path)) {
        Transforms.select(
          markdownEditorRef.current,
          Editor.end(markdownEditorRef.current, [
            ...tableNodeEntry?.at(1),
            path[path.length - 1] - 1,
            index,
          ]),
        );
      } else {
        Transforms.select(
          markdownEditorRef.current,
          Editor.end(markdownEditorRef.current, [
            ...tableNodeEntry?.at(1),
            path[path.length - 1],
            index,
          ]),
        );
      }

      Transforms.delete(markdownEditorRef.current, { at: path });

      if (path[path.length - 1] === 0) {
        Array.from(new Array(columns)).forEach((_, i) => {
          Transforms.setNodes(
            markdownEditorRef.current,
            {
              title: true,
            },
            {
              at: [...path, i],
            },
          );
        });
      }
    },
    [markdownEditorRef.current],
  );

  const runTask = useCallback(
    (
      task:
        | 'insertRowBefore'
        | 'insertRowAfter'
        | 'insertColBefore'
        | 'insertColAfter'
        | 'moveUpOneRow'
        | 'moveDownOneRow'
        | 'moveLeftOneCol'
        | 'moveRightOneCol'
        | 'removeCol'
        | 'removeRow'
        | 'setAligns'
        | 'in'
        | 'insertTableCellBreak',
      index: number,
      ...rest: any[]
    ) => {
      if (!tableCellRef.current || !tableNodeEntry) return;
      const columns = tableNodeEntry?.at(0)?.children?.[0]?.children?.length;
      const rows = tableNodeEntry?.at(0)?.children?.length;
      const path = tableCellRef?.current?.[1];
      const row = path?.[path?.length - 2];
      const rowPath = Path.parent(path);
      switch (task) {
        case 'insertRowBefore':
          insertRow(
            row === 0 ? Path.next(Path.parent(path)) : Path.parent(path),
            columns,
          );
          break;
        case 'insertRowAfter':
          insertRow(Path.next(Path.parent(path)), columns);
          break;
        case 'insertColBefore':
          insertCol(tableNodeEntry?.at(1), rows, index);
          break;
        case 'insertColAfter':
          insertCol(tableNodeEntry?.at(1), rows, index + 1);
          break;
        case 'insertTableCellBreak':
          Transforms.insertNodes(
            markdownEditorRef.current,
            [{ type: 'break', children: [{ text: '' }] }, { text: '' }],
            { select: true },
          );
          break;
        case 'moveUpOneRow':
          if (row > 1) {
            Transforms.moveNodes(markdownEditorRef.current, {
              at: rowPath,
              to: Path.previous(rowPath),
            });
          } else {
            Transforms.moveNodes(markdownEditorRef.current, {
              at: rowPath,
              to: [...tableNodeEntry?.at(1), rows - 1],
            });
          }
          break;
        case 'moveDownOneRow':
          if (row < rows - 1) {
            Transforms.moveNodes(markdownEditorRef.current, {
              at: rowPath,
              to: Path.next(rowPath),
            });
          } else {
            Transforms.moveNodes(markdownEditorRef.current, {
              at: rowPath,
              to: [...tableNodeEntry?.at(1), 1],
            });
          }
          break;
        case 'moveLeftOneCol':
          Array.from(new Array(rows)).forEach((_, i) => {
            Transforms.moveNodes(markdownEditorRef.current, {
              at: [...tableNodeEntry?.at(1), i, index],
              to: [
                ...tableNodeEntry?.at(1),
                i,
                index > 0 ? index - 1 : columns - 1,
              ],
            });
          });
          break;
        case 'moveRightOneCol':
          Array.from(new Array(rows)).forEach((_, i) => {
            Transforms.moveNodes(markdownEditorRef.current, {
              at: [...tableNodeEntry?.at(1), i, index],
              to: [
                ...tableNodeEntry?.at(1),
                i,
                index === columns - 1 ? 0 : index + 1,
              ],
            });
          });
          break;
        case 'removeCol':
          if (columns < 2) {
            remove();
            return;
          }
          if (index < columns - 1) {
            Transforms.select(
              markdownEditorRef.current,
              Editor.start(markdownEditorRef.current, [
                ...tableNodeEntry?.at(1),
                row,
                index + 1,
              ]),
            );
          } else {
            Transforms.select(
              markdownEditorRef.current,
              Editor.start(markdownEditorRef.current, [
                ...tableNodeEntry?.at(1),
                row,
                index - 1,
              ]),
            );
          }
          Array.from(new Array(rows)).forEach((_, i) => {
            Transforms.delete(markdownEditorRef.current, {
              at: [...tableNodeEntry?.at(1), rows - i - 1, index],
            });
          });
          break;
        case 'removeRow':
          if (rows < 2) {
            remove();
          } else {
            removeRow(Path.parent(path), index, columns);
          }
          break;

        case 'setAligns':
          setAligns(rest?.at(0));
          break;
      }
      updateTableDimensions.cancel();
      updateTableDimensions.run();
      ReactEditor.focus(markdownEditorRef.current);
    },
    [],
  );

  const isSel = useMemo(() => {
    if (selectedTable) return true;
    if (!store.selectTablePath?.length) return false;
    return store.selectTablePath.join('') === tablePath.join('');
  }, [store.editor, selectedTable, store.selectTablePath, props.element]);

  const handleClickTable = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const el = store.tableCellNode;
      if (el) {
        tableCellRef.current = el;
        setState((prev) => ({
          ...prev,
          align: el[0].align,
        }));
      }
      setIsShowBar(true);
    },
    [store.tableCellNode, store.editor, setState, isShowBar],
  );

  const tableTargetRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (!props.element) return;
    tableRef.current = tableNodeEntry;
    updateTableDimensions.cancel();
    updateTableDimensions.run();
  }, [tableNodeEntry]);

  const getTableNode = () => {
    return props.element;
  };

  const [selCells, setSelCells] = useState<NodeEntry<TableCellNode>[]>([]);

  useEffect(() => {
    if (!store.editor) return;
    const cachedSelCells = store.CACHED_SEL_CELLS?.get(store.editor);
    cachedSelCells?.forEach((cell) => {
      const [cellNode] = cell;
      try {
        const cellDom = ReactEditor.toDOMNode(store.editor, cellNode);
        if (cellDom) {
          cellDom.classList.remove('selected-cell-td');
        }
      } catch (error) {
        console.log(error, cellNode);
      }
    });
    selCells?.forEach((cell) => {
      const [cellNode] = cell;
      try {
        const cellDom = ReactEditor.toDOMNode(store.editor, cellNode);
        if (cellDom) {
          cellDom.classList.add('selected-cell-td');
        }
      } catch (error) {
        console.log(error, cellNode);
      }
    });
    store.CACHED_SEL_CELLS.set(store.editor, selCells);
  }, [JSON.stringify(selCells)]);

  return useMemo(() => {
    return (
      <ConfigProvider
        getPopupContainer={() =>
          overflowShadowContainerRef?.current?.parentElement || document.body
        }
      >
        <div
          {...props.attributes}
          data-be={'table'}
          onDragStart={store.dragStart}
          ref={overflowShadowContainerRef}
          style={{
            display: 'flex',
            gap: 1,
            maxWidth: '100%',
            minWidth: 0,
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: 12,
          }}
          onMouseUp={handleClickTable}
        >
          <div className="ant-md-editor-drag-el">
            <DragHandle />
          </div>
          <div
            className={`ant-md-editor-table ant-md-editor-content-table ${
              isShowBar ? 'show-bar' : ''
            }`}
            onClick={() => {
              runInAction(() => {
                if (isSel) {
                  store.selectTablePath = [];
                  return;
                }
                store.selectTablePath = tablePath;
              });
            }}
            style={{
              flex: 1,
              minWidth: 0,
              marginLeft: 20,
              marginTop: 4,
              marginRight: 6,
            }}
          >
            <div
              style={{
                visibility: isShowBar ? 'visible' : 'hidden',
                overflow: 'hidden',
              }}
              data-slate-editor="false"
            >
              <IntersectionPointDiv
                getTableNode={getTableNode}
                selCells={selCells}
                setSelCells={setSelCells}
              />
              <RowSideDiv
                activeDeleteBtn={activeDeleteBtn}
                setActiveDeleteBtn={setActiveDeleteBtn}
                tableRef={tableTargetRef}
                getTableNode={getTableNode}
                selCells={selCells}
                setSelCells={setSelCells}
                onDeleteRow={(index) => {
                  runTask('removeRow', index);
                }}
                onAlignChange={(index, align) => {
                  runTask('setAligns', index, align);
                }}
                onCreateRow={(index, direction) => {
                  if (direction === 'after') {
                    runTask('insertRowAfter', index);
                  }
                  if (direction === 'before') {
                    runTask('insertRowBefore', index);
                  }
                }}
              />
              <ColSideDiv
                onDeleteColumn={(index) => {
                  runTask('removeCol', index);
                }}
                onAlignChange={(index, align) => {
                  runTask('setAligns', index, align);
                }}
                onCreateColumn={(index, direction) => {
                  if (direction === 'after') {
                    runTask('insertColAfter', index);
                  }
                  if (direction === 'before') {
                    runTask('insertColBefore', index);
                  }
                }}
                activeDeleteBtn={activeDeleteBtn}
                setActiveDeleteBtn={setActiveDeleteBtn}
                tableRef={tableTargetRef}
                getTableNode={getTableNode}
                selCells={selCells}
                setSelCells={setSelCells}
              />
            </div>
            <table
              className="md-editor-table"
              style={{
                marginTop: '1em',
                borderCollapse: 'separate',
                borderSpacing: 0,
              }}
              ref={tableTargetRef}
            >
              <tbody data-slate-node="element">{props.children}</tbody>
            </table>
          </div>
        </div>
      </ConfigProvider>
    );
  }, [
    props.element.children,
    state,
    setState,
    store.dragStart,
    store.editor?.children?.length === 1,
    isSel,
    JSON.stringify(selCells),
    tableNodeEntry,
  ]);
});
