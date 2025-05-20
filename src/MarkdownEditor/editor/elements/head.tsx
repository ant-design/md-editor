import classNames from 'classnames';
import React, { createElement, useMemo } from 'react';
import { Node } from 'slate';
import { ElementProps, HeadNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useSlate } from '../slate-react';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { slugify } from '../utils/dom';

export function Head({
  element,
  attributes,
  children,
}: ElementProps<HeadNode>) {
  const {
    store = {} as Record<string, any>,
    markdownContainerRef,
    typewriter,
  } = useEditorStore();
  const editor = useSlate();
  const [selected, path] = useSelStatus(element);

  const isLatest = useMemo(() => {
    if (editor.children.length === 0) return false;
    if (!typewriter) return false;
    return store.isLatestNode(element);
  }, [
    editor.children.at?.(path.at(0)!),
    editor.children.at?.(path.at(0)! + 1),
    typewriter,
  ]);
  const str = Node.string(element);
  return React.useMemo(() => {
    return createElement(
      `h${element.level}`,
      {
        ...attributes,
        id: slugify(str),
        ['data-be']: 'head',
        ['data-head']: slugify(Node.string(element) || ''),
        ['data-title']: path?.[0] === 0,
        onDragStart: (e) => store.dragStart(e, markdownContainerRef.current!),
        ['data-empty']: !str && selected ? 'true' : undefined,
        className: classNames('ant-md-editor-drag-el', {
          empty: !str,
          typewriter: isLatest && typewriter,
        }),
      },
      <>
        <DragHandle />
        {children}
      </>,
    );
  }, [element.level, isLatest, str, element.children, selected, path]);
}
