import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export function TableCell(props: RenderElementProps) {
  const store = useEditorStore();
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
        className={'drag-el'}
        {...props.attributes}
        data-be={'table'}
        onDragStart={store.dragStart}
        style={{
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto',
        }}
      >
        <DragHandle />
        <table>
          <tbody>{props.children}</tbody>
        </table>
      </div>
    );
  }, [props.element.children]);
});
