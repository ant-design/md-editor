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
  const { element: node } = props;
  const chartData =
    node.otherProps?.dataSource?.map((item: any) => {
      return {
        ...item,
        value: Number(item.value || '0'),
        column_list: Object.keys(item),
      };
    }) || [];
  const chartType = node.otherProps?.chartType;
  if (chartType === 'pie') {
    return (
      <div
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
        style={{
          maxWidth: 400,
          margin: 'auto',
        }}
      >
        <Bar
          data={chartData || []}
          yField={node.otherProps?.y}
          xField={node.otherProps?.x}
          label={{
            position: 'outside',
            textAlign: 'center',
          }}
        />{' '}
      </div>
    );
  }

  if (chartType === 'line') {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: 'auto',
        }}
      >
        <Line
          data={chartData}
          yField={node.otherProps?.y}
          xField={node.otherProps?.x}
          label={{
            position: 'outside',
            textAlign: 'center',
          }}
        />
      </div>
    );
  }
  if (node.otherProps?.chartType === 'column') {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: 'auto',
        }}
      >
        <Column
          data={chartData}
          yField={node.otherProps?.y}
          xField={node.otherProps?.x}
          label={{
            position: 'outside',
            textAlign: 'center',
          }}
        />
      </div>
    );
  }

  return null;
};
