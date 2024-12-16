import { Popover, Typography } from 'antd';
import classNames from 'classnames';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Editor, Node, NodeEntry, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import stringWidth from 'string-width';
import { TableCellNode, TableNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { TableAttr } from '../tools/TableAttr';
import ResizeMask from './ResizeMask';

const SEL_CELLS: WeakMap<Editor, NodeEntry[]> = new WeakMap();
const RESIZING_ROW: WeakMap<Editor, NodeEntry> = new WeakMap();
const RESIZING_ROW_ORIGIN_HEIGHT: WeakMap<Editor, number> = new WeakMap();
const RESIZING_ROW_MIN_HEIGHT: WeakMap<Editor, number> = new WeakMap();

const RESIZING_COL: WeakMap<Editor, NodeEntry> = new WeakMap();
const RESIZING_COL_ORIGIN_WIDTH: WeakMap<Editor, number> = new WeakMap();
const RESIZING_COL_MIN_WIDTH: WeakMap<Editor, number> = new WeakMap();

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
  const context = useCallback((e: React.MouseEvent, head?: boolean) => {
    store.openTableMenus(e, head);
  }, []);

  return React.useMemo(() => {
    const minWidth = Math.min(
      stringWidth(Node.string(props.element)) * 8 + 20,
      200,
    );
    const text = Node.string(props.element);
    return props.element.title ? (
      <th
        {...props.attributes}
        style={{ textAlign: props.element.align }}
        data-be={'th'}
        onContextMenu={(e) => context(e, true)}
      >
        <div
          style={{
            minWidth: minWidth,
            textWrap: 'wrap',
            maxWidth: '200px',
          }}
        >
          {props.children}
        </div>
      </th>
    ) : (
      <td
        {...props.attributes}
        style={{ textAlign: props.element.align }}
        data-be={'td'}
        className={classNames('group')}
        onContextMenu={(e) => {
          context(e);
        }}
      >
        {readonly ? (
          <Popover
            title={
              <div
                style={{
                  maxWidth: 400,
                  maxHeight: 400,
                  fontWeight: 400,
                  fontSize: 14,
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
  const { store } = useEditorStore();

  const [tableAttrVisible, setTableAttrVisible] = useState(false);
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
  const [selected, path] = useSelStatus(props.element);
  const tableRef = React.useRef<NodeEntry<TableNode>>();
  const overflowShadowContainerRef = React.useRef<HTMLTableElement>(null);
  const tableCellRef = useRef<NodeEntry<TableCellNode>>();

  useEffect(() => {
    if (store.floatBarOpen) {
      setTableAttrVisible(false);
    }
  }, [store.floatBarOpen]);

  const isSel = useMemo(() => {
    if (selected) return true;
    if (!store.selectTablePath.length) return false;
    return store.selectTablePath.join('') === path.join('');
  }, [store.editor, selected, store.selectTablePath, props.element]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tableRef.current) return;
      if (tableAttrVisible && tableRef.current) {
        if (!store.editor.hasPath(tableRef.current[1])) return;
        try {
          const dom = ReactEditor.toDOMNode(
            store.editor,
            Node.get(store.editor, tableRef.current[1]),
          ) as HTMLElement;
          if (dom && !dom.contains(event.target as Node)) {
            setTableAttrVisible(false);
          }
        } catch (error) {}
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tableAttrVisible, tableRef, store.editor]);

  const resize = useCallback(() => {
    const table = tableRef.current;
    if (!table) return;
    setTimeout(() => {
      try {
        const dom = ReactEditor.toDOMNode(
          store.editor,
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
    }, 16);
  }, [setState, store.editor]);

  const handleClickTable = useCallback(() => {
    if (store.floatBarOpen) return;
    const el = store.tableCellNode;
    if (el) {
      tableCellRef.current = el;
      try {
        const dom = ReactEditor.toDOMNode(store.editor, el[0]) as HTMLElement;
        const overflowShadowContainer = overflowShadowContainerRef.current!;
        const tableTop = overflowShadowContainer.offsetTop;
        let left = dom.getBoundingClientRect().left;
        setState((prev) => ({
          ...prev,
          top: tableTop - 48 + 3,
          left,
        }));
        setTableAttrVisible(true);
      } catch (error) {
        console.log(error);
      }
      setState((prev) => ({
        ...prev,
        align: el[0].align,
      }));
      const table = Editor.node(store.editor, Path.parent(Path.parent(el[1])));
      if (table && table[0] !== tableRef.current?.[0]) {
        tableRef.current = table;
        resize();
      }
    }
  }, [store.tableCellNode, store.editor, setState]);
  const tableTargetRef = useRef<HTMLTableElement>(null);
  useEffect(() => {
    if (!tableTargetRef.current) {
      return;
    }
    const observerRoot = (tableTargetRef as any).current?.parentNode;
    const observerTarget = (tableTargetRef as any).current;
    const overflowShadowContainer = overflowShadowContainerRef.current!;
    overflowShadowContainer.classList.add('overflow-shadow-container');
    overflowShadowContainer.classList.add('card-table-wrap');
    const options = {
      root: observerRoot,
      threshold: 1,
    };

    new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio !== 1) {
        overflowShadowContainer.classList.add(
          'is-overflowing',
          'is-scrolled-left',
        );
      } else {
        overflowShadowContainer.classList.remove('is-overflowing');
      }
    }, options).observe(observerTarget);

    let handleScrollX = (e: any) => {
      if (e.target.scrollLeft < 1) {
        overflowShadowContainer.classList.add('is-scrolled-left');
      } else {
        overflowShadowContainer.classList.remove('is-scrolled-left');
      }
      if (
        Math.abs(
          e.target.scrollLeft +
            e.target.offsetWidth -
            observerTarget.offsetWidth,
        ) <= 1
      ) {
        overflowShadowContainer.classList.add('is-scrolled-right');
      } else {
        overflowShadowContainer.classList.remove('is-scrolled-right');
      }
    };

    observerRoot.addEventListener('scroll', handleScrollX);

    return () => {
      observerRoot.removeEventListener('scroll', handleScrollX);
    };
  }, []);

  /////////////////////////////
  const colCount = props.element?.children[0]?.children?.length || 0;
  const initialColArr = Array(colCount).fill('60px');
  const [colArr, setColArr] = useState<string[]>(initialColArr);

  const [isDragging, setIsDragging] = useState(false);
  const [startKey, setStartKey] = useState('');
  const [tableResizeMaskRect, setTableResizeMaskRect] = useState({
    height: 0,
    width: 0,
    top: 0,
    left: 0,
  });

  const [tableRect, setTableRect] = useState({
    height: 0,
    width: 0,
    top: 0,
    left: 0,
  });
  const [maskRectSide, setMaskRectSide] = useState<
    'top' | 'right' | 'bottom' | 'left' | null
  >(null);
  const [curCell, setCurCell] = useState(null);
  const [startPositionX, setStartPositionX] = useState<number | null>(null);
  const [startPositionY, setStartPositionY] = useState<number | null>(null);
  const [differenceX, setDifferenceX] = useState<number | null>(null);
  const [differenceY, setDifferenceY] = useState<number | null>(null);

  const [rowMovingLine, setRowMovingLine] = useState<{ top: number | null }>({
    top: 0,
  });

  const [colMovingLine, setColMovingLine] = useState({
    left: 0,
  });
  const handleTableCellsMouseMove = useCallback(
    (e) => {
      if (store.readonly || !store.editor) return;

      const cell = (e.target as HTMLBaseElement).closest('td');

      if (cell) {
        const tdSlateNode = ReactEditor.toSlateNode(store.editor, cell);
        const tdClientBounding = cell.getBoundingClientRect();
        const tbodyDom = (e.target as HTMLBaseElement).closest('tbody');
        if (tbodyDom && tdSlateNode && tdClientBounding) {
          const tbodyClientBounding = tbodyDom.getBoundingClientRect();
          const maskLeft =
            (tdClientBounding.left || 0) - tbodyClientBounding.left;
          const maskTop = (tdClientBounding.top || 0) - tbodyClientBounding.top;
          setCurCell(tdSlateNode);
          if (
            tableResizeMaskRect.height !== tdClientBounding.height ||
            tableResizeMaskRect.width !== tdClientBounding.width ||
            tableResizeMaskRect.left !== maskLeft ||
            tableResizeMaskRect.top !== maskTop
          ) {
            setTableResizeMaskRect({
              height: tdClientBounding.height || 0,
              width: tdClientBounding.width || 0,
              left: maskLeft,
              top: maskTop,
            });
          }
          if (
            tableRect.height !== tbodyClientBounding.height ||
            tableRect.width !== tbodyClientBounding.width ||
            tableRect.left !== tbodyClientBounding.left ||
            tableRect.top !== tbodyClientBounding.top
          ) {
            setTableRect({
              height: tbodyClientBounding.height || 0,
              width: tbodyClientBounding.width || 0,
              left: tbodyClientBounding.left || 0,
              top: tbodyClientBounding.top || 0,
            });
          }
        }
      }
    },
    [startKey, store.editor?.selection, (tableRef as any).current],
  );

  function getParentPathByType(
    editor: Editor,
    path: Path,
    type: string,
  ): Path | null {
    if (!path) return null;
    const len = path.length;
    for (let i = len - 1; i >= 0; i--) {
      const node: any =
        Node.has(editor, path.slice(0, i)) &&
        Node.get(editor, path.slice(0, i));
      if (node && node.type === type) {
        return path.slice(0, i);
      }
    }
    return null;
  }

  const handleMovingLineMouseMove = useCallback(
    (e) => {
      const editorDom = ReactEditor.toDOMNode(store.editor, store.editor);
      editorDom.setPointerCapture(e.pointerId);

      if (!curCell) return;

      if (startPositionY !== null && isDragging) {
        const resizingRowEntry: any = RESIZING_ROW.get(store.editor);
        const minHeight = RESIZING_ROW_MIN_HEIGHT.get(store.editor) ?? 0;
        const originHeight = RESIZING_ROW_ORIGIN_HEIGHT.get(store.editor) ?? 0;
        const diffY = e.pageY - startPositionY;
        const calculatedHeight = Math.floor(originHeight + diffY);
        let isMinValue = false;

        if (minHeight - originHeight >= diffY) {
          isMinValue = true;
        }

        if (isMinValue) {
          setDifferenceY(minHeight - originHeight);
        } else {
          setDifferenceY(diffY);
        }

        console.log(
          '[resizingRowEntry 1 ]',
          curCell,
          minHeight,
          resizingRowEntry,
        );

        document.body.style.cursor = 'row-resize';

        const trDOM = ReactEditor.toDOMNode(store.editor, resizingRowEntry[0]);
        let dataHeight = minHeight + 'px';

        switch (maskRectSide) {
          case 'top':
            if (minHeight && isMinValue) {
            } else {
              dataHeight = calculatedHeight + 'px';
            }
            trDOM.style.height = dataHeight;
            trDOM.setAttribute('data-height', dataHeight);

            break;
          case 'bottom':
            if (minHeight && isMinValue) {
            } else {
              dataHeight = calculatedHeight + 'px';
            }
            trDOM.style.height = dataHeight;
            trDOM.setAttribute('data-height', dataHeight);
            break;
          default:
            break;
        }
        console.log('differenceY]', startPositionY, differenceY);
        return;
      }

      if (startPositionX !== null && isDragging) {
        const minWidth = RESIZING_COL_MIN_WIDTH.get(store.editor) ?? 0;
        const tdEntry = RESIZING_COL.get(store.editor);
        console.log('[tdEntry]', tdEntry);
        const tablePath =
          tdEntry &&
          tdEntry[1] &&
          getParentPathByType(store.editor, tdEntry[1], 'table');
        if (!tablePath) return;
        const tableNode = Editor.node(store.editor, tablePath);
        const tableDOM = ReactEditor.toDOMNode(store.editor, tableNode[0]);
        console.log('[col 1 ]', tdEntry);

        const colNumber = tdEntry && tdEntry[1] && tdEntry[1][3];
        const originWidth = RESIZING_COL_ORIGIN_WIDTH.get(store.editor) ?? 0;
        const diffX = e.pageX - startPositionX;
        const calculatedWidth = Math.floor(originWidth + diffX);
        let isMinValue = false;

        if (minWidth - originWidth + 3 >= diffX) {
          isMinValue = true;
        }
        if (isMinValue) {
          setDifferenceX(minWidth - originWidth);
        } else {
          setDifferenceX(diffX);
        }

        document.body.style.cursor = 'col-resize';
        switch (maskRectSide) {
          case 'right':
            setColArr((prev) => {
              const res = [...prev];
              if (isMinValue) {
                res.splice(colNumber, 1, minWidth + 'px');
              } else {
                res.splice(colNumber, 1, calculatedWidth + 'px');
              }
              tableDOM?.setAttribute('data-col-arr', JSON.stringify(res));
              return res;
            });

            console.log(`RRRRRR right`, originWidth, calculatedWidth);

            break;
          case 'left':
            setColArr((prev) => {
              const res = [...prev];
              if (isMinValue) {
                res.splice(colNumber, 1, minWidth + 'px');
              } else {
                res.splice(colNumber, 1, calculatedWidth + 'px');
              }
              tableDOM?.setAttribute('data-col-arr', JSON.stringify(res));
              return res;
            });
            console.log(`LLLLLL left`, originWidth, calculatedWidth);
            break;
          default:
            break;
        }
        console.log('differenceX]', startPositionX, differenceX);
        return;
      }
    },
    [startPositionY, startPositionX, isDragging, curCell, maskRectSide],
  );

  const handleMovingLineMouseUp = useCallback(
    (e) => {
      const editorDom = ReactEditor.toDOMNode(store.editor, store.editor);
      editorDom.releasePointerCapture(e.pointerId);
      if (startPositionY !== null && isDragging) {
        setStartPositionY(null);
        setDifferenceY(null);
        setRowMovingLine({ top: null });
        setIsDragging(false);
        document.body.style.cursor = 'default';

        const resizingRowEntry: any = RESIZING_ROW.get(store.editor);

        const trDOM =
          resizingRowEntry &&
          resizingRowEntry[0] &&
          ReactEditor.toDOMNode(store.editor, resizingRowEntry[0]);
        if (!trDOM) {
          return;
        }
        const dataHeight = trDOM.getAttribute('data-height');
        Transforms.setNodes(store.editor, { height: dataHeight } as any, {
          at: resizingRowEntry[1],
        });

        editorDom.removeEventListener('pointermove', handleMovingLineMouseMove);
        editorDom.removeEventListener('pointerup', handleMovingLineMouseUp);
        console.log('[handleMovingLineMouseUp]', editorDom);
      }

      if (startPositionX !== null && isDragging) {
        setStartPositionX(null);
        setDifferenceX(null);
        setColMovingLine({ left: -9999 });
        setIsDragging(false);
        document.body.style.cursor = 'default';

        const tdEntry = RESIZING_COL.get(store.editor);
        const tablePath =
          tdEntry &&
          tdEntry[1] &&
          getParentPathByType(store.editor, tdEntry[1], 'table');

        if (!tablePath) return;
        const tableNode = Editor.node(store.editor, tablePath);
        const tableDOM = ReactEditor.toDOMNode(store.editor, tableNode[0]);
        const dataColArr: string = tableDOM.getAttribute('data-col-arr') ?? '';

        if (dataColArr) {
          const howWideEach = new Array(props.element.hwEach?.length || 1).fill(
            JSON.parse(dataColArr),
          );
          Transforms.setNodes(
            store.editor,
            { hwEach: howWideEach } as Partial<Node>,
            { at: tablePath },
          );
        }

        editorDom.removeEventListener('pointermove', handleMovingLineMouseMove);
        editorDom.removeEventListener('pointerup', handleMovingLineMouseUp);
      }
    },
    [startPositionY, startPositionX, isDragging],
  );
  const handleResetStartKey = useCallback(() => {
    setStartKey('');
    setCurCell(null);
  }, []);

  useEffect(() => {
    const editorDom = ReactEditor.toDOMNode(store.editor, store.editor);
    if (isDragging) {
      editorDom.addEventListener('pointermove', handleMovingLineMouseMove);
      editorDom.addEventListener('pointerup', handleMovingLineMouseUp);
    }
    editorDom.addEventListener('pointerup', handleResetStartKey);

    return () => {
      editorDom.removeEventListener('pointermove', handleMovingLineMouseMove);
      editorDom.removeEventListener('pointerup', handleMovingLineMouseUp);
      editorDom.removeEventListener('pointerup', handleResetStartKey);
    };
  }, [isDragging]);

  useEffect(() => {
    const tbodyDom = (tableTargetRef as any).current?.childNodes?.[1];
    if (tbodyDom) {
      const tbodyClientBounding = tbodyDom.getBoundingClientRect();
      if (
        tableRect.height !== tbodyClientBounding.height ||
        tableRect.width !== tbodyClientBounding.width ||
        tableRect.left !== tbodyClientBounding.left ||
        tableRect.top !== tbodyClientBounding.top
      ) {
        setTableRect({
          height: tbodyClientBounding.height || 0,
          width: tbodyClientBounding.width || 0,
          left: tbodyClientBounding.left || 0,
          top: tbodyClientBounding.top || 0,
        });
      }
    }
  }, [differenceX, differenceY]);

  // useEffect(() => {
  //   console.log('table element state', props.element);
  //   if ((tableRef as any).current) {
  //     const newColArr = props.element.hwEach[0];
  //     console.log(
  //       'newColArr 1',
  //       newColArr,
  //       props.element.column,
  //       props.element.hwEach?.[0]?.length,
  //       props.element,
  //     );
  //     setColArr(newColArr);
  //   }
  // }, [props.element]);

  return useMemo(() => {
    return (
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
          marginBottom: 12,
        }}
        onMouseMove={handleTableCellsMouseMove}
      >
        <div
          className={
            'ant-md-editor-drag-el ant-md-editor-table ant-md-editor-content-table'
          }
          style={{
            maxWidth: '100%',
            width: '100%',
            border: '1px solid #e8e8e8',
            borderRadius: 16,
            display: 'flex',
            minWidth: 0,
            boxShadow:
              isSel && store?.editorProps?.reportMode
                ? '0 0 0 1px #1890ff'
                : 'none',
          }}
        >
          {tableAttrVisible && (
            <TableAttr
              state={state}
              setState={setState}
              tableRef={tableRef}
              tableCellRef={tableCellRef}
            />
          )}
          <DragHandle />
          <div
            onMouseUp={handleClickTable}
            onClick={() => {
              runInAction(() => {
                if (isSel) {
                  store.selectTablePath = [];
                  return;
                }
                store.selectTablePath = path;
              });
            }}
            style={{
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
              flex: 1,
              minWidth: 0,
            }}
          >
            <table
              style={{
                borderCollapse: 'collapse',
                borderSpacing: 0,
              }}
              ref={tableTargetRef}
            >
              <colgroup style={{ userSelect: 'none' }} contentEditable={false}>
                {colArr.map((colWidth: string, index) => (
                  <col
                    key={index}
                    width={Number.parseInt(colWidth) || '40px'}
                  ></col>
                ))}
              </colgroup>
              <tbody
                {...props.attributes}
                style={{ userSelect: 'auto' }}
                contentEditable={false}
                onDrag={(e) => {
                  e.preventDefault();
                }}
                onMouseDown={() => {}}
              >
                {props.children}
              </tbody>
            </table>
          </div>
        </div>
        <ResizeMask
          SEL_CELLS={SEL_CELLS}
          RESIZING_ROW={RESIZING_ROW}
          RESIZING_ROW_ORIGIN_HEIGHT={RESIZING_ROW_ORIGIN_HEIGHT}
          RESIZING_ROW_MIN_HEIGHT={RESIZING_ROW_MIN_HEIGHT}
          RESIZING_COL={RESIZING_COL}
          RESIZING_COL_ORIGIN_WIDTH={RESIZING_COL_ORIGIN_WIDTH}
          RESIZING_COL_MIN_WIDTH={RESIZING_COL_MIN_WIDTH}
          store={store}
          tableRect={tableRect}
          curCell={curCell}
          setMaskRectSide={setMaskRectSide}
          tableResizeMaskRect={tableResizeMaskRect}
          setStartPositionX={setStartPositionX}
          setStartPositionY={setStartPositionY}
          differenceX={differenceX}
          differenceY={differenceY}
          setRowMovingLine={setRowMovingLine}
          setColMovingLine={setColMovingLine}
          rowMovingLine={rowMovingLine}
          colMovingLine={colMovingLine}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          startKey={startKey}
        />
      </div>
    );
  }, [
    props.element.children,
    state,
    setState,
    store.dragStart,
    store.editor?.children?.length === 1,
    handleClickTable,
    tableAttrVisible,
    isSel,
  ]);
});
