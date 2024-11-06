import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { ConfigProvider, Popconfirm, Popover, Tooltip } from 'antd';
import classNames from 'classnames';
import isHotkey from 'is-hotkey';
import { Grid2x2X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableCellNode, TableRowNode } from '../../el';
import { useSubject } from '../../hooks/subscribe';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';
import { useStyle } from './tableAttrStyle';

/**
 * InsertRowAfterIcon component.
 * Renders an SVG icon for inserting a row after in a table.
 */
const AddRowBelowIcon = () => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      width="1em"
      fill="currentColor"
      height="1em"
    >
      <path
        d="M878.7 336H145.3c-18.4 0-33.3 14.3-33.3 32v464c0 17.7 14.9 32 33.3 32h733.3c18.4 0 33.3-14.3 33.3-32V368c0.1-17.7-14.8-32-33.2-32zM360 792H184V632h176v160z m0-224H184V408h176v160z m240 224H424V632h176v160z m0-224H424V408h176v160z m240 224H664V632h176v160z m0-224H664V408h176v160zM904 160H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

/**
 * Component for rendering an insert row before icon.
 */
const InsertRowAfterIcon = () => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      width="1em"
      fill="currentColor"
      height="1em"
    >
      <path
        d="M904 768H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8zM878.7 160H145.3c-18.4 0-33.3 14.3-33.3 32v464c0 17.7 14.9 32 33.3 32h733.3c18.4 0 33.3-14.3 33.3-32V192c0.1-17.7-14.8-32-33.2-32zM360 616H184V456h176v160z m0-224H184V232h176v160z m240 224H424V456h176v160z m0-224H424V232h176v160z m240 224H664V456h176v160z m0-224H664V232h176v160z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

/**
 * Component for rendering an insert column after icon.
 */
const InsertColAfterIcon = () => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      width="1em"
      fill="currentColor"
      height="1em"
    >
      <path
        d="M853.333333 128a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-256a42.666667 42.666667 0 0 1-42.666666-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h256z m-42.666666 85.333333h-170.666667v597.333334h170.666667V213.333333zM256 298.666667a213.333333 213.333333 0 1 1 0 426.666666A213.333333 213.333333 0 0 1 256 298.666667z m42.666667 85.333333H213.333333v85.290667L128 469.333333v85.333334l85.333333-0.042667V640h85.333334v-85.376L384 554.666667v-85.333334l-85.333333-0.042666V384z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

/**
 * InsertColBeforeIcon component.
 * Renders an SVG icon for inserting a column before in a table.
 */
const InsertColBeforeIcon = () => {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" width="1em" height="1em">
      <path
        fill="currentColor"
        d="M426.666667 128a42.666667 42.666667 0 0 1 42.666666 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666666 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h256zM384 213.333333H213.333333v597.333334h170.666667V213.333333z m384 85.333334a213.333333 213.333333 0 1 1 0 426.666666 213.333333 213.333333 0 0 1 0-426.666666z m42.666667 85.333333h-85.333334v85.290667L640 469.333333v85.333334l85.333333-0.042667V640h85.333334v-85.376L896 554.666667v-85.333334l-85.333333-0.042666V384z"
      ></path>
    </svg>
  );
};

/**
 * 表格设置器
 */
/**
 * React component for managing table attributes.
 *
 * @remarks
 * This component is responsible for handling various operations related to table attributes, such as resizing, aligning, inserting/removing rows and columns, and more.
 *
 * @returns The TableAttr component.
 */
interface TableAttrState {
  top: number;
  left: number;
  width: number;
  scaleOpen: boolean;
  enterScale: boolean;
  align: string | undefined;
  rows: number;
  cols: number;
  selectCols: number;
  selectRows: number;
}

interface TableAttrProps {
  state: TableAttrState;
  setState: React.Dispatch<React.SetStateAction<TableAttrState>>;
  tableRef: React.MutableRefObject<any>;
  tableCellRef: React.MutableRefObject<any>;
}

export const TableAttr = observer(
  ({ state, setState, tableRef, tableCellRef }: TableAttrProps) => {
    const { store, readonly } = useEditorStore();
    const editor = store.editor;

    const el = store.tableCellNode;

    const resetGird = useCallback(
      (row: number, col: number) => {
        store.doManual();
        setState((prevState) => ({
          ...prevState,
          scaleOpen: false,
        }));
        const [table, path] = tableRef.current!;
        if (state.rows > row) {
          Transforms.removeNodes(editor, {
            at: {
              anchor: { path: [...path, row], offset: 0 },
              focus: { path: [...path, state.rows], offset: 0 },
            },
            match: (node) => node.type === 'table-row',
          });
        }

        const heads = (table.children[0].children as TableCellNode[]) || [];
        const lastIndex = heads.length;
        for (let i = 0; i < row; i++) {
          const row = table.children[i];
          if (!row) {
            const row: TableRowNode = {
              type: 'table-row',
              children: Array.from(new Array(col)).map((_, j) => {
                return {
                  type: 'table-cell',
                  children: [],
                  align: heads[j]?.align,
                } as TableCellNode;
              }),
            };
            Transforms.insertNodes(editor, row, {
              at: [...path, i],
            });
          } else {
            if (state.cols > col) {
              Transforms.removeNodes(editor, {
                at: {
                  anchor: { path: [...path, i, col], offset: 0 },
                  focus: { path: [...path, i, state.cols], offset: 0 },
                },
                match: (node) => node.type === 'table-cell',
              });
            } else {
              Array.from(new Array(col - state.cols)).forEach((_, j) => {
                Transforms.insertNodes(
                  editor,
                  {
                    type: 'table-cell',
                    children: [],
                    title: i === 0,
                    align: heads[j + state.cols]?.align,
                  } as TableCellNode,
                  { at: [...path, i, lastIndex + j] },
                );
              });
            }
          }
        }
        if (
          tableCellRef.current &&
          !Editor.hasPath(editor, tableCellRef.current[1])
        ) {
          Transforms.select(editor, Editor.start(editor, path));
        }
        ReactEditor.focus(editor);
      },
      [editor],
    );

    const getScaleGirdClass = useCallback((row: number, col: number) => {
      if (row === 1) {
        if (state.enterScale) {
          return col <= state.selectCols ? 'bg-gray-600' : 'bg-white';
        } else {
          return col <= state.cols ? 'bg-gray-600' : 'bg-white';
        }
      } else {
        if (state.enterScale) {
          return row <= state.selectRows && col <= state.selectCols
            ? 'bg-gray-400'
            : '';
        } else {
          return row <= state.rows && col <= state.cols ? 'bg-gray-400' : '';
        }
      }
    }, []);

    const setAligns = useCallback(
      (type: 'left' | 'center' | 'right') => {
        const cell = tableCellRef.current!;
        const table = tableRef.current!;
        if (cell) {
          const index = cell[1][cell[1].length - 1];
          table[0].children.forEach((el: { children: any[] }) => {
            el.children?.forEach((cell, i) => {
              if (i === index) {
                Transforms.setNodes(
                  editor,
                  { align: type },
                  { at: EditorUtils.findPath(editor, cell) },
                );
              }
            });
          });
        }
        ReactEditor.focus(editor);
      },
      [editor],
    );

    const remove = useCallback(() => {
      const table = tableRef.current!;

      Transforms.delete(editor, { at: table[1] });
      tableCellRef.current = undefined;
      tableRef.current = undefined;
      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: '' }] },
        { at: table[1], select: true },
      );
      ReactEditor.focus(editor);
    }, [editor]);

    const insertRow = useCallback((path: Path, columns: number) => {
      Transforms.insertNodes(
        editor,
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
      Transforms.select(editor, Editor.start(editor, path));
    }, []);

    const insertCol = useCallback(
      (tablePath: Path, rows: number, index: number) => {
        Array.from(new Array(rows)).forEach((_, i) => {
          Transforms.insertNodes(
            editor,
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
        Transforms.select(editor, [...tablePath, 0, index, 0]);
      },
      [],
    );

    const removeRow = useCallback(
      (path: Path, index: number, columns: number) => {
        if (Path.hasPrevious(path)) {
          Transforms.select(
            editor,
            Editor.end(editor, [
              ...tableRef.current![1],
              path[path.length - 1] - 1,
              index,
            ]),
          );
        } else {
          Transforms.select(
            editor,
            Editor.end(editor, [
              ...tableRef.current![1],
              path[path.length - 1],
              index,
            ]),
          );
        }

        Transforms.delete(editor, { at: path });

        if (path[path.length - 1] === 0) {
          Array.from(new Array(columns)).forEach((_, i) => {
            Transforms.setNodes(
              editor,
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
      [editor],
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
          | 'in'
          | 'insertTableCellBreak',
      ) => {
        if (!tableCellRef.current || !tableRef.current) return;
        const columns = tableRef.current[0].children[0].children.length;
        const rows = tableRef.current[0].children.length;
        const path = tableCellRef.current[1];
        const index = path[path.length - 1];
        const row = path[path.length - 2];
        const rowPath = Path.parent(path);
        store.doManual();
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
            insertCol(tableRef.current[1], rows, index);
            break;
          case 'insertColAfter':
            insertCol(tableRef.current[1], rows, index + 1);
            break;
          case 'insertTableCellBreak':
            Transforms.insertNodes(
              editor,
              [{ type: 'break', children: [{ text: '' }] }, { text: '' }],
              { select: true },
            );
            break;
          case 'moveUpOneRow':
            if (row > 1) {
              Transforms.moveNodes(editor, {
                at: rowPath,
                to: Path.previous(rowPath),
              });
            } else {
              Transforms.moveNodes(editor, {
                at: rowPath,
                to: [...tableRef.current[1], rows - 1],
              });
            }
            break;
          case 'moveDownOneRow':
            if (row < rows - 1) {
              Transforms.moveNodes(editor, {
                at: rowPath,
                to: Path.next(rowPath),
              });
            } else {
              Transforms.moveNodes(editor, {
                at: rowPath,
                to: [...tableRef.current[1], 1],
              });
            }
            break;
          case 'moveLeftOneCol':
            Array.from(new Array(rows)).forEach((_, i) => {
              Transforms.moveNodes(editor, {
                at: [...tableRef.current![1], i, index],
                to: [
                  ...tableRef.current![1],
                  i,
                  index > 0 ? index - 1 : columns - 1,
                ],
              });
            });
            break;
          case 'moveRightOneCol':
            Array.from(new Array(rows)).forEach((_, i) => {
              Transforms.moveNodes(editor, {
                at: [...tableRef.current![1], i, index],
                to: [
                  ...tableRef.current![1],
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
                editor,
                Editor.start(editor, [...tableRef.current[1], row, index + 1]),
              );
            } else {
              Transforms.select(
                editor,
                Editor.start(editor, [...tableRef.current[1], row, index - 1]),
              );
            }
            Array.from(new Array(rows)).forEach((_, i) => {
              Transforms.delete(editor, {
                at: [...tableRef.current![1], rows - i - 1, index],
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
        }
        ReactEditor.focus(editor);
      },
      [],
    );

    useEffect(() => {
      const keydown = (e: KeyboardEvent) => {
        if (isHotkey('mod+shift+backspace', e)) {
          e.preventDefault();
          runTask('removeRow');
        }
      };
      window.addEventListener('keydown', keydown);
      return () => {
        window.removeEventListener('keydown', keydown);
      };
    }, []);

    useSubject(store.tableTask$, runTask);

    const context = useContext(ConfigProvider.ConfigContext);
    const baseClassName = context.getPrefixCls(`table-attr-toolbar`);
    const htmlRef = useRef<HTMLDivElement>(null);

    const { wrapSSR, hashId } = useStyle(baseClassName);
    if (!store.container) return null;
    if (readonly) return null;

    return wrapSSR(
      <div
        className={classNames(baseClassName, hashId)}
        style={{
          left: state.left,
          top: state.top,
          zIndex: 99,
          width: 'auto',
          position: 'absolute',
          display: store.tableAttrVisible ? 'flex' : 'none',
        }}
        ref={htmlRef}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Popover
          placement="bottomLeft"
          title={null}
          open={state.scaleOpen}
          onOpenChange={(open) => {
            setState((prevState) => ({
              ...prevState,
              scaleOpen: open,
            }));
          }}
          content={
            <div>
              <div
                onMouseEnter={() =>
                  setState((prevState) => ({
                    ...prevState,
                    enterScale: true,
                  }))
                }
                onMouseLeave={() =>
                  setState((prevState) => ({
                    ...prevState,
                    enterScale: false,
                  }))
                }
              >
                {Array.from(new Array(10)).map((_, i) => (
                  <div
                    style={{
                      display: 'flex',
                      gap: 2,
                    }}
                    key={i}
                  >
                    {Array.from(new Array(6)).map((_, j) => (
                      <div
                        onMouseEnter={() => {
                          setState((prevState) => ({
                            ...prevState,
                            selectRows: i + 1,
                            selectCols: j + 1,
                          }));
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetGird(i + 1, j + 1);
                        }}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          border: '1px solid #f0f0f0',
                        }}
                        className={`${getScaleGirdClass(i + 1, j + 1)}`}
                        key={j}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: '1em',
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: '0.5em',
                  textAlign: 'center',
                }}
              >
                {state.enterScale ? (
                  <span>
                    {state.selectCols} x {state.selectRows}
                  </span>
                ) : (
                  <span>
                    {state.cols} x {state.rows}
                  </span>
                )}
              </div>
            </div>
          }
          trigger="click"
        >
          <div
            style={{
              display: 'none',
            }}
            className={classNames(`${baseClassName}-item`, hashId)}
          >
            <AppstoreAddOutlined />
          </div>
        </Popover>
        {(el?.[1]?.at?.(1) || 0) > 0 ? (
          <div
            className={classNames(`${baseClassName}-item`, hashId)}
            onClick={() => {
              runTask('insertRowBefore');
            }}
            title="Insert Row Before"
          >
            <AddRowBelowIcon />
          </div>
        ) : null}

        <div
          className={classNames(`${baseClassName}-item`, hashId)}
          title="Insert Row After"
          onClick={() => {
            runTask('insertRowAfter');
          }}
        >
          <InsertRowAfterIcon />
        </div>
        <div
          className={classNames(`${baseClassName}-item`, hashId)}
          title="Insert Col Before"
          onClick={() => {
            runTask('insertColBefore');
          }}
        >
          <InsertColBeforeIcon />
        </div>
        <div
          className={classNames(`${baseClassName}-item`, hashId)}
          title="Insert Col After"
          onClick={() => {
            runTask('insertColAfter');
          }}
        >
          <InsertColAfterIcon />
        </div>

        {(el?.[1]?.at?.(1) || 0) === 0 ? (
          <>
            <Tooltip placement={'top'} title={'align left'}>
              <div
                onClick={() => setAligns('left')}
                className={classNames(`${baseClassName}-item`, hashId)}
                style={{
                  color: state.align === 'left' ? '#000' : undefined,
                  fontWeight: state.align === 'left' ? 'bold' : 'normal',
                }}
              >
                <AlignLeftOutlined />
              </div>
            </Tooltip>
            <Tooltip placement={'top'} title={'align center'}>
              <div
                onClick={() => setAligns('center')}
                style={{
                  color: state.align === 'center' ? '#000' : undefined,
                  fontWeight: state.align === 'center' ? 'bold' : 'normal',
                }}
                className={classNames(`${baseClassName}-item`, hashId)}
              >
                <AlignCenterOutlined />
              </div>
            </Tooltip>
            <Tooltip placement={'top'} title={'align right'}>
              <div
                onClick={() => setAligns('right')}
                style={{
                  color: state.align === 'right' ? '#000' : undefined,
                  fontWeight: state.align === 'right' ? 'bold' : 'normal',
                }}
                className={classNames(`${baseClassName}-item`, hashId)}
              >
                <AlignRightOutlined />
              </div>
            </Tooltip>
          </>
        ) : null}

        <Popconfirm
          onConfirm={() => {
            runTask('removeRow');
          }}
          getPopupContainer={() => htmlRef.current || document.body}
          title="Confirm Remove this row?"
        >
          <div
            className={classNames(`${baseClassName}-item`, hashId)}
            title="Remove Row"
          >
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              id="mx_n_1730888889047"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width={'1em'}
              height={'1em'}
            >
              <path
                stroke="currentColor"
                d="M836.32 836.32c1.952 1.92 3.136 4.608 3.136 7.552s-1.184 5.632-3.136 7.552l-45.216 45.216c-1.92 1.952-4.608 3.136-7.552 3.136s-5.632-1.184-7.552-3.136l-214.016-213.984H170.688A42.656 42.656 0 0 1 128.032 640v-256c0-23.552 19.104-42.656 42.656-42.656h49.952L127.328 248a10.688 10.688 0 0 1 0-15.104l45.28-45.152a10.688 10.688 0 0 1 12.864-1.728l-0.064-0.032 2.304 1.696 648.576 648.672z m-374.4-495.072l391.424 0.096c23.552 0 42.656 19.104 42.656 42.656v256c0 23.552-19.104 42.656-42.656 42.656h-50.048l-85.344-85.344H800a10.656 10.656 0 0 0 10.656-10.656v-149.344a10.656 10.656 0 0 0-10.656-10.656l-252.768-0.096-85.344-85.344z m-155.968 85.408H224a10.656 10.656 0 0 0-10.656 10.656v149.344c0 5.888 4.768 10.656 10.656 10.656h252.64l-170.656-170.656z"
              />
            </svg>
          </div>
        </Popconfirm>
        <Popconfirm
          onConfirm={() => {
            runTask('removeCol');
          }}
          getPopupContainer={() => htmlRef.current || document.body}
          title="Confirm Remove this col?"
        >
          <div
            className={classNames(`${baseClassName}-item`, hashId)}
            title="Remove Col"
          >
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width={'1em'}
              height={'1em'}
            >
              <path
                stroke="currentColor"
                d="M836.32 836.32c1.952 1.92 3.136 4.608 3.136 7.552s-1.184 5.632-3.136 7.552l-45.216 45.216c-1.92 1.952-4.608 3.136-7.552 3.136s-5.632-1.184-7.552-3.136l-93.312-93.312v50.016c0 23.552-19.104 42.656-42.656 42.656h-256a42.656 42.656 0 0 1-42.656-42.656V461.952L127.328 248.032c-1.952-1.92-3.136-4.608-3.136-7.552s1.184-5.632 3.136-7.552l45.312-45.184a10.688 10.688 0 0 1 12.864-1.728l-0.064-0.032 2.304 1.696 648.576 648.672z m-409.664-289.024V800c0 5.888 4.768 10.656 10.656 10.656h149.344a10.656 10.656 0 0 0 10.656-10.656v-82.048l-170.656-170.656zM640 128c23.552 0 42.656 19.104 42.656 42.656v391.296l-85.344-85.344V223.968a10.656 10.656 0 0 0-10.656-10.656h-149.344a10.656 10.656 0 0 0-10.656 10.656v82.016l-85.344-85.344V170.624c0-23.552 19.104-42.656 42.656-42.656h256z"
              />
            </svg>
          </div>
        </Popconfirm>
        <Popconfirm
          onConfirm={() => {
            remove();
            console.log('remove');
          }}
          getPopupContainer={() => htmlRef.current || document.body}
          title="Confirm Remove this Table?"
        >
          <div
            className={classNames(`${baseClassName}-item`, hashId)}
            title="Remove"
          >
            <Grid2x2X width={14} />
          </div>
        </Popconfirm>
      </div>,
    );
  },
);
