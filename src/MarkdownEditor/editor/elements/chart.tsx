import { Area, Bar, Column, Line, Pie } from '@ant-design/charts';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { ConfigProvider, Descriptions, Dropdown, Popover } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import React, { useMemo } from 'react';
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
  color: '#1677ff',
  height: 400,
  scale: {
    color: {
      type: 'ordinal',
      range: [
        '#1677ff',
        '#15e7e4',
        '#8954FC',
        '#F45BB5',
        '#00A6FF',
        '#33E59B',
        '#D666E4',
        '#6151FF',
        '#BF3C93',
        '#005EE0',
      ],
    },
  },
};

const ChartMap = {
  pie: {
    title: '饼图',
    changeData: ['table'],
  },
  bar: {
    title: '条形图',
    changeData: ['column', 'line', 'area', 'table'],
  },
  line: {
    title: '折线图',
    changeData: ['column', 'line', 'area', 'table'],
  },
  column: {
    title: '柱状图',
    changeData: ['column', 'line', 'area', 'table'],
  },
  area: {
    title: '面积图',
    changeData: ['column', 'line', 'area', 'table'],
  },
  table: {
    title: '表格',
    changeData: ['column', 'line', 'area', 'table', 'pie'],
  },
};

export const Chart: React.FC<RenderElementProps> = (props) => {
  const store = useEditorStore();
  const { element: node, attributes, children } = props;
  let chartData = useMemo(() => {
    return (node.otherProps?.dataSource?.map((item: any) => {
      return {
        ...item,
        column_list: Object.keys(item),
      };
    }) || []) as any[];
  }, [node.otherProps?.dataSource]);

  const columns = (node as TableNode).otherProps?.columns || [];

  const config = [node.otherProps?.config].flat(1);

  /**
   * 图表配置
   */
  const getChartPopover = (index: number) => [
    <Dropdown
      key="dropdown"
      menu={{
        items:
          ChartMap[config.at(index).chartType as 'pie']?.changeData?.map(
            (key: string) => {
              return {
                key,
                label: ChartMap[key as 'pie'].title,
                onClick: () => {
                  const path = EditorUtils.findPath(store.editor, node);
                  const config = [
                    JSON.parse(JSON.stringify(node.otherProps?.config || [])),
                  ].flat(1);
                  config[index] = {
                    ...config?.at(index),
                    chartType: key,
                  };

                  Transforms.setNodes(
                    store.editor,
                    {
                      otherProps: {
                        ...node.otherProps,
                        config: config,
                      },
                    },
                    {
                      at: path,
                    },
                  );
                },
              };
            },
          ) || [],
      }}
    >
      <span
        style={{
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          border: '1px solid #f0f0f0',
          padding: '4px 12px',
          borderRadius: 14,
        }}
      >
        {ChartMap[(config.at(index)?.chartType as 'bar') || 'bar']?.title}
        <DownOutlined
          style={{
            fontSize: 8,
          }}
        />
      </span>
    </Dropdown>,
    <Popover
      key="config"
      title="配置图表"
      trigger={'click'}
      content={
        <ConfigProvider componentSize="small">
          <ProForm
            submitter={{
              searchConfig: {
                submitText: '更新',
              },
            }}
            style={{
              width: 300,
            }}
            initialValues={
              config.at(index) || {
                x: '',
                y: '',
              }
            }
            onFinish={(values) => {
              const path = EditorUtils.findPath(store.editor, node);
              const config = JSON.parse(
                JSON.stringify(node.otherProps?.config || []),
              );

              config[index] = {
                ...config.at(index),
                ...values,
              };

              Transforms.setNodes(
                store.editor,
                {
                  otherProps: {
                    ...node.otherProps,
                    config: config,
                  },
                },
                {
                  at: path,
                },
              );
            }}
          >
            <div
              style={{
                maxHeight: '70vh',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                }}
              >
                <ProFormSelect
                  label="X轴"
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
                  label="Y轴"
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
              </div>
            </div>
          </ProForm>
        </ConfigProvider>
      }
    >
      <span
        style={{
          padding: '4px 8px',
        }}
      >
        <SettingOutlined />
      </span>
    </Popover>,
  ];

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
        className="chart-box"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 18,
          overflow: 'auto',
        }}
      >
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

                  if (chartType === 'table') {
                    return (
                      <div
                        key={index}
                        contentEditable={store.readonly ? false : true}
                        style={{
                          margin: 12,
                          borderRadius: 16,
                          border:
                            // 只有一个图表时不显示边框，用消息框自己的
                            config.length < 2 &&
                            store?.editor?.children?.length < 2
                              ? 'none'
                              : '1px solid #eee',
                        }}
                      >
                        <table contentEditable={store.readonly ? false : true}>
                          <tbody>{children}</tbody>
                        </table>
                      </div>
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
                        label: { autoHide: true },
                        labelFormatter: (value: number | string) => {
                          return stringFormatNumber(value);
                        },
                      },
                      y: {
                        title: y,
                        label: { autoHide: true },
                        labelFormatter: (value: number | string) => {
                          return stringFormatNumber(value);
                        },
                      },
                    },
                    style: {
                      maxWidth: 20, // 圆角样式
                      radiusTopLeft: 4,
                      radiusTopRight: 4,
                    },
                    label: false,
                    height: 400,
                    legend: {
                      color: {
                        title: false,
                        position: 'right',
                        rowPadding: 5,
                      },
                    },
                    color: [
                      '#1677ff',
                      '#15e7e4',
                      '#8954FC',
                      '#F45BB5',
                      '#00A6FF',
                      '#33E59B',
                      '#D666E4',
                      '#6151FF',
                      '#BF3C93',
                      '#005EE0',
                    ],
                    scale: {
                      color: {
                        type: 'ordinal',
                        range: [
                          '#1677ff',
                          '#15e7e4',
                          '#8954FC',
                          '#F45BB5',
                          '#00A6FF',
                          '#33E59B',
                          '#D666E4',
                          '#6151FF',
                          '#BF3C93',
                          '#005EE0',
                        ],
                      },
                    },
                  };
                  if (chartType === 'pie') {
                    return (
                      <Pie
                        key={index}
                        data={chartData}
                        {...defaultPieConfig}
                        angleField={y || 'value'}
                        colorField={x || 'type'}
                        interaction={{
                          elementHighlight: {
                            background: 'true',
                          },
                        }}
                        innerRadius={0.6}
                        legend={{
                          ['color']: {
                            position: 'right',
                            title: false,
                            rowPadding: 5,
                          },
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
                              items={
                                columns
                                  .map(
                                    (column: {
                                      title: string;
                                      dataIndex: string;
                                    }) => {
                                      if (!column.title || !column.dataIndex)
                                        return null;
                                      return {
                                        label: column.title || '',
                                        children: row[column.dataIndex],
                                      };
                                    },
                                  )
                                  .filter(
                                    (item: any) => !!item,
                                  ) as DescriptionsItemType[]
                              }
                            />
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                })
                .map((item, index) => {
                  const toolBar = getChartPopover(index);
                  return (
                    <div
                      key={index}
                      style={{
                        border:
                          // 只有一个图表时不显示边框，用消息框自己的
                          config.length < 2 &&
                          store?.editor?.children?.length < 2
                            ? 'none'
                            : '1px solid #eee',
                        borderRadius: 18,
                        margin: 'auto',
                        overflow: 'auto',
                        minWidth: 300,
                        maxWidth: 600,
                        flex: 1,
                      }}
                    >
                      <div contentEditable={false}>
                        <ChartAttr
                          node={node}
                          options={[
                            {
                              style: { padding: 0 },
                              icon: toolBar.at(0),
                            },
                            {
                              style: { padding: 0 },
                              icon: toolBar.at(1),
                            },
                          ]}
                        />
                      </div>
                      {item}
                    </div>
                  );
                })}
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};
