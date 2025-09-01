import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Plugin,
  Tooltip,
} from 'chart.js';
import classNames from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import { useStyle } from './style';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DonutChartDatum {
  category?: string; // 分类
  label: string;
  value: number;
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
  data: DonutChartDatum[];
  configs?: DonutChartConfig[];
  width?: number;
  height?: number;
  className?: string;
  title?: string;
  showToolbar?: boolean;
  onDownload?: () => void;
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
  data,
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
  enableAutoCategory = true,
  singleMode = false,
}) => {
  // 默认配置：当 configs 不传时，使用默认配置，showLegend 默认为 true
  const defaultConfigs: DonutChartConfig[] = [{ showLegend: true }];
  const finalConfigs = configs || defaultConfigs;
  const baseClassName = 'md-editor-donut-chart';
  const { wrapSSR, hashId } = useStyle(baseClassName);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // 默认色板
  const defaultColors = [
    '#917EF7',
    '#2AD8FC',
    '#388BFF',
    '#718AB6',
    '#FACC15',
    '#33E59B', // 绿色
    '#D666E4', // 紫红色
    '#6151FF', // 靛蓝色
    '#BF3C93', // 玫红色
    '#005EE0', // 深蓝色
  ];

  // 状态管理：跟踪哪些数据项被隐藏
  const [hiddenDataIndices, setHiddenDataIndices] = useState<Set<number>>(
    new Set(),
  );

  // 提取 filterLables
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
      setInternalSelectedCategory(autoCategoryData.categories[0] || '');
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
    return byCategory.filter((item) => item.filterLable === selectedFilterLable);
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
        <div>
          {title && <ChartToolBar title={title} onDownload={handleDownload} />}
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
                selectedCustionSelection: selectedFilterLable,
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
          ['--donut-item-min-width' as any]: `${width}px`,
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
            const mainValue = currentDataItem.value;
            const remainingValue = Math.max(0, 100 - mainValue); // 确保剩余值不为负数
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

          const labels = visibleData.map((d) => d.label);
          const values = visibleData.map((d) => d.value);
          const total = values.reduce((sum, v) => sum + v, 0);
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
                borderWidth: 1,
                spacing: isSingleValueMode ? 0 : 6, // 单值模式：无间距
                borderRadius: 4,
                hoverOffset: 6,
              },
            ],
          };

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
                    plugins={[
                      createCenterTextPlugin(
                        (currentDataItem.value / total) * 100,
                        currentDataItem.label,
                      ),
                    ]}
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
                      {chartData.map((d, i) => {
                        const isHidden = hiddenDataIndices.has(i);
                        return (
                          <div
                            key={i}
                            className={`${baseClassName}-legend-item ${hashId}`}
                            style={{
                              opacity: isHidden ? 0.5 : 1,
                              cursor: 'pointer',
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
