import { Area, Bar, Column, Line, Pie } from '@ant-design/charts';
import { CodeOutlined, PieChartFilled } from '@ant-design/icons';
import {
  ProForm,
  ProFormList,
  ProFormSegmented,
  ProFormText,
} from '@ant-design/pro-components';
import { ConfigProvider, Popover } from 'antd';
import React, { useMemo, useState } from 'react';
import { Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import { useEditorStore } from '../store';
import { ChartAttr } from '../tools/ChartAttr';
import { DragHandle } from '../tools/DragHandle';
import { EditorUtils } from '../utils/editorUtils';

/**
 * 转化数字，将字符串转化为数字，即使非标准数字也可以转化
 * @param val
 * @param locale
 * @returns
 */
function reverseFormatNumber(val: string, locale: any) {
  let group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
  let decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
  let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
  reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
  return Number.isNaN(reversedVal) ? NaN : Number(reversedVal);
}

/**
 * 转化数字，转化不成功继续用string
 * @param value
 * @returns
 */
const numberString = (value: string) => {
  if (!value) return value;
  try {
    if (typeof value === 'number') return value;

    if (typeof value === 'string') {
      const formattedValue = reverseFormatNumber(value, 'en-US');
      if (!isNaN(formattedValue)) return formattedValue;
    }
    return value;
  } catch (error) {
    return value;
  }
};
const intl = new Intl.NumberFormat('en-US', {
  style: 'decimal',
});

const stringFormatNumber = (value: string | number) => {
  if (!value) return value;
  try {
    if (typeof value === 'string') return value;

    if (typeof value === 'number') {
      return intl.format(Number(value));
    }
    return value;
  } catch (error) {
    return value;
  }
};

const defaultPieConfig = {
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
  let chartData = useMemo(() => {
    return (
      node.otherProps?.dataSource?.map((item: any) => {
        return {
          ...item,
          column_list: Object.keys(item),
        };
      }) || []
    );
  }, [node.otherProps?.dataSource]);

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
                                    label: '条形图',
                                    value: 'bar',
                                  },
                                  {
                                    label: '折线图',
                                    value: 'line',
                                  },
                                  {
                                    label: '面积图',
                                    value: 'area',
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
              padding: 24,
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
              chartData = chartData.map((item: any) => {
                return {
                  ...item,
                  [x]: numberString(item[x]),
                  [y]: numberString(item[y]),
                };
              });
              const defaultProps = {
                tooltip: {
                  title: (d: any) => {
                    return d[x];
                  },
                  items: [
                    {
                      field: y,
                      valueFormatter: (value: string) => {
                        return stringFormatNumber(value);
                      },
                    },
                  ],
                },
                axis: {
                  x: {
                    labelFormatter: (value: number | string) => {
                      return stringFormatNumber(value);
                    },
                  },
                  y: {
                    labelFormatter: (value: number | string) => {
                      return stringFormatNumber(value);
                    },
                  },
                },
                label: {
                  position: 'inside',
                  fill: '#fff',
                  fillOpacity: 1,
                  background: true,
                  backgroundFill: 'rgb(23, 131, 255)',
                  backgroundPadding: [4, 6, 4, 6],
                  backgroundRadius: 4,
                  fontSize: 13,
                  opacity: 1,
                  textAlign: 'center',
                  formatter: (value: number) => {
                    return stringFormatNumber(value);
                  },
                },
              };
              if (chartType === 'pie') {
                return (
                  <div
                    key={index}
                    style={{
                      maxWidth: 600,
                      margin: 'auto',
                      position: 'relative',
                      zIndex: 9,
                    }}
                  >
                    <Pie
                      data={chartData}
                      {...defaultPieConfig}
                      angleField={y}
                      colorField={x}
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
                      maxWidth: 600,
                      margin: 'auto',
                      position: 'relative',
                      zIndex: 9,
                    }}
                  >
                    <Bar
                      data={chartData}
                      yField={y}
                      xField={x}
                      {...defaultProps}
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
                      maxWidth: 600,
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
                      {...defaultProps}
                      {...rest}
                    />
                  </div>
                );
              }
              if (chartType === 'column') {
                return (
                  <div
                    key={index}
                    style={{
                      maxWidth: 600,
                      margin: 'auto',
                      position: 'relative',
                      zIndex: 9,
                    }}
                  >
                    <Column
                      data={chartData}
                      yField={y}
                      xField={x}
                      {...defaultProps}
                      {...rest}
                    />
                  </div>
                );
              }
              if (chartType === 'area') {
                return (
                  <div
                    key={index}
                    style={{
                      maxWidth: 600,
                      margin: 'auto',
                      position: 'relative',
                      zIndex: 9,
                    }}
                  >
                    <Area
                      data={chartData}
                      yField={y}
                      xField={x}
                      {...{
                        style: {
                          fill: 'rgb(23, 131, 255)',
                          opacity: 0.7,
                        },
                      }}
                      {...defaultProps}
                      {...rest}
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
