import { HolderOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import { useEditorStore } from '../store';

export const DragHandle = observer((props: { style?: CSSProperties }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { store, readonly } = useEditorStore();
  if (!store) return null;
  if (readonly === true) return null;

  return (
    <span
      className={'ant-md-editor-drag-handle'}
      style={{ ...props.style }}
      contentEditable={false}
      ref={ref}
      onMouseDown={() => {
        let parent = ref.current!.parentElement!;
        if (parent.parentElement?.dataset.be === 'list-item') {
          if (
            !parent.previousSibling ||
            (parent.previousSibling as HTMLElement).classList.contains(
              'check-item',
            )
          ) {
            parent = parent.parentElement;
          }
        }
        parent.draggable = true;
        store.draggedElement = parent;
      }}
    >
      <div className="ant-md-editor-drag-icon">
        <HolderOutlined />
      </div>
    </span>
  );
});
