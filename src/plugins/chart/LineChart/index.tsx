import { ConfigProvider } from 'antd';
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
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  ChartContainer,
  ChartContainerProps,
  ChartFilter,
  ChartStatistic,
  ChartToolBar,
  downloadChart,
} from '../components';
import {
  StatisticConfigType,
  useChartStatistic,
} from '../hooks/useChartStatistic';
import {
  ChartDataItem,
  extractAndSortXValues,
  findDataPointByXValue,
} from '../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export type LineChartDataItem = ChartDataItem;

export interface LineChartConfigItem {
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

export interface LineChartProps extends ChartContainerProps {
  /** 图表标题 */
  title?: string;
  /** 扁平化数据数组 */
  data: LineChartDataItem[];
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
  /** 自定义主色（可选），支持 string 或 string[]；数组按序对应各数据序列 */
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
  /** 头部工具条额外按钮 */
  toolbarExtra?: React.ReactNode;
  /** ChartStatistic组件配置：object表示单个配置，array表示多个配置 */
  statistic?: StatisticConfigType;
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

const LineChart: React.FC<LineChartProps> = ({
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
  toolbarExtra,
  statistic: statisticConfig,
  ...props
}) => {
  const safeData = Array.isArray(data) ? data : [];
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
  const context = useContext(ConfigProvider.ConfigContext);
  const baseClassName = context?.getPrefixCls('line-chart-container');

  const chartRef = useRef<ChartJS<'line'>>(null);

  // ChartStatistic 组件配置
  const statisticComponentConfigs = useChartStatistic(statisticConfig);

  // 从数据中提取唯一的类别作为筛选选项
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(safeData.map((item) => item.category)),
    ].filter(Boolean);
    return uniqueCategories;
  }, [safeData]);

  // 从数据中提取 filterLabel，过滤掉 undefined 值
  const validFilterLabels = useMemo(() => {
    return safeData
      .map((item) => item.filterLabel)
      .filter(
        (filterLabel): filterLabel is string => filterLabel !== undefined,
      );
  }, [safeData]);

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
    const base = selectedFilter
      ? safeData.filter((item) => item.category === selectedFilter)
      : safeData;

    const withFilterLabel =
      !filterLabels || !selectedFilterLabel
        ? base
        : base.filter((item) => item.filterLabel === selectedFilterLabel);

    // 统一过滤掉 x 为空（null/undefined）的数据，避免后续 toString 报错
    return withFilterLabel.filter(
      (item) => item.x !== null && item.x !== undefined,
    );
  }, [safeData, selectedFilter, filterLabels, selectedFilterLabel]);

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
      const provided = color;
      const baseColor = Array.isArray(provided)
        ? provided[index % provided.length] ||
          defaultColors[index % defaultColors.length]
        : provided || defaultColors[index % defaultColors.length];

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
        backgroundColor: `${baseColor}33`,
        pointBackgroundColor: baseColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        borderWidth: 3,
        tension: 0,
        fill: false,
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
        display: showLegend && types.length > 0,
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
    downloadChart(chartRef.current, 'line-chart');
  };

  return (
    <ChartContainer
      baseClassName={baseClassName}
      className={className}
      theme={theme}
      isMobile={isMobile}
      variant={props.variant}
      style={{
        width: responsiveWidth,
      }}
    >
      <ChartToolBar
        title={title}
        theme={theme}
        onDownload={handleDownload}
        extra={toolbarExtra}
        dataTime={dataTime}
      />

      {statisticComponentConfigs && (
        <div className="chart-statistic-container">
          {statisticComponentConfigs.map((config, index) => (
            <ChartStatistic key={index} {...config} theme={theme} />
          ))}
        </div>
      )}

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
    </ChartContainer>
  );
};

export default LineChart;
