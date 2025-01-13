import { Chart } from '@antv/g2';

export type ChartProps = {
  data: any[];
  xField: string;
  yField: string;
  index: number;
  colorLegend?: string;
  chartRef?: React.MutableRefObject<Chart | undefined>;
};
