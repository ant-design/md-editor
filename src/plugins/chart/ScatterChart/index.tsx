import { ConfigProvider } from 'antd';
import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import { useStyle } from './style';

// 注册 Chart.js 组件
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

// 散点图数据项接口 - 扁平化数据格式
export interface ScatterChartDataItem {
  category: string;
  type: string;
  x: number;
  y: number;
  filterLable?: string;
}

export interface ScatterChartConfigItem {
  datasets: Array<(string | { x: number; y: number })[]>;
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
  data: ScatterChartDataItem[];
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

// 默认颜色配置
const defaultColors = [
  { backgroundColor: '#917EF7', borderColor: '#917EF7' }, // 第一个颜色：紫色
  { backgroundColor: '#2AD8FC', borderColor: '#2AD8FC' }, // 第二个颜色：蓝色
  { backgroundColor: 'rgba(42, 216, 252, 0.6)', borderColor: '#2AD8FC' }, // 第三个颜色：青色
  { backgroundColor: 'rgba(244, 91, 181, 0.6)', borderColor: '#F45BB5' }, // 粉色
  { backgroundColor: 'rgba(0, 166, 255, 0.6)', borderColor: '#00A6FF' }, // 天蓝色
];

const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  width = 800,
  height = 600,
  className,
  title,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('scatter-chart');
  const { wrapSSR, hashId } = useStyle(prefixCls);

  // 响应式尺寸计算
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768,
  );
  const isMobile = windowWidth <= 768;
  const responsiveWidth = isMobile ? '100%' : width;
  const responsiveHeight = isMobile ? Math.min(windowWidth * 0.8, 400) : height;

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
  const chartRef = useRef<ChartJS<'scatter'>>(null);

  // 从扁平化数据中提取分类
  const categories = Array.from(new Set(data.map((item) => item.category)));

  // 从数据中提取 filterLable，过滤掉 undefined 值
  const validFilterLables = data
    .map((item) => item.filterLable)
    .filter((category): category is string => category !== undefined);

  const filterLables: string[] | undefined =
    validFilterLables.length > 0
      ? ['全部', ...Array.from(new Set(validFilterLables))]
      : undefined;

  // 状态管理 - 使用第一个分类作为默认值
  const [selectedFilter, setSelectedFilter] = useState(categories[0]);
  const [selectedFilterLable, setSelectedFilterLable] = useState(
    filterLables && filterLables.length > 0 ? filterLables[0] : undefined,
  );

  // 根据选定的分类筛选数据
  const filteredData = data.filter((item) => {
    const categoryMatch = item.category === selectedFilter;
    // 如果没有 filterLables 或 selectedFilterLable，只按 category 筛选
    if (
      !filterLables ||
      !selectedFilterLable ||
      selectedFilterLable === '全部'
    ) {
      return categoryMatch;
    }
    // 如果有 filterLable 筛选，需要同时匹配 category 和 filterLable
    return categoryMatch && item.filterLable === selectedFilterLable;
  });

  // 提取数据集类型
  const datasetTypes = Array.from(
    new Set(filteredData.map((item) => item.type)),
  );

  // 构建数据集
  const datasets = datasetTypes.map((type, index) => {
    const typeData = filteredData.filter((item) => item.type === type);
    const coordinates = typeData.map((item) => ({ x: item.x, y: item.y }));

    return {
      label: type,
      data: coordinates,
      backgroundColor:
        defaultColors[index % defaultColors.length].backgroundColor,
      borderColor: defaultColors[index % defaultColors.length].borderColor,
      pointRadius: isMobile ? 4 : 6,
      pointHoverRadius: isMobile ? 6 : 8,
    };
  });

  // 构建当前配置（应用默认值）
  const currentConfig = {
    theme: 'light' as const,
    showLegend: true,
    legendPosition: 'bottom' as const,
  };

  // 筛选器的枚举 - 从分类生成
  const filterEnum = categories.map((category) => ({
    label: category,
    value: category,
  }));

  // 根据 filterLable 筛选数据 - 只有当 filterLables 存在时才生成
  const filteredDataByFilterLable = filterLables?.map((item) => ({
    key: item,
    label: item,
  }));

  // 处理数据，应用默认颜色
  const processedData: ChartData<'scatter'> = {
    datasets: datasets,
  };

  // 图表配置选项
  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: currentConfig.showLegend !== false,
        position: isMobile
          ? 'bottom'
          : ((currentConfig.legendPosition || 'bottom') as
              | 'top'
              | 'left'
              | 'bottom'
              | 'right'),
        align: 'start',
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
          text: '月份', // 使用默认标签
          color:
            currentConfig.theme === 'light'
              ? 'rgba(0, 25, 61, 0.3255)'
              : '#fff',
          font: {
            size: isMobile ? 10 : 12,
            weight: 500,
          },
        },
        min: 1, // 使用默认值
        max: 12, // 使用默认值
        ticks: {
          stepSize: 1, // 使用默认值
          color:
            currentConfig.theme === 'light'
              ? 'rgba(0, 25, 61, 0.3255)'
              : '#fff',
          font: {
            size: isMobile ? 8 : 10,
          },
          callback: function (value: any) {
            return `${value}月`;
          },
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
          text: '数值', // 使用默认标签
          color:
            currentConfig.theme === 'light'
              ? 'rgba(0, 25, 61, 0.3255)'
              : '#fff',
          font: {
            family: 'PingFang SC',
            size: isMobile ? 10 : 12,
            weight: 'normal',
          },
          align: 'center',
        },
        min: 0, // 使用默认值
        max: 100, // 使用默认值
        ticks: {
          stepSize: 10, // 使用默认值
          color:
            currentConfig.theme === 'light'
              ? 'rgba(0, 25, 61, 0.3255)'
              : '#fff',
          font: {
            family: 'PingFang SC',
            size: isMobile ? 8 : 12,
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
        hoverRadius: isMobile ? 6 : 8,
      },
    },
  };

  const handleDownload = () => {
    downloadChart(chartRef.current, 'scatter-chart');
  };

  return wrapSSR(
    <div
      className={classNames(`${prefixCls}-container`, hashId, className)}
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
      <ChartToolBar title={title} onDownload={handleDownload} />

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

      <div className={classNames(`${prefixCls}-chart-wrapper`, hashId)}>
        <Scatter ref={chartRef} data={processedData} options={options} />
      </div>
    </div>,
  );
};

export default ScatterChart;
