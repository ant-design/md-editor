import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  ScriptableContext,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  ChartContainer,
  ChartContainerProps,
  ChartFilter,
  ChartToolBar,
  downloadChart,
} from '../components';
import {
  ChartDataItem,
  extractAndSortXValues,
  findDataPointByXValue,
} from '../utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export type BarChartDataItem = ChartDataItem;

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

export interface BarChartProps extends ChartContainerProps {
  /** 图表标题 */
  title?: string;
  /** 扁平化数据数组 */
  data: BarChartDataItem[];
  /** 图表宽度，默认600px */
  width?: number | string;
  /** 图表高度，默认400px */
  height?: number | string;
  /** 自定义CSS类名 */
  className?: string;
  /** 数据时间 */
  dataTime?: string;
  /** 图表主题 */
  theme?: 'dark' | 'light';
  /** 自定义主色（可选），支持 string 或 string[]；
   *  - 非正负图：数组按序对应各数据序列
   *  - 正负图：取数组前两位分别作为正/负色；仅一位则全用同色
   */
  color?: string | string[];
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

const defaultColors = ['#917EF7', '#2AD8FC', '#388BFF', '#718AB6', '#84DC18'];

// 将十六进制颜色转换为带透明度的 rgba 字符串
const hexToRgba = (hex: string, alpha: number): string => {
  const sanitized = hex.replace('#', '');
  const isShort = sanitized.length === 3;
  const r = parseInt(
    isShort ? sanitized[0] + sanitized[0] : sanitized.slice(0, 2),
    16,
  );
  const g = parseInt(
    isShort ? sanitized[1] + sanitized[1] : sanitized.slice(2, 4),
    16,
  );
  const b = parseInt(
    isShort ? sanitized[2] + sanitized[2] : sanitized.slice(4, 6),
    16,
  );
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// 正负柱状图颜色（与需求给定的 rgba 保持一致）
const POSITIVE_COLOR_HEX = '#388BFF'; // rgba(56, 139, 255, 1)
const NEGATIVE_COLOR_HEX = '#F78826'; // rgba(247, 136, 38, 1)

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  width = 600,
  height = 400,
  className,
  dataTime,
  theme = 'light',
  color,
  showLegend = true,
  legendPosition = 'bottom',
  legendAlign = 'start',
  showGrid = true,
  xPosition = 'bottom',
  yPosition = 'left',
  stacked = false,
  indexAxis = 'x',
  toolbarExtra,
  variant,
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
  const baseClassName = 'bar-chart-container';

  const chartRef = useRef<ChartJS<'bar'>>(null);

  // 从数据中提取唯一的类别作为筛选选项
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(data.map((item) => item.category)),
    ].filter(Boolean);
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
  const [selectedFilter, setSelectedFilter] = useState<string>(
    categories.find(Boolean) || '',
  );
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

  // 是否是正负柱图（同一批次同时存在正值与负值）
  const hasPositive = useMemo(() => {
    return filteredData.some((item) => {
      const v = typeof item.y === 'number' ? item.y : Number(item.y);
      return Number.isFinite(v) && v > 0;
    });
  }, [filteredData]);
  const hasNegative = useMemo(() => {
    return filteredData.some((item) => {
      const v = typeof item.y === 'number' ? item.y : Number(item.y);
      return Number.isFinite(v) && v < 0;
    });
  }, [filteredData]);
  const isDiverging = hasPositive && hasNegative;

  // 构建Chart.js数据结构
  const processedData: ChartData<'bar'> = useMemo(() => {
    const labels = xValues.map((x) => x.toString());

    const datasets = types.map((type, index) => {
      const provided = color;
      const pickByIndex = (i: number) =>
        Array.isArray(provided)
          ? provided[i] ||
            provided[0] ||
            defaultColors[i % defaultColors.length]
          : provided || defaultColors[i % defaultColors.length];
      const baseColor = pickByIndex(index);

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
        borderColor: (ctx: ScriptableContext<'bar'>) => {
          const parsed: any = ctx.parsed as any;
          const value =
            indexAxis === 'y'
              ? typeof parsed?.x === 'number'
                ? parsed.x
                : 0
              : typeof parsed?.y === 'number'
                ? parsed.y
                : 0;
          let base = baseColor;
          if (!color && isDiverging) {
            base = value >= 0 ? POSITIVE_COLOR_HEX : NEGATIVE_COLOR_HEX;
          } else if (Array.isArray(color) && isDiverging) {
            const pos = color[0] || baseColor;
            const neg = color[1] || color[0] || baseColor;
            base = value >= 0 ? pos : neg;
          }
          return hexToRgba(base, 0.95);
        },
        backgroundColor: (ctx: ScriptableContext<'bar'>) => {
          const chart = ctx.chart;
          const chartArea = chart.chartArea;
          const parsed: any = ctx.parsed as any;
          if (!chartArea) return hexToRgba(baseColor, 0.6);

          const xScale = chart.scales['x'];
          const yScale = chart.scales['y'];
          const startAlpha = 0.65;
          const endAlpha = 0.95;

          if (indexAxis === 'y') {
            const value = typeof parsed?.x === 'number' ? parsed.x : 0;
            let base = baseColor;
            if (!color && isDiverging) {
              base = value >= 0 ? POSITIVE_COLOR_HEX : NEGATIVE_COLOR_HEX;
            } else if (Array.isArray(color) && isDiverging) {
              const pos = color[0] || baseColor;
              const neg = color[1] || color[0] || baseColor;
              base = value >= 0 ? pos : neg;
            }
            const x0 = xScale.getPixelForValue(0);
            const x1 = xScale.getPixelForValue(value);
            // 从靠近坐标轴的零点开始，向数据端渐深
            const gradient = chart.ctx.createLinearGradient(x0, 0, x1, 0);
            gradient.addColorStop(0, hexToRgba(base, startAlpha));
            gradient.addColorStop(1, hexToRgba(base, endAlpha));
            return gradient;
          }

          const value = typeof parsed?.y === 'number' ? parsed.y : 0;
          let base = baseColor;
          if (!color && isDiverging) {
            base = value >= 0 ? POSITIVE_COLOR_HEX : NEGATIVE_COLOR_HEX;
          } else if (Array.isArray(color) && isDiverging) {
            const pos = color[0] || baseColor;
            const neg = color[1] || color[0] || baseColor;
            base = value >= 0 ? pos : neg;
          }
          const y0 = yScale.getPixelForValue(0);
          const y1 = yScale.getPixelForValue(value);
          const gradient = chart.ctx.createLinearGradient(0, y0, 0, y1);
          gradient.addColorStop(0, hexToRgba(base, startAlpha));
          gradient.addColorStop(1, hexToRgba(base, endAlpha));
          return gradient;
        },
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

  return (
    <ChartContainer
      baseClassName={baseClassName}
      className={className}
      theme={theme}
      isMobile={isMobile}
      variant={variant}
      style={{
        width: responsiveWidth,
        height: responsiveHeight,
      }}
    >
      <ChartToolBar
        title={title}
        theme={theme}
        onDownload={handleDownload}
        extra={toolbarExtra}
        dataTime={dataTime}
      />

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
        <Bar ref={chartRef} data={processedData} options={options} />
      </div>
    </ChartContainer>
  );
};

export default BarChart;
