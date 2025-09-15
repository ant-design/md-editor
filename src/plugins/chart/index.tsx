import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { RenderElementProps, useSlate } from 'slate-react';
import { ErrorBoundary } from '../../MarkdownEditor/editor/elements/ErrorBoundary';
import { TableNode } from '../../MarkdownEditor/editor/elements/Table';
import { useEditorStore } from '../../MarkdownEditor/editor/store';
import { DragHandle } from '../../MarkdownEditor/editor/tools/DragHandle';
import { ChartRender } from './ChartRender';

export { ChartAttrToolBar } from './ChartAttrToolBar';
export * from './ChartMark';
export { ChartRender } from './ChartRender';

// 图表组件
export { default as AreaChart } from './AreaChart';
export { default as BarChart } from './BarChart';
export { default as DonutChart } from './DonutChart';
export { default as FunnelChart } from './FunnelChart';
export { default as LineChart } from './LineChart';
export { default as RadarChart } from './RadarChart';
export { default as ScatterChart } from './ScatterChart';

// 类型导出
export type {
  AreaChartConfigItem,
  AreaChartDataItem,
  AreaChartProps,
} from './AreaChart';
export type {
  BarChartConfigItem,
  BarChartDataItem,
  BarChartProps,
} from './BarChart';
export type {
  DonutChartConfig,
  DonutChartData,
  DonutChartProps,
} from './DonutChart';
export type { FunnelChartDataItem, FunnelChartProps } from './FunnelChart';
export type {
  LineChartConfigItem,
  LineChartDataItem,
  LineChartProps,
} from './LineChart';
export type { RadarChartDataItem } from './RadarChart';
export type { ScatterChartDataItem, ScatterChartProps } from './ScatterChart';

// 工具与常量
export { defaultColorList } from './const';
export { debounce as chartDebounce, stringFormatNumber } from './utils';

// 复用组件与类型
export { ChartFilter, ChartToolBar, downloadChart } from './components';
export type {
  ChartFilterProps,
  ChartToolBarProps,
  FilterOption,
  RegionOption,
} from './components';

/**
 * 转化数字，将字符串转化为数字，即使非标准数字也可以转化
 * @param {string} val - 要转换的字符串
 * @param {any} locale - 本地化配置
 * @returns {number|NaN} 转换后的数字或NaN
 */
function reverseFormatNumber(val: string, locale: any) {
  let group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
  let decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
  let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
  reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
  return Number.isNaN(reversedVal) ? NaN : Number(reversedVal);
}

/**
 * 验证并格式化日期字符串
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期字符串
 */
function isValidDate(dateString: string) {
  const defaultDateFormats = [
    'YYYY-MM-DD',
    'YYYY-MM-DD HH:mm:ss',
    'YYYY/MM/DD',
    'YYYY/MM/DD HH:mm:ss',
    'DD/MM/YYYY',
    'DD/MM/YYYY HH:mm:ss',
    'MMMM D, YYYY',
    'MMMM D, YYYY h:mm A',
    'MMM D, YYYY',
    'MMM D, YYYY h:mm A',
    'ddd, MMM D, YYYY h:mm A',
  ];
  for (let i = 0; i < defaultDateFormats.length; i++) {
    if (dayjs(dateString, defaultDateFormats[i]).isValid()) {
      return dayjs(dateString).format(defaultDateFormats[i]);
    }
  }
  if (dayjs(dateString).isValid()) {
    return dayjs(dateString).format('YYYY-MM-DD');
  }
  return dateString;
}

/**
 * 转化数字，转化不成功继续用string
 * @param {string} value - 要转换的值
 * @returns {number|string} 转换后的数字或原字符串
 */
const numberString = (value: string) => {
  if (!value) return value;
  try {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const formattedValue = reverseFormatNumber(value, 'en-US');
      if (!isNaN(formattedValue)) return formattedValue;
      return isValidDate(value);
    }
    return value;
  } catch (error) {
    return value;
  }
};

/**
 * 按类别分组数据
 * @param {any[]} data - 数据数组
 * @param {any} key - 分组键
 * @returns {Object} 分组后的数据对象
 */
const groupByCategory = (data: any[], key: any) => {
  return data.reduce((group, product) => {
    const category = product[key];
    group[category] = group[category] ?? [];
    group[category].push(product);
    return group;
  }, {});
};

/**
 * ChartElement 组件 - 图表元素组件
 *
 * 该组件用于在Markdown编辑器中渲染图表，支持多种图表类型和数据处理。
 * 提供图表配置、数据转换、错误处理等功能。
 *
 * @component
 * @description 图表元素组件，在编辑器中渲染各种类型的图表
 * @param {RenderElementProps} props - 组件属性
 * @param {Object} props.element - 图表元素数据
 * @param {Object} props.attributes - 元素属性
 * @param {React.ReactNode} props.children - 子元素
 *
 * @example
 * ```tsx
 * <ChartElement
 *   element={chartElement}
 *   attributes={attributes}
 *   children={children}
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的图表元素组件
 *
 * @remarks
 * - 支持多种图表类型（饼图、柱状图、折线图、面积图等）
 * - 提供数据格式转换功能
 * - 支持日期和数字格式化
 * - 使用ErrorBoundary处理渲染错误
 * - 提供拖拽手柄功能
 * - 支持图表配置和自定义
 * - 集成编辑器状态管理
 * - 提供响应式布局
 */
export const ChartElement = (props: RenderElementProps) => {
  const { store, readonly, markdownContainerRef, rootContainer } =
    useEditorStore();
  const editor = useSlate();
  const { element: node, attributes, children } = props;
  let chartData = useMemo(() => {
    return (node.otherProps?.dataSource?.map((item: any) => {
      return {
        ...item,
        column_list: Object.keys(item),
      };
    }) || []) as any[];
  }, [node.otherProps?.dataSource]);

  const columns = (node as TableNode).otherProps?.columns || [];

  const [columnLength, setColumnLength] = React.useState(2);
  const config = [node.otherProps?.config || node.otherProps].flat(1);
  const htmlRef = React.useRef<HTMLDivElement>(null);
  const [minWidth, setMinWidth] = React.useState(256);

  useEffect(() => {
    const width = Math.max(
      rootContainer?.current?.clientWidth ||
        htmlRef.current?.parentElement?.clientWidth ||
        256,
      256,
    );
    setMinWidth(width || 256);
    setColumnLength(Math.min(Math.floor(width / 256), config.length));
  }, []);

  return useMemo(
    () => (
      <div
        className={'ant-md-editor-drag-el'}
        {...attributes}
        data-be={'chart'}
        style={{
          flex: 1,
          minWidth: `min(${Math.min(minWidth, 856)}px, 100%)`,
          maxWidth: '100%',
          margin: '1em 0',
        }}
        ref={htmlRef}
        onDragStart={(e) => store.dragStart(e, markdownContainerRef.current!)}
      >
        <DragHandle />
        <div
          className="ant-md-editor-chart-box"
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '0.5em',
          }}
        >
          <ErrorBoundary
            fallback={
              <table>
                <tbody>{children}</tbody>
              </table>
            }
          >
            <div
              style={{
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                  width: '100%',
                  opacity: 0,
                  height: '100%',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                {children}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: minWidth < 400 ? 'column' : 'row',
                  gap: 8,
                  userSelect: 'none',
                }}
                contentEditable={false}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
              >
                {config
                  .map(({ chartType, x, y, ...rest }, index) => {
                    const height = Math.min(
                      400,
                      htmlRef.current?.clientWidth || 400,
                    );
                    if (
                      typeof window === 'undefined' ||
                      typeof document === 'undefined'
                    ) {
                      return (
                        <div
                          key={index}
                          style={{
                            margin: 'auto',
                            position: 'relative',
                            zIndex: 9,
                          }}
                        ></div>
                      );
                    }

                    chartData = chartData
                      .map((item: any) => {
                        return {
                          ...item,
                          [x]: numberString(item[x]),
                          [y]: numberString(item[y]),
                        };
                      })
                      .sort((a, b) => {
                        if (dayjs(a[x]).isValid() && dayjs(b[x]).isValid()) {
                          return dayjs(a[x]).valueOf() - dayjs(b[x]).valueOf();
                        }
                        return 0;
                      });

                    const subgraphBy = rest?.subgraphBy;

                    if (subgraphBy) {
                      const groupData = groupByCategory(chartData, subgraphBy);
                      return Object.keys(groupData).map((key, subIndex) => {
                        const group = groupData[key];
                        if (!Array.isArray(group) || group.length < 1) {
                          return null;
                        }
                        const dom = (
                          <ChartRender
                            chartType={chartType}
                            chartData={group}
                            columnLength={columnLength}
                            onColumnLengthChange={setColumnLength}
                            isChartList
                            config={{
                              height,
                              x,
                              y,
                              columns,
                              index: index * 10 + subIndex,
                              rest,
                            }}
                            title={key}
                            dataTime={rest?.dataTime}
                            groupBy={rest?.groupBy}
                            filterBy={rest?.filterBy}
                            colorLegend={rest?.colorLegend}
                          />
                        );
                        return dom;
                      });
                    }

                    return (
                      <ChartRender
                        key={index}
                        columnLength={columnLength}
                        onColumnLengthChange={setColumnLength}
                        chartType={chartType}
                        chartData={chartData}
                        title={rest?.title}
                        dataTime={rest?.dataTime}
                        groupBy={rest?.groupBy}
                        filterBy={rest?.filterBy}
                        colorLegend={rest?.colorLegend}
                        config={{
                          height,
                          x,
                          y,
                          columns,
                          index: index,
                          rest,
                        }}
                      />
                    );
                  })
                  .map((itemList, index) => {
                    if (Array.isArray(itemList)) {
                      return itemList?.map((item, subIndex) => {
                        if (!item) return null;
                        return (
                          <div
                            key={index + subIndex}
                            style={{
                              margin: 'auto',
                              minWidth: `max(calc(${100 / columnLength}% - 16px), 256px)`,
                              flex: 1,
                              userSelect: 'none',
                            }}
                            contentEditable={false}
                          >
                            {item}
                          </div>
                        );
                      });
                    }
                    return (
                      <div
                        key={index}
                        contentEditable={false}
                        style={{
                          userSelect: 'none',
                          margin: 'auto',
                          minWidth: `max(calc(${100 / columnLength}% - 16px), 256px)`,
                          flex: 1,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {itemList}
                      </div>
                    );
                  })}
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    ),
    [
      attributes,
      JSON.stringify((node as TableNode).otherProps),
      editor,
      columnLength,
      readonly,
      minWidth,
    ],
  );
};
