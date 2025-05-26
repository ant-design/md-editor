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
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Editor, Node, Transforms } from 'slate';
import stringWidth from 'string-width';
import { TableNode } from '../../../el';
import { useSelStatus } from '../../../hooks/editor';
import { parserMarkdownToSlateNode } from '../../parser/parserMarkdownToSlateNode';
import { RenderElementProps } from '../../slate-react';
import { useEditorStore } from '../../store';
import { TableToolbar } from './enhanced/TableToolbar';
import { ReadonlyTable } from './ReadonlyTable';
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

/**
 * 将节点转换为字符串
 * @param node 需要转换的节点
 * @returns 转换后的字符串
 */
const nodeToString = (node: any) => {
  if (node.children) {
    return node.children.map(nodeToString).join('');
  }
  if (node.type === 'break') {
    return '<br>';
  }
  return node.text;
};

/**
 * 将Slate表格结构转换为JSON数据格式
 * @param input TableNode类型的表格节点
 * @returns 包含tableData和cellSet的对象
 */
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
export const Table = (
  props: RenderElementProps<TableNode> & { enableEnhancedOperations?: boolean },
) => {
  const { markdownEditorRef, editorProps, markdownContainerRef, readonly } =
    useEditorStore();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const baseCls = getPrefixCls('md-editor-content-table');

  const { wrapSSR, hashId } = useTableStyle(baseCls, {});

  // 从props中获取是否启用增强操作，默认为true
  const { enableEnhancedOperations = true } = props;

  const [, tablePath] = useSelStatus(props.element);

  const overflowShadowContainerRef = React.useRef<HTMLTableElement>(null);

  const hotRef = useRef<{
    hotInstance: Handsontable | null;
  }>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableJSONData = useMemo(() => {
    // 仅在需要时计算表格JSON数据
    return slateTableToJSONData(props.element);
  }, [props.element.id, props.element.children]); // 更具体的依赖项

  /**
   * 表格内容变化处理函数
   * @param dataList 单元格变化列表
   * @param source 变化来源
   */
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

  /**
   * 创建列的回调函数
   * @param insertIndex 插入位置的索引
   * @param amount 插入的列数量
   * @param source 操作来源
   */
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

  /**
   * 创建行的回调函数
   * @param insertIndex 插入位置的索引
   * @param amount 插入的行数量
   * @param source 操作来源
   */
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

  /**
   * 合并单元格后的回调函数
   * @param cellRange 合并的单元格范围
   * @param mergeParent 合并后的父单元格信息
   * @param auto 是否为自动操作
   */
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

  /**
   * 取消合并单元格后的回调函数
   * @param cellRange 取消合并的单元格范围
   * @param auto 是否为自动操作
   */
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
            mergeCells?.filter((cell: any) => {
              return cell.col !== rol || cell.row !== row;
            }) || [],
        },
      },
      {
        at: tablePath,
      },
    );
  });

  const colWidths = useMemo(() => {
    // 如果在props中存在，直接使用以避免计算
    if (props.element?.otherProps?.colWidths) {
      return props.element?.otherProps?.colWidths;
    }

    if (typeof window === 'undefined' || !props.element?.children?.length)
      return [];

    const tableRows = props.element.children;
    if (!tableRows?.[0]?.children?.length) return [];

    // 只获取一次容器宽度
    const containerWidth =
      (markdownContainerRef?.current?.querySelector('.ant-md-editor-content')
        ?.clientWidth || 400) - 32;
    const maxColumnWidth = containerWidth / 4;
    const minColumnWidth = 60;

    const columnCount = tableRows[0].children.length;
    const rowsToSample = Math.min(5, tableRows.length);

    // 一次性计算宽度
    const calculatedWidths = Array.from(
      { length: columnCount },
      (_, colIndex) => {
        const cellWidths = [];

        for (let rowIndex = 0; rowIndex < rowsToSample; rowIndex++) {
          const cell = tableRows[rowIndex]?.children?.[colIndex];
          if (cell) {
            const textWidth = stringWidth(Node.string(cell)) * 12;
            cellWidths.push(textWidth);
          }
        }

        return Math.min(
          Math.max(minColumnWidth, ...cellWidths),
          maxColumnWidth,
        );
      },
    );

    // 如果表格少于5行且总宽度超过容器宽度，则均匀分配宽度
    if (tableRows.length < 5) {
      const totalWidth = calculatedWidths.reduce(
        (sum, width) => sum + width,
        0,
      );
      if (totalWidth > containerWidth) {
        const evenWidth = Math.max(
          minColumnWidth,
          Math.floor(containerWidth / columnCount),
        );
        return Array(columnCount).fill(evenWidth);
      }
    }

    return calculatedWidths;
  }, [
    props.element?.otherProps?.colWidths,
    props.element?.children?.length,
    props.element?.children?.[0]?.children?.length,
  ]);

  /**
   * 生成默认列宽（记忆化）
   */
  const genDefaultWidth = useRefFunction((tableData: any[]) => {
    if (props.element?.otherProps?.colWidths)
      return props.element?.otherProps?.colWidths;
    if (!tableData?.[1]) return tableData[0].map(() => 80);
    if (tableData?.[1]?.filter(Boolean)?.length === 0) return;
    return colWidths;
  });

  /**
   * 生成合并单元格配置（记忆化）
   */
  const generateMergedCells = useRefFunction((tableData: any[]) => {
    const mergeCells = props.element?.otherProps?.mergeCells;
    if (!mergeCells || mergeCells.length === 0) return [];

    return mergeCells.filter((item: any) => {
      if (!item) return false;
      if (item.row + item.rowspan >= tableData?.length) return false;
      if (item.col + item.colspan >= tableData?.[item.row]?.children?.length)
        return false;
      return true;
    });
  });

  /**
   * 通过使用元素ID而不是完整序列化来优化表格数据更新
   */
  useEffect(() => {
    const hotInstance = hotRef.current?.hotInstance;
    if (!hotInstance) return;

    hotInstance.updateSettings({
      cell: tableJSONData.cellSet,
      data: tableJSONData.tableData,
      hiddenRows: { rows: [0] },
      colHeaders: tableJSONData.tableData?.at(0),
      colWidths: genDefaultWidth(tableJSONData.tableData),
      mergeCells: generateMergedCells(tableJSONData.tableData) || [],
    });

    // 使用requestAnimationFrame来批量更新UI
    requestAnimationFrame(() => {
      document.dispatchEvent(new CustomEvent('md-resize', { detail: {} }));
    });
  }, [props.element.id, tableJSONData]); // 更具体的依赖项

  /**
   * 将调整大小处理程序合并到单个效果中，并使用防抖调整大小
   */
  useEffect(() => {
    if (!overflowShadowContainerRef.current || typeof window === 'undefined')
      return;

    // 防抖调整大小以避免过多计算
    let resizeTimeout: number;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        const minWidth = markdownContainerRef?.current?.querySelector(
          '.ant-md-editor-content',
        )?.clientWidth;

        const dom = tableContainerRef.current?.querySelector(
          '.ht-theme-horizon',
        ) as HTMLDivElement;

        if (dom) {
          dom.style.minWidth = `min(${(
            (markdownContainerRef?.current?.querySelector(
              '.ant-md-editor-content',
            )?.clientWidth || 200) * 0.95
          ).toFixed(0)}px,${minWidth}px)`;
        }

        hotRef.current?.hotInstance?.updateSettings({
          colWidths: genDefaultWidth(tableJSONData.tableData),
        });
      }, 100); // 100毫秒防抖
    };

    window.addEventListener('md-resize', resize);
    window.addEventListener('resize', resize);

    // 初始调整大小
    resize();

    return () => {
      window.removeEventListener('md-resize', resize);
      window.removeEventListener('resize', resize);
      clearTimeout(resizeTimeout);
    };
  }, [tableJSONData.tableData]);

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
          style={{ position: 'relative' }}
        >
          {/* 增强表格工具栏 */}
          {enableEnhancedOperations && !readonly && (
            <TableToolbar element={props.element} />
          )}
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
              <div
                style={{
                  height: 1,
                  overflow: 'hidden',
                  opacity: 0,
                }}
              >
                {props.children}
              </div>
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
                  if (TH.querySelector('textarea')) return;
                  let instance = hotRef.current?.hotInstance;
                  if (!instance) return;
                  // 创建输入元素
                  let input = document.createElement('textarea');
                  if (!input) return;
                  (input as any).style =
                    'width:calc(100% - 4px);color:#000;display:none;height:calc(100% - 4px);border:none;outline:none;border-radius:inherit';
                  input.value = TH.firstChild?.textContent + '';
                  TH.appendChild(input);
                  TH.onblur = function () {
                    let headers = instance?.getColHeader() as string[];
                    headers[col] = input.value + '';
                    updateTable(
                      [
                        [
                          0,
                          col,
                          TH.firstChild?.textContent + '',
                          input.value || ' ',
                        ],
                      ],
                      'edit',
                    );
                    (TH.firstChild as any).style.display = 'block';
                    input.style.display = 'none';
                    hotRef.current?.hotInstance?.refreshDimensions();
                    hotRef.current?.hotInstance?.render();
                  };
                  input.onblur = function () {
                    let headers = instance?.getColHeader() as string[];
                    headers[col] = input.value + '';
                    updateTable(
                      [
                        [
                          0,
                          col,
                          TH.firstChild?.textContent + '',
                          input.value || ' ',
                        ],
                      ],
                      'edit',
                    );
                    (TH.firstChild as any).style.display = 'block';
                    input.style.display = 'none';
                    hotRef.current?.hotInstance?.refreshDimensions();
                    hotRef.current?.hotInstance?.render();
                  };

                  TH.style.position = 'relative';
                  TH.style.whiteSpace = 'break-spaces';
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
                  'copy',
                  '---------',
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
                licenseKey="non-commercial-and-evaluation" // 仅用于非商业用途
              />
            </div>
          ) : (
            <div
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              style={{
                maxWidth: '100%',
                width: '100%',
              }}
            >
              <ReadonlyTable {...props} hashId={hashId}>
                {props.children}
              </ReadonlyTable>
            </div>
          )}
        </div>
      </TablePropsContext.Provider>,
    );
  }, [
    // 使用更细粒度的依赖项而不是深层对象
    props.element.id,
    props.element?.otherProps?.colWidths,
    props.element?.otherProps?.mergeCells?.length,
    tableJSONData,
    readonly,
    hashId,
    baseCls,
  ]);
};
