import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import { RenderElementProps } from 'slate-react/dist/components/editable';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { TableAttr } from '../tools/TableAttr';

export function TableCell(props: RenderElementProps) {
  const store = useEditorStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, path] = useSelStatus(props.element);
  const context = useCallback((e: React.MouseEvent, head?: boolean) => {
    store.openTableMenus(e, head);
  }, []);
  const isLatest = useMemo(() => {
    if (store.editor.children.length === 0) return false;
    if (!store.editorProps.typewriter) return false;

    return store.isLatestNode(props.element);
  }, [
    store.editor.children.at?.(path.at(0)!),
    store.editor.children.at?.(path.at(0)! + 1),
    store.editorProps.typewriter,
  ]);
  return React.useMemo(() => {
    return props.element.title ? (
      <th
        {...props.attributes}
        className={classNames({
          typewriter: isLatest && store.editorProps.typewriter,
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
          typewriter: isLatest && store.editorProps.typewriter,
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
  const store = useEditorStore();

  return useMemo(() => {
    return (
      <div
        className={'ant-md-editor-drag-el ant-md-editor-table'}
        {...props.attributes}
        data-be={'table'}
        onDragStart={store.dragStart}
      >
        <TableAttr />
        <DragHandle />
        <div
          style={{
            maxWidth: '100%',
            overflow: 'auto',
            position: 'relative',
            ...(store.editor.children.length === 1
              ? {}
              : {
                  border: '1px solid #e8e8e8',
                  borderRadius: 16,
                }),
          }}
        >
          <table>
            <tbody>{props.children}</tbody>
          </table>
        </div>
      </div>
    );
  }, [props.element.children]);
});
