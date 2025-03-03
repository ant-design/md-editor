import { useRefFunction } from '@ant-design/pro-components';
import { HotTable } from '@handsontable/react-wrapper';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { CellChange, ChangeSource } from 'handsontable/common';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-horizon.min.css';
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
import { Editor, Node, NodeEntry, Transforms } from 'slate';
import { TableCellNode, TableNode } from '../../../el';
import { useSelStatus } from '../../../hooks/editor';
import { ReactEditor, RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { useTableStyle } from './style';
import './table.css';
export * from './TableCell';

registerLanguageDictionary(zhCN);
registerAllModules();
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

const slateTableToJSONData = (input: any[]): any[][] => {
  return input.map((row) => {
    const element = row?.props?.children?.props?.element;

    const columns = Array.isArray(element)
      ? element
      : Array.isArray(element?.children)
        ? element.children
        : [];

    return columns.map((column: { children: { text: string }[] }) => {
      return Node.string(column);
    });
  });
};

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
export const Table = observer((props: RenderElementProps<TableNode>) => {
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
  const hotRef = useRef(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableJSONData = useMemo(() => slateTableToJSONData(props.children), []);

  useEffect(() => {
    console.log(hotRef);
  }, []);

  const updateTable = useRefFunction(
    (dataList: CellChange[] | null, source: ChangeSource) => {
      dataList?.forEach((data) => {
        if (source === 'edit' && data) {
          const [row, col, old, newValue] = data;
          if (!tableNodeEntry) return;
          const path = tableNodeEntry?.[1];
          console.log(dataList);
          // 如果旧值不存在，新值不存在，且新值不等于旧值
          // 说明是新增的单元格
          if (!old && !newValue && newValue !== old) {
            if (
              Editor.hasPath(markdownEditorRef.current, [
                ...path,
                row,
                col as number,
              ])
            ) {
              Transforms.delete(markdownEditorRef.current, {
                at: [...path, row, col as number],
              });
              Transforms.insertText(markdownEditorRef.current, newValue, {
                at: [...path, row, col as number, 0],
              });
              return;
            } else if (
              Editor.hasPath(markdownEditorRef.current, [...path, row])
            ) {
              const rows = new Array(props.element.children?.length).fill(0);

              rows?.forEach((_, rowIndex) => {
                if (rowIndex === row) {
                  Transforms.insertNodes(
                    markdownEditorRef.current,
                    {
                      type: 'table-cell',
                      children: [{ text: newValue }],
                    },
                    { at: [...path, row, col as number] },
                  );
                } else if (
                  !Editor.hasPath(markdownEditorRef.current, [
                    ...path,
                    row + rowIndex,
                    col as number,
                  ])
                ) {
                  Transforms.insertNodes(
                    markdownEditorRef.current,
                    {
                      type: 'table-cell',
                      children: [{ text: '' }],
                    },
                    { at: [...path, row + rowIndex, col as number] },
                  );
                }
              });
              return;
            } else if (
              !Editor.hasPath(markdownEditorRef.current, [...path, row])
            ) {
              Transforms.insertNodes(
                markdownEditorRef.current,
                {
                  type: 'table-row',
                  children: [
                    {
                      type: 'table-cell',
                      children: [{ text: newValue }],
                    },
                  ],
                },
                { at: [...path, row] },
              );
              return;
            }
          }

          // 如果旧值不存在，新值存在，且新值不等于旧值
          // 说明是新增的单元格，但是单元格已经存在，和编辑相同
          if (!old && newValue && newValue !== old) {
            if (
              Editor.hasPath(markdownEditorRef.current, [
                ...path,
                row,
                col as number,
                0,
              ])
            ) {
              Transforms.insertText(markdownEditorRef.current, newValue, {
                at: [...path, row, col as number, 0],
              });
              return;
            } else if (
              Editor.hasPath(markdownEditorRef.current, [...path, row])
            ) {
              const rows = new Array(props.element.children?.length).fill(0);
              rows?.forEach((_, rowIndex) => {
                if (rowIndex === row) {
                  Transforms.insertNodes(
                    markdownEditorRef.current,
                    {
                      type: 'table-cell',
                      children: [{ text: newValue }],
                    },
                    { at: [...path, row, col as number] },
                  );
                } else if (
                  !Editor.hasPath(markdownEditorRef.current, [
                    ...path,
                    row + rowIndex,
                    col as number,
                  ])
                ) {
                  Transforms.insertNodes(
                    markdownEditorRef.current,
                    {
                      type: 'table-cell',
                      children: [{ text: '' }],
                    },
                    { at: [...path, row + rowIndex, col as number] },
                  );
                }
              });

              return;
            }
            if (
              !Editor.hasPath(markdownEditorRef.current, [...path, row]) &&
              Editor.hasPath(markdownEditorRef.current, [...path])
            ) {
              const cells = new Array(
                props.element.children?.at(0)?.children?.length,
              )
                .fill(0)
                .map((_, index) => {
                  if (index === col) {
                    return {
                      type: 'table-cell',
                      children: [{ text: newValue }],
                    };
                  }
                  return {
                    type: 'table-cell',
                    children: [{ text: '' }],
                  };
                });
              Transforms.insertNodes(
                markdownEditorRef.current,
                {
                  type: 'table-row',
                  children: cells,
                },
                { at: [...path, row] },
              );
              return;
            }
          }

          // 如果旧值存在，新值不存在，且新值不等于旧值
          // 说明是删除的单元格
          if (old && !newValue && newValue !== old) {
            if (
              Editor.hasPath(markdownEditorRef.current, [
                ...path,
                row,
                col as number,
                0,
              ])
            ) {
              Transforms.delete(markdownEditorRef.current, {
                at: [...path, row, col as number],
              });
              return;
            }
          }
          // 如果旧值存在，新值存在，且新值不等于旧值
          // 说明是编辑的单元格
          if (old && newValue && newValue !== old) {
            if (
              Editor.hasPath(markdownEditorRef.current, [
                ...path,
                row,
                col as number,
                0,
              ])
            ) {
              Transforms.insertText(markdownEditorRef.current, newValue, {
                at: [...path, row, col as number, 0],
              });
              return;
            }
          }
        }
      });
    },
  );
  const afterCreateCol = useRefFunction(
    (insertIndex: number, amount: number) => {
      const rows = new Array(props.element.children?.length).fill(0);
      if (insertIndex > rows.length) {
        return;
      }
      rows?.forEach((_, rowIndex) => {
        const cells = new Array(amount).fill(0);
        cells.forEach((_, index) => {
          Transforms.insertNodes(
            markdownEditorRef.current,
            {
              type: 'table-cell',
              children: [{ text: '' }],
            },
            {
              at: [...tablePath, rowIndex, insertIndex + index],
            },
          );
        });
      });
    },
  );
  const afterCreateRow = useRefFunction(
    (insertIndex: number, amount: number) => {
      const cells = new Array(props.element.children?.at(0)?.children?.length)
        .fill(0)
        .map(() => {
          return {
            type: 'table-cell',
            children: [{ text: '' }],
          };
        });
      if (insertIndex > cells.length) {
        return;
      }
      const rows = new Array(amount).fill(0);
      rows.forEach((_, rowIndex) => {
        Transforms.insertNodes(
          markdownEditorRef.current,
          {
            type: 'table-row',
            children: cells,
          },
          {
            at: [...tablePath, insertIndex + rowIndex],
          },
        );
      });
    },
  );
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
            >
              {!readonly && process.env.NODE_ENV !== 'test' ? (
                <div
                  ref={tableContainerRef}
                  contentEditable={false}
                  style={{
                    width: '100%',
                    minWidth: 0,
                  }}
                  className="ht-theme-horizon"
                >
                  <HotTable
                    ref={hotRef}
                    data={tableJSONData}
                    rowHeaders={true}
                    colHeaders={true}
                    height="auto"
                    language={zhCN.languageCode}
                    dropdownMenu={[
                      'col_left',
                      'col_right',
                      '---------',
                      'remove_col',
                    ]}
                    // ------  列宽的配置  ---------
                    autoColumnSize={{}}
                    manualColumnResize={
                      props.element?.otherProps?.colWidths || true
                    }
                    afterCreateCol={afterCreateCol}
                    afterCreateRow={afterCreateRow}
                    afterRemoveCol={(index, amount) => {
                      const rows = new Array(
                        props.element.children?.length,
                      ).fill(0);
                      rows?.forEach((_, rowIndex) => {
                        const cells = new Array(amount).fill(0);
                        cells.forEach((_, colIndex) => {
                          Transforms.delete(markdownEditorRef.current, {
                            at: [...tablePath, rowIndex, index + colIndex],
                          });
                        });
                      });
                    }}
                    afterRemoveRow={(index, amount) => {
                      const rows = new Array(amount).fill(0);
                      rows.forEach((_, rowIndex) => {
                        Transforms.delete(markdownEditorRef.current, {
                          at: [...tablePath, index + rowIndex],
                        });
                      });
                    }}
                    afterColumnResize={(size, colIndex) => {
                      const colWidths =
                        props.element?.otherProps?.colWidths || [];
                      colWidths[colIndex] = size;
                      Transforms?.setNodes(
                        markdownEditorRef.current,
                        {
                          otherProps: {
                            ...props.element.otherProps,
                            colWidths,
                          },
                        },
                        {
                          at: tablePath,
                        },
                      );
                    }}
                    // ------  列宽的配置 end  ---------
                    // 与内容同步，用于处理表格内容的变化
                    afterChange={updateTable}
                    //------- merge 合并单元格的处理 -------
                    mergeCells={props.element?.otherProps?.mergeCells || true}
                    afterMergeCells={(cellRange, mergeParent) => {
                      const mergeCells =
                        props.element?.otherProps?.mergeCells || [];
                      mergeCells.push(mergeParent as any);
                      Transforms?.setNodes(
                        markdownEditorRef.current,
                        {
                          otherProps: {
                            ...props.element.otherProps,
                            mergeCells,
                          },
                        },
                        {
                          at: tablePath,
                        },
                      );
                    }}
                    afterUnmergeCells={(cellRange) => {
                      const row = cellRange?.from?.row;
                      const rol = cellRange?.from?.col;
                      const mergeCells =
                        props.element?.otherProps?.mergeCells || [];
                      Transforms?.setNodes(
                        markdownEditorRef.current,
                        {
                          otherProps: {
                            ...props.element.otherProps,
                            mergeCells:
                              mergeCells?.filter((cell) => {
                                return cell.col !== rol || cell.row !== row;
                              }) || [],
                          },
                        },
                        {
                          at: tablePath,
                        },
                      );
                    }}
                    // ----- merge 合并单元格的处理 end --------
                    contextMenu={[
                      'row_above',
                      'row_below',
                      '---------',
                      'undo',
                      'redo',
                      '---------',
                      'mergeCells',
                    ]}
                    autoWrapRow={true}
                    autoWrapCol={true}
                    minRows={editorProps?.tableConfig?.minRows || 3}
                    minCols={editorProps?.tableConfig?.minColumn || 3}
                    licenseKey="non-commercial-and-evaluation" // for non-commercial use only
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
      isSel,
      JSON.stringify(selCells),
      tableNodeEntry,
      tableJSONData,
    ],
  );
});
