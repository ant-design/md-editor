import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import { extractAndSortXValues, findDataPointByXValue, ChartDataItem } from '../utils';
import { useStyle } from './style';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export type AreaChartDataItem = ChartDataItem;


export interface AreaChartConfigItem {
  datasets: Array<(string | { x: number; y: number })[]>;
  theme?: 'light' | 'dark';
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  legendAlign?: 'start' | 'center' | 'end';
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisMin?: number;
  xAxisMax?: number;
  yAxisMin?: number;
  yAxisMax?: number;
  xAxisStep?: number;
  yAxisStep?: number;
}

export interface AreaChartProps {
  /** 图表标题 */
  title: string;
  /** 扁平化数据数组 */
  data: AreaChartDataItem[];
  /** 图表宽度，默认600px */
  width?: number;
  /** 图表高度，默认400px */
  height?: number;
  /** 自定义CSS类名 */
  className?: string;
  /** 数据时间 */
  dataTime?: string;
  /** 图表主题 */
  theme?: 'dark' | 'light';
  /** 是否显示图例，默认true */
  showLegend?: boolean;
  /** 图例位置 */
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  /** 图例水平对齐方式 */
  legendAlign?: 'start' | 'center' | 'end';
  /** 是否显示网格线，默认true */
  showGrid?: boolean;
  /** X轴位置 */
  xPosition?: 'top' | 'bottom';
  /** Y轴位置 */
  yPosition?: 'left' | 'right';
  /** 头部工具条额外按钮 */
  toolbarExtra?: React.ReactNode;
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
  title,
  data,
  width = 600,
  height = 400,
  className,
  dataTime,
  theme = 'light',
  showLegend = true,
  legendPosition = 'bottom',
  legendAlign = 'start',
  showGrid = true,
  xPosition = 'bottom',
  yPosition = 'left',
  toolbarExtra,
}) => {
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

  // 样式注册
  const baseClassName = 'area-chart-container';
  const { wrapSSR, hashId } = useStyle(baseClassName);

  const chartRef = useRef<ChartJS<'line'>>(null);

  // 从数据中提取唯一的类别作为筛选选项
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(data.map((item) => item.category))].filter(Boolean);
    return uniqueCategories;
  }, [data]);

  // 从数据中提取 filterLabel，过滤掉 undefined 值
  const validFilterLabels = useMemo(() => {
    return data
      .map((item) => item.filterLabel)
      .filter(
        (filterLabel): filterLabel is string => filterLabel !== undefined,
      );
  }, [data]);

  const filterLabels = useMemo(() => {
    return validFilterLabels.length > 0
      ? [...new Set(validFilterLabels)]
      : undefined;
  }, [validFilterLabels]);

  // 状态管理
  const [selectedFilter, setSelectedFilter] = useState<string>(categories.find(Boolean) || '');
  const [selectedFilterLabel, setSelectedFilterLabel] = useState(
    filterLabels && filterLabels.length > 0 ? filterLabels[0] : undefined,
  );

  // 当数据变化导致当前选中分类失效时，自动回退到首个有效分类或空（显示全部）
  useEffect(() => {
    if (selectedFilter && !categories.includes(selectedFilter)) {
      setSelectedFilter(categories.find(Boolean) || '');
    }
  }, [categories, selectedFilter]);

  // 筛选数据
  const filteredData = useMemo(() => {
    if (!selectedFilter) return data;
    const categoryMatch = data.filter(
      (item) => item.category === selectedFilter,
    );

    // 如果没有 filterLabels 或 selectedFilterLabel，只按 category 筛选
    if (!filterLabels || !selectedFilterLabel) {
      return categoryMatch;
    }

    // 如果有 filterLabel 筛选，需要同时匹配 category 和 filterLabel
    return categoryMatch.filter(
      (item) => item.filterLabel === selectedFilterLabel,
    );
  }, [data, selectedFilter, filterLabels, selectedFilterLabel]);

  // 从数据中提取唯一的类型
  const types = useMemo(() => {
    return [...new Set(filteredData.map((item) => item.type))];
  }, [filteredData]);

  // 从数据中提取唯一的x值并排序
  const xValues = useMemo(() => {
    return extractAndSortXValues(filteredData);
  }, [filteredData]);

  // 从数据中获取xtitle和ytitle
  const xTitle = useMemo(() => {
    const titles = [
      ...new Set(filteredData.map((item) => item.xtitle).filter(Boolean)),
    ];
    return titles[0] || '';
  }, [filteredData]);

  const yTitle = useMemo(() => {
    const titles = [
      ...new Set(filteredData.map((item) => item.ytitle).filter(Boolean)),
    ];
    return titles[0] || '';
  }, [filteredData]);

  // 构建Chart.js数据结构
  const processedData: ChartData<'line'> = useMemo(() => {
    const labels = xValues.map((x) => x.toString());

    const datasets = types.map((type, index) => {
      const baseColor = defaultColors[index % defaultColors.length];

      // 为每个类型收集数据点
      const typeData = xValues.map((x) => {
        const dataPoint = findDataPointByXValue(filteredData, x, type);
        const v = dataPoint?.y;
        const n = typeof v === 'number' ? v : Number(v);
        return Number.isFinite(n) ? n : null;
      });

      return {
        label: type || '默认',
        data: typeData,
        borderColor: baseColor,
        backgroundColor: `${baseColor}20`,
        pointBackgroundColor: baseColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        borderWidth: 3,
        tension: 0,
        fill: true,
      };
    });

    return { labels, datasets };
  }, [filteredData, types, xValues]);

  // 筛选器选项
  const filterOptions = useMemo(() => {
    return categories.map((category) => ({
      label: category || '默认',
      value: category || '默认',
    }));
  }, [categories]);

  // 根据 filterLabel 筛选数据 - 只有当 filterLabels 存在时才生成
  const filteredDataByFilterLabel = useMemo(() => {
    return filterLabels?.map((item) => ({
      key: item,
      label: item,
    }));
  }, [filterLabels]);

  const isLight = theme === 'light';
  const axisTextColor = isLight
    ? 'rgba(0, 25, 61, 0.3255)'
    : 'rgba(255, 255, 255, 0.8)';
  const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)';

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
        align: legendAlign,
        labels: {
          color: axisTextColor,
          font: { size: isMobile ? 10 : 12, weight: 'normal' },
          padding: isMobile ? 10 : 12,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor: isLight
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(0,0,0,0.85)',
        titleColor: isLight ? '#333' : '#fff',
        bodyColor: isLight ? '#333' : '#fff',
        borderColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        cornerRadius: isMobile ? 6 : 8,
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
        position: xPosition,
        title: {
          display: !!xTitle,
          text: xTitle,
          color: axisTextColor,
          font: { size: isMobile ? 10 : 12, weight: 'normal' },
          align: 'end',
        },
        grid: {
          display: showGrid,
          color: gridColor,
          lineWidth: 1,
          drawTicks: false,
          tickLength: 0,
        },
        ticks: {
          color: axisTextColor,
          font: { size: isMobile ? 10 : 12 },
          padding: isMobile ? 10 : 12,
        },
        border: {
          color: gridColor,
        },
      },
      y: {
        position: yPosition,
        beginAtZero: true,
        title: {
          display: !!yTitle,
          text: yTitle,
          color: axisTextColor,
          font: { size: isMobile ? 10 : 12, weight: 'normal' },
          align: 'end',
        },
        grid: {
          display: showGrid,
          color: gridColor,
          lineWidth: 1,
          drawTicks: false,
          tickLength: 0,
        },
        ticks: {
          color: axisTextColor,
          font: { size: isMobile ? 10 : 12 },
          padding: isMobile ? 10 : 12,
        },
        border: {
          color: gridColor,
        },
      },
    },
    elements: {
      point: {
        radius: isMobile ? 2 : 3,
        hoverRadius: isMobile ? 3 : 5,
        borderWidth: isMobile ? 1 : 2,
        hoverBorderWidth: isMobile ? 1 : 2,
      },
      line: {
        borderWidth: 3,
      },
    },
  };

  const handleDownload = () => {
    downloadChart(chartRef.current, 'area-chart');
  };

  return wrapSSR(
    <div
      className={`${baseClassName} ${hashId} ${className || ''}`}
      style={{
        width: responsiveWidth,
        backgroundColor: isLight ? '#fff' : '#1a1a1a',
        borderRadius: isMobile ? '6px' : '8px',
        padding: isMobile ? '12px' : '20px',
        position: 'relative',
        border: isLight ? '1px solid #e8e8e8' : 'none',
        margin: isMobile ? '0 auto' : 'initial',
        maxWidth: isMobile ? '100%' : 'none',
        boxSizing: 'border-box',
      }}
    >
      <ChartToolBar title={title} theme={theme} onDownload={handleDownload} extra={toolbarExtra} dataTime={dataTime} />

      <ChartFilter
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        {...(filterLabels && {
          customOptions: filteredDataByFilterLabel,
          selectedCustomSelection: selectedFilterLabel,
          onSelectionChange: setSelectedFilterLabel,
        })}
        theme={theme}
      />

      <div className="chart-wrapper" style={{ height: responsiveHeight }}>
        <Line ref={chartRef} data={processedData} options={options} />
      </div>
    </div>,
  );
};

export default AreaChart;
