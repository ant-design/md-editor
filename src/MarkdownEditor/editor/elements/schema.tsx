import { SendOutlined } from '@ant-design/icons';
import {
  BetaSchemaForm,
  CheckCard,
  ProConfigProvider,
} from '@ant-design/pro-components';
import { Input, Select } from 'antd';
import json5 from 'json5';
import React from 'react';
import { RenderElementProps } from 'slate-react';

export const Schema: React.FC<RenderElementProps> = (props) => {
  const { element: node } = props;
  let json = [];

  try {
    json = json5.parse(node.value || '[]');
  } catch (error) {
    console.log(error, node.value);
    return <pre>{node.value}</pre>;
  }

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        border: '1px solid rgb(209 213 219 / 0.8)',
      }}
    >
      <div
        style={{
          width: '100%',
        }}
      >
        {node.title ? <h3>{node.title}</h3> : null}
      </div>
      <ProConfigProvider
        valueTypeMap={{
          chatInputArea: {
            render: (_, { text }) => <>{text}</>,
            renderFormItem: (_, props) => (
              <Input.TextArea
                placeholder="Please enter the company name or the ticker."
                style={{
                  width: '100%',
                  minHeight: 120,
                }}
                {...props?.fieldProps}
              />
            ),
          },
          searchCompany: {
            render: (_, { text }) => <>{text}</>,
            renderFormItem: (_, props) => (
              <Select
                mode="tags"
                placeholder="Please enter the company name or the ticker"
                {...props?.fieldProps}
              />
            ),
          },
          checkCard: {
            render: (_, { text }) => <>{text}</>,
            renderFormItem: (_, props) => (
              <CheckCard.Group {...props?.fieldProps} />
            ),
          },
        }}
      >
        <BetaSchemaForm<Record<string, any>>
          columns={json}
          autoFocusFirstInput={false}
          submitter={{
            searchConfig: {
              submitText: node.otherProps?.submitText || 'Send',
            },
            submitButtonProps: {
              icon: <SendOutlined />,
            },
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            render: (_, defaultDom) => {
              if (node.otherProps?.autoSubmit) return null;
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  {defaultDom}
                </div>
              );
            },
          }}
        />
      </ProConfigProvider>
    </div>
  );
  return null;
};
