import React, { useRef } from 'react';
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
import { Segmented, Dropdown, Button } from 'antd';
import { DownOutlined, DownloadOutlined } from '@ant-design/icons';
import TimeIcon from './icons/TimeIcon';
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

// 雷达图配置接口
export interface RadarChartConfig {
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
  config: RadarChartConfig;
  width?: number;
  height?: number;
  className?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  config,
  width = 600, 
  height = 400, 
  className 
}) => {
  const chartRef = useRef<ChartJS<'radar'>>(null);

  // 默认颜色配置
  const defaultColors = [
    '#1677ff', // 蓝色
    '#8954FC', // 紫色
    '#15e7e4', // 青色
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
    labels: config.labels,
    datasets: config.datasets.map((dataset, index) => ({
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
        display: config.showLegend !== false,
        position: (config.legendPosition || 'right') as 'top' | 'left' | 'bottom' | 'right',
        labels: {
          color: config.theme === 'light' ? '#767E8B' : '#fff',
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
        backgroundColor: config.theme === 'light' 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(0, 0, 0, 0.8)',
        titleColor: config.theme === 'light' ? '#333' : '#fff',
        bodyColor: config.theme === 'light' ? '#333' : '#fff',
        borderColor: config.theme === 'light' 
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
        max: config.maxValue || 100,
        min: config.minValue || 0,
        ticks: {
          stepSize: config.stepSize || 20,
          color: config.theme === 'light' ? 'rgba(0, 25, 61, 0.3255)' : '#fff',
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
          color: config.theme === 'light' 
            ? 'rgba(0, 0, 0, 0.1)' 
            : 'rgba(255, 255, 255, 0.2)',
          lineWidth: 1,
        },
        angleLines: {
          color: config.theme === 'light' 
            ? 'rgba(0, 0, 0, 0.1)' 
            : 'rgba(255, 255, 255, 0.2)',
          lineWidth: 1,
        },
        pointLabels: {
          color: config.theme === 'light' ? 'rgba(0, 25, 61, 0.3255)' : '#fff',
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

  return (
    <div 
      className={`radar-chart-container ${className || ''}`}
      style={{ 
        width, 
        height, 
        backgroundColor: config.theme === 'light' ? '#fff' : '#1a1a1a',
        borderRadius: '8px',
        padding: '20px',
        position: 'relative',
        border: config.theme === 'light' ? '1px solid #e8e8e8' : 'none',
      }}
    >

      {/* 头部 */}
      <div className="chart-header">
        {/* 左侧标题 */}
        <div className="header-title">
          2025年第一季度短视频用户分布分析
        </div>
        
        {/* 右侧时间+下载按钮 */}
        <div className="header-actions">
          <TimeIcon className="time-icon" />
          <span className="data-time">
            数据时间: 2025-06-30 00:00:00
          </span>
          <DownloadOutlined className="download-btn" />
        </div>
      </div>

      <div className="filter-container">
        {/* 地区筛选器 */}
        <div className="region-filter">
          <Dropdown
            menu={{
              items: [
                { key: 'global', label: '全球' },
                { key: 'china', label: '中国' },
                { key: 'us', label: '美国' },
                { key: 'eu', label: '欧洲' },
                { key: 'asia', label: '亚洲' },
                { key: 'africa', label: '非洲' },
                { key: 'oceania', label: '大洋洲' }
              ]
            }}
            trigger={['click']}
          >
              <Button
                type="default"
                size="small"
                className="region-dropdown-btn"
              >
                <span>全球</span>
                <DownOutlined className="dropdown-icon" />
              </Button>
          </Dropdown>
        </div>

        <Segmented
          options={[
            { label: '年龄', value: 'age' },
            { label: '性别', value: 'gender' }
          ]}
          defaultValue="age"
          size="small"
          className="segmented-filter custom-segmented"
        />
      </div>
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
