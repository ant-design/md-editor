import React, { useCallback } from 'react';
import { Editor, NodeEntry, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { TableCellNode, TableNode } from '../../el';
import { useEditorStore } from '../store';
export const ClickTable = ({
  tableRef,
  tableCellRef,
  overflowShadowContainerRef,
  setState,
  setTableAttrVisible,
}: {
  tableRef: React.MutableRefObject<NodeEntry<TableNode> | undefined>;
  tableCellRef: React.MutableRefObject<NodeEntry<TableCellNode> | undefined>;
  overflowShadowContainerRef: React.MutableRefObject<HTMLTableElement | null>;
  setState: React.Dispatch<
    React.SetStateAction<{
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
    }>
  >;
  setTableAttrVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { store } = useEditorStore();

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
      } catch (e) {
        console.error(e);
      }
    }, 16);
  }, [store.editor, tableRef, setState]);

  const handleClickTable = useCallback(() => {
    if (store.floatBarOpen) return;
    const el = store.tableCellNode;
    if (el) {
      tableCellRef.current = el;
      try {
        const dom = ReactEditor.toDOMNode(store.editor, el[0]) as HTMLElement;
        const overflowShadowContainer = overflowShadowContainerRef.current!;
        const tableTop = overflowShadowContainer.offsetTop;
        const left = dom.getBoundingClientRect().left;
        setState((prev) => ({
          ...prev,
          top: tableTop - 48 + 3,
          left,
        }));
        setTableAttrVisible(true);
      } catch (error) {
        console.error(error);
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
  }, [
    store.floatBarOpen,
    store.tableCellNode,
    store.editor,
    resize,
    setTableAttrVisible,
    tableCellRef,
    tableRef,
  ]);

  return handleClickTable;
};
