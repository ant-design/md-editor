import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Editor, Node, NodeEntry, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { TableCellNode, TableNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { TableAttr } from '../tools/TableAttr';

export function TableCell(props: RenderElementProps) {
  const { store } = useEditorStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_] = useSelStatus(props.element);
  const context = useCallback((e: React.MouseEvent, head?: boolean) => {
    store.openTableMenus(e, head);
  }, []);

  return React.useMemo(() => {
    return props.element.title ? (
      <th
        {...props.attributes}
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
        className={classNames('group')}
        onContextMenu={(e) => {
          context(e);
        }}
      >
        <div
          style={{
            maxWidth: '200px',
            textWrap: 'wrap',
          }}
        >
          {props.children}
        </div>
      </td>
    );
  }, [props.element, props.element.children, store.refreshHighlight]);
}

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

  const tableRef = React.useRef<NodeEntry<TableNode>>();
  const overflowShadowContainerRef = React.useRef<HTMLTableElement>(null);
  const tableCellRef = useRef<NodeEntry<TableCellNode>>();

  useEffect(() => {
    if (store.floatBarOpen) {
      setTableAttrVisible(false);
    }
  }, [store.floatBarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tableRef.current) return;
      if (tableAttrVisible && tableRef.current) {
        if (!store.editor.hasPath(tableRef.current[1])) return;
        try {
          console.log(tableRef.current[1]);
          const dom = ReactEditor.toDOMNode(
            store.editor,
            Node.get(store.editor, tableRef.current[1]),
          ) as HTMLElement;
          if (dom && !dom.contains(event.target as Node)) {
            setTableAttrVisible(false);
          }
        } catch (error) {
          console.log(tableRef.current[0]);
          console.log(error);
        }
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
        let top = dom.offsetTop;
        let left = dom.offsetLeft;
        setState((prev) => ({
          ...prev,
          top: top - 24 + 3,
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
          minWidth: 600,
        }}
      >
        <div
          className={'ant-md-editor-drag-el ant-md-editor-table'}
          style={{
            maxWidth: '100%',
            width: '100%',
            ...(store.editor?.children?.length === 1
              ? {}
              : {
                  border: '1px solid #e8e8e8',
                  borderRadius: 16,
                }),
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
            style={{
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
              flex: 1,
            }}
          >
            <table
              style={{
                borderCollapse: 'collapse',
                borderSpacing: 0,
              }}
              ref={tableTargetRef}
            >
              <tbody>{props.children}</tbody>
            </table>
          </div>
        </div>
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
  ]);
});
