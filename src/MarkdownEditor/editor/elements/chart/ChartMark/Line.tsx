import { Chart } from '@antv/g2';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { Container } from './Container';
import { ChartProps } from './useChart';

export const Line: React.FC<ChartProps> = (props) => {
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
      .line()
      .data(props.data)
      .encode('x', props.xField)
      .encode('y', props.yField)
      .axis('x', { title: false })
      .axis('y', { title: false })
      .style('fillOpacity', 0.3);

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

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    chart.clear();
    chart.destroy();
    chartRef.current = undefined;
    initChart();
  }, [props.xField, props.yField, props.colorLegend]);
  return (
    <Container
      index={props.index}
      chartRef={chartRef}
      htmlRef={htmlRef}
      onShow={() => {
        initChart();
      }}
      onHidden={() => {}}
    />
  );
};
