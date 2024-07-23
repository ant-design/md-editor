import React from 'react';
import { BlockQuoteNode, ElementProps } from '../../el';
import { useEditorStore } from '../store';

export function Blockquote(props: ElementProps<BlockQuoteNode>) {
  const store = useEditorStore();
  return React.useMemo(
    () => (
      <blockquote data-be={'blockquote'} {...props.attributes}>
        {props.children}
      </blockquote>
    ),
    [props.element.children, store.refreshHighlight],
  );
}
