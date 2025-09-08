import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import { useStyle } from './style';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface BarChartDataItem {
  /** 数据类别 */
  category: string;
  /** 数据类型 */
  type: string;
  /** X轴值 */
  x: number;
  /** Y轴值 */
  y: number;
  /** X轴标题 */
  xtitle?: string;
  /** Y轴标题 */
  ytitle?: string;
  /** 筛选标签 */
  filterLable?: string;
}

export interface BarChartConfigItem {
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
  stacked?: boolean;
  indexAxis?: 'x' | 'y';
}

export interface BarChartProps {
  /** 图表标题 */
  title: string;
  /** 扁平化数据数组 */
  data: BarChartDataItem[];
  /** 图表宽度，默认600px */
  width?: number;
  /** 图表高度，默认400px */
  height?: number;
  /** 自定义CSS类名 */
  className?: string;
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
  /** 是否启用堆叠显示，将多个数据集叠加显示 */
  stacked?: boolean;
  /** 图表轴向，'x'为垂直柱状图，'y'为水平柱状图 */
  indexAxis?: 'x' | 'y';
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

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  width = 600,
  height = 400,
  className,
  theme = 'light',
  showLegend = true,
  legendPosition = 'bottom',
  legendAlign = 'start',
  showGrid = true,
  xPosition = 'bottom',
  yPosition = 'left',
  stacked = false,
  indexAxis = 'x',
  toolbarExtra,
}) => {
  // 响应式尺寸计算
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
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
  const baseClassName = 'bar-chart-container';
  const { wrapSSR, hashId } = useStyle(baseClassName);

  const chartRef = useRef<ChartJS<'bar'>>(null);

  // 从数据中提取唯一的类别作为筛选选项
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(data.map((item) => item.category))];
    return uniqueCategories;
  }, [data]);

  // 从数据中提取 filterLable，过滤掉 undefined 值
  const validFilterLables = useMemo(() => {
    return data
      .map((item) => item.filterLable)
      .filter((filterLable): filterLable is string => filterLable !== undefined);
  }, [data]);

  const filterLables = useMemo(() => {
    return validFilterLables.length > 0
      ? [...new Set(validFilterLables)]
      : undefined;
  }, [validFilterLables]);

  // 状态管理
  const [selectedFilter, setSelectedFilter] = useState<string>(categories?.[0]);
  const [selectedFilterLable, setSelectedFilterLable] = useState(
    filterLables && filterLables.length > 0 ? filterLables[0] : undefined,
  );

  // 筛选数据
  const filteredData = useMemo(() => {
    const categoryMatch = data.filter((item) => item.category === selectedFilter);

    // 如果没有 filterLables 或 selectedFilterLable，只按 category 筛选
    if (!filterLables || !selectedFilterLable) {
      return categoryMatch;
    }

    // 如果有 filterLable 筛选，需要同时匹配 category 和 filterLable
    return categoryMatch.filter((item) => item.filterLable === selectedFilterLable);
  }, [data, selectedFilter, filterLables, selectedFilterLable]);

  // 从数据中提取唯一的类型
  const types = useMemo(() => {
    return [...new Set(filteredData.map((item) => item.type))];
  }, [filteredData]);

  // 从数据中提取唯一的x值并排序
  const xValues = useMemo(() => {
    const uniqueX = [...new Set(filteredData.map((item) => item.x))];
    return uniqueX.sort((a, b) => a - b);
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
  const processedData: ChartData<'bar'> = useMemo(() => {
    const labels = xValues.map((x) => x.toString());

    const datasets = types.map((type, index) => {
      const baseColor = defaultColors[index % defaultColors.length];

      // 为每个类型收集数据点
      const typeData = xValues.map((x) => {
        const dataPoint = filteredData.find(
          (item) => item.type === type && item.x === x,
        );
        return dataPoint ? dataPoint.y : null;
      });

      return {
        label: type,
        data: typeData,
        borderColor: baseColor,
        backgroundColor: baseColor,
        borderWidth: 0,
        categoryPercentage: 0.7,
        barPercentage: 0.8,
        stack: stacked ? 'stack' : undefined,
        borderRadius: (ctx: any) => {
          const rawValue = ctx?.raw;
          const value =
            typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0);
          const isHorizontal = indexAxis === 'y';
          const radius = 6;
          const chart = ctx?.chart as import('chart.js').Chart<'bar'>;

          // When stacked, only the outermost (top) segment of the same sign gets radius
          let isTopOfStack = true;
          if (stacked && chart) {
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
            const topIndex = sameStackIndexes.length
              ? Math.max(...sameStackIndexes)
              : dsIndex;
            isTopOfStack = dsIndex === topIndex;
          }

          if (!isTopOfStack) return 0;

          if (isHorizontal) {
            if (value >= 0) {
              return {
                topRight: radius,
                bottomRight: radius,
                topLeft: 0,
                bottomLeft: 0,
              };
            } else {
              return {
                topLeft: radius,
                bottomLeft: radius,
                topRight: 0,
                bottomRight: 0,
              };
            }
          } else {
            if (value >= 0) {
              return {
                topLeft: radius,
                topRight: radius,
                bottomLeft: 0,
                bottomRight: 0,
              };
            } else {
              return {
                bottomLeft: radius,
                bottomRight: radius,
                topLeft: 0,
                topRight: 0,
              };
            }
          }
        },
        borderSkipped: false,
      };
    });

    return { labels, datasets };
  }, [filteredData, types, xValues, stacked, indexAxis]);

  // 筛选器选项
  const filterOptions = useMemo(() => {
    return categories.map((category) => ({
      label: category,
      value: category,
    }));
  }, [categories]);

  // 根据 filterLable 筛选数据 - 只有当 filterLables 存在时才生成
  const filteredDataByFilterLable = useMemo(() => {
    return filterLables?.map((item) => ({
      key: item,
      label: item,
    }));
  }, [filterLables]);

  const isLight = theme === 'light';
  const axisTextColor = isLight
    ? 'rgba(0, 25, 61, 0.3255)'
    : 'rgba(255, 255, 255, 0.8)';
  const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)';

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis,
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
          pointStyle: 'rect',
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
      },
    },
    scales: {
      x: {
        stacked,
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
        stacked,
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
  };

  const handleDownload = () => {
    downloadChart(chartRef.current, 'bar-chart');
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
      <ChartToolBar title={title} theme={theme} onDownload={handleDownload} extra={toolbarExtra} />

      <ChartFilter
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        {...(filterLables && {
          customOptions: filteredDataByFilterLable,
          selectedCustionSelection: selectedFilterLable,
          onSelectionChange: setSelectedFilterLable,
        })}
        theme={theme}
      />

      <div className="chart-wrapper" style={{ height: responsiveHeight }}>
        <Bar ref={chartRef} data={processedData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
