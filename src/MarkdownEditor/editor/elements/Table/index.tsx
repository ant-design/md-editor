import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { kdTree } from 'kd-tree-javascript';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Editor, NodeEntry, Path, Transforms } from 'slate';
import { TableCellNode, TableNode } from '../../../el';
import { useSelStatus } from '../../../hooks/editor';
import { ReactEditor, RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { DragHandle } from '../../tools/DragHandle';
import { EditorUtils } from '../../utils';
import { ColSideDiv, IntersectionPointDiv, RowSideDiv } from './renderSideDiv';
import { useTableStyle } from './style';
import './table.css';
export * from './TableCell';

const _distance = (
  a: {
    x: number;
    y: number;
    x2: number;
    y2: number;
  },
  b: {
    x: number;
    y: number;
    x2: number;
    y2: number;
  },
) =>
  Math.sqrt(
    Object.keys(a).reduce(
      (acc, key) => acc + (a[key as 'x'] - b[key as 'x']) ** 2,
      0,
    ),
  );

function isIntersect(
  rectA: { x2: number; x: number; y2: number; y: number },
  rectB: { x: number; x2: number; y: number; y2: number },
) {
  // X 轴投影无重叠
  if (rectA.x2 <= rectB.x || rectA.x >= rectB.x2) return false;

  // Y 轴投影无重叠
  if (rectA.y2 <= rectB.y || rectA.y >= rectB.y2) return false;

  return true;
}

/**
 * 表格上下文组件，用于在表格组件树中共享单元格选中状态
 * @context
 * @property {NodeEntry<TableCellNode> | null} selectedCell - 当前选中的表格单元格
 * @property {(cell: NodeEntry<TableCellNode> | null) => void} setSelectedCell - 设置当前选中的表格单元格
 */
export const TableConnext = React.createContext<{
  selectedCell: NodeEntry<TableCellNode> | null;
  setSelectedCell: (cell: NodeEntry<TableCellNode> | null) => void;
}>({
  selectedCell: null,
  setSelectedCell: () => {},
});

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
  const [selectedCell, setSelectedCell] =
    useState<NodeEntry<TableCellNode> | null>(null);
  const { store, markdownEditorRef, editorProps, readonly } = useEditorStore();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const baseCls = getPrefixCls('md-editor-content-table');

  const { wrapSSR, hashId } = useTableStyle(baseCls, {});

  const [isShowBar, setIsShowBar] = useState(
    editorProps.tableConfig?.excelMode || false,
  );

  const selectionAreaRef = useRef<HTMLDivElement>(null);

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

  const [selCells, setSelCells] = useState<NodeEntry<TableCellNode>[]>([]);

  const tableTargetRef = useRef<HTMLTableElement>(null);

  const clearSelection = useCallback(() => {
    selectionAreaRef.current?.style?.setProperty('display', 'none');
    tableTargetRef.current
      ?.querySelectorAll('td.selected-cell-td')
      .forEach((td) => {
        td.classList.remove('selected-cell-td');
      });
    Transforms.setNodes(
      markdownEditorRef.current,
      {
        selected: false,
      },
      {
        match: (n) => n.type === 'table-cell' && n.selected === true,
        at: tablePath,
      },
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tableRef.current) return;

      const isInsideScrollbar = () => {
        if (!overflowShadowContainerRef.current) return false;
        return overflowShadowContainerRef.current.contains(
          event.target as Node,
        );
      };

      if (isInsideScrollbar()) {
        return;
      }
      setSelCells([]);
      clearSelection();
      // excel 模式下不隐藏, 用于处理表格内部的操作
      if (!editorProps.tableConfig?.excelMode) {
        setIsShowBar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tableRef, store.editor, isShowBar]);

  const setAligns = useCallback(
    (index: number, type: 'left' | 'center' | 'right') => {
      const cell = tableCellRef.current!;
      const table = tableNodeEntry!;
      if (cell) {
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
          setAligns(index, rest?.at(0));
          break;
      }
      ReactEditor.focus(markdownEditorRef.current);
    },
    [],
  );

  /**
   * 判断当前表格是否被选中。
   */
  const isSel = useMemo(() => {
    if (selectedTable) return true;
    if (!store.selectTablePath?.length) return false;
    return store.selectTablePath.join('') === tablePath.join('');
  }, [store.editor, selectedTable, store.selectTablePath, props.element]);

  const handleClickTable = useCallback(
    (e: any) => {
      if (editorProps.tableConfig?.excelMode) {
      }
      e.preventDefault();
      e.stopPropagation();
      const el = store.tableCellNode;
      if (el) {
        tableCellRef.current = el;
      }
      if (readonly) return;
      setIsShowBar(true);
    },
    [store.tableCellNode, store.editor, isShowBar],
  );

  useEffect(() => {
    if (!props.element) return;
    tableRef.current = tableNodeEntry;
  }, [tableNodeEntry]);

  useEffect(() => {
    if (!isShowBar) {
      setActiveDeleteBtn((prev) => prev + ' ');
    }
  }, [isShowBar]);

  useEffect(() => {
    if (!editorProps.tableConfig?.excelMode) return;
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

  useEffect(() => {
    if (readonly) return;
    const table = overflowShadowContainerRef.current;
    const tdRectMap = new Map<string, Path>();
    const pathToDomMap = new Map<string, HTMLElement>();
    const tableRect =
      overflowShadowContainerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };

    const tds = Array.from(table?.getElementsByTagName('td') || []);
    const points = tds.map((td) => {
      const tdRect = td.getBoundingClientRect();
      const TdNode = ReactEditor.toSlateNode(markdownEditorRef.current, td);
      const path = ReactEditor.findPath(markdownEditorRef.current, TdNode);
      let left = tdRect.left - tableRect?.left;
      let top = tdRect.top - tableRect?.top;
      const key = [left, top, left + tdRect.width, top + tdRect.height].join(
        ',',
      );
      tdRectMap.set(key, path);
      pathToDomMap.set(key, td);
      return {
        x: left,
        y: top,
        x2: left + tdRect.width,
        y2: top + tdRect.height,
      };
    });
    const cellDimensionsKdTree = new kdTree<{
      x: number;
      y: number;
      x2: number;
      y2: number;
    }>(points, _distance, ['x', 'y', 'x2', 'y2']);

    if (!table) return;
    // 更新选区矩形并检测碰撞
    function updateSelectionRect(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) {
      const rect = {
        x: Math.min(x1, x2) - 4,
        y: Math.min(y1, y2) - 4,
        x2: Math.max(x1, x2) - 4,
        y2: Math.max(y1, y2) - 4,
      };

      const nodes = cellDimensionsKdTree.nearest(
        {
          x: Math.min(x1, x2) - 4,
          y: Math.min(y1, y2) - 4,
          x2: Math.max(x1, x2) - 4,
          y2: Math.max(y1, y2) - 4,
        },
        80,
      );

      const selectRect = {
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        x2: Math.max(x1, x2),
        y2: Math.max(y1, y2),
      };
      const pathList = nodes
        .filter((node) => {
          const tdRect = node[0];

          const isCollided = isIntersect(tdRect, rect);
          if (isCollided) {
            selectRect.x = Math.max(
              selectRect.x,
              tdRect.x,
              selectRect.x2,
              tdRect.x2,
            );
            selectRect.y = Math.max(
              selectRect.y,
              tdRect.y,
              selectRect.y2,
              tdRect.y2,
            );
            selectRect.x2 = Math.min(
              selectRect.x,
              tdRect.x,
              selectRect.x2,
              tdRect.x2,
            );
            selectRect.y2 = Math.min(
              selectRect.y,
              tdRect.y,
              selectRect.y2,
              tdRect.y2,
            );
            return true;
          }
          return false;
        })
        ?.map((node) => {
          const mapKey = [node[0].x, node[0].y, node[0].x2, node[0].y2].join(
            ',',
          );
          const path = tdRectMap.get(mapKey);
          const dom = pathToDomMap.get(mapKey);
          dom?.classList.add('selected-cell-td');
          return path;
        });

      setTimeout(() => {
        if (selectionAreaRef.current) {
          selectionAreaRef.current.style.transition = 'all 0.3s';
          selectionAreaRef.current.style.transform = `translate(${Math.min(selectRect.x, selectRect.x2)}px, ${Math.min(selectRect.y, selectRect.y2)}px)`;
          selectionAreaRef.current?.style.setProperty(
            'width',
            Math.abs(selectRect.x - selectRect.x2) + 'px',
          );
          selectionAreaRef.current?.style.setProperty(
            'height',
            Math.abs(selectRect.y - selectRect.y2) + 'px',
          );
          selectionAreaRef.current.style.display = 'block';
          setTimeout(() => {
            if (selectionAreaRef.current) {
              selectionAreaRef.current.style.transition = 'none';
            }
          }, 400);
        }
      }, 160);

      if (pathList.length === 0) {
        setSelCells([]);
        return;
      }
      setTimeout(() => {
        Transforms.setNodes(
          markdownEditorRef.current,
          {
            selected: true,
          },
          {
            match(node, path) {
              return pathList.some((p) => p && Path.equals(p, path));
            },
            at: tablePath,
          },
        );
      }, 600);
    }
    // 获取表格元素
    let isDragging = false;
    let startX: number, startY: number, endX: number, endY: number;
    // 鼠标按下事件
    table.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement;
      if (selectionAreaRef.current) {
        selectionAreaRef.current.style.display = 'none';
      }
      clearSelection();
      if (!tableTargetRef.current?.contains(target)) {
        isDragging = false;
        startX = startY = endX = endY = 0;

        return;
      }
      isDragging = true;
      startX =
        e.clientX +
        (overflowShadowContainerRef?.current?.scrollLeft || 0) -
        (overflowShadowContainerRef.current?.getBoundingClientRect().left || 0);
      startY =
        e.clientY +
        (overflowShadowContainerRef?.current?.scrollTop || 0) -
        (overflowShadowContainerRef.current?.getBoundingClientRect().top || 0);
    });

    // 鼠标移动事件
    table.addEventListener('mousemove', (e) => {
      const target = e.target as HTMLElement;

      if (!tableTargetRef.current?.contains(target)) {
        isDragging = false;
        startX = startY = endX = endY = 0;
        return;
      }

      if (!isDragging) return;
      endX =
        e.clientX +
        (overflowShadowContainerRef?.current?.scrollLeft || 0) -
        (overflowShadowContainerRef.current?.getBoundingClientRect().left || 0);
      endY =
        e.clientY +
        (overflowShadowContainerRef?.current?.scrollTop || 0) -
        (overflowShadowContainerRef.current?.getBoundingClientRect().top || 0);
      // 更新选区矩形

      if (selectionAreaRef.current) {
        selectionAreaRef.current.style.display = 'block';
        selectionAreaRef.current.style.transform = `translate(${Math.min(startX, endX)}px, ${Math.min(startY, endY)}px)`;
        selectionAreaRef.current?.style.setProperty(
          'width',
          Math.abs(endX - startX) + 'px',
        );
        selectionAreaRef.current?.style.setProperty(
          'height',
          Math.abs(endY - startY) + 'px',
        );
      }
    });

    // 鼠标释放事件
    table.addEventListener('mouseup', (e) => {
      const target = e.target as HTMLElement;

      if (!tableTargetRef.current?.contains(target)) {
        isDragging = false;
        startX = startY = endX = endY = 0;
        return;
      }
      endX =
        e.clientX +
        (overflowShadowContainerRef?.current?.scrollLeft || 0) -
        (overflowShadowContainerRef.current?.getBoundingClientRect().left || 0);
      endY =
        e.clientY +
        (overflowShadowContainerRef?.current?.scrollTop || 0) -
        (overflowShadowContainerRef.current?.getBoundingClientRect().top || 0);
      isDragging = false;
      clearSelection();
      tableTargetRef.current
        ?.querySelectorAll('td.selected-cell-td')
        .forEach((td) => {
          td.classList.remove('selected-cell-td');
        });

      updateSelectionRect(startX, startY, endX, endY);
      startX = startY = endX = endY = 0;
    });
  }, []);

  return useMemo(
    () =>
      wrapSSR(
        <TableConnext.Provider
          value={{
            selectedCell,
            setSelectedCell,
          }}
        >
          <ConfigProvider
            getPopupContainer={() =>
              overflowShadowContainerRef?.current?.parentElement
                ?.parentElement || document.body
            }
          >
            <div
              {...props.attributes}
              data-be={'table'}
              onDragStart={store.dragStart}
              ref={(el) => {
                //@ts-ignore
                overflowShadowContainerRef.current = el;
                props.attributes.ref(el);
              }}
              className={classNames(`${baseCls}-container`, hashId)}
              onMouseUp={handleClickTable}
              tabIndex={0}
              onBlur={() => {
                setSelCells([]);
                if (editorProps.tableConfig?.excelMode) return;
                setIsShowBar(false);
                setSelCells([]);
              }}
              style={{
                overflow: readonly ? 'hidden' : undefined,
              }}
            >
              <div
                ref={selectionAreaRef}
                style={{
                  position: 'absolute',
                  zIndex: 999,
                  border: '3px solid #42a642',
                  pointerEvents: 'none',
                  display: 'none',
                  left: 0,
                  top: 0,
                }}
              ></div>
              <div className="ant-md-editor-drag-el">
                <DragHandle />
              </div>
              <div
                className={classNames(baseCls, hashId, {
                  [`${baseCls}-selected`]: isSel,
                  [`${baseCls}-show-bar`]: isShowBar,
                  [`${baseCls}-excel-mode`]: editorProps.tableConfig?.excelMode,
                  'show-bar': isShowBar,
                })}
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
                  marginLeft: !readonly ? 20 : 0,
                  marginTop: !readonly ? 4 : 0,
                  marginRight: !readonly ? 6 : 0,
                  overflow: !readonly ? undefined : 'auto',
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
                    getTableNode={() => {
                      return props.element;
                    }}
                    selCells={selCells}
                    setSelCells={setSelCells}
                  />
                  <RowSideDiv
                    activeDeleteBtn={activeDeleteBtn}
                    setActiveDeleteBtn={setActiveDeleteBtn}
                    tableRef={tableTargetRef}
                    getTableNode={() => {
                      return props.element;
                    }}
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
                    getTableNode={() => {
                      return props.element;
                    }}
                    selCells={selCells}
                    setSelCells={setSelCells}
                  />
                </div>
                <table
                  ref={tableTargetRef}
                  className={classNames(`${baseCls}-editor-table`, hashId)}
                >
                  <tbody data-slate-node="element">{props.children}</tbody>
                </table>
              </div>
            </div>
          </ConfigProvider>
        </TableConnext.Provider>,
      ),
    [
      props.element.children,
      store.dragStart,
      store.editor?.children?.length === 1,
      isSel,
      JSON.stringify(selCells),
      tableNodeEntry,
    ],
  );
});
