import { Bar, Pie } from '@ant-design/charts';
import { DragOutlined, SendOutlined } from '@ant-design/icons';
import {
  NodeToSchemaType,
  mdToJsonSchema,
} from '@ant-design/md-to-json-schema';
import { BetaSchemaForm, ProConfigProvider } from '@ant-design/pro-components';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

export function SortableItem(props: {
  id: any;
  children: React.ReactNode;
  drag?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.id,
    });

  if (transform) {
    transform.scaleX = 1;
    transform.scaleY = 1;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  if (props.drag === true) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          gap: 8,
          position: 'relative',
        }}
        {...attributes}
      >
        {React.cloneElement(props.children as React.ReactElement, {
          ...(props.children as React.ReactElement)?.props,
          dragHandle: (
            <div ref={setNodeRef} {...listeners}>
              <DragOutlined />
            </div>
          ),
        })}
      </div>
    );
  }
  return props.children;
}

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
              node.otherProps.data?.map((item) => {
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
            data={node.otherProps.data || []}
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as unknown as number);
        const newIndex = items.indexOf(over.id as unknown as number);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      key={props.value?.toString()}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((index) => {
          const node = schemaMap.get(index) as NodeToSchemaType<{
            submitText?: string;
            x?: string | undefined;
          }>;
          if (!node) {
            console.log('node not found', index, schemaMap);
            return null;
          }

          const dom = (
            <ErrorBoundary>{defaultRender(node, index)}</ErrorBoundary>
          );

          if (props.itemRender) {
            return (
              <SortableItem id={index} key={index} drag={props.drag}>
                {props.itemRender(dom, node, index)}
              </SortableItem>
            );
          }

          if (node.type === 'heading') {
            return (
              <SortableItem id={index} key={index}>
                {dom}
              </SortableItem>
            );
          }
          return (
            <SortableItem id={index} key={index} drag={props.drag}>
              {dom}
            </SortableItem>
          );
        })}
      </SortableContext>
    </DndContext>
  );
};

export default MessageRender;
