import { ConfigProvider } from 'antd';
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
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import { useStyle } from './style';

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
  category?: string;
  label: string;
  type?: string;
  score: number | string;
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
  toolbarExtra?: React.ReactNode;
  dataTime?: string;
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
  toolbarExtra,
  dataTime,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('radar-chart');
  const { wrapSSR, hashId } = useStyle(prefixCls);

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

  // 清理自定义tooltip
  useEffect(() => {
    return () => {
      const tooltipEl = document.getElementById('custom-radar-tooltip');
      if (tooltipEl) {
        document.body.removeChild(tooltipEl);
      }
    };
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
  const [selectedFilter, setSelectedFilter] = useState(categories[0] || '');
  const [selectedFilterLable, setSelectedFilterLable] = useState(
    filterLables && filterLables.length > 0 ? filterLables[0] : undefined,
  );

  // 根据选定的分类筛选数据
  const filteredData = data.filter((item) => {
    if (!selectedFilter) return data;
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
      const v = item?.score as any;
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(n) ? n : 0;
    });

    return {
      label: type || '默认',
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
    label: category || '',
    value: category || '',
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
        enabled: false, // 禁用默认 tooltip
        external: (context) => {
          const { chart, tooltip } = context;
          
          // 如果没有 tooltip 数据，隐藏
          if (tooltip.opacity === 0) {
            const tooltipEl = document.getElementById('custom-radar-tooltip');
            if (tooltipEl) {
              tooltipEl.style.opacity = '0';
            }
            return;
          }

          // 获取或创建自定义 tooltip 元素
          let tooltipEl = document.getElementById('custom-radar-tooltip');
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'custom-radar-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.transition = 'all 0.1s ease';
            document.body.appendChild(tooltipEl);
          }

                     // 获取数据
           const dataPoint = tooltip.dataPoints[0];
           const dimensionTitle = dataPoint.label || ''; // 维度标题，如"技术"
           const label = dataPoint.dataset.label || '数据指标'; // 数据集标签
           const value = typeof dataPoint.parsed.r === 'number' 
             ? dataPoint.parsed.r.toFixed(1) 
             : dataPoint.parsed.r;
           
           // 获取数据集颜色作为图标颜色
           const iconColor = dataPoint.dataset.borderColor || '#388BFF';

           // 创建 HTML 内容
           const isDark = currentConfig.theme !== 'light';
           const bgColor = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)';
           const labelColor = isDark ? '#fff' : '#767E8B'; // 左边图标信息颜色

           tooltipEl.innerHTML = `
             <div style="
               background-color: ${bgColor};
               border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 16, 32, 0.0627)'};
               border-radius: ${isMobile ? '6px' : '8px'};
               padding: ${isMobile ? '8px 12px' : '12px 16px'};
               font-family: 'PingFang SC', sans-serif;
               box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
               backdrop-filter: blur(10px);
               display: flex;
               flex-direction: column;
               gap: 8px;
               min-width: 120px;
             ">
               <div style="
                 font-family: 'PingFang SC', sans-serif;
                 font-size: 12px;
                 font-weight: normal;
                 line-height: 20px;
                 text-align: center;
                 letter-spacing: 0em;
                 font-variation-settings: 'opsz' auto;
                 color: #767E8B;
                 display: flex;
                 align-items: center;
                 justify-content: space-between;
               ">${dimensionTitle}</div>
               <div style="
                 display: flex;
                 align-items: center;
                 justify-content: space-between;
                 gap: 20px;
               ">
                 <div style="
                   display: flex;
                   align-items: center;
                   gap: 8px;
                 ">
                   <div style="
                     width: 12px;
                     height: 12px;
                     background-color: ${iconColor};
                     border-radius: 2px;
                     flex-shrink: 0;
                   "></div>
                   <span style="
                     color: ${labelColor};
                     font-size: ${isMobile ? '11px' : '12px'};
                     font-weight: 500;
                     font-family: 'PingFang SC', sans-serif;
                     white-space: nowrap;
                   ">${label}</span>
                 </div>
                 <span style="
                   font-family: Rubik, sans-serif;
                   font-size: 13px;
                   font-weight: 500;
                   line-height: 13px;
                   text-align: center;
                   letter-spacing: 0.04em;
                   font-variation-settings: 'opsz' auto;
                   font-feature-settings: 'kern' on;
                   color: #343A45;
                   white-space: nowrap;
                 ">${value}</span>
               </div>
             </div>
           `;

           // 定位 tooltip
           const position = chart.canvas.getBoundingClientRect();
           
           tooltipEl.style.opacity = '1';
           tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX + 'px';
           tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY + 'px';
           tooltipEl.style.zIndex = '1000';
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
      <ChartToolBar
        title={title || '2025年第一季度短视频用户分布分析'}
        onDownload={handleDownload}
        extra={toolbarExtra}
        dataTime={dataTime}
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
      <div className={classNames(`${prefixCls}-chart-wrapper`, hashId)}>
        <Radar ref={chartRef} data={processedData} options={options} />
      </div>
    </div>,
  );
};

export default RadarChart;
