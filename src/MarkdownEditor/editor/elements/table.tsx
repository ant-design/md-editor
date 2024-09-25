import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { TableAttr } from '../tools/TableAttr';

export function TableCell(props: RenderElementProps) {
  const store = useEditorStore();
  const context = useCallback((e: React.MouseEvent, head?: boolean) => {
    store.openTableMenus(e, head);
  }, []);
  const isLatest = useMemo(() => {
    if (store.editor.children.length === 0) return false;
    if (!store.editorProps.typewriter) return false;

    return store.isLatestNode(props.element);
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
        className={'group'}
        onContextMenu={(e) => {
          context(e);
        }}
      >
        {props.children}
      </td>
    );
  }, [props.element, props.element.children, store.refreshHighlight]);
}

export const Table = observer((props: RenderElementProps) => {
  const store = useEditorStore();

  return useMemo(() => {
    return (
      <div
        className={'md-editor-drag-el markdown-editor-table'}
        {...props.attributes}
        data-be={'table'}
        onDragStart={store.dragStart}
        style={{
          maxWidth: '100%',
          overflow: 'visible',
          ...(store.editor.children.length === 1
            ? {}
            : {
                border: '1px solid #e8e8e8',
                borderRadius: 16,
              }),
        }}
      >
        <TableAttr />
        <DragHandle />
        <table>
          <tbody>{props.children}</tbody>
        </table>
      </div>
    );
  }, [props.element.children]);
});
