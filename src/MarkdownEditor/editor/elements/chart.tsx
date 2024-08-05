import { Area, Bar, Column, Line, Pie } from '@ant-design/charts';
import { CodeOutlined, PieChartFilled } from '@ant-design/icons';
import {
  ProForm,
  ProFormList,
  ProFormSegmented,
  ProFormSelect,
} from '@ant-design/pro-components';
import { ConfigProvider, Descriptions, Popover } from 'antd';
import React, { useMemo, useState } from 'react';
import { Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import { TableNode } from '../../el';
import { useEditorStore } from '../store';
import { ChartAttr } from '../tools/ChartAttr';
import { DragHandle } from '../tools/DragHandle';
import { EditorUtils } from '../utils/editorUtils';
import { ErrorBoundary } from './ErrorBoundary';

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

  const columns = (node as TableNode).otherProps?.columns || [];

  const config = [node.otherProps?.config].flat(1);

  /**
   * 图表配置
   */
  const chartPopover = (
    <Popover
      title="配置图表"
      content={
        <ConfigProvider componentSize="small">
          <ProForm
            submitter={{
              searchConfig: {
                submitText: '更新',
              },
            }}
            onFinish={(values) => {
              const path = EditorUtils.findPath(store.editor, node);
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
              <ProFormSelect
                name="x"
                fieldProps={{
                  onClick: (e) => {
                    e.stopPropagation();
                  },
                }}
                options={columns
                  ?.filter((item) => item.title)
                  ?.map((item) => {
                    return {
                      label: item.title,
                      value: item.dataIndex,
                    };
                  })}
              />
              <ProFormSelect
                name="y"
                fieldProps={{
                  onClick: (e) => {
                    e.stopPropagation();
                  },
                }}
                options={columns
                  ?.filter((item) => item.title)
                  ?.map((item) => {
                    return {
                      label: item.title,
                      value: item.dataIndex,
                    };
                  })}
              />
            </ProFormList>
          </ProForm>
        </ConfigProvider>
      }
    >
      📊
    </Popover>
  );

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
          overflow: 'auto',
          border: store.readonly ? 'none' : '1px solid #eee',
        }}
      >
        {store.readonly ? (
          <ChartAttr
            node={node}
            options={[
              {
                icon: chartPopover,
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
        ) : (
          <ChartAttr
            node={node}
            options={[
              {
                icon: chartPopover,
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
          <table contentEditable={store.readonly ? false : true}>
            <tbody>{children}</tbody>
          </table>
        ) : (
          <ErrorBoundary
            fallback={
              <table>
                <tbody>{children}</tbody>
              </table>
            }
          >
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
                  height: '100%',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                {children}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {config
                  .map(({ chartType, x, y, ...rest }, index) => {
                    if (
                      typeof window === 'undefined' ||
                      typeof document === 'undefined'
                    ) {
                      return (
                        <div
                          key={index}
                          style={{
                            maxWidth: 600,
                            margin: 'auto',
                            position: 'relative',
                            zIndex: 9,
                          }}
                        ></div>
                      );
                    }
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
                          title: x,
                          labelFormatter: (value: number | string) => {
                            return stringFormatNumber(value);
                          },
                        },
                        y: {
                          title: y,
                          labelFormatter: (value: number | string) => {
                            return stringFormatNumber(value);
                          },
                        },
                      },
                      label: false,
                    };
                    if (chartType === 'pie') {
                      return (
                        <Pie
                          key={index}
                          data={chartData}
                          {...defaultPieConfig}
                          angleField={y}
                          colorField={x}
                          legend={{
                            navEffect: 'linear',
                          }}
                          interaction={{
                            elementHighlight: {
                              background: 'true',
                            },
                          }}
                          label={{
                            position: 'spider',
                            text: (d: any) => `${d[x]} (${d[y]})`,
                          }}
                        />
                      );
                    }
                    if (chartType === 'bar') {
                      return (
                        <Bar
                          data={chartData}
                          yField={y}
                          key={index}
                          xField={x}
                          {...defaultProps}
                          {...rest}
                        />
                      );
                    }

                    if (chartType === 'line') {
                      return (
                        <Line
                          key={index}
                          data={chartData}
                          yField={y}
                          xField={x}
                          {...defaultProps}
                          {...rest}
                        />
                      );
                    }
                    if (chartType === 'column') {
                      return (
                        <Column
                          key={index}
                          data={chartData}
                          yField={y}
                          xField={x}
                          {...defaultProps}
                          {...rest}
                        />
                      );
                    }
                    if (chartType === 'area') {
                      return (
                        <Area
                          key={index}
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
                      );
                    }
                    if (
                      chartType === 'descriptions' ||
                      (chartData.length < 2 && columns.length > 8)
                    ) {
                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                          }}
                        >
                          {chartData.map((row: Record<string, any>) => {
                            return (
                              <Descriptions
                                bordered
                                key={index}
                                column={{
                                  xxl: 2,
                                  xl: 2,
                                  lg: 2,
                                  md: 2,
                                  sm: 1,
                                  xs: 1,
                                }}
                                items={columns
                                  .map(
                                    (column: {
                                      title: string;
                                      dataIndex: string;
                                    }) => {
                                      console.log(column.title);
                                      if (!column.title || !column.dataIndex)
                                        return null;
                                      return {
                                        label: column.title,
                                        children: row[column.dataIndex],
                                      };
                                    },
                                  )
                                  .filter((item: any) => !!item)}
                              />
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  })
                  .map((item, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          borderRadius: 4,
                          width: '50%',
                          minWidth: 260,
                          flex: 1,
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
              </div>
            </div>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};
