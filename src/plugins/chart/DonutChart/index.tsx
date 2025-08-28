import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Plugin,
  Tooltip,
} from 'chart.js';
import classNames from 'classnames';
import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import { useStyle } from './style';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DonutChartDatum {
  label: string;
  value: number;
}

export interface DonutChartConfig {
  datasets: DonutChartDatum[];
  title?: string;
  lastModified?: string;
  theme?: 'light' | 'dark';
  cutout?: string | number;
  showLegend?: boolean;
  showTooltip?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  backgroundColor?: string[];
  borderColor?: string;
}

export interface DonutChartProps {
  configs: DonutChartConfig[];
  width?: number;
  height?: number;
  className?: string;
  title: string;
  showToolbar?: boolean;
  onDownload?: () => void;
  /** 筛选项列表，不传时不显示筛选器 */
  filterList?: string[];
  /** 当前选中的筛选值 */
  selectedFilter?: string;
  /** 筛选变化回调函数 */
  onFilterChange?: (value: string) => void;
}

// 中心文字插件
const createCenterTextPlugin = (
  value: number,
  label: string,
): Plugin<'doughnut'> => ({
  id: 'centerText',
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart;
    ctx.save();

    const centerX = width / 2;
    const centerY = height / 2;

    // 固定字体大小与字重
    const percentFontSize = 13; // px
    const labelFontSize = 12; // px

    // 百分比（13px，500）
    ctx.font = `500 ${percentFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif`;
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}%`, centerX, centerY - labelFontSize * 0.8);

    // 标签（12px，正常字重）
    ctx.font = `400 ${labelFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif`;
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(label, centerX, centerY + labelFontSize * 0.6);

    ctx.restore();
  },
});

const DonutChart: React.FC<DonutChartProps> = ({
  configs,
  width = 200,
  height = 200,
  className,
  title,
  showToolbar = true,
  onDownload,
  filterList,
  selectedFilter,
  onFilterChange,
}) => {
  const baseClassName = 'md-editor-donut-chart';
  const { wrapSSR, hashId } = useStyle(baseClassName);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // 验证 filterList 是否有重复项
  if (filterList && filterList.length > 0) {
    const uniqueItems = new Set(filterList);
    if (uniqueItems.size !== filterList.length) {
      // 找出重复的项
      const seen = new Set<string>();
      const duplicates = new Set<string>();

      filterList.forEach((item) => {
        if (seen.has(item)) {
          duplicates.add(item);
        } else {
          seen.add(item);
        }
      });

      throw new Error(
        `DonutChart filterList 包含重复项: [${Array.from(duplicates).join(', ')}]. 每个筛选项必须唯一。`,
      );
    }
  }

  // 下载图表
  const handleDownload = () => {
    onDownload ? onDownload() : downloadChart(chartRef.current, 'donut-chart');
  };

  return wrapSSR(
    <>
      {showToolbar && (
        <div>
          <ChartToolBar title={title} onDownload={handleDownload} />
          {filterList && filterList.length > 0 && (
            <ChartFilter
              filterOptions={filterList.map((item) => {
                return {
                  label: item,
                  value: item,
                };
              })}
              selectedFilter={selectedFilter || ''}
              onFilterChange={onFilterChange || (() => {})}
            />
          )}
        </div>
      )}
      <div
        className={classNames(baseClassName, hashId, className)}
        style={{
          // 使用 CSS 变量传递动态尺寸
          ['--donut-item-min-width' as any]: `${width}px`,
        }}
      >
        {configs.map((cfg, idx) => {
          const labels = cfg.datasets.map((d) => d.label);
          const values = cfg.datasets.map((d) => d.value);

          const total = values.reduce((sum, v) => sum + v, 0);
          const backgroundColors = cfg.backgroundColor || [
            '#917EF7',
            '#2AD8FC',
            '#388BFF',
            '#718AB6',
            '#FACC15',
          ];

          const data = {
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: backgroundColors.slice(0, values.length),
                borderColor: cfg.borderColor || '#fff',
                borderWidth: 1,
                spacing: values.length === 2 ? 0 : 6,
                borderRadius: 4,
                hoverOffset: 6,
              },
            ],
          };

          const isSingleValueMode = values.length === 2;
          const firstValue = values[0];
          const cutout = cfg.cutout ?? '75%';

          // 依据主题计算 tooltip 颜色
          const isDarkTheme = cfg.theme === 'dark';
          const tooltipBackgroundColor = isDarkTheme ? '#1F2937' : '#FFFFFF'; // gray-800 vs white
          const tooltipBorderColor = isDarkTheme ? '#374151' : '#E5E7EB'; // gray-700 vs gray-200
          const tooltipTitleColor = isDarkTheme ? '#F9FAFB' : '#111827'; // gray-50 vs gray-900
          const tooltipBodyColor = isDarkTheme ? '#D1D5DB' : '#374151'; // gray-300 vs gray-700

          const options: ChartOptions<'doughnut'> = {
            responsive: true,
            maintainAspectRatio: false,
            cutout,
            plugins: {
              legend: {
                display: false, // 我们自己渲染 legend
              },
              tooltip: {
                enabled: cfg.showTooltip !== false, // 默认显示，除非明确设置为false
                backgroundColor: tooltipBackgroundColor,
                borderColor: tooltipBorderColor,
                borderWidth: 1,
                titleColor: tooltipTitleColor,
                bodyColor: tooltipBodyColor,
                callbacks: {
                  label: ({ label, raw }) =>
                    `${label}: ${raw} (${(((raw as number) / total) * 100).toFixed(1)}%)`,
                },
              },
            },
          };

          return (
            <div key={idx}>
              {/* Doughnut 图 + legend */}
              {isSingleValueMode ? (
                <div
                  className={`${baseClassName}-single ${hashId}`}
                  style={{ ['--donut-chart-height' as any]: `${height}px` }}
                >
                  <Doughnut
                    ref={chartRef}
                    data={data}
                    options={options}
                    plugins={[createCenterTextPlugin(firstValue, labels[0])]}
                  />
                </div>
              ) : (
                <div className={`${baseClassName}-row ${hashId}`}>
                  <div
                    className={`${baseClassName}-chart ${hashId}`}
                    style={{
                      ['--donut-chart-width' as any]: `${width}px`,
                      ['--donut-chart-height' as any]: `${height}px`,
                    }}
                  >
                    <Doughnut ref={chartRef} data={data} options={options} />
                  </div>
                  {cfg.showLegend && (
                    <div className={`${baseClassName}-legend ${hashId}`}>
                      {cfg.datasets.map((d, i) => (
                        <div
                          key={i}
                          className={`${baseClassName}-legend-item ${hashId}`}
                        >
                          <span
                            className={`${baseClassName}-legend-color ${hashId}`}
                            style={{
                              ['--donut-legend-color' as any]:
                                backgroundColors[i] || '#ccc',
                            }}
                          />
                          <span
                            className={`${baseClassName}-legend-label ${hashId}`}
                          >
                            {d.label}
                          </span>
                          <span
                            className={`${baseClassName}-legend-value ${hashId}`}
                          >
                            <span>{d.value}</span>
                            <span
                              className={`${baseClassName}-legend-percent ${hashId}`}
                            >
                              {((d.value / total) * 100).toFixed(0)}%
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>,
  );
};

export default DonutChart;
