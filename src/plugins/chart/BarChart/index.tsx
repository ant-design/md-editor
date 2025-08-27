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
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
}

export interface BarChartConfig {
  labels: string[];
  datasets: BarChartDataset[];
  yMax?: number;
  yMin?: number;
  yStepSize?: number;
  theme?: 'dark' | 'light';
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  legendAlign?: 'start' | 'center' | 'end';
  showGrid?: boolean;
  xTitle?: string;
  yTitle?: string;
  barThickness?: number;
  categoryPercentage?: number;
  barPercentage?: number;
  xPosition?: 'top' | 'bottom';
  yPosition?: 'left' | 'right';
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
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: 'bottom',
      } as any;
    }),
  };

  const isLight = config.theme === 'light';
  const axisTextColor = 'rgba(0, 25, 61, 0.3255)';
  const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)';

  const options: ChartOptions<'bar'> = {
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


