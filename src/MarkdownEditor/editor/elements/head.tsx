import classNames from 'classnames';
import React, { createElement, useMemo } from 'react';
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
  const isLatest = useMemo(() => {
    if (store.editor.children.length === 0) return false;
    if (!store.editorProps.typewriter) return false;

    return store.isLatestNode(element);
  }, [
    store.editor.children.at?.(path.at(0)!),
    store.editor.children.at?.(path.at(0)! + 1),
    store.editorProps.typewriter,
  ]);

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
        className: classNames('ant-md-editor-drag-el', {
          empty: !str,
          typewriter: isLatest && store.editorProps.typewriter,
        }),
      },
      <>
        <DragHandle />
        {children}
      </>,
    );
  }, [
    element.level,
    isLatest,
    element.children,
    store.refreshHighlight,
    selected,
    path,
  ]);
}
