import { BetaSchemaForm, ProConfigProvider } from '@ant-design/pro-components';
import React from 'react';
import { RenderElementProps } from 'slate-react';
import { useEditorStore } from '../store';
import { EditorUtils } from '../utils';

export const Schema: React.FC<RenderElementProps> = (props) => {
  const { element: node } = props;
  const { store, readonly } = useEditorStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const htmlRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      {...node.attributes}
      style={{
        display: 'flex',
      }}
    >
      <div
        className={'ant-md-editor-drag-el'}
        data-be="link-card"
        style={{
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          padding: 24,
          borderRadius: 8,
          flex: 1,
          border: '1px solid rgb(209 213 219 / 0.8)',
          alignItems: 'center',
        }}
        ref={htmlRef}
        contentEditable={false}
        onDragStart={(e) => store.dragStart(e)}
        draggable={readonly ? false : true}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!store.focus) {
            EditorUtils.focus(store?.editor);
          }
        }}
      >
        <div
          style={{
            padding: 8,
            width: '100%',
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
          <ProConfigProvider>
            <BetaSchemaForm<Record<string, any>>
              columns={Array.isArray(node.value) ? node.value : []}
              autoFocusFirstInput={false}
              submitter={{
                searchConfig: {
                  submitText: node.otherProps?.submitText || 'Send',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
              }}
            />
          </ProConfigProvider>
        </div>
      </div>
      <span
        style={{
          fontSize: (htmlRef.current?.clientHeight || 200) * 0.75,
          width: '2px',
          height: (htmlRef.current?.clientHeight || 200) * 0.75,
          lineHeight: 1,
        }}
      >
        {props.children}
      </span>
    </div>
  );
};
