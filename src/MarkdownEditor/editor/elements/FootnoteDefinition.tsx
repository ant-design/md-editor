import React, { useMemo } from 'react';
import { Node } from 'slate';
import { ElementProps, FootnoteDefinitionNode } from '../../el';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export const FootnoteDefinition = (
  props: ElementProps<FootnoteDefinitionNode>,
) => {
  const { store } = useEditorStore();
  const element = props.element;
  useMemo(() => {
    store.footnoteDefinitionMap = store.footnoteDefinitionMap.set(
      element.identifier,
      element,
    );
  }, [element]);
  return React.useMemo(() => {
    const str = Node.string(props.element);
    return (
      <div
        {...props.attributes}
        style={{
          fontSize: '12px',
          margin: '5px 0',
          display: 'flex',
        }}
        contentEditable={false}
        data-be={'footnoteDefinition'}
        className={
          !str ? 'ant-md-editor-drag-el empty' : 'ant-md-editor-drag-el'
        }
        onDragStart={store.dragStart}
      >
        <DragHandle />
        {element.identifier}.
        <a
          href={'#md-editor-ref' + (element.identifier || '')}
          style={{
            color: '#1677ff',
            textDecoration: 'none',
            marginLeft: '5px',
            cursor: 'pointer',
          }}
        >
          {props.children}
        </a>
      </div>
    );
  }, [props.element.children]);
};
