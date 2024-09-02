import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Popconfirm, Popover, Tooltip } from 'antd';
import isHotkey from 'is-hotkey';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import { useGetSetState } from 'react-use';
import { Editor, NodeEntry, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableCellNode, TableNode, TableRowNode } from '../../el';
import { useSubject } from '../../hooks/subscribe';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils/editorUtils';

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
export const TableAttr = observer(() => {
  const store = useEditorStore();
  const editor = store.editor;
  const [state, setState] = useGetSetState({
    visible: false,
    top: 0,
    left: 0,
    width: 0,
    scaleOpen: false,
    enterScale: false,
    align: '',
    rows: 0,
    cols: 0,
    selectCols: 0,
    selectRows: 0,
  });
  const tableRef = React.useRef<NodeEntry<TableNode>>();
  const tableCellRef = useRef<NodeEntry<TableCellNode>>();
  const resize = useCallback(() => {
    const table = tableRef.current;
    if (!table) return;
    setTimeout(() => {
      try {
        const dom = ReactEditor.toDOMNode(editor, table[0]) as HTMLElement;
        if (dom) {
          setState({
            rows: table[0].children.length,
            cols: table[0].children[0].children.length,
          });
        }
      } catch (e) {}
    }, 16);
  }, []);
  const el = store.tableCellNode;
  useEffect(() => {
    if (el) {
      tableCellRef.current = el;
      if (el.at(0) as TableCellNode) {
        try {
          const dom = ReactEditor.toDOMNode(editor, el[0]) as HTMLElement;
          let top = store.offsetTop(dom);
          let left =
            dom.getBoundingClientRect().left -
            store.container!.getBoundingClientRect().left;
          setState({
            top: top - 24 + 3,
            left,
            visible: true,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setState({
          visible: false,
        });
      }
      setState({ align: el[0].align });
      const table = Editor.node(editor, Path.parent(Path.parent(el[1])));
      if (table && table[0] !== tableRef.current?.[0]) {
        tableRef.current = table;
        resize();
      }
    } else {
      tableCellRef.current = undefined;
      tableRef.current = undefined;
      setState({ visible: false });
    }
  }, [store.tableCellNode, el, store.refreshTableAttr]);

  const resetGird = useCallback(
    (row: number, col: number) => {
      store.doManual();
      setState({ scaleOpen: false });
      const [table, path] = tableRef.current!;
      if (state().rows > row) {
        Transforms.removeNodes(editor, {
          at: {
            anchor: { path: [...path, row], offset: 0 },
            focus: { path: [...path, state().rows], offset: 0 },
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
          if (state().cols > col) {
            Transforms.removeNodes(editor, {
              at: {
                anchor: { path: [...path, i, col], offset: 0 },
                focus: { path: [...path, i, state().cols], offset: 0 },
              },
              match: (node) => node.type === 'table-cell',
            });
          } else {
            Array.from(new Array(col - state().cols)).forEach((_, j) => {
              Transforms.insertNodes(
                editor,
                {
                  type: 'table-cell',
                  children: [],
                  title: i === 0,
                  align: heads[j + state().cols]?.align,
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
      if (state().enterScale) {
        return col <= state().selectCols ? 'bg-gray-600' : 'bg-white';
      } else {
        return col <= state().cols ? 'bg-gray-600' : 'bg-white';
      }
    } else {
      if (state().enterScale) {
        return row <= state().selectRows && col <= state().selectCols
          ? 'bg-gray-400'
          : '';
      } else {
        return row <= state().rows && col <= state().cols ? 'bg-gray-400' : '';
      }
    }
  }, []);

  const setAligns = useCallback(
    (type: 'left' | 'center' | 'right') => {
      const cell = tableCellRef.current!;
      const table = tableRef.current!;
      if (cell) {
        const index = cell[1][cell[1].length - 1];
        table[0].children.forEach((el) => {
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

  const baseClassName = 'table-attr-toolbar';

  if (!store.container) return null;
  if (store.readonly) return null;

  return (
    <div
      className={baseClassName}
      style={{
        left: state().left,
        top: state().top,
        width: 'auto',
        position: 'absolute',
        display: state().visible ? 'flex' : 'none',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Popover
        placement="bottomLeft"
        title={null}
        open={state().scaleOpen}
        onOpenChange={(open) => {
          setState({ scaleOpen: open });
        }}
        content={
          <div>
            <div
              className={'space-y-0.5'}
              onMouseEnter={() => setState({ enterScale: true })}
              onMouseLeave={() => setState({ enterScale: false })}
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
                        setState({ selectRows: i + 1, selectCols: j + 1 });
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
            <div className={'mt-4 border-t border-gray-500 pt-2 text-center'}>
              {state().enterScale ? (
                <span>
                  {state().selectCols} x {state().selectRows}
                </span>
              ) : (
                <span>
                  {state().cols} x {state().rows}
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
          className={`${baseClassName}-item`}
        >
          <AppstoreAddOutlined />
        </div>
      </Popover>
      {(el?.[1]?.at?.(1) || 0) > 0 ? (
        <div
          className={`${baseClassName}-item`}
          onClick={() => {
            runTask('insertRowBefore');
          }}
          title="Insert Row Before"
        >
          <AddRowBelowIcon />
        </div>
      ) : null}

      <div
        className={`${baseClassName}-item`}
        title="Insert Row After"
        onClick={() => {
          runTask('insertRowAfter');
        }}
      >
        <InsertRowAfterIcon />
      </div>
      <div
        className={`${baseClassName}-item`}
        title="Insert Col Before"
        onClick={() => {
          runTask('insertColBefore');
        }}
      >
        <InsertColBeforeIcon />
      </div>
      <div
        className={`${baseClassName}-item`}
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
              className={`${baseClassName}-item`}
              style={{
                color: state().align === 'left' ? '#000' : undefined,
                fontWeight: state().align === 'left' ? 'bold' : 'normal',
              }}
            >
              <AlignLeftOutlined />
            </div>
          </Tooltip>
          <Tooltip placement={'top'} title={'align center'}>
            <div
              onClick={() => setAligns('center')}
              style={{
                color: state().align === 'center' ? '#000' : undefined,
                fontWeight: state().align === 'center' ? 'bold' : 'normal',
              }}
              className={`${baseClassName}-item`}
            >
              <AlignCenterOutlined />
            </div>
          </Tooltip>
          <Tooltip placement={'top'} title={'align right'}>
            <div
              onClick={() => setAligns('right')}
              style={{
                color: state().align === 'right' ? '#000' : undefined,
                fontWeight: state().align === 'right' ? 'bold' : 'normal',
              }}
              className={`${baseClassName}-item`}
            >
              <AlignRightOutlined />
            </div>
          </Tooltip>
        </>
      ) : null}
      <Popconfirm onConfirm={remove} title="Confirm Remove this Table?">
        <div className={`${baseClassName}-item`} title="Remove">
          <DeleteOutlined />
        </div>
      </Popconfirm>
    </div>
  );
});
