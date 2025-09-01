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
import React, { useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import './style.less';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export interface LineChartDataItem {
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

export interface LineChartProps {
  /** 图表标题 */
  title: string;
  /** 扁平化数据数组 */
  data: LineChartDataItem[];
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
  theme = 'light',
  showLegend = true,
  legendPosition = 'bottom',
  legendAlign = 'start',
  showGrid = true,
  xPosition = 'bottom',
  yPosition = 'left',
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

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
  const processedData: ChartData<'line'> = useMemo(() => {
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
        backgroundColor: `${baseColor}33`,
        pointBackgroundColor: baseColor,
        pointBorderColor: '#fff',
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
          font: { size: 12, weight: 'normal' },
          padding: 12,
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
        cornerRadius: 8,
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
          font: { size: 12, weight: 'normal' },
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
          font: { size: 12 },
          padding: 12,
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
          font: { size: 12, weight: 'normal' },
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
          font: { size: 12 },
          padding: 12,
        },
        border: {
          color: gridColor,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 0,
        borderWidth: 0,
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
    <div
      className={`line-chart-container ${className || ''}`}
      style={{
        width,
        height,
        backgroundColor: isLight ? '#fff' : '#1a1a1a',
        borderRadius: '8px',
        padding: '20px',
        position: 'relative',
        border: isLight ? '1px solid #e8e8e8' : 'none',
      }}
    >
      <ChartToolBar title={title} theme={theme} onDownload={handleDownload} />

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

      <div className="chart-wrapper">
        <Line ref={chartRef} data={processedData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
