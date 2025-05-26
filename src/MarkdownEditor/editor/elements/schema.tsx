import { SchemaRenderer } from '@ant-design/md-editor/schema';
import React, { useMemo } from 'react';
import { CodeNode } from '../../el';
import { RenderElementProps } from '../slate-react';
import { useEditorStore } from '../store';

export const Schema: React.FC<RenderElementProps<CodeNode>> = (props) => {
  const { element: node } = props;
  const { editorProps } = useEditorStore();
  return useMemo(() => {
    if (editorProps?.apassify?.enable && editorProps.apassify.render) {
      return (
        <div
          {...node.attributes}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {editorProps.apassify.render(props)}
          <div
            style={{
              height: 1,
              opacity: 0,
              userSelect: 'none',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            {JSON.stringify(props.element.value, null, 2)}
          </div>
        </div>
      );
    }

    if (node.language === 'agentar-card') {
      return (
        <div
          style={{
            padding: '0.5em',
          }}
          className="md-editor-agentar-card"
        >
          <SchemaRenderer
            schema={props.element.value}
            values={props.element.value?.initialValues || {}}
            useDefaultValues={false}
          />
        </div>
      );
    }

    return (
      <div
        {...node.attributes}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <div
          style={{
            padding: 8,
            width: '100%',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            borderRadius: 8,
            flex: 1,
            border: '1px solid rgb(209 213 219 / 0.8)',
            alignItems: 'center',
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          data-be={node?.type}
        >
          {JSON.stringify(node?.value, null, 2)}
        </div>
        <span
          style={{
            display: 'none',
          }}
        >
          {props.children}
        </span>
      </div>
    );
  }, [node.value]);
};
