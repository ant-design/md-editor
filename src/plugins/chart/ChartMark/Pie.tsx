﻿import { Chart } from '@antv/g2';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { defaultColorList } from '../const';
import { Container } from './Container';
import { ChartProps } from './useChart';

export const Pie: React.FC<ChartProps> = (props) => {
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

    chart
      .interval()
      .data(props.data)
      .legend('color', {
        position: 'bottom',
        layout: { justifyContent: 'center' },
      })
      .coordinate({ type: 'theta', outerRadius: 0.8, innerRadius: 0.5 })
      .encode('y', props.yField)
      .encode('color', props.xField)
      .scale('color', {
        range: defaultColorList,
      });

    chartRef.current = chart;

    setTimeout(() => {
      chart.render();
    }, 16);

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
