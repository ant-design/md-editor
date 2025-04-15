import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Node } from 'slate';
import { ElementProps, ParagraphNode } from '../../el';
import { useSelStatus } from '../../hooks/editor';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';
import { InlineChromiumBugfix } from '../utils/InlineChromiumBugfix';

export const Paragraph = (props: ElementProps<ParagraphNode>) => {
  const { store, markdownEditorRef, typewriter, readonly } = useEditorStore();
  const [selected, path] = useSelStatus(props.element);
  const isLatest = useMemo(() => {
    if (markdownEditorRef.current?.children.length === 0) return false;
    if (!typewriter) return false;
    return store.isLatestNode(props.element);
  }, [
    markdownEditorRef.current?.children.at?.(path.at(0)!),
    markdownEditorRef.current?.children.at?.(path.at(0)! + 1),
    typewriter,
  ]);

  return React.useMemo(() => {
    const str = Node.string(props.element).trim();
    return (
      <div
        {...props.attributes}
        data-be={'paragraph'}
        className={classNames('ant-md-editor-drag-el', {
          empty: !str,
          typewriter: isLatest && typewriter,
        })}
        onDragStart={store.dragStart}
        data-empty={!str && selected ? 'true' : undefined}
        style={{
          display: !!str || !!props.children?.at(0).type ? undefined : 'none',
        }}
      >
        <DragHandle />
        <InlineChromiumBugfix />
        {props.children}
        <InlineChromiumBugfix />
      </div>
    );
  }, [props.element.children, readonly, selected, isLatest, typewriter]);
};
