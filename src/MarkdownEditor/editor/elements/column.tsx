import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export function ColumnCell(props: RenderElementProps) {
  const store = useEditorStore();
  const context = useCallback((e: React.MouseEvent, head?: boolean) => {
    store.openTableMenus(e, head);
  }, []);
  return React.useMemo(() => {
    return (
      <td
        {...props.attributes}
        data-be={'column-cell'}
        className={'column-cell'}
        onContextMenu={(e) => {
          context(e);
        }}
      >
        {props.children}
      </td>
    );
  }, [props.element, props.element.children]);
}

export const ColumnGroup = observer((props: RenderElementProps) => {
  const store = useEditorStore();
  return useMemo(() => {
    return (
      <div
        className={'drag-el'}
        {...props.attributes}
        data-be={'column-group'}
        onDragStart={store.dragStart}
        style={{
          maxWidth: '100%',
          overflow: 'auto',
        }}
      >
        <DragHandle />
        <table className="column-group-table">{props.children}</table>
      </div>
    );
  }, [props.element.children]);
});
