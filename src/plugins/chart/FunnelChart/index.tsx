import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import {
  ChartDataItem,
  findDataPointByXValue,
  toNumber,
} from '../utils';
import { useStyle } from './style';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface FunnelChartDataItem {
  /** 数据类别 */
  category?: string;
  /** 数据类型 */
  type?: string;
  /** X轴值 */
  x: number | string;
  /** Y轴值 */
  y: number | string;
  /** 筛选标签 */
  filterLable?: string;
}

export interface FunnelChartProps {
  /** 图表标题 */
  title: string;
  /** 扁平化数据数组（x 为阶段名，y 为数值） */
  data: FunnelChartDataItem[];
  /** 图表宽度，默认600px */
  width?: number;
  /** 图表高度，默认400px */
  height?: number;
  /** 自定义CSS类名 */
  className?: string;
  /** 数据时间 */
  dataTime?: string;
  /** 主题 */
  theme?: 'dark' | 'light';
  /** 是否显示图例，默认false（单序列） */
  showLegend?: boolean;
  /** 图例位置 */
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  /** 图例水平对齐方式 */
  legendAlign?: 'start' | 'center' | 'end';
  /** 是否显示网格线，默认false */
  showGrid?: boolean;
  /** 是否显示百分比（相对第一层） */
  showPercent?: boolean;
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

const FunnelChart: React.FC<FunnelChartProps> = ({
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
  showGrid = false,
  showPercent = true,
}) => {
  // 响应式尺寸
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768,
  );
  const isMobile = windowWidth <= 768;
  const responsiveWidth = isMobile ? '100%' : width;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // 样式注册
  const baseClassName = 'funnel-chart-container';
  const { wrapSSR, hashId } = useStyle(baseClassName);

  const chartRef = useRef<ChartJS<'bar'>>(null);

  // 类别筛选（外层）
  const categories = useMemo(() => {
    return [...new Set(data.map((d) => d.category))];
  }, [data]);

  // 状态
  const [selectedFilter, setSelectedFilter] = useState<string>(
    categories.find(Boolean) || '',
  );
  const [selectedFilterLable, setSelectedFilterLable] = useState<string | undefined>(
    undefined,
  );

  // 二级筛选（可选）- 仅基于当前选中 category 的可用标签
  const filterLables = useMemo(() => {
    const labels = data
      .filter((d) => !selectedFilter || d.category === selectedFilter)
      .map((d) => d.filterLable)
      .filter((v): v is string => v !== undefined);
    return labels.length > 0 ? [...new Set(labels)] : undefined;
  }, [data, selectedFilter]);

  // 当切换 category 时，如当前二级筛选不在可选列表中，则重置为该类目第一项或清空
  useEffect(() => {
    const first = filterLables && filterLables.length > 0 ? filterLables[0] : undefined;
    if (!filterLables || filterLables.length === 0) {
      if (selectedFilterLable !== undefined) setSelectedFilterLable(undefined);
      return;
    }
    if (!selectedFilterLable || !filterLables.includes(selectedFilterLable)) {
      setSelectedFilterLable(first);
    }
  }, [filterLables]);

  // 数据筛选
  const filteredData = useMemo(() => {
    if (!selectedFilter) return data;
    const categoryMatch = data.filter((d) => d.category === selectedFilter);
    if (!filterLables || !selectedFilterLable) return categoryMatch;
    return categoryMatch.filter((d) => d.filterLable === selectedFilterLable);
  }, [data, selectedFilter, filterLables, selectedFilterLable]);

  // 阶段（使用 x 值作为阶段名称），按 y 从大到小排序以符合漏斗习惯
  const stages = useMemo(() => {
    const unique = [...new Set(filteredData.map((d) => d.x))];
    // 映射阶段 -> 数值
    const values = unique.map((x) => {
      const dp = findDataPointByXValue(filteredData, x);
      const n = toNumber(dp?.y, 0);
      return { x, n };
    });
    // 降序
    values.sort((a, b) => b.n - a.n);
    return values.map((v) => v.x);
  }, [filteredData]);

  const BAR_THICKNESS = 30;
  const ROW_GAP = 2;
  const PADDING_Y = isMobile ? 48 : 64;
  const chartHeight = useMemo(() => {
    const rows = Math.max(1, stages.length);
    return rows * (BAR_THICKNESS + ROW_GAP) + PADDING_Y;
  }, [stages.length, PADDING_Y]);

  // 计算数据：使用浮动条 [-w/2, w/2] 居中呈现，形成对称“漏斗条”
  const processedData: ChartData<'bar'> = useMemo(() => {
    const baseColor = defaultColors[0];
    const labels = stages.map((x) => x.toString());

    const values = stages.map((x) => {
      const dp = findDataPointByXValue(filteredData, x);
      const n = toNumber(dp?.y, 0);
      return n;
    });

    // 取当前数据的类型名作为数据集 label
    const typeName = (() => {
      const uniques = [
        ...new Set(
          (filteredData || [])
            .map((d) => d.type)
            .filter((v): v is string => !!v),
        ),
      ];
      return uniques[0] || '数据';
    })();

    // 中心对称的浮动条：[-v/2, v/2]
    const datasetData = values.map((v) => [-v / 2, v / 2]);

    // 生成从上到下由深到浅的颜色
    const hexToRgb = (hex: string) => {
      const s = hex.replace('#', '');
      const bigint = parseInt(s, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };
    const rgbToHex = (r: number, g: number, b: number) =>
      `#${[r, g, b]
        .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
        .join('')}`;
    const lighten = (hex: string, t: number) => {
      const { r, g, b } = hexToRgb(hex);
      const lr = r + (255 - r) * t;
      const lg = g + (255 - g) * t;
      const lb = b + (255 - b) * t;
      return rgbToHex(lr, lg, lb);
    };
    const count = Math.max(1, stages.length - 1);
    const colorList = stages.map((_, i) => {
      const t = (i / count) * 0.6; // 限制变浅上限，避免变白
      return lighten(baseColor, t);
    });

    return {
      labels,
      datasets: [
        {
          label: typeName,
          data: datasetData as unknown as number[],
          backgroundColor: colorList,
          borderColor: colorList,
          borderWidth: 0,
          borderRadius: 0,
          borderSkipped: false,
          barThickness: BAR_THICKNESS,
          categoryPercentage: 1,
          barPercentage: 1,
        },
      ],
    };
  }, [filteredData, stages]);

  // 过滤器选项
  const filterOptions = useMemo(
    () =>
      categories.map((c) => ({
        label: c || '',
        value: c || '',
      })),
    [categories],
  );

  const customOptions = useMemo(() => {
    return filterLables?.map((l) => ({ key: l, label: l }));
  }, [filterLables]);

  const isLight = theme === 'light';
  const axisTextColor = isLight
    ? 'rgba(0, 25, 61, 0.3255)'
    : 'rgba(255, 255, 255, 0.8)';
  const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)';

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    layout: {
      padding: {
        left: 8,
        right: isMobile ? 72 : 96,
        top: 8,
        bottom: 8,
      },
    },
    parsing: {
      // 允许使用 [start, end] 浮动条
      xAxisKey: undefined,
      yAxisKey: undefined,
    },
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
        displayColors: false,
        callbacks: {
          label: (ctx) => {
            const raw = ctx?.raw as [number, number];
            const width = Math.abs((raw?.[1] ?? 0) - (raw?.[0] ?? 0));
            const allValues = (ctx?.dataset?.data || []).map((it) => {
              if (Array.isArray(it)) return Math.abs(it[1] - it[0]);
              const n = typeof it === 'number' ? it : Number(it);
              return Number.isFinite(n) ? n : 0;
            });
            const base = allValues[0] || 1;
            const percent = ((width / base) * 100).toFixed(1) + '%';
            if (showPercent) {
              return `${ctx.label}: ${width} (${percent})`;
            }
            return `${ctx.label}: ${width}`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        title: {
          display: false,
        },
        border: { display: false },
      },
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        title: {
          display: false,
        },
        border: { display: false },
      },
    },
  };

  const handleDownload = () => downloadChart(chartRef.current, 'funnel-chart');

  // 中间值标签插件（白色，12px，居中）
  const valueLabelPlugin = useMemo(() => {
    return {
      id: 'funnelValueLabels',
      afterDatasetsDraw: (chart: any) => {
        const { ctx, data: cdata, scales } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta) return;
        const xScale = scales?.x;
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = `${isMobile ? 10 : 12}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const ds = cdata?.datasets?.[0]?.data || [];
        meta.data.forEach((el: any, i: number) => {
          const raw = ds?.[i];
          if (!raw || !Array.isArray(raw)) return;
          const start = Number(raw[0] ?? 0);
          const end = Number(raw[1] ?? 0);
          const mid = (start + end) / 2;
          const value = Math.abs(end - start);
          const x = xScale?.getPixelForValue ? xScale.getPixelForValue(mid) : el.x;
          const y = el.y;
          const text = String(Math.round(value));
          ctx.fillText(text, x, y);
        });
        ctx.restore();
      },
    } as const;
  }, [isMobile]);

  // 右侧阶段文本标签（跟随每个柱，显示 stage 名称）
  const rightLabelPlugin = useMemo(() => {
    return {
      id: 'funnelRightLabels',
      afterDatasetsDraw: (chart: any) => {
        const { ctx, data, scales } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta) return;
        const xScale = scales?.x;
        const labels = (data?.labels || []) as string[];
        ctx.save();
        ctx.fillStyle = axisTextColor;
        ctx.font = `${isMobile ? 10 : 12}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const ds = data?.datasets?.[0]?.data || [];

        // 计算所有条末端的像素坐标，找最大值作为对齐基准
        const ends: number[] = meta.data.map((el: any, i: number) => {
          const raw = ds?.[i];
          if (!raw || !Array.isArray(raw)) return el.x;
          const end = Number(raw[1] ?? 0);
          return xScale?.getPixelForValue ? xScale.getPixelForValue(end) : el.x + Math.max(0, el.width / 2);
        });
        const maxEnd = Math.max(...ends);
        const padding = 12;

        meta.data.forEach((el: any, i: number) => {
          const raw = ds?.[i];
          if (!raw || !Array.isArray(raw)) return;
          const y = el.y;
          const label = labels?.[i] ?? '';
          ctx.fillText(label, maxEnd + padding, y);
        });
        ctx.restore();
      },
    } as const;
  }, [isMobile, axisTextColor]);

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
      <ChartToolBar
        title={title}
        theme={theme}
        onDownload={handleDownload}
        dataTime={dataTime}
      />

      <ChartFilter
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        {...(customOptions && {
          customOptions,
          selectedCustomSelection: selectedFilterLable,
          onSelectionChange: setSelectedFilterLable,
        })}
        theme={theme}
      />

      <div className="chart-wrapper" style={{ height: chartHeight }}>
        <Bar ref={chartRef} data={processedData} options={options} plugins={[valueLabelPlugin, rightLabelPlugin]} />
      </div>
    </div>,
  );
};

export default FunnelChart;


