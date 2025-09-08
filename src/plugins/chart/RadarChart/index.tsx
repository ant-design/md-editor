import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import './style.less';

// 注册 Chart.js 组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

// 雷达图数据项接口 - 扁平化数据格式
export interface RadarChartDataItem {
  category: string;
  label: string;
  type: string;
  score: number;
  filterLable?: string;
}

// 雷达图配置接口 - 移除 type 字段，因为 type 现在是 Record 的 key
export interface RadarChartConfigItem {
  datasets: Array<(string | number)[]>;
  maxValue?: number;
  minValue?: number;
  stepSize?: number;
  theme?: 'dark' | 'light';
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
}

interface RadarChartProps {
  data: RadarChartDataItem[];
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

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

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  title,
  width = 600,
  height = 400,
  className,
}) => {
  // 响应式尺寸计算
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768,
  );
  const isMobile = windowWidth <= 768;
  const responsiveWidth = isMobile ? '100%' : width;
  // 雷达图保持正方形比例，移动端使用屏幕宽度的85%，最大400px
  const responsiveHeight = isMobile
    ? Math.min(windowWidth * 0.85, 400)
    : height;

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  const chartRef = useRef<ChartJS<'radar'>>(null);

  // 从扁平化数据中提取分类
  const categories = Array.from(new Set(data.map((item) => item.category)));

  // 从数据中提取 filterLable，过滤掉 undefined 值
  const validFilterLables = data
    .map((item) => item.filterLable)
    .filter((category): category is string => category !== undefined);

  const filterLables: string[] | undefined =
    validFilterLables.length > 0
      ? Array.from(new Set(validFilterLables))
      : undefined;

  // 状态管理
  const [selectedFilter, setSelectedFilter] = useState(categories[0]);
  const [selectedFilterLable, setSelectedFilterLable] = useState(
    filterLables && filterLables.length > 0 ? filterLables[0] : undefined,
  );

  // 根据选定的分类筛选数据
  const filteredData = data.filter((item) => {
    const categoryMatch = item.category === selectedFilter;
    // 如果没有 filterLables 或 selectedFilterLable，只按 category 筛选
    if (!filterLables || !selectedFilterLable) {
      return categoryMatch;
    }
    // 如果有 filterLable 筛选，需要同时匹配 category 和 filterLable
    return categoryMatch && item.filterLable === selectedFilterLable;
  });

  // 提取标签和数据集
  const labels = Array.from(new Set(filteredData.map((item) => item.label)));
  const datasetTypes = Array.from(
    new Set(filteredData.map((item) => item.type)),
  );

  // 构建数据集
  const datasets = datasetTypes.map((type, index) => {
    const typeData = filteredData.filter((item) => item.type === type);
    const scores = labels.map((label) => {
      const item = typeData.find((d) => d.label === label);
      return item ? item.score : 0;
    });

    return {
      label: type,
      data: scores,
      borderColor: defaultColors[index % defaultColors.length],
      backgroundColor: `${defaultColors[index % defaultColors.length]}20`,
      borderWidth: isMobile ? 1.5 : 2,
      pointBackgroundColor: defaultColors[index % defaultColors.length],
      pointBorderColor: '#fff',
      pointBorderWidth: isMobile ? 1 : 2,
      pointRadius: isMobile ? 3 : 4,
      pointHoverRadius: isMobile ? 5 : 6,
      fill: true,
    };
  });

  // 构建当前配置（用于主题等设置）
  const currentConfig = {
    theme: 'light' as const,
    showLegend: true,
    legendPosition: 'right' as const,
  };

  // 筛选器的枚举
  const filterEnum = categories?.map((category) => ({
    label: category,
    value: category,
  }));

  // 根据 filterLable 筛选数据 - 只有当 filterLables 存在时才生成
  const filteredDataByFilterLable = filterLables?.map((item) => ({
    key: item,
    label: item,
  }));

  // 处理数据，应用默认颜色和样式
  const processedData: ChartData<'radar'> = {
    labels: labels,
    datasets: datasets,
  };

  // 图表配置选项
  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: currentConfig.showLegend !== false,
        position: isMobile
          ? 'bottom'
          : ((currentConfig.legendPosition || 'right') as
              | 'top'
              | 'left'
              | 'bottom'
              | 'right'),
        labels: {
          color: currentConfig.theme === 'light' ? '#767E8B' : '#fff',
          font: {
            size: isMobile ? 10 : 12,
            weight: 'normal',
          },
          padding: isMobile ? 10 : 20,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor:
          currentConfig.theme === 'light'
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(0, 0, 0, 0.8)',
        titleColor: currentConfig.theme === 'light' ? '#333' : '#fff',
        bodyColor: currentConfig.theme === 'light' ? '#333' : '#fff',
        borderColor:
          currentConfig.theme === 'light'
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: isMobile ? 6 : 8,
        displayColors: true,
        titleFont: {
          size: isMobile ? 11 : 12,
        },
        bodyFont: {
          size: isMobile ? 10 : 11,
        },
        padding: isMobile ? 8 : 12,
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
        max: 100, // Assuming max score is 100 for now
        min: 0,
        ticks: {
          stepSize: isMobile ? 25 : 20, // 移动端减少刻度线以避免拥挤
          color:
            currentConfig.theme === 'light'
              ? 'rgba(0, 25, 61, 0.3255)'
              : '#fff',
          font: {
            size: isMobile ? 8 : 10,
          },
          backdropColor: 'transparent',
          callback: function (value: any) {
            // 在每个坐标轴旁边显示刻度值
            return value;
          },
        },
        grid: {
          color:
            currentConfig.theme === 'light'
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(255, 255, 255, 0.2)',
          lineWidth: 1,
        },
        angleLines: {
          color:
            currentConfig.theme === 'light'
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(255, 255, 255, 0.2)',
          lineWidth: 1,
        },
        pointLabels: {
          color:
            currentConfig.theme === 'light'
              ? 'rgba(0, 25, 61, 0.3255)'
              : '#fff',
          font: {
            size: isMobile ? 10 : 12,
            weight: 500,
          },
          padding: isMobile ? 10 : 15,
        },
      },
    },
    elements: {
      point: {
        hoverRadius: isMobile ? 4 : 6,
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
        width: responsiveWidth,
        height: responsiveHeight,
        backgroundColor: currentConfig.theme === 'light' ? '#fff' : '#1a1a1a',
        borderRadius: isMobile ? '6px' : '8px',
        padding: isMobile ? '12px' : '20px',
        position: 'relative',
        border: currentConfig.theme === 'light' ? '1px solid #e8e8e8' : 'none',
        margin: isMobile ? '0 auto' : 'initial',
        maxWidth: isMobile ? '100%' : 'none',
        boxSizing: 'border-box',
      }}
    >
      <ChartToolBar
        title={title || '2025年第一季度短视频用户分布分析'}
        onDownload={handleDownload}
      />

      <ChartFilter
        filterOptions={filterEnum}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        {...(filterLables && {
          customOptions: filteredDataByFilterLable,
          selectedCustomSelection: selectedFilterLable,
          onSelectionChange: setSelectedFilterLable,
        })}
        theme={currentConfig.theme}
      />
      <div className="chart-wrapper">
        <Radar ref={chartRef} data={processedData} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
