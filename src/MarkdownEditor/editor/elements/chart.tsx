import { Bar, Column, Line, Pie } from '@ant-design/charts';
import { CodeOutlined, PieChartFilled } from '@ant-design/icons';
import {
  ProForm,
  ProFormList,
  ProFormSegmented,
  ProFormText,
} from '@ant-design/pro-components';
import { ConfigProvider, Popover } from 'antd';
import React, { useState } from 'react';
import { Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import { useEditorStore } from '../store';
import { ChartAttr } from '../tools/ChartAttr';
import { DragHandle } from '../tools/DragHandle';
import { EditorUtils } from '../utils/editorUtils';

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

export const Chart: React.FC<RenderElementProps> = (props) => {
  const store = useEditorStore();
  const [source, setSource] = useState(false);
  const { element: node, attributes, children } = props;
  const chartData =
    node.otherProps?.dataSource?.map((item: any) => {
      return {
        ...item,
        value: Number(item.value || '0'),
        column_list: Object.keys(item),
      };
    }) || [];

  const config = [node.otherProps?.config].flat(1);

  return (
    <div
      className={'drag-el'}
      {...attributes}
      data-be={'chart'}
      style={{
        marginBottom: 12,
      }}
      onDragStart={store.dragStart}
    >
      <DragHandle />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          border: store.readonly ? 'none' : '1px solid #eee',
        }}
      >
        {store.readonly ? null : (
          <ChartAttr
            node={node}
            options={[
              {
                icon: (
                  <Popover
                    title="配置图表"
                    content={
                      <ConfigProvider componentSize="small">
                        <ProForm
                          onFinish={(values) => {
                            const path = EditorUtils.findPath(
                              store.editor,
                              node,
                            );

                            Transforms.setNodes(
                              store.editor,
                              {
                                otherProps: {
                                  ...node.otherProps,
                                  config: values.config,
                                },
                              },
                              {
                                at: path,
                              },
                            );
                            setSource(false);
                          }}
                        >
                          <ProFormList
                            name="config"
                            creatorRecord={() => {
                              return {
                                chartType: 'bar',
                              };
                            }}
                            initialValue={[config].flat(1)}
                          >
                            <ProFormSegmented
                              name="chartType"
                              request={async () => {
                                return [
                                  {
                                    label: '饼图',
                                    value: 'pie',
                                  },
                                  {
                                    label: '柱状图',
                                    value: 'bar',
                                  },
                                  {
                                    label: '折线图',
                                    value: 'line',
                                  },
                                  {
                                    label: '柱状图',
                                    value: 'column',
                                  },
                                ];
                              }}
                            />
                            <ProFormText name="x" />
                            <ProFormText name="y" />
                          </ProFormList>
                        </ProForm>
                      </ConfigProvider>
                    }
                  >
                    📊
                  </Popover>
                ),
              },
              {
                icon: source ? <PieChartFilled /> : <CodeOutlined />,
                title: source ? '图表' : '源码',
                onClick: () => {
                  setSource(!source);
                },
              },
            ]}
          />
        )}
        {source ? (
          <table>
            <tbody>{children}</tbody>
          </table>
        ) : (
          <div
            style={{
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                width: '100%',
                opacity: 0,
              }}
            >
              {children}
            </div>
            {config.map(({ chartType, x, y, ...rest }, index) => {
              if (chartType === 'pie') {
                return (
                  <div
                    key={index}
                    style={{
                      maxWidth: 400,
                      margin: 'auto',
                      position: 'relative',
                      zIndex: 9,
                    }}
                  >
                    <Pie
                      data={chartData}
                      {...defaultPieConfig}
                      label={{
                        text: 'type',
                        position: 'outside',
                        textAlign: 'center',
                      }}
                    />
                  </div>
                );
              }
              if (chartType === 'bar') {
                return (
                  <div
                    key={index}
                    style={{
                      maxWidth: 400,
                      margin: 'auto',
                      position: 'relative',
                      zIndex: 9,
                    }}
                  >
                    <Bar
                      data={chartData || []}
                      yField={y}
                      xField={x}
                      label={{
                        position: 'outside',
                        textAlign: 'center',
                      }}
                      {...rest}
                    />
                  </div>
                );
              }

              if (chartType === 'line') {
                return (
                  <div
                    key={index}
                    style={{
                      maxWidth: 400,
                      margin: 'auto',
                      position: 'relative',
                      zIndex: 9,
                    }}
                  >
                    <Line
                      key={index}
                      data={chartData}
                      yField={y}
                      xField={x}
                      label={{
                        position: 'outside',
                        textAlign: 'center',
                      }}
                    />
                  </div>
                );
              }
              if (chartType === 'column') {
                return (
                  <div
                    key={index}
                    style={{
                      maxWidth: 400,
                      margin: 'auto',
                      position: 'relative',
                      zIndex: 9,
                    }}
                  >
                    <Column
                      data={chartData}
                      yField={y}
                      xField={x}
                      label={{
                        position: 'outside',
                        textAlign: 'center',
                      }}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
