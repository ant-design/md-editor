import { Area, Bar, Column, Line, Pie } from '@ant-design/charts';
import { Descriptions } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import React from 'react';

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
export const AutoSizeChart = (
  chartType: 'pie' | 'bar' | 'line' | 'column' | 'area' | 'descriptions',
  chartData: Record<string, any>[],
  config: {
    defaultProps: any;
    height: any;
    x: any;
    y: any;
    rest: any;
    index?: any;
    chartData?: any;
    columns?: any;
  },
) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  if (chartType === 'pie') {
    return (
      <Pie
        ref={chartRef}
        key={config?.index}
        data={chartData}
        {...defaultPieConfig}
        height={config?.height || 400}
        angleField={config?.y || 'value'}
        colorField={config?.x || 'type'}
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
        title=""
      />
    );
  }
  if (chartType === 'bar') {
    return (
      <Bar
        data={chartData}
        yField={config?.y}
        key={config?.index}
        xField={config?.x}
        {...config?.defaultProps}
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
        yField={config?.y}
        xField={config?.x}
        {...{
          style: {
            fill: 'rgb(23, 131, 255)',
            opacity: 0.7,
          },
        }}
        {...config?.defaultProps}
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

  return null;
};
