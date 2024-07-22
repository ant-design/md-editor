import { DragOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { CSSProperties, useRef } from 'react';
import { useEditorStore } from '../store';

export const DragHandle = observer((props: { style?: CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const store = useEditorStore();
  return (
    <span
      className={'drag-handle'}
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
        store.dragEl = parent;
      }}
    >
      <DragOutlined className={'drag-icon'} />
    </span>
  );
});
