import React, { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { ChartToolBar, ChartFilter, downloadChart } from '../components';
import './style.less';

// 注册 Chart.js 组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 雷达图数据项接口
export interface RadarChartDataItem {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
}

// 雷达图配置接口 - 移除 type 字段，因为 type 现在是 Record 的 key
export interface RadarChartConfigItem {
  labels: string[];
  datasets: RadarChartDataItem[];
  maxValue?: number;
  minValue?: number;
  stepSize?: number;
  theme?: 'dark' | 'light';
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
}

interface RadarChartProps {
  configs: Record<string, RadarChartConfigItem>;
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  configs,
  title,
  width = 600, 
  height = 400, 
  className 
}) => {
  const chartRef = useRef<ChartJS<'radar'>>(null);
  
  // 状态管理
  const [selectedFilter, setSelectedFilter] = useState(Object.keys(configs)[0]);
  
  // 根据筛选器选择对应的配置，并应用默认值
  const rawConfig = configs[selectedFilter];
  const currentConfig = {
    ...rawConfig,
    theme: rawConfig.theme || 'light',
    showLegend: rawConfig.showLegend !== false,
    legendPosition: rawConfig.legendPosition || 'right',
  } as const;
  
  // 筛选器的枚举
  const filterEnum = Object.entries(configs).map(([key]) => ({
    label: key,
    value: key,
  }));

  // 默认颜色配置
  const defaultColors = [
    '#388BFF', // 第一个颜色：蓝色
    '#917EF7', // 第二个颜色：紫色
    '#2AD8FC', // 第三个颜色：青色
    '#F45BB5', // 粉色
    '#00A6FF', // 天蓝色
    '#33E59B', // 绿色
    '#D666E4', // 紫红色
    '#6151FF', // 靛蓝色
    '#BF3C93', // 玫红色
    '#005EE0', // 深蓝色
  ];

  // 处理数据，应用默认颜色和样式
  const processedData: ChartData<'radar'> = {
    labels: currentConfig.labels,
    datasets: currentConfig.datasets.map((dataset: RadarChartDataItem, index: number) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
      backgroundColor: dataset.backgroundColor || 
        `${dataset.borderColor || defaultColors[index % defaultColors.length]}20`,
      borderWidth: 2,
      pointBackgroundColor: dataset.pointBackgroundColor || 
        dataset.borderColor || defaultColors[index % defaultColors.length],
      pointBorderColor: dataset.pointBorderColor || '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
    })),
  };

  // 图表配置选项
  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: currentConfig.showLegend !== false,
        position: (currentConfig.legendPosition || 'right') as 'top' | 'left' | 'bottom' | 'right',
        labels: {
          color: currentConfig.theme === 'light' ? '#767E8B' : '#fff',
          font: {
            size: 12,
            weight: 'normal',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor: currentConfig.theme === 'light' 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(0, 0, 0, 0.8)',
        titleColor: currentConfig.theme === 'light' ? '#333' : '#fff',
        bodyColor: currentConfig.theme === 'light' ? '#333' : '#fff',
        borderColor: currentConfig.theme === 'light' 
          ? 'rgba(0, 0, 0, 0.2)' 
          : 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.r}`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: currentConfig.maxValue || 100,
        min: currentConfig.minValue || 0,
        ticks: {
          stepSize: currentConfig.stepSize || 20,
          color: currentConfig.theme === 'light' ? 'rgba(0, 25, 61, 0.3255)' : '#fff',
          font: {
            size: 10,
          },
          backdropColor: 'transparent',
          callback: function(value: any) {
            // 在每个坐标轴旁边显示刻度值
            return value;
          }
        },
        grid: {
          color: currentConfig.theme === 'light' 
            ? 'rgba(0, 0, 0, 0.1)' 
            : 'rgba(255, 255, 255, 0.2)',
          lineWidth: 1,
        },
        angleLines: {
          color: currentConfig.theme === 'light' 
            ? 'rgba(0, 0, 0, 0.1)' 
            : 'rgba(255, 255, 255, 0.2)',
          lineWidth: 1,
        },
        pointLabels: {
          color: currentConfig.theme === 'light' ? 'rgba(0, 25, 61, 0.3255)' : '#fff',
          font: {
            size: 12,
            weight: 500,
          },
          padding: 15,
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 6,
      },
    },
  };

  const handleDownload = () => {
    downloadChart(chartRef.current, 'radar-chart');
  };

  return (
    <div 
      className={`radar-chart-container ${className || ''}`}
      style={{ 
        width, 
        height, 
        backgroundColor: currentConfig.theme === 'light' ? '#fff' : '#1a1a1a',
        borderRadius: '8px',
        padding: '20px',
        position: 'relative',
        border: currentConfig.theme === 'light' ? '1px solid #e8e8e8' : 'none',
      }}
    >

      <ChartToolBar
        title={title}
        theme={currentConfig.theme}
        onDownload={handleDownload}
      />

      <ChartFilter
        filterOptions={filterEnum}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        theme={currentConfig.theme}
      />
      <div className="chart-wrapper">
        <Radar
          ref={chartRef}
          data={processedData}
          options={options}
        />
      </div>
    </div>
  );
};

export default RadarChart;
