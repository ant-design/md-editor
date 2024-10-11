import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Node } from 'slate';
import { ElementProps, ParagraphNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export const Paragraph = (props: ElementProps<ParagraphNode>) => {
  const { store, typewriter } = useEditorStore();
  const [selected, path] = useSelStatus(props.element);

  const isLatest = useMemo(() => {
    if (store?.editor?.children.length === 0) return false;
    if (!typewriter) return false;
    return store.isLatestNode(props.element);
  }, [
    store?.editor?.children.at?.(path.at(0)!),
    store?.editor?.children.at?.(path.at(0)! + 1),
    typewriter,
  ]);

  console.log('Paragraph', isLatest);

  return React.useMemo(() => {
    const str = Node.string(props.element);
    return (
      <p
        {...props.attributes}
        data-be={'paragraph'}
        className={classNames('ant-md-editor-drag-el', {
          empty: !str,
          typewriter: isLatest && typewriter,
        })}
        onDragStart={store.dragStart}
        data-empty={!str && selected ? 'true' : undefined}
      >
        <DragHandle />
        {props.children}
      </p>
    );
  }, [props.element.children, selected, isLatest, typewriter]);
};
