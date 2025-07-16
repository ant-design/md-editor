import React from 'react';
import { BlockQuoteNode, ElementProps } from '../../el';
import { useEditorStore } from '../store';

export function Blockquote(props: ElementProps<BlockQuoteNode>) {
  const { store, markdownContainerRef } = useEditorStore();
  return React.useMemo(
    () => (
      <blockquote
        data-be={'blockquote'}
        {...props.attributes}
        onDragStart={(e) => store.dragStart(e, markdownContainerRef.current!)}
      >
        {props.children}
      </blockquote>
    ),
    [props.element.children],
  );
}
