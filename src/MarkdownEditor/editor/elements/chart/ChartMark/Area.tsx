import { Chart } from '@antv/g2';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { Container } from './Container';

export const Area: React.FC<{
  data: any[];
  xField: string;
  yField: string;
  colorLegend?: string;
  chartRef?: React.MutableRefObject<Chart | undefined>;
}> = (props) => {
  const chartRef = React.useRef<Chart>(undefined);
  const htmlRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(props.chartRef, () => chartRef.current, [
    chartRef.current,
  ]);

  const initChart = () => {
    if (!htmlRef.current) return;
    if (chartRef.current) return;
    const chart = new Chart({
      container: htmlRef.current!,
      autoFit: true,
      theme: 'agent',
    });

    const chartIn = chart
      .area()
      .data(props.data)
      .encode('x', props.xField)
      .encode('y', props.yField)
      .axis('x', { title: false })
      .axis('y', { title: false })
      .style('fillOpacity', 0.3);

    chart
      .line()
      .encode('x', props.xField)
      .encode('y', props.yField)
      .style('strokeWidth', 1)
      .style('fillOpacity', 0.3)
      .tooltip(false);

    if (props.colorLegend) {
      chartIn.encode('color', props.colorLegend).transform({ type: 'dodgeX' });
    }
    chartRef.current = chart;
    chart.render();
    return () => {
      if (!chart) return;
      chart.clear();
      chart.destroy();
    };
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.changeData(props.data);
    chart.render();
  }, [props.data]);
  return (
    <Container
      chartRef={chartRef}
      htmlRef={htmlRef}
      onShow={() => {
        initChart();
      }}
      onHidden={() => {}}
    />
  );
};
