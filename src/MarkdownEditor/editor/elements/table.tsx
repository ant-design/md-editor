import { Popover, Typography } from 'antd';
import classNames from 'classnames';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
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
import stringWidth from 'string-width';
import { TableCellNode, TableNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { TableAttr } from '../tools/TableAttr';

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

  return React.useMemo(() => {
    const domWidth = stringWidth(Node.string(props.element)) * 8 + 20;
    const minWidth = Math.min(domWidth, 200);
    const text = Node.string(props.element);
    return props.element.title ? (
      <th
        {...props.attributes}
        style={{ textAlign: props.element.align }}
        data-be={'th'}
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
      >
        {readonly && domWidth > 200 ? (
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
    if (!store.selectTablePath?.length) return false;
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
    if (typeof IntersectionObserver === 'undefined') {
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
          maxWidth: '100%',
          minWidth: 0,
          marginBottom: 12,
        }}
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
    isSel,
  ]);
});
