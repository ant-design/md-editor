import React, { createElement } from 'react';
import { Node } from 'slate';
import { ElementProps, HeadNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { slugify } from '../utils/dom';

export function Head({
  element,
  attributes,
  children,
}: ElementProps<HeadNode>) {
  const store = useEditorStore();
  const [selected, path] = useSelStatus(element);
  return React.useMemo(() => {
    const str = Node.string(element);
    return createElement(
      `h${element.level}`,
      {
        ...attributes,
        id: slugify(str),
        ['data-be']: 'head',
        ['data-head']: slugify(Node.string(element) || ''),
        ['data-title']: path?.[0] === 0,
        onDragStart: store.dragStart,
        ['data-empty']: !str && selected ? 'true' : undefined,
        className: !str ? 'md-editor-drag-el empty' : 'md-editor-drag-el',
      },
      <>
        <DragHandle />
        {children}
      </>,
    );
  }, [element.level, element.children, store.refreshHighlight, selected, path]);
}
