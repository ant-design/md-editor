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
  category?: string;
  type?: string;
  x: number | string;
  y: number | string;
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
  toolbarExtra?: React.ReactNode;
  dataTime?: string;
  xUnit?: string;
  yUnit?: string;
  xLabel?: string;
  yLabel?: string;
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
  toolbarExtra,
  dataTime,
  xUnit='月',
  yUnit,
  xLabel,
  yLabel,
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

  // 清理自定义tooltip
  useEffect(() => {
    return () => {
      const tooltipEl = document.getElementById('custom-scatter-tooltip');
      if (tooltipEl) {
        document.body.removeChild(tooltipEl);
      }
    };
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
  const [selectedFilter, setSelectedFilter] = useState(categories[0] || '');
  const [selectedFilterLable, setSelectedFilterLable] = useState(
    filterLables && filterLables.length > 0 ? filterLables[0] : undefined,
  );

  // 根据选定的分类筛选数据
  const filteredData = data.filter((item) => {
    if (!selectedFilter) return data;
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
    const coordinates = typeData.map((item) => {
      const nx = typeof item.x === 'number' ? item.x : Number(item.x);
      const ny = typeof item.y === 'number' ? item.y : Number(item.y);
      return {
        x: Number.isFinite(nx) ? nx : 0,
        y: Number.isFinite(ny) ? ny : 0,
      };
    });

    return {
      label: type || '默认',
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
    label: category || '',
    value: category || '',
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
        enabled: false, // 禁用默认 tooltip
        external: (context) => {
          const { chart, tooltip } = context;
          
          // 如果没有 tooltip 数据，隐藏
          if (tooltip.opacity === 0) {
            const tooltipEl = document.getElementById('custom-scatter-tooltip');
            if (tooltipEl) {
              tooltipEl.style.opacity = '0';
            }
            return;
          }

          // 获取或创建自定义 tooltip 元素
          let tooltipEl = document.getElementById('custom-scatter-tooltip');
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'custom-scatter-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.transition = 'all 0.1s ease';
            document.body.appendChild(tooltipEl);
          }

          // 获取数据
          const dataPoint = tooltip.dataPoints[0];
          const dimensionTitle = xUnit ? `${dataPoint.parsed.x}${xUnit}` : `${dataPoint.parsed.x}`; // 散点图的维度标题
          const label = dataPoint.dataset.label; // 数据集标签
          const coordinates = yUnit ? `${dataPoint.parsed.y}${yUnit}` : `${dataPoint.parsed.y}`;
          
          // 获取数据集颜色作为图标颜色
          const iconColor = dataPoint.dataset.borderColor || '#917EF7';

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
                ">${coordinates}</span>
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
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: xLabel || '月份', // 使用默认标签
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
            return xUnit ? `${value}${xUnit}` : `${value}`;
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
          text: yLabel || '数值', // 使用默认标签
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
          callback: function (value: any) {
            return yUnit ? `${value}${yUnit}` : `${value}`;
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
        title={title}
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

      <div
        className={classNames(`${prefixCls}-chart-wrapper`, hashId)}
        style={{ height: responsiveHeight }}
      >
        <Scatter ref={chartRef} data={processedData} options={options} />
      </div>
    </div>,
  );
};

export default ScatterChart;
