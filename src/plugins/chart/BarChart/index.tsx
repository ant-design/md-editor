import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface BarChartDataset {
  /** 数据集标签，用于图例显示 */
  label: string;
  /** 数据值数组，与labels一一对应 */
  data: number[];
  /** 柱子边框颜色，默认为主题色 */
  borderColor?: string;
  /** 柱子填充颜色，默认使用borderColor */
  backgroundColor?: string;
  /** 边框宽度，默认为0（无边框） */
  borderWidth?: number;
}

export interface BarChartConfig {
  /** X轴标签数组，定义每个数据点的标签 */
  labels: string[];
  /** 数据集数组，包含要显示的数据系列 */
  datasets: BarChartDataset[];
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
  /** 柱子固定厚度（像素），设置后所有柱子宽度相同 */
  barThickness?: number;
  /** 类别宽度百分比，0-1之间，控制柱子组的宽度 */
  categoryPercentage?: number;
  /** 单个柱子宽度百分比，0-1之间，相对于类别宽度 */
  barPercentage?: number;
  /** X轴位置 */
  xPosition?: 'top' | 'bottom';
  /** Y轴位置 */
  yPosition?: 'left' | 'right';
  /** 是否启用堆叠显示，将多个数据集叠加显示 */
  stacked?: boolean;
  /** 图表轴向，'x'为垂直柱状图，'y'为水平柱状图 */
  indexAxis?: 'x' | 'y';
}

interface BarChartProps {
  config: BarChartConfig;
  width?: number;
  height?: number;
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

const BarChart: React.FC<BarChartProps> = ({ config, width = 600, height = 400, className }) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const processedData: ChartData<'bar'> = {
    labels: config.labels,
    datasets: config.datasets.map((dataset, index) => {
      const base = dataset.borderColor || defaultColors[index % defaultColors.length];
      return {
        label: dataset.label,
        data: dataset.data,
        borderColor: base,
        backgroundColor: dataset.backgroundColor || base,
        borderWidth: 0,
        barThickness: config.barThickness,
        categoryPercentage: config.categoryPercentage ?? 0.7,
        barPercentage: config.barPercentage ?? 0.8,
        stack: config.stacked ? 'stack' : undefined,
        borderRadius: ((ctx: any) => {
          const rawValue = ctx?.raw;
          const value = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);
          const isHorizontal = (config.indexAxis || 'x') === 'y';
          const radius = 6;
          const chart = ctx?.chart as import('chart.js').Chart<'bar'>;

          // When stacked, only the outermost (top) segment of the same sign gets radius
          let isTopOfStack = true;
          if (config.stacked && chart) {
            const dsIndex = ctx?.datasetIndex as number;
            const dIndex = ctx?.dataIndex as number;
            const currentStack = chart.data.datasets?.[dsIndex]?.stack;
            const sameStackIndexes = chart.data.datasets
              .map((_, i) => i)
              .filter((i) => {
                const ds: any = chart.data.datasets?.[i];
                if (!chart.isDatasetVisible(i)) return false;
                if (currentStack) {
                  if (ds?.stack !== currentStack) return false;
                }
                const v = Number(ds?.data?.[dIndex] ?? 0);
                return (v >= 0 && value >= 0) || (v < 0 && value < 0);
              });
            // top means the last dataset in rendering order among same sign
            const topIndex = sameStackIndexes.length ? Math.max(...sameStackIndexes) : dsIndex;
            isTopOfStack = dsIndex === topIndex;
          }

          if (!isTopOfStack) return 0;

          if (isHorizontal) {
            if (value >= 0) {
              return { topRight: radius, bottomRight: radius, topLeft: 0, bottomLeft: 0 };
            } else {
              return { topLeft: radius, bottomLeft: radius, topRight: 0, bottomRight: 0 };
            }
          } else {
            if (value >= 0) {
              return { topLeft: radius, topRight: radius, bottomLeft: 0, bottomRight: 0 };
            } else {
              return { bottomLeft: radius, bottomRight: radius, topLeft: 0, topRight: 0 };
            }
          }
        }),
        borderSkipped: false,
      };
    }),
  };

  const isLight = config.theme === 'light';
  const axisTextColor = 'rgba(0, 25, 61, 0.3255)';
  const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)';

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: config.indexAxis || 'x',    
    plugins: {
      legend: {
        display: config.showLegend !== false,
        position: config.legendPosition || 'bottom',
        align: config.legendAlign || 'start',
        labels: {
          color: axisTextColor,
          font: { size: 12, weight: 'normal' },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'rect',
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
      },
    },
    scales: {
      x: {
        stacked: !!config.stacked,
        position: config.xPosition || 'bottom',
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
        stacked: !!config.stacked,
        position: config.yPosition || 'left',
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
      <Bar ref={chartRef} data={processedData} options={options} width={width - 40} height={height - 40} />
    </div>
  );
};

export default BarChart;


