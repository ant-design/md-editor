import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Plugin,
  Tooltip,
} from 'chart.js';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import { useStyle } from './style';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DonutChartData {
  category?: string; // 分类
  label: string;
  value: number | string;
  filterLable?: string;
}

export interface DonutChartConfig {
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
  data: DonutChartData[];
  configs?: DonutChartConfig[];
  width?: number;
  height?: number;
  className?: string;
  title?: string;
  showToolbar?: boolean;
  onDownload?: () => void;
  /** 数据时间 */
  dataTime?: string;
  /** 筛选项列表，不传时不显示筛选器 */
  filterList?: string[];
  /** 当前选中的筛选值 */
  selectedFilter?: string;
  /** 筛选变化回调函数 */
  onFilterChange?: (value: string) => void;
  /** 是否启用自动分类功能 */
  enableAutoCategory?: boolean;
  /** 是否启用单值模式：每条数据渲染一个独立环形图并自动着色 */
  singleMode?: boolean;
  /** 头部工具条额外按钮 */
  toolbarExtra?: React.ReactNode;
}

// 中心文字插件 - 移动端优化版本
const createCenterTextPlugin = (
  value: number,
  label: string,
  isMobile: boolean = false,
): Plugin<'doughnut'> => ({
  id: 'centerText',
  beforeDraw: (chart) => {
    const { width, height, ctx } = chart;
    ctx.save();

    const centerX = width / 2;
    const centerY = height / 2;

    // 移动端字体大小调整
    const percentFontSize = isMobile ? 11 : 13; // px
    const labelFontSize = isMobile ? 10 : 12; // px

    // 百分比（移动端适当缩小）
    ctx.font = `${isMobile ? '600' : '500'} ${percentFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif`;
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}%`, centerX, centerY - labelFontSize * 0.8);

    // 标签（移动端适当缩小）
    ctx.font = `400 ${labelFontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif`;
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(label, centerX, centerY + labelFontSize * 0.6);

    ctx.restore();
  },
});

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  configs,
  width = 200,
  height = 200,
  className,
  title,
  showToolbar = true,
  onDownload,
  dataTime,
  filterList,
  selectedFilter,
  onFilterChange,
  enableAutoCategory = true,
  singleMode = false,
  toolbarExtra,
}) => {
  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 默认配置：当 configs 不传时，使用默认配置，showLegend 默认为 true
  const defaultConfigs: DonutChartConfig[] = [{ showLegend: true }];
  const finalConfigs = configs || defaultConfigs;
  const baseClassName = 'md-editor-donut-chart';
  const { wrapSSR, hashId } = useStyle(baseClassName);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // 移动端优化的默认色板
  const defaultColors = [
    '#917EF7',
    '#2AD8FC',
    '#388BFF',
    '#718AB6',
    '#FACC15',
    '#33E59B',
    '#D666E4',
    '#6151FF',
    '#BF3C93',
    '#005EE0',
  ];

  // 小屏最大尺寸上限，避免甜甜圈在小屏过宽
  const MOBILE_MAX_CHART_SIZE = 160;

  // 状态管理：跟踪哪些数据项被隐藏
  const [hiddenDataIndices, setHiddenDataIndices] = useState<Set<number>>(
    new Set(),
  );

  // 提取 filterLables
  const validFilterLables = useMemo(() => {
    return data
      .map((item) => item.filterLable)
      .filter(
        (filterLable): filterLable is string => filterLable !== undefined,
      );
  }, [data]);

  const filterLables = useMemo(() => {
    return validFilterLables.length > 0
      ? [...new Set(validFilterLables)]
      : undefined;
  }, [validFilterLables]);

  const [selectedFilterLable, setSelectedFilterLable] = useState(
    filterLables && filterLables.length > 0 ? filterLables[0] : undefined,
  );

  const filteredDataByFilterLable = useMemo(() => {
    return filterLables?.map((item) => ({ key: item, label: item }));
  }, [filterLables]);

  // 自动分类功能
  const autoCategoryData = useMemo(() => {
    if (!enableAutoCategory || !data) {
      return null;
    }

    const allData = data;
    const categories = [
      ...new Set(allData.map((item) => item.category).filter(Boolean)),
    ];

    if (categories.length <= 1) {
      return null; // 只有一个分类或没有分类，不需要分类功能
    }

    return {
      categories,
      allData,
    };
  }, [data, enableAutoCategory]);

  // 内部分类状态管理
  const [internalSelectedCategory, setInternalSelectedCategory] =
    useState<string>('');

  // 初始化内部分类状态
  React.useEffect(() => {
    if (autoCategoryData && !internalSelectedCategory) {
      setInternalSelectedCategory(autoCategoryData.categories.find(Boolean) || '');
    }
  }, [autoCategoryData, internalSelectedCategory]);

  // 选中的分类（优先外部 selectedFilter，其次内部）
  const selectedCategory = selectedFilter || internalSelectedCategory;

  // 根据分类与 filterLable 过滤数据（对齐 LineChart）
  const filteredData = useMemo(() => {
    // 先按分类过滤（如果有选中分类）
    const byCategory = selectedCategory
      ? data.filter((item) => item.category === selectedCategory)
      : data;

    // 若没有 filterLables 或未选择，则仅返回分类过滤结果
    if (!filterLables || !selectedFilterLable) {
      return byCategory;
    }

    // 同时匹配 filterLable
    return byCategory.filter(
      (item) => item.filterLable === selectedFilterLable,
    );
  }, [data, selectedCategory, filterLables, selectedFilterLable]);

  // 处理内部分类变化
  const handleInternalCategoryChange = (category: string) => {
    setInternalSelectedCategory(category);
  };

  // 处理图例项点击
  const handleLegendItemClick = (index: number) => {
    setHiddenDataIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

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

  // 确定是否显示筛选器
  const shouldShowFilter =
    (filterList && filterList.length > 0) || autoCategoryData;
  const finalFilterList =
    filterList || (autoCategoryData ? autoCategoryData.categories : []);
  const finalSelectedFilter = selectedFilter || internalSelectedCategory;
  const finalOnFilterChange = onFilterChange || handleInternalCategoryChange;

  // 计算 ChartFilter 主题（若 configs 提供则继承之）
  const chartFilterTheme: 'light' | 'dark' =
    (finalConfigs[0]?.theme as 'light' | 'dark') || 'light';

  // 移动端优化：调整图表尺寸
  const getResponsiveDimensions = () => {
    if (isMobile) {
      // 小屏设备使用更紧凑的尺寸
      const mobileWidth = Math.min(
        windowWidth - 40,
        width,
        MOBILE_MAX_CHART_SIZE,
      );
      const mobileHeight = Math.min(
        windowWidth - 40,
        height,
        MOBILE_MAX_CHART_SIZE,
      );
      return {
        width: mobileWidth,
        height: mobileHeight,
        chartWidth: mobileWidth,
        chartHeight: mobileHeight,
      };
    }
    return {
      width,
      height,
      chartWidth: width,
      chartHeight: height,
    };
  };

  const dimensions = getResponsiveDimensions();

  // 渲染用的配置：单值模式且未传 configs 时，根据过滤后的数据长度自动生成
  const renderConfigs: DonutChartConfig[] =
    singleMode && !configs
      ? Array.from({ length: filteredData.length }, (_, i) => ({
          showLegend: false,
          showTooltip: false,
          backgroundColor: [defaultColors[i % defaultColors.length], '#F7F8F9'],
        }))
      : finalConfigs;

  return wrapSSR(
    <>
      {showToolbar && (
        <div className={`${baseClassName}-toolbar-wrapper ${hashId}`}>
          {title && <ChartToolBar title={title} onDownload={handleDownload} extra={toolbarExtra} dataTime={dataTime} />}
          {shouldShowFilter && (
            <ChartFilter
              filterOptions={finalFilterList.map((item) => {
                return {
                  label: item || '',
                  value: item || '',
                };
              })}
              selectedFilter={finalSelectedFilter || ''}
              onFilterChange={finalOnFilterChange}
              {...(filterLables && {
                customOptions: filteredDataByFilterLable,
                selectedCustomSelection: selectedFilterLable,
                onSelectionChange: setSelectedFilterLable,
              })}
              theme={chartFilterTheme}
            />
          )}
        </div>
      )}
      <div
        className={classNames(baseClassName, hashId, className)}
        style={{
          // 使用 CSS 变量传递动态尺寸
          ['--donut-item-min-width' as any]: `${dimensions.width}px`,
        }}
      >
        {renderConfigs.map((cfg, idx) => {
          // 获取当前配置对应的数据项
          const currentDataItem = filteredData[idx];

          // 判断是否为单值模式（有多个配置时，每个配置对应一个独立的单值饼图）
          const isSingleValueMode = Boolean(singleMode && currentDataItem);

          // 处理单值模式的数据
          let chartData = filteredData;
          if (isSingleValueMode && currentDataItem) {
            // 单值模式：为当前数据项创建独立的饼图
            const mainValue = typeof currentDataItem.value === 'number' ? currentDataItem.value : Number(currentDataItem.value);
            const remainingValue = Math.max(0, 100 - (Number.isFinite(mainValue) ? mainValue : 0)); // 确保剩余值不为负数
            chartData = [
              currentDataItem,
              {
                label: '剩余',
                value: remainingValue,
                category: currentDataItem.category,
              },
            ];
          }

          // 过滤掉被隐藏的数据项
          const visibleData = chartData.filter(
            (_, index) => !hiddenDataIndices.has(index),
          );
          const toNum = (v: any) => (typeof v === 'number' ? v : Number(v));
          const labels = visibleData.map((d) => d.label);
          const values = visibleData.map((d) => toNum(d.value));
          const total = values.reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);
          const backgroundColors = cfg.backgroundColor || defaultColors;

          const mainColor =
            cfg.backgroundColor?.[0] ??
            defaultColors[idx % defaultColors.length];

          const data = {
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: isSingleValueMode
                  ? [mainColor, '#F7F8F9'] // 单值模式：剩余部分使用浅灰色
                  : backgroundColors.slice(0, values.length),
                borderColor: cfg.borderColor || '#fff',
                borderWidth: isMobile ? 1 : 1,
                spacing: isSingleValueMode ? 0 : isMobile ? 3 : 6, // 移动端减小间距
                borderRadius: 4,
                hoverOffset: isMobile ? 4 : 6, // 移动端减小悬停偏移
              },
            ],
          };

          // 移动端优化：调整 cutout
          const cutout = isMobile
            ? typeof cfg.cutout === 'number'
              ? cfg.cutout * 0.9
              : '70%'
            : (cfg.cutout ?? '75%');

          // 依据主题计算 tooltip 颜色
          const isDarkTheme = cfg.theme === 'dark';
          const tooltipBackgroundColor = isDarkTheme ? '#1F2937' : '#FFFFFF';
          const tooltipBorderColor = isDarkTheme ? '#374151' : '#E5E7EB';
          const tooltipTitleColor = isDarkTheme ? '#F9FAFB' : '#111827';
          const tooltipBodyColor = isDarkTheme ? '#D1D5DB' : '#374151';

          const options: ChartOptions<'doughnut'> = {
            responsive: true,
            maintainAspectRatio: false,
            cutout,
            plugins: {
              legend: {
                display: false, // 我们自己渲染 legend
              },
              tooltip: {
                enabled: cfg.showTooltip !== false,
                backgroundColor: tooltipBackgroundColor,
                borderColor: tooltipBorderColor,
                borderWidth: 1,
                titleColor: tooltipTitleColor,
                bodyColor: tooltipBodyColor,
                padding: isMobile ? 8 : 12, // 移动端减小内边距
                titleFont: {
                  size: isMobile ? 12 : 14, // 移动端减小字体
                },
                bodyFont: {
                  size: isMobile ? 11 : 13, // 移动端减小字体
                },
                callbacks: {
                  label: ({ label, raw }) => {
                    const val = typeof raw === 'number' ? raw : Number(raw);
                    const pct = total > 0 && Number.isFinite(val) ? ((val / total) * 100).toFixed(1) : '0.0';
                    return `${label}: ${Number.isFinite(val) ? val : raw} (${pct}%)`;
                  },
                },
              },
            },
            // 移动端优化：禁用悬停动画以提高性能
            animation: {
              duration: isMobile ? 200 : 1000,
            },
            interaction: {
              mode: 'point', // 移动端使用点模式
              intersect: false,
            },
          };

          return (
            <div
              key={idx}
              className={`${baseClassName}-chart-wrapper ${hashId}`}
            >
              {/* Doughnut 图 + legend */}
              {isSingleValueMode ? (
                <div
                  className={`${baseClassName}-single ${hashId}`}
                  style={{
                    ['--donut-chart-height' as any]: `${dimensions.height}px`,
                    ['--donut-chart-width' as any]: `${dimensions.width}px`,
                    width: dimensions.width,
                    height: dimensions.height,
                    ...(isMobile ? { margin: '0 auto' } : {}),
                  }}
                >
                  <Doughnut
                    ref={chartRef}
                    data={data}
                    options={options}
                    plugins={[
                      createCenterTextPlugin(
                        ((typeof currentDataItem.value === 'number' ? currentDataItem.value : Number(currentDataItem.value)) / (total || 1)) * 100,
                        currentDataItem.label,
                        isMobile,
                      ),
                    ]}
                  />
                </div>
              ) : (
                <div
                  className={`${baseClassName}-row ${hashId}`}
                  style={{
                    ...(isMobile
                      ? { flexDirection: 'column', alignItems: 'stretch' }
                      : {}),
                  }}
                >
                  <div
                    className={`${baseClassName}-chart ${hashId}`}
                    style={{
                      ['--donut-chart-width' as any]: `${dimensions.chartWidth}px`,
                      ['--donut-chart-height' as any]: `${dimensions.chartHeight}px`,
                      width: dimensions.chartWidth,
                      height: dimensions.chartHeight,
                    }}
                  >
                    <Doughnut ref={chartRef} data={data} options={options} />
                  </div>
                  {cfg.showLegend && (
                    <div
                      className={`${baseClassName}-legend ${hashId}`}
                      style={{
                        marginLeft: isMobile ? 0 : 12,
                        maxHeight: isMobile ? '120px' : 'none',
                        overflowY: isMobile ? 'auto' : 'visible',
                        ...(isMobile ? { alignSelf: 'center' } : {}),
                      }}
                    >
                      {chartData.map((d, i) => {
                        const isHidden = hiddenDataIndices.has(i);
                        return (
                          <div
                            key={i}
                            className={`${baseClassName}-legend-item ${hashId}`}
                            style={{
                              opacity: isHidden ? 0.5 : 1,
                              cursor: 'pointer',
                              padding: isMobile ? '4px 0' : '6px 0',
                              fontSize: isMobile ? 11 : 12,
                              minHeight: isMobile ? '24px' : '28px',
                            }}
                            onClick={() => handleLegendItemClick(i)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleLegendItemClick(i);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`${isHidden ? '显示' : '隐藏'} ${d.label}`}
                          >
                            <span
                              className={`${baseClassName}-legend-color ${hashId}`}
                              style={{
                                ['--donut-legend-color' as any]:
                                  backgroundColors[i] || '#ccc',
                                width: isMobile ? 10 : 12,
                                height: isMobile ? 10 : 12,
                                borderRadius: 4,
                                marginRight: isMobile ? 4 : 6,
                              }}
                            />
                            <span
                              className={`${baseClassName}-legend-label ${hashId}`}
                              style={{
                                fontSize: isMobile ? 11 : 13,
                                flex: isMobile ? '0 1 auto' : 1,
                                minWidth: isMobile ? '60px' : 'auto',
                              }}
                            >
                              {d.label}
                            </span>
                            <span
                              className={`${baseClassName}-legend-value ${hashId}`}
                              style={{
                                fontSize: isMobile ? 11 : 13,
                                fontWeight: isMobile ? 400 : 500,
                                marginLeft: isMobile ? 8 : 15,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <span>{d.value}</span>
                              <span
                                className={`${baseClassName}-legend-percent ${hashId}`}
                                style={{
                                  fontSize: isMobile ? 10 : 12,
                                  marginLeft: isMobile ? 6 : 8,
                                  marginTop: 0,
                                }}
                              >
                                {(() => {
                                  const v = typeof d.value === 'number' ? d.value : Number(d.value);
                                  return total > 0 && Number.isFinite(v) ? ((v / total) * 100).toFixed(0) : '0';
                                })()}%
                              </span>
                            </span>
                          </div>
                        );
                      })}
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
