import { Bar, Pie } from '@ant-design/charts';
import { SendOutlined } from '@ant-design/icons';
import {
  NodeToSchemaType,
  mdToJsonSchema,
} from '@ant-design/md-to-json-schema';
import { BetaSchemaForm, ProConfigProvider } from '@ant-design/pro-components';

import { Input, Table, message } from 'antd';
import json5 from 'json5';
import React, { useEffect, useMemo, type FC } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const defaultPieConfig = {
  angleField: 'value',
  colorField: 'type',

  legend: {
    color: {
      title: false,
      position: 'right',
      rowPadding: 5,
    },
  },
};

class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  {
    hasError: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p>loading</p>;
    }

    return this.props.children;
  }
}

/**
 * MarkdownParser component.
 *
 * @param value - The markdown content to be parsed.
 * @param dart - A boolean indicating whether to use the dark theme or not.
 * @returns The parsed markdown content.
 */
export const MessageRender: FC<{
  value: string;
  drag?: boolean;
  onSend?: (message: string) => void;
  itemRender?: (
    props: React.ReactNode,
    node: NodeToSchemaType,
    index: number,
  ) => React.ReactNode;
}> = (props) => {
  const schemaList = useMemo(() => {
    return mdToJsonSchema(props.value) as NodeToSchemaType<{
      order?: number;
    }>[];
  }, [props.value]);

  console.log(schemaList);

  const schemaMap = useMemo(() => {
    return schemaList.reduce((acc, node, index) => {
      acc.set(index, node);
      return acc;
    }, new Map());
  }, [schemaList]);

  const [items, setItems] = React.useState<number[]>(() =>
    schemaList.map((node, index) => index),
  );

  useEffect(() => {
    setItems(schemaList.map((node, index) => index));
  }, [schemaList]);

  const defaultRender = (
    node: NodeToSchemaType<{
      submitText?: string;
    }>,
    index: React.Key | null | undefined,
  ) => {
    if (node.type === 'table') {
      return (
        <div>
          <Table
            key={index}
            size="small"
            bordered
            pagination={false}
            {...node.otherProps}
          />
        </div>
      );
    }
    if (node.type === 'code' && node.lang === 'json') {
      let json = {};

      try {
        json = json5.parse(node.value || '[]');
      } catch (error) {
        console.error(error);
      }
      return <pre key={index}>{json5.stringify(json, null, 2)}</pre>;
    }

    if (node.type === 'code' && node.lang === 'schema') {
      let json = [];

      try {
        json = json5.parse(node.value || '[]');
      } catch (error) {
        console.log(error, node.value);
        return <pre key={index}>{node.value}</pre>;
      }

      return (
        <div
          style={{
            padding: 8,
            width: '100%',
          }}
        >
          <ProConfigProvider
            valueTypeMap={{
              chatInputArea: {
                render: (_, { text }) => <>{text}</>,
                renderFormItem: (_, props) => (
                  <Input
                    placeholder="Please enter the goal you want to achieve."
                    {...props?.fieldProps}
                  />
                ),
              },
            }}
          >
            <BetaSchemaForm<Record<string, any>>
              key={index}
              columns={json}
              onFinish={async (values) => {
                try {
                  props.onSend?.(values.message || values.post_data);
                  message.success('Send successfully');

                  return true;
                } catch (error) {
                  return false;
                }
              }}
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
    }
    if (node.type === 'chart') {
      if (node.otherProps?.chartType === 'pie') {
        return (
          <Pie
            data={
              node.otherProps.dataSource?.map((item) => {
                return {
                  type: item.type,
                  value: parseFloat(item.value),
                };
              }) || []
            }
            {...defaultPieConfig}
            label={{
              text: 'type',
              position: 'outside',
              textAlign: 'center',
            }}
          />
        );
      }
      if (node.otherProps?.chartType === 'bar') {
        return (
          <Bar
            data={node.otherProps.dataSource || []}
            yField={node.otherProps?.y}
            xField={node.otherProps?.x}
            label={{
              position: 'outside',
              textAlign: 'center',
            }}
          />
        );
      }
    }

    if (node.type === 'heading') {
      return (
        <Markdown key={index} remarkPlugins={[remarkGfm]}>
          {node.value}
        </Markdown>
      );
    }
    return (
      <Markdown
        key={index}
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => {
            return (
              <img
                {...props}
                style={{ maxWidth: '100%' }}
                crossOrigin="anonymous"
                alt="img"
              />
            );
          },
        }}
      >
        {node.value || ''}
      </Markdown>
    );
  };

  return (
    <div key={props.value?.toString()}>
      {items.map((index) => {
        const node = schemaMap.get(index) as NodeToSchemaType<{
          submitText?: string;
          x?: string | undefined;
        }>;
        if (!node) {
          console.log('node not found', index, schemaMap);
          return null;
        }

        const dom = <ErrorBoundary>{defaultRender(node, index)}</ErrorBoundary>;

        if (props.itemRender) {
          return props.itemRender(dom, node, index);
        }

        if (node.type === 'heading') {
          return dom;
        }
        return dom;
      })}
    </div>
  );
};

export default MessageRender;
