import { BetaSchemaForm, ProConfigProvider } from '@ant-design/pro-components';
import React from 'react';
import { RenderElementProps } from 'slate-react';

export const Schema: React.FC<RenderElementProps> = (props) => {
  const { element: node } = props;

  return (
    <div
      {...node.attributes}
      contentEditable={false}
      style={{
        padding: 24,
        borderRadius: 8,
        border: '1px solid rgb(209 213 219 / 0.8)',
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
      <div
        style={{
          display: 'none',
        }}
      >
        {props.children}
      </div>
    </div>
  );
  return null;
};
