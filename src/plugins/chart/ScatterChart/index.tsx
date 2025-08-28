import React, { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { ChartToolBar, ChartFilter, downloadChart } from '../components';
import './style.less';

// 注册 Chart.js 组件
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// 数据类型定义
export interface ScatterChartDataItem {
  x: number;
  y: number;
}

export interface ScatterChartDataset {
  label: string;
  data: ScatterChartDataItem[];
  backgroundColor: string;
  borderColor: string;
}

export interface ScatterChartConfigItem {
  type: string;
  typeName: string;
  title: string;
  datasets: ScatterChartDataset[];
  theme?: 'light' | 'dark';
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisMin?: number;
  xAxisMax?: number;
  yAxisMin?: number;
  yAxisMax?: number;
  xAxisStep?: number;
  yAxisStep?: number;
}

export interface ScatterChartProps {
  configs: ScatterChartConfigItem[];
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

export interface ScatterChartProps {
  configs: ScatterChartConfigItem[];
  width?: number;
  height?: number;
  className?: string;
}

// 默认颜色配置
const defaultColors = [
  { backgroundColor: 'rgba(147, 112, 219, 0.6)', borderColor: 'rgba(147, 112, 219, 1)' }, // 紫色
  { backgroundColor: 'rgba(0, 255, 255, 0.6)', borderColor: 'rgba(0, 255, 255, 1)' }, // 青色
];

const ScatterChart: React.FC<ScatterChartProps> = ({
  configs,
  width = 800,
  height = 600,
  className,
  title
}) => {
  const chartRef = useRef<ChartJS<'scatter'>>(null);
  
  // 状态管理
  const [selectedFilter, setSelectedFilter] = useState(configs[0]?.type);
  const [selectedRegion, setSelectedRegion] = useState('global');
  
  // 根据筛选器选择对应的配置
  const currentConfig = configs.find(config => config.type === selectedFilter) || configs[0];
  // 筛选器的枚举
  const filterEnum = configs.map(config => {
    return {
      label: config.typeName,
      value: config.type,
    }
  });
  
  // 处理数据，应用默认颜色
  const processedData: ChartData<'scatter'> = {
    datasets: currentConfig.datasets.map((dataset: ScatterChartDataset, index: number) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || defaultColors[index % defaultColors.length].backgroundColor,
      borderColor: dataset.borderColor || defaultColors[index % defaultColors.length].borderColor,
      pointRadius: 6,
      pointHoverRadius: 8,
    })),
  };

  // 图表配置选项
  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: currentConfig.showLegend !== false,
        position: (currentConfig.legendPosition || 'bottom') as 'top' | 'left' | 'bottom' | 'right',
        align: 'start',
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
            return `${context.dataset.label}: (${context.parsed.x}, ${context.parsed.y})`;
          },
        },
      },
    },
    scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      title: {
        display: true,
        text: currentConfig.xAxisLabel || '月份',
        color: currentConfig.theme === 'light' ? 'rgba(0, 25, 61, 0.3255)' : '#fff',
          font: {
            size: 12,
            weight: 500,
          },
        },
        min: currentConfig.xAxisMin || 1,
        max: currentConfig.xAxisMax || 12,
        ticks: {
          stepSize: currentConfig.xAxisStep || 1,
          color: currentConfig.theme === 'light' ? 'rgba(0, 25, 61, 0.3255)' : '#fff',
          font: {
            size: 10,
          },
          callback: function(value: any) {
            return `${value}月`;
          }
        },
        grid: {
          color: 'rgba(0, 16, 32, 0.0627)',
          lineWidth: 1,
        },
      },
      y: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: currentConfig.yAxisLabel || '数值',
          color: currentConfig.theme === 'light' ? 'rgba(0, 25, 61, 0.3255)' : '#fff',
          font: {
            family: 'PingFang SC',
            size: 12,
            weight: 'normal',
          },
          align: 'center',
        },
        min: currentConfig.yAxisMin || 0,
        max: currentConfig.yAxisMax || 100,
        ticks: {
          stepSize: currentConfig.yAxisStep || 10,
          color: currentConfig.theme === 'light' ? 'rgba(0, 25, 61, 0.3255)' : '#fff',
          font: {
            family: 'PingFang SC',
            size: 12,
            weight: 'normal',
          },
        },
        grid: {
          color: 'rgba(0, 16, 32, 0.0627)',
          lineWidth: 1,
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  const handleDownload = () => {
    downloadChart(chartRef.current, 'scatter-chart');
  };

  return (
    <div 
      className={`scatter-chart-container ${className || ''}`}
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
        onDownload={handleDownload}
      />

      <ChartFilter
        filterOptions={filterEnum}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <div className="chart-wrapper">
        <Scatter
          ref={chartRef}
          data={processedData}
          options={options}
        />
      </div>
    </div>
  );
};

export default ScatterChart;
