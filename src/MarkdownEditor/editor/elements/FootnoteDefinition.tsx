import React from 'react';
import { Node } from 'slate';
import { ElementProps, FootnoteDefinitionNode } from '../../el';
import { useEditorStore } from '../store';
import { DragHandle } from '../tools/DragHandle';

export const FootnoteDefinition = (
  props: ElementProps<FootnoteDefinitionNode>,
) => {
  const { store } = useEditorStore();
  const element = props.element;
  return React.useMemo(() => {
    const str = Node.string(props.element);
    return (
      <>
        {element.identifier === '1' ? (
          <div
            style={{
              borderBottom: '1px solid #e8e8e8',
              padding: '4px 0',
              margin: '12px 0',
              fontSize: 14,
            }}
            contentEditable={false}
          />
        ) : null}
        <div
          {...props.attributes}
          style={{
            fontSize: '12px',
            margin: '5px 0',
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
            {props.children.at(1)}
          </a>
        </div>
      </>
    );
  }, [props.element.children]);
};
