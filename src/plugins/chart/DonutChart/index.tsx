import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import classNames from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartFilter, ChartToolBar, downloadChart } from '../components';
import LegendView from './Legend';
import {
  BASE_CLASS_NAME,
  DEFAULT_COLORS,
  SINGLE_MODE_DESKTOP_CUTOUT,
  SINGLE_MODE_MOBILE_CUTOUT,
} from './constants';
import {
  useAutoCategory,
  useFilterLabels,
  useMobile,
  useResponsiveDimensions,
} from './hooks';
import { createBackgroundArcPlugin, createCenterTextPlugin } from './plugins';
import { useStyle } from './style';
import type { DonutChartConfig, DonutChartProps } from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

export type {
  DonutChartConfig,
  DonutChartData,
  DonutChartProps,
} from './types';

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
  const { isMobile, windowWidth } = useMobile();

  // 默认配置：当 configs 不传时，使用默认配置，showLegend 默认为 true
  const defaultConfigs: DonutChartConfig[] = [{ showLegend: true }];
  const finalConfigs = configs || defaultConfigs;
  const baseClassName = BASE_CLASS_NAME;
  const { wrapSSR, hashId } = useStyle(baseClassName);
  // 多图场景下独立管理每个图表实例，避免引用被覆盖
  const chartRefs = useRef<Array<ChartJS<'doughnut'> | null>>([]);

  // 多图场景下按图索引隔离 Legend 隐藏状态
  const [hiddenDataIndicesByChart, setHiddenDataIndicesByChart] = useState<
    Record<number, Set<number>>
  >({});

  const {
    filterLabels,
    filteredDataByFilterLabel,
    selectedFilterLabel,
    setSelectedFilterLabel,
  } = useFilterLabels(data);

  const {
    autoCategoryData,
    internalSelectedCategory,
    setInternalSelectedCategory,
    selectedCategory,
  } = useAutoCategory(data, enableAutoCategory, selectedFilter);

  const filteredData = useMemo(() => {
    const byCategory = selectedCategory
      ? data.filter((item) => item.category === selectedCategory)
      : data;

    if (!filterLabels || !selectedFilterLabel) {
      return byCategory;
    }

    return byCategory.filter(
      (item) => item.filterLabel === selectedFilterLabel,
    );
  }, [data, selectedCategory, filterLabels, selectedFilterLabel]);

  const handleInternalCategoryChange = (category: string) => {
    setInternalSelectedCategory(category);
  };

  const handleLegendItemClick = (chartIndex: number, dataIndex: number) => {
    setHiddenDataIndicesByChart((prev) => {
      const next: Record<number, Set<number>> = { ...prev };
      const currentSet = new Set(next[chartIndex] ?? new Set<number>());
      if (currentSet.has(dataIndex)) {
        currentSet.delete(dataIndex);
      } else {
        currentSet.add(dataIndex);
      }
      next[chartIndex] = currentSet;
      return next;
    });
  };

  if (filterList && filterList.length > 0) {
    const uniqueItems = new Set(filterList);
    if (uniqueItems.size !== filterList.length) {
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

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const instances = (chartRefs.current || []).filter(
      (c): c is ChartJS<'doughnut'> => !!c,
    );

    if (instances.length <= 1) {
      const target = instances[0] ?? null;
      downloadChart(target as any, 'donut-chart');
      return;
    }

    try {
      // 将多个 canvas 竖直拼接为一张图片
      const canvases = instances
        .map((inst) => (inst as any)?.canvas as HTMLCanvasElement)
        .filter(Boolean);

      if (canvases.length === 0) {
        return;
      }

      const GAP = 16; // 竖向间距
      const widths = canvases.map((c) => c.width);
      const heights = canvases.map((c) => c.height);
      const maxWidth = Math.max(...widths);
      const totalHeight =
        heights.reduce((sum, h) => sum + h, 0) + GAP * (canvases.length - 1);

      const composite = document.createElement('canvas');
      composite.width = maxWidth;
      composite.height = totalHeight;
      const ctx = composite.getContext('2d');
      if (!ctx) return;

      // 背景填充为白色，避免透明背景在 jpeg 下变黑
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, composite.width, composite.height);

      let offsetY = 0;
      canvases.forEach((c, i) => {
        const x = Math.floor((maxWidth - c.width) / 2);
        ctx.drawImage(c, x, offsetY);
        offsetY += c.height + (i < canvases.length - 1 ? GAP : 0);
      });

      const link = document.createElement('a');
      link.download = `donut-charts-${Date.now()}.png`;
      link.href = composite.toDataURL('image/png', 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      // 兜底：任意异常回退为下载第一张
      const target = instances[0] ?? null;
      downloadChart(target as any, 'donut-chart');
    }
  };

  const shouldShowFilter =
    (filterList && filterList.length > 0) || autoCategoryData;
  const finalFilterList =
    filterList || (autoCategoryData ? autoCategoryData.categories : []);
  const finalSelectedFilter = selectedFilter || internalSelectedCategory;
  const finalOnFilterChange = onFilterChange || handleInternalCategoryChange;

  const chartFilterTheme: 'light' | 'dark' =
    (finalConfigs[0]?.theme as 'light' | 'dark') || 'light';

  const dimensions = useResponsiveDimensions(
    isMobile,
    windowWidth,
    width,
    height,
  );

  const renderConfigs: DonutChartConfig[] =
    singleMode && !configs
      ? Array.from({ length: filteredData.length }, (_, i) => ({
          showLegend: false,
          showTooltip: false,
          backgroundColor: [
            DEFAULT_COLORS[i % DEFAULT_COLORS.length],
            '#F7F8F9',
          ],
        }))
      : finalConfigs;

  return wrapSSR(
    <>
      {showToolbar && (
        <div className={`${baseClassName}-toolbar-wrapper ${hashId}`}>
          {title && (
            <ChartToolBar
              title={title}
              onDownload={handleDownload}
              extra={toolbarExtra}
              dataTime={dataTime}
            />
          )}
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
              {...(filterLabels && {
                customOptions: filteredDataByFilterLabel,
                selectedCustomSelection: selectedFilterLabel,
                onSelectionChange: setSelectedFilterLabel,
              })}
              theme={chartFilterTheme}
            />
          )}
        </div>
      )}
      <div
        className={classNames(baseClassName, hashId, className)}
        style={{
          ['--donut-item-min-width' as any]: `${dimensions.width}px`,
        }}
      >
        {renderConfigs.map((cfg, idx) => {
          const currentDataItem = filteredData[idx];
          const isSingleValueMode = Boolean(singleMode && currentDataItem);

          let chartData = filteredData;
          if (isSingleValueMode && currentDataItem) {
            const mainValue =
              typeof currentDataItem.value === 'number'
                ? currentDataItem.value
                : Number(currentDataItem.value);
            const remainingValue = Math.max(
              0,
              100 - (Number.isFinite(mainValue) ? mainValue : 0),
            );
            chartData = [
              currentDataItem,
              {
                label: '剩余',
                value: remainingValue,
                category: currentDataItem.category,
              },
            ];
          }

          const hiddenSetForChart =
            hiddenDataIndicesByChart[idx] || new Set<number>();
          const visibleData = chartData.filter(
            (_, index) => !hiddenSetForChart.has(index),
          );
          const toNum = (v: any) => (typeof v === 'number' ? v : Number(v));
          const rawLabels = visibleData.map((d) => d.label);
          const labels = isSingleValueMode
            ? rawLabels.map((labelText, i) => (i === 1 ? '' : labelText))
            : rawLabels;
          const values = visibleData.map((d) => toNum(d.value));
          const safeValues = values.map((v) => (Number.isFinite(v) ? v : 0));
          const total = values.reduce(
            (sum, v) => sum + (Number.isFinite(v) ? v : 0),
            0,
          );
          const backgroundColors = cfg.backgroundColor || DEFAULT_COLORS;

          const mainColor =
            cfg.backgroundColor?.[0] ??
            DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

          const chartJsData = {
            labels,
            datasets: [
              {
                data: safeValues,
                backgroundColor: isSingleValueMode
                  ? [mainColor, 'transparent']
                  : backgroundColors.slice(0, values.length),
                borderColor: isSingleValueMode
                  ? [cfg.borderColor || '#fff', 'transparent']
                  : cfg.borderColor || '#fff',
                borderWidth: isMobile ? 1 : 1,
                spacing: isSingleValueMode ? 0 : isMobile ? 3 : 6,
                borderRadius: 4,
                hoverOffset: (ctx: any) =>
                  isSingleValueMode && ctx?.dataIndex === 1
                    ? 0
                    : isMobile
                      ? 4
                      : 6,
              },
            ],
          };

          const cutout = (() => {
            if (isMobile) {
              if (typeof cfg.cutout === 'number') return cfg.cutout * 0.9;
              return (
                (cfg.cutout as any) ??
                (isSingleValueMode ? SINGLE_MODE_MOBILE_CUTOUT : '70%')
              );
            }
            return (
              (cfg.cutout as any) ??
              (isSingleValueMode ? SINGLE_MODE_DESKTOP_CUTOUT : '75%')
            );
          })();

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
                display: false,
              },
              tooltip: {
                enabled: cfg.showTooltip !== false,
                filter: (tooltipItem) =>
                  !(isSingleValueMode && tooltipItem.dataIndex === 1),
                backgroundColor: tooltipBackgroundColor,
                borderColor: tooltipBorderColor,
                borderWidth: 1,
                titleColor: tooltipTitleColor,
                bodyColor: tooltipBodyColor,
                padding: isMobile ? 8 : 12,
                titleFont: {
                  size: isMobile ? 12 : 14,
                },
                bodyFont: {
                  size: isMobile ? 11 : 13,
                },
                callbacks: {
                  label: ({ label, raw }) => {
                    const val = typeof raw === 'number' ? raw : Number(raw);
                    const pct =
                      total > 0 && Number.isFinite(val)
                        ? ((val / total) * 100).toFixed(0)
                        : '0';
                    return `${label}: ${Number.isFinite(val) ? val : raw} (${pct}%)`;
                  },
                },
              },
            },
            animation: {
              duration: isMobile ? 200 : 1000,
            },
            interaction: {
              mode: 'point',
              intersect: false,
            },
            layout: {
              padding: isMobile ? 4 : 6,
            },
          };

          return (
            <div
              key={idx}
              className={`${baseClassName}-chart-wrapper ${hashId}`}
            >
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
                    ref={(instance) => {
                      chartRefs.current[idx] = instance as any;
                    }}
                    data={chartJsData}
                    options={options}
                    plugins={[
                      createCenterTextPlugin(
                        ((typeof (currentDataItem as any).value === 'number'
                          ? (currentDataItem as any).value
                          : Number((currentDataItem as any).value)) /
                          (total || 1)) *
                          100,
                        (currentDataItem as any).label,
                        isMobile,
                      ),
                      createBackgroundArcPlugin(), // 背景色
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
                    <Doughnut
                      ref={(instance) => {
                        chartRefs.current[idx] = instance as any;
                      }}
                      data={chartJsData}
                      options={options}
                    />
                  </div>
                  {cfg.showLegend && (
                    <LegendView
                      chartData={chartData}
                      backgroundColors={backgroundColors}
                      hiddenDataIndicesByChart={hiddenDataIndicesByChart}
                      chartIndex={idx}
                      onLegendItemClick={(dataIndex) =>
                        handleLegendItemClick(idx, dataIndex)
                      }
                      total={total}
                      baseClassName={baseClassName}
                      hashId={hashId}
                      isMobile={isMobile}
                    />
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
