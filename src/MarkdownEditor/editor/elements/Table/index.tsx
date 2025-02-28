import { ConfigProvider } from 'antd';
import classNames from 'classnames';
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
import Spreadsheet from 'react-spreadsheet';
import { Editor, NodeEntry } from 'slate';
import { TableCellNode, TableNode } from '../../../el';
import { useSelStatus } from '../../../hooks/editor';
import { ReactEditor, RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { useTableStyle } from './style';
import './table.css';
import ToolbarOverlay from './ToolbarOverlay';
export * from './TableCell';

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

  const tableNodeEntry = useMemo(() => {
    if (!Editor) return;
    if (!tablePath || tablePath?.length === 0) return;
    if (!markdownEditorRef.current) return;
    if (!markdownEditorRef.current.children) return;
    if (markdownEditorRef.current.children?.length === 0) return;
    if (!tablePath) return;
    if (!markdownEditorRef?.current?.hasPath?.(tablePath)) return;
    return Editor.node(markdownEditorRef.current, tablePath);
  }, [tablePath]);

  const [selCells, setSelCells] = useState<NodeEntry<TableCellNode>[]>([]);

  const tableTargetRef = useRef<HTMLTableElement>(null);

  const clearSelection = useCallback(() => {
    tableTargetRef.current
      ?.querySelectorAll('td.selected-cell-td')
      .forEach((td) => {
        td.classList.remove('selected-cell-td');
      });
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
      selectionAreaRef.current?.style?.setProperty('display', 'none');
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
    if (!store.editor) return;
    if (readonly) return;
    const cachedSelCells = store.CACHED_SEL_CELLS?.get(store.editor);
    cachedSelCells?.forEach((cell) => {
      const [cellNode] = cell;
      try {
        const cellDom = ReactEditor.toDOMNode(store.editor, cellNode);
        if (cellDom) {
          cellDom.classList.remove('bar-selected-cell-td');
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
          console.log(cellDom);
          cellDom.classList.add('bar-selected-cell-td');
        }
      } catch (error) {
        console.log(error, cellNode);
      }
    });
    store.CACHED_SEL_CELLS.set(store.editor, selCells);
  }, [JSON.stringify(selCells)]);

  const extractTableData = (input: any[]): any[][] => {
    return input.map((row) => {
      const element = row?.props?.children?.props?.element;

      const columns = Array.isArray(element)
        ? element
        : Array.isArray(element?.children)
          ? element.children
          : [];

      return columns.map((column: { children: { text: string }[] }) => {
        const content = column?.children?.[0]?.text || '';
        return { value: content };
      });
    });
  };

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState(extractTableData(props.children));

  const [overlayPos, setOverlayPos] = useState({
    left: -999999999,
    top: -999999999,
  });

  const [isColumn, setIsColumn] = useState(false);

  const [opIndex, setOpIndex] = useState(0);

  const handleSelect = (selected: any) => {
    try {
      const table = tableContainerRef.current?.querySelector(
        '.Spreadsheet__table',
      );
      if (!table) return;

      if (selected.constructor.name === 'EmptySelection') {
        return;
      }
      let targetElement = null;
      let isColumn = false;

      const COLUMN_OFFSET = { x: -18, y: -36 };
      const ROW_OFFSET = { x: 24, y: -36 };

      if (selected.constructor.name === 'EntireColumnsSelection') {
        isColumn = true;
        const headerRow = table.children[1]?.children[0];
        if (!headerRow) return;
        setOpIndex(selected.start);
        const colIndex = selected.start + 1;
        targetElement = headerRow.children[colIndex];
      } else if (selected.constructor.name === 'EntireRowsSelection') {
        isColumn = false;
        const bodySection = table.children[1];
        if (!bodySection) return;
        setOpIndex(selected.start);
        const rowIndex = selected.start + 1;
        const row = bodySection.children[rowIndex];
        targetElement = row?.children[0];
      } else {
        setOverlayPos({ left: -999999999, top: -999999999 });
        return;
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();

        const offset = isColumn ? COLUMN_OFFSET : ROW_OFFSET;

        setOverlayPos({
          left: rect.left + offset.x,
          top: rect.top + offset.y,
        });

        setIsColumn(isColumn);
      }
    } catch (error) {
      console.error('Error calculating overlay position:', error);
      setOverlayPos({ left: -999999999, top: -999999999 });
    }
  };
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
              overflowShadowContainerRef?.current?.parentElement ||
              document.body
            }
          >
            <div
              {...props.attributes}
              data-be={'table'}
              draggable={false}
              ref={(el) => {
                //@ts-ignore
                overflowShadowContainerRef.current = el;
                props.attributes.ref(el);
              }}
              className={classNames(`${baseCls}-container`, hashId)}
              onClick={handleClickTable}
              tabIndex={0}
              style={{
                overflow: readonly ? 'hidden' : undefined,
              }}
            >
              {!readonly ? (
                <div ref={tableContainerRef} contentEditable={false}>
                  <Spreadsheet
                    data={data}
                    onSelect={handleSelect}
                    onChange={(data) => {
                      setData(data);
                    }}
                  />
                  <ToolbarOverlay
                    overlayPos={overlayPos}
                    isColumn={isColumn}
                    opIndex={opIndex}
                    setData={setData}
                    setOverlayPos={setOverlayPos}
                  />
                </div>
              ) : (
                <>
                  <div
                    className={classNames(baseCls, hashId, {
                      [`${baseCls}-selected`]: isSel,
                      [`${baseCls}-show-bar`]: isShowBar,
                      [`${baseCls}-excel-mode`]:
                        editorProps.tableConfig?.excelMode,
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
                    <table
                      ref={tableTargetRef}
                      className={classNames(`${baseCls}-editor-table`, hashId)}
                    >
                      <tbody data-slate-node="element">{props.children}</tbody>
                    </table>
                  </div>
                </>
              )}
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
      overlayPos,
      data,
    ],
  );
});
