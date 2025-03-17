import { useRefFunction } from '@ant-design/pro-components';
import { HotTable } from '@handsontable/react-wrapper';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import Handsontable from 'handsontable';
import { CellChange, ChangeSource } from 'handsontable/common';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
import { registerAllModules } from 'handsontable/registry';
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-horizon.min.css';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Editor, Transforms } from 'slate';
import stringWidth from 'string-width';
import { TableNode } from '../../../el';
import { useSelStatus } from '../../../hooks/editor';
import { parserMarkdownToSlateNode } from '../../parser/parserMarkdownToSlateNode';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { useTableStyle } from './style';
import './table.css';
export * from './TableCell';

registerLanguageDictionary(zhCN);
registerAllModules();

registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => {
  textRenderer(hotInstance, TD, ...rest);
  const cellProperties = rest.at(-1);
  if (cellProperties.bold) {
    TD.style.fontWeight = 'bold';
  }
  if (cellProperties.color) {
    TD.style.color = cellProperties.color;
  }
  if (cellProperties.italic) {
    TD.style.fontStyle = 'italic';
  }

  if (cellProperties.title) {
    TD.style.background = '#eee';
    TD.style.fontWeight = 'bold';
  }
});

const nodeToString = (node: any) => {
  if (node.children) {
    return node.children.map(nodeToString).join('');
  }
  if (node.type === 'break') {
    return '<br>';
  }
  return node.text;
};

const slateTableToJSONData = (
  input: TableNode,
): {
  tableData: string[][];
  cellSet: any[];
} => {
  const cellSetList: Record<string, any>[] = [];
  const tableData =
    input?.children?.map((row, rowIndex) => {
      const cells = row.children?.map((column, colIndex) => {
        const cellSet: Record<string, any> = {};
        if (column.title) {
          cellSet.title = true;
        }
        if (column.children?.[0]?.text && column.children.length === 1) {
          const leaf = column.children[0];
          if (leaf.bold) {
            cellSet.bold = leaf.bold;
          }
          if (leaf.italic) {
            cellSet.italic = leaf.italic;
          }
          if (leaf.underline) {
            cellSet.underline = leaf.underline;
          }
          if (leaf.color) {
            cellSet.color = leaf.color;
          }
          if (Object.keys(cellSet).length) {
            cellSet.row = rowIndex;
            cellSet.col = colIndex;
            cellSet.renderer = 'customStylesRenderer';
            cellSetList.push(cellSet);
          }
        }
        return (
          nodeToString(column)
            .replaceAll('<br>', '\n')
            .replaceAll('<br/>', '\n') || ' '
        );
      }) as string[];
      return cells || [];
    }) || [];

  return {
    tableData,
    cellSet: cellSetList,
  };
};

export const TablePropsContext = React.createContext<{
  tablePath?: number[];
  tableNode?: TableNode;
}>({});

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
  const { store, markdownEditorRef, editorProps, readonly } = useEditorStore();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const baseCls = getPrefixCls('md-editor-content-table');

  const { wrapSSR, hashId } = useTableStyle(baseCls, {});

  const [selectedTable, tablePath] = useSelStatus(props.element);

  const overflowShadowContainerRef = React.useRef<HTMLTableElement>(null);

  const tableTargetRef = useRef<HTMLTableElement>(null);

  /**
   * 判断当前表格是否被选中。
   */
  const isSel = useMemo(() => {
    if (selectedTable) return true;
    if (!store.selectTablePath?.length) return false;
    return store.selectTablePath.join('') === tablePath.join('');
  }, [store.editor, selectedTable, store.selectTablePath, props.element]);

  const hotRef = useRef<{
    hotInstance: Handsontable | null;
  }>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableJSONData = useMemo(() => slateTableToJSONData(props.element), []);

  // 用于处理表格内容的变化
  const updateTable = useRefFunction(
    (dataList: CellChange[] | null, source: ChangeSource) => {
      dataList?.forEach((data) => {
        if (source === 'edit' && data) {
          const [row, col, oldValue, changeValue] = data;
          const newValue =
            changeValue?.replaceAll?.('\n', '<br/>') || changeValue;
          const path = tablePath;
          // 如果旧值不存在，新值不存在，且新值不等于旧值
          // 说明是新增的单元格
          if (!oldValue && !newValue && newValue !== oldValue) {
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
          if (!oldValue && newValue && newValue !== oldValue) {
            if (
              Editor.hasPath(markdownEditorRef.current, [
                ...path,
                row,
                col as number,
                0,
              ])
            ) {
              Transforms.removeNodes(markdownEditorRef.current, {
                at: [...path, row, col as number],
              });
              Transforms.insertNodes(
                markdownEditorRef.current,
                {
                  type: 'table-cell',
                  children: parserMarkdownToSlateNode(newValue).schema,
                },
                { at: [...path, row, col as number] },
              );
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
          if (oldValue && !newValue && newValue !== oldValue) {
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
          if (oldValue && newValue && newValue !== oldValue) {
            if (
              Editor.hasPath(markdownEditorRef.current, [
                ...path,
                row,
                col as number,
                0,
              ])
            ) {
              Transforms.removeNodes(markdownEditorRef.current, {
                at: [...path, row, col as number],
              });
              Transforms.insertNodes(
                markdownEditorRef.current,
                {
                  type: 'table-cell',
                  children: parserMarkdownToSlateNode(newValue).schema,
                },
                { at: [...path, row, col as number] },
              );
              return;
            }
          }
        }
      });
    },
  );
  // 创建列
  const afterCreateCol = useRefFunction(
    (insertIndex: number, amount: number, source?: string) => {
      if (source === 'auto') return;
      const rows = new Array(props.element.children?.length).fill(0);
      if (insertIndex >= rows.length) {
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
  // 创建行
  const afterCreateRow = useRefFunction(
    (insertIndex: number, amount: number, source?: string) => {
      if (source === 'auto') return;
      const cells = new Array(props.element.children?.at(0)?.children?.length)
        .fill(0)
        .map(() => {
          return {
            type: 'table-cell',
            children: [{ text: '' }],
          };
        });
      if (insertIndex >= cells.length) {
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

  const afterMergeCells = useRefFunction((cellRange, mergeParent, auto) => {
    if (auto) return;
    const mergeCells = [...(props.element?.otherProps?.mergeCells || [])];
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
  });

  const afterUnmergeCells = useRefFunction((cellRange, auto) => {
    if (auto) return;
    const row = cellRange?.from?.row;
    const rol = cellRange?.from?.col;
    const mergeCells = props.element?.otherProps?.mergeCells || [];
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
  });
  const genDefaultWidth = useRefFunction((tableData: any[]) => {
    if (props.element?.otherProps?.colWidths)
      return props.element?.otherProps?.colWidths;
    if (!tableData?.[1]) return;
    if (tableData?.[1]?.filter(Boolean)?.length === 0) return;
    return tableData?.[1]?.map((text: string) => {
      return Math.max(Math.min(stringWidth(text) * 16 + 24, 300), 50);
    });
  });

  const generateMergedCells = useRefFunction((tableData: any[]) => {
    return props.element?.otherProps?.mergeCells?.filter((item: any) => {
      if (!item) return false;

      if (item.row + item.rowspan >= tableData?.length) {
        return false;
      }
      if (item.col + item.colspan >= tableData?.[item.row]?.children?.length) {
        return false;
      }

      return true;
    });
  });
  useEffect(() => {
    const cellSet = slateTableToJSONData(props.element);
    const list = cellSet.tableData;
    hotRef.current?.hotInstance?.updateSettings({
      cell: cellSet.cellSet,
      data: list,
      hiddenRows: {
        rows: [0],
      },
      colHeaders: cellSet?.tableData?.at(0),
      colWidths: genDefaultWidth(cellSet.tableData),
      mergeCells: generateMergedCells(cellSet.tableData) || [],
    });
  }, [JSON.stringify(props.element)]);

  return useMemo(() => {
    return wrapSSR(
      <TablePropsContext.Provider
        value={{
          tablePath,
          tableNode: props.element,
        }}
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
          className={classNames(
            `${baseCls}-container`,
            {
              [`${baseCls}-container-editable`]: !readonly,
            },
            hashId,
          )}
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
                ref={hotRef as any}
                data={tableJSONData.tableData}
                cell={tableJSONData.cellSet}
                height="auto"
                language={zhCN.languageCode}
                autoColumnSize={true}
                manualColumnResize={true}
                afterGetColHeader={function (col, TH) {
                  if (col === -1) {
                    return;
                  }
                  if (TH.querySelector('input')) return;
                  let instance = hotRef.current?.hotInstance;
                  if (!instance) return;
                  // create input element
                  let input = document.createElement('input');
                  if (!input) return;
                  input.type = 'text';
                  input.style =
                    'width:calc(100% - 4px);display:none;height:calc(100% - 4px);border:none;outline:none;border-radius:inherit';
                  input.value = TH.firstChild?.textContent + '';
                  TH.appendChild(input);
                  TH.onblur = function () {
                    let headers = instance?.getColHeader();
                    headers[col] = input.value + '';
                    updateTable(
                      [[0, col, TH.firstChild?.textContent + '', input.value]],
                      'edit',
                    );
                    (TH.firstChild as any).style.display = 'block';
                    instance.updateSettings({
                      colHeaders: headers as string[],
                    });
                    input.style.display = 'none';
                  };
                  input.onblur = function () {
                    let headers = instance?.getColHeader();
                    headers[col] = input.value + '';
                    updateTable(
                      [[0, col, TH.firstChild?.textContent + '', input.value]],
                      'edit',
                    );
                    (TH.firstChild as any).style.display = 'block';
                    instance.updateSettings({
                      colHeaders: headers as string[],
                    });
                    input.style.display = 'none';
                  };

                  TH.style.position = 'relative';

                  TH.ondblclick = function () {
                    if (TH.firstChild && (TH.firstChild as any)?.style) {
                      if ((TH.firstChild as any).style.display === 'none') {
                        (TH.firstChild as any).style.display = 'block';
                        input.style.display = 'none';
                      } else {
                        (TH.firstChild as any).style.display = 'none';
                        input.style.display = 'block';
                      }
                    }
                  };
                }}
                afterCreateCol={afterCreateCol}
                afterCreateRow={afterCreateRow}
                afterRemoveCol={(index, amount) => {
                  const rows = new Array(props.element.children?.length).fill(
                    0,
                  );
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
                  let colWidths = [
                    ...(props.element?.otherProps?.colWidths ||
                      genDefaultWidth(
                        hotRef.current?.hotInstance?.getData() || [],
                      )),
                  ];

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
                afterMergeCells={afterMergeCells}
                afterUnmergeCells={afterUnmergeCells}
                // ----- merge 合并单元格的处理 end --------
                contextMenu={[
                  'row_above',
                  'row_below',
                  '---------',
                  'col_left',
                  'col_right',
                  '---------',
                  'remove_col',
                  'undo',
                  'redo',
                  '---------',
                  'mergeCells',
                  'remove_row',
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
      </TablePropsContext.Provider>,
    );
  }, [props.element.children, props.element?.otherProps, isSel, tableJSONData]);
});
