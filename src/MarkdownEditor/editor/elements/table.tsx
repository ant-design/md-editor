import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Editor, NodeEntry, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { TableCellNode, TableNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { TableAttr } from '../tools/TableAttr';

export function TableCell(props: RenderElementProps) {
  const { typewriter, store } = useEditorStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, path] = useSelStatus(props.element);
  const context = useCallback((e: React.MouseEvent, head?: boolean) => {
    store.openTableMenus(e, head);
  }, []);

  const isLatest = useMemo(() => {
    if (store.editor?.children?.length === 0) return false;
    if (!store.editorProps?.typewriter) return false;
    return store.isLatestNode(props.element);
  }, [
    store.editor?.children?.at?.(path.at(0)!),
    store.editor?.children?.at?.(path.at(0)! + 1),
    typewriter,
  ]);
  return React.useMemo(() => {
    return props.element.title ? (
      <th
        {...props.attributes}
        className={classNames({
          typewriter: isLatest && typewriter,
        })}
        style={{ textAlign: props.element.align }}
        data-be={'th'}
        onContextMenu={(e) => context(e, true)}
      >
        {props.children}
      </th>
    ) : (
      <td
        {...props.attributes}
        style={{ textAlign: props.element.align }}
        data-be={'td'}
        className={classNames('group', {
          typewriter: isLatest && typewriter,
        })}
        onContextMenu={(e) => {
          context(e);
        }}
      >
        {props.children}
      </td>
    );
  }, [props.element, isLatest, props.element.children, store.refreshHighlight]);
}

export const Table = observer((props: RenderElementProps) => {
  const { store } = useEditorStore();

  const [state, setState] = useState({
    visible: false,
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

  const tableRef = React.useRef<NodeEntry<TableNode>>();
  const tableCellRef = useRef<NodeEntry<TableCellNode>>();

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
    const el = store.tableCellNode;
    if (el) {
      tableCellRef.current = el;
      try {
        const dom = ReactEditor.toDOMNode(store.editor, el[0]) as HTMLElement;
        let top = dom.offsetTop;
        let left = dom.offsetLeft;
        setState((prev) => ({
          ...prev,
          top: top - 24 + 3,
          left,
          visible: true,
        }));
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

  return useMemo(() => {
    return (
      <div
        className={'ant-md-editor-drag-el ant-md-editor-table'}
        {...props.attributes}
        data-be={'table'}
        onDragStart={store.dragStart}
        onMouseUp={handleClickTable}
        style={{
          maxWidth: '100%',
          overflow: 'visible',
          ...(store.editor?.children?.length === 1
            ? {}
            : {
                border: '1px solid #e8e8e8',
                borderRadius: 16,
              }),
        }}
      >
        {state.visible && (
          <TableAttr
            state={state}
            setState={setState}
            tableRef={tableRef}
            tableCellRef={tableCellRef}
          />
        )}
        <DragHandle />
        <table>
          <tbody>{props.children}</tbody>
        </table>
      </div>
    );
  }, [
    props.element.children,
    state,
    setState,
    store.dragStart,
    handleClickTable,
  ]);
});
