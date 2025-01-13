import { Chart } from '@antv/g2';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { stringFormatNumber } from '../utils';
import { Container } from './Container';

export const Column: React.FC<{
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

  useEffect(() => {
    if (!htmlRef.current) return;
    const chart = new Chart({
      container: htmlRef.current!,
      autoFit: true,
      theme: 'agent',
    });

    const chartIn = chart
      .interval()
      .data(props.data)
      .encode('x', props.xField)
      .encode('y', props.yField)
      .axis('x', {
        label: { autoHide: false },
        labelFormatter: (value: number | string) => {
          return stringFormatNumber(value);
        },
      })
      .axis('y', {
        label: { autoHide: true },
        labelFormatter: (value: number | string) => {
          return stringFormatNumber(value);
        },
        tickLineWidth: 0,
      })
      .style({
        maxWidth: 10, // 圆角样式
        radiusTopLeft: 4,
        fillOpacity: 0.85,
        radiusTopRight: 4,
      });

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
  }, [htmlRef.current]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.changeData(props.data);
    chart.render();
  }, [props.data]);
  return (
    <Container chartRef={chartRef} htmlRef={htmlRef}>
      <div
        ref={htmlRef}
        style={{
          maxHeight: htmlRef.current?.clientWidth || '400px',
        }}
      ></div>
    </Container>
  );
};
