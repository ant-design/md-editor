import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export interface AreaChartDataset {
  /** 数据集标签，用于图例显示 */
  label: string;
  /** 数据值数组，与labels一一对应 */
  data: number[];
  /** 线条颜色，默认为主题色 */
  borderColor?: string;
  /** 填充区域颜色，默认使用borderColor的透明版本 */
  backgroundColor?: string;
  /** 数据点背景色，默认使用borderColor */
  pointBackgroundColor?: string;
  /** 数据点边框色，默认为白色 */
  pointBorderColor?: string;
  /** 线条宽度，默认为3 */
  borderWidth?: number;
  /** 曲线平滑度，0-1之间，0为直线，1为平滑曲线 */
  tension?: number;
}

export interface AreaChartConfig {
  /** X轴标签数组，定义每个数据点的标签 */
  labels: string[];
  /** 数据集数组，包含要显示的数据系列 */
  datasets: AreaChartDataset[];
  /** Y轴最大值，设置后Y轴不会超过此值 */
  yMax?: number;
  /** Y轴最小值，设置后Y轴不会低于此值 */
  yMin?: number;
  /** Y轴刻度步长，控制刻度间隔 */
  yStepSize?: number;
  /** 图表主题，影响颜色和背景 */
  theme?: 'dark' | 'light';
  /** 是否显示图例，默认true */
  showLegend?: boolean;
  /** 图例位置 */
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  /** 图例水平对齐方式 */
  legendAlign?: 'start' | 'center' | 'end';
  /** 是否显示网格线，默认true */
  showGrid?: boolean;
  /** X轴标题文本 */
  xTitle?: string;
  /** Y轴标题文本 */
  yTitle?: string;
  /** X轴位置 */
  xPosition?: 'top' | 'bottom';
  /** Y轴位置 */
  yPosition?: 'left' | 'right';
}

interface AreaChartProps {
  /** 面积图配置对象 */
  config: AreaChartConfig;
  /** 图表宽度，默认600px */
  width?: number;
  /** 图表高度，默认400px */
  height?: number;
  /** 自定义CSS类名 */
  className?: string;
}

const defaultColors = [
  '#1677ff',
  '#8954FC',
  '#15e7e4',
  '#F45BB5',
  '#00A6FF',
  '#33E59B',
  '#D666E4',
  '#6151FF',
  '#BF3C93',
  '#005EE0',
];

const AreaChart: React.FC<AreaChartProps> = ({
  config,
  width = 600,
  height = 400,
  className,
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const processedData: ChartData<'line'> = {
    labels: config.labels,
    datasets: config.datasets.map((dataset, index) => {
      const base = dataset.borderColor || defaultColors[index % defaultColors.length];
      return {
        label: dataset.label,
        data: dataset.data,
        borderColor: base,
        backgroundColor: dataset.backgroundColor || `${base}20`,
        pointBackgroundColor: dataset.pointBackgroundColor || base,
        pointBorderColor: dataset.pointBorderColor || '#fff',
        borderWidth: 3,
        tension: dataset.tension ?? 0,
        fill: true,
      } as any;
    }),
  };

  const isLight = config.theme === 'light';
  const axisTextColor = 'rgba(0, 25, 61, 0.3255)';
  const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)';

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: config.showLegend !== false,
        position: (config.legendPosition || 'bottom') as any,
        align: (config.legendAlign || 'start') as any,
        labels: {
          color: axisTextColor,
          font: { size: 12, weight: 'normal' },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)',
        titleColor: isLight ? '#333' : '#fff',
        bodyColor: isLight ? '#333' : '#fff',
        borderColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const y = context.parsed.y;
            return `${label}: ${y}`;
          },
        },
      },
    },
    scales: {
      x: {
        position: (config.xPosition || 'bottom') as any,
        title: {
          display: !!config.xTitle,
          text: config.xTitle,
          color: axisTextColor,
          font: { size: 12, weight: 'normal' },
          align: 'end',
        },
        grid: {
          display: config.showGrid !== false,
          color: gridColor,
          lineWidth: 1,
          drawTicks: false,
          tickLength: 0,
        },
        ticks: {
          color: axisTextColor,
          font: { size: 12 },
          padding: 12,
        },
        border: {
          color: gridColor,
        },
      },
      y: {
        position: (config.yPosition || 'left') as any,
        beginAtZero: config.yMin === undefined ? true : config.yMin === 0,
        min: config.yMin,
        max: config.yMax,
        title: {
          display: !!config.yTitle,
          text: config.yTitle,
          color: axisTextColor,
          font: { size: 12, weight: 'normal' },
          align: 'end',
        },
        grid: {
          display: config.showGrid !== false,
          color: gridColor,
          lineWidth: 1,
          drawTicks: false,
          tickLength: 0,
        },
        ticks: {
          stepSize: config.yStepSize,
          color: axisTextColor,
          font: { size: 12 },
          padding: 12,
        },
        border: {
          color: gridColor,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 0,
        borderWidth: 0,
      },
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: isLight ? '#fff' : '#1a1a1a',
        borderRadius: '8px',
        padding: '20px',
        position: 'relative',
        border: isLight ? '1px solid #e8e8e8' : 'none',
      }}
    >
      <Line ref={chartRef} data={processedData} options={options} width={width - 40} height={height - 40} />
    </div>
  );
};

export default AreaChart;


