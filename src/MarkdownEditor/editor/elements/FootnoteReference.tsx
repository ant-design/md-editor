import { observer } from 'mobx-react-lite';
import React from 'react';
import { Node } from 'slate';
import { ElementProps, FootnoteDefinitionNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export const FootnoteReference = observer(
  (props: ElementProps<FootnoteDefinitionNode>) => {
    const store = useEditorStore();
    const [selected] = useSelStatus(props.element);
    console.log(props.element);
    return React.useMemo(() => {
      const str = Node.string(props.element);
      return (
        <p
          {...props.attributes}
          data-be={'paragraph'}
          className={
            !str ? 'ant-md-editor-drag-el empty' : 'ant-md-editor-drag-el'
          }
          onDragStart={store.dragStart}
          data-empty={!str && selected ? 'true' : undefined}
        >
          <DragHandle />
          {props.children}
        </p>
      );
    }, [props.element.children, store.refreshHighlight, selected]);
  },
);
