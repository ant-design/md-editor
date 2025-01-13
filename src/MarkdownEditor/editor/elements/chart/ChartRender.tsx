import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { ConfigProvider, Descriptions, Dropdown, Popover, Table } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useMemo, useState } from 'react';
import { ChartAttrToolBar } from './ChartAttrToolBar';
import { Area, Bar, Column, Line, Pie } from './ChartMark';

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
  descriptions: {
    title: '定义列表',
    changeData: ['column', 'line', 'area', 'table', 'pie'],
  },
};

/**
 * 生成图表组件的函数，根据图表类型和配置返回相应的图表组件。
 *
 * @param chartType - 图表类型，可以是 'pie'、'bar'、'line'、'column'、'area' 或 'descriptions'。
 * @param chartData - 图表数据，记录数组。
 * @param config - 图表配置对象，包括以下属性：
 *   @param config.defaultProps - 默认属性。
 *   @param config.height - 图表高度。
 *   @param config.x - x 轴字段。
 *   @param config.y - y 轴字段。
 *   @param config.rest - 其他配置。
 *   @param config.index - 可选，图表索引。
 *   @param config.chartData - 可选，图表数据。
 *   @param config.columns - 可选，列配置。
 *
 * @returns 返回相应的图表组件。
 */
export const ChartRender = (props: {
  chartType:
    | 'pie'
    | 'bar'
    | 'line'
    | 'column'
    | 'area'
    | 'descriptions'
    | 'table';
  chartData: Record<string, any>[];
  config: {
    defaultProps: any;
    height: any;
    x: any;
    y: any;
    rest: any;
    index?: any;
    chartData?: any;
    columns?: any;
  };
  node?: any;
  title?: any;
  isChartList?: boolean;
  columnLength?: number;
  onColumnLengthChange?: (value: number) => void;
}) => {
  const [chartType, setChartType] = useState<
    'pie' | 'bar' | 'line' | 'column' | 'area' | 'descriptions' | 'table'
  >(() => props.chartType);
  const {
    chartData,
    node,
    isChartList,
    onColumnLengthChange,
    columnLength,
    title,
  } = props;

  const [config, setConfig] = useState(() => props.config);
  /**
   * 图表配置
   */
  const getChartPopover = () =>
    [
      <Dropdown
        key="dropdown"
        menu={{
          items:
            ChartMap[chartType as 'pie']?.changeData?.map((key: string) => {
              return {
                key,
                label: ChartMap[key as 'pie'].title,
                onClick: () => {
                  setChartType(key as 'pie');
                },
              };
            }) || [],
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
          {ChartMap[chartType]?.title}
          <DownOutlined
            style={{
              fontSize: 8,
            }}
          />
        </span>
      </Dropdown>,
      isChartList ? (
        <Dropdown
          key="dropdown"
          menu={{
            items: new Array(4).fill(0).map((_, i) => {
              return {
                key: i + 1,
                label: i + 1,
                onClick: () => {
                  onColumnLengthChange?.(i + 1);
                },
              };
            }),
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
            {columnLength} 列
            <DownOutlined
              style={{
                fontSize: 8,
              }}
            />
          </span>
        </Dropdown>
      ) : null,
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
              initialValues={config}
              onFinish={(values) => {
                setConfig({
                  ...props.config,
                  ...values,
                });
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
                    options={config.columns
                      ?.filter((item: any) => item.title)
                      ?.map((item: any) => {
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
                    options={config.columns
                      ?.filter((item: any) => item.title)
                      ?.map((item: any) => {
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
    ].filter((item) => !!item) as JSX.Element[];

  const chartDom = useMemo(() => {
    if (chartType === 'table') {
      return (
        <div
          key={config?.index}
          contentEditable={false}
          style={{
            margin: 12,
            overflow: 'auto',
            border: '1px solid #eee',
            borderRadius: 18,
            flex: 1,
            maxWidth: 'calc(100% - 32px)',
            maxHeight: 400,
            userSelect: 'none',
          }}
        >
          <Table
            size="small"
            dataSource={chartData}
            columns={config?.columns}
            pagination={false}
            rowKey={(record) => record.key}
          />
        </div>
      );
    }
    if (chartType === 'pie') {
      return (
        <Pie
          index={config?.index}
          key={config?.index}
          data={chartData}
          yField={config?.y || 'value'}
          xField={config?.x || 'type'}
        />
      );
    }
    if (chartType === 'bar') {
      return (
        <Bar
          data={chartData}
          index={config?.index}
          yField={config?.y}
          key={config?.index}
          xField={config?.x}
          height={config?.height || 400}
          {...config?.rest}
          title=""
        />
      );
    }

    if (chartType === 'line') {
      return (
        <Line
          key={config?.index}
          index={config?.index}
          data={chartData}
          yField={config?.y}
          xField={config?.x}
          {...config?.defaultProps}
          height={config?.height || 400}
          {...config?.rest}
          title=""
        />
      );
    }
    if (chartType === 'column') {
      return (
        <Column
          key={config?.index}
          index={config?.index}
          data={chartData}
          yField={config?.y}
          xField={config?.x}
          {...config?.defaultProps}
          height={config?.height || 400}
          {...config?.rest}
          title=""
        />
      );
    }
    if (chartType === 'area') {
      return (
        <Area
          key={config?.index}
          data={chartData}
          index={config?.index}
          yField={config?.y}
          xField={config?.x}
          height={config?.height || 400}
          {...config?.rest}
          title=""
        />
      );
    }
    if (
      chartType === 'descriptions' ||
      (chartData.length < 2 && config?.columns.length > 8)
    ) {
      return (
        <div
          key={config?.index}
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
                key={config?.index}
                column={{
                  xxl: 2,
                  xl: 2,
                  lg: 2,
                  md: 2,
                  sm: 1,
                  xs: 1,
                }}
                items={
                  config?.columns
                    .map((column: { title: string; dataIndex: string }) => {
                      if (!column.title || !column.dataIndex) return null;
                      return {
                        label: column.title || '',
                        children: row[column.dataIndex],
                      };
                    })
                    .filter((item: any) => !!item) as DescriptionsItemType[]
                }
              />
            );
          })}
        </div>
      );
    }
  }, [chartType, JSON.stringify(chartData), JSON.stringify(config)]);

  const toolBar = getChartPopover();

  if (!chartDom) return null;
  return (
    <div>
      <div
        style={{
          userSelect: 'none',
        }}
        contentEditable={false}
      >
        <ChartAttrToolBar
          title={title || ''}
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
            {
              style: { padding: 0 },
              icon: toolBar.at(2),
            },
          ]}
        />
      </div>
      {chartDom ?? null}
    </div>
  );
};
