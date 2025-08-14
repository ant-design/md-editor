import React, { useContext, useMemo } from 'react';
import { BubbleConfigContext } from '../../../Bubble/BubbleConfigProvide';
import { SchemaRenderer } from '../../../schema';
import { CodeNode } from '../../el';
import { RenderElementProps } from '../slate-react';
import { useEditorStore } from '../store';

export const Schema: React.FC<RenderElementProps<CodeNode>> = (props) => {
  const { element: node } = props;
  const { editorProps } = useEditorStore();
  const apaasify = editorProps?.apaasify || editorProps?.apassify;

  const { bubble } = useContext(BubbleConfigContext) || {};
  return useMemo(() => {
    if (apaasify?.enable && apaasify.render) {
      return (
        <div
          {...node.attributes}
          data-testid="schema-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {apaasify.render(props, bubble)}
          <div
            data-testid="schema-hidden-json"
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
          data-testid="agentar-card-container"
          style={{
            padding: '0.5em',
          }}
          className="md-editor-agentar-card"
        >
          <SchemaRenderer
            debug={false}
            fallbackContent={null}
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
        data-testid="schema-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <div
          data-testid="schema-clickable"
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
          data-testid="schema-hidden-children"
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
