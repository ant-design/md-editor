import { Bar, Column, Line, Pie } from '@ant-design/charts';
import React from 'react';
import { RenderElementProps } from 'slate-react';

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
    <div {...attributes}>
      <div contentEditable={false}>
        {config.map(({ chartType, x, y, ...rest }, index) => {
          if (chartType === 'pie') {
            return (
              <div
                key={index}
                style={{
                  maxWidth: 400,
                  margin: 'auto',
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
      <div>{children}</div>
    </div>
  );
};
