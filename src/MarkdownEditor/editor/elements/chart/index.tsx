import React, { useEffect, useMemo } from 'react';
import { RenderElementProps, useSlate } from 'slate-react';
import { TableNode } from '../../../el';
import { useEditorStore } from '../../store';
import { DragHandle } from '../../tools/DragHandle';
import { ErrorBoundary } from '../ErrorBoundary';
import { ChartRender } from './ChartRender';

/**
 * 转化数字，将字符串转化为数字，即使非标准数字也可以转化
 * @param val
 * @param locale
 * @returns
 */
function reverseFormatNumber(val: string, locale: any) {
  let group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
  let decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
  let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
  reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
  return Number.isNaN(reversedVal) ? NaN : Number(reversedVal);
}

/**
 * 转化数字，转化不成功继续用string
 * @param value
 * @returns
 */
const numberString = (value: string) => {
  if (!value) return value;
  try {
    if (typeof value === 'number') return value;

    if (typeof value === 'string') {
      const formattedValue = reverseFormatNumber(value, 'en-US');
      if (!isNaN(formattedValue)) return formattedValue;
    }
    return value;
  } catch (error) {
    return value;
  }
};

/**
 * 创建一个新的 `Intl.NumberFormat` 实例，用于将数字格式化为美国英语的十进制格式。
 *
 * @constant
 * @type {Intl.NumberFormat}
 * @default
 * @example
 * const formattedNumber = intl.format(1234567.89);
 * console.log(formattedNumber); // 输出: "1,234,567.89"
 */
const intl = new Intl.NumberFormat('en-US', {
  style: 'decimal',
});

/**
 * 将数字或字符串格式化为字符串。
 *
 * @param value - 要格式化的值，可以是字符串或数字。
 * @returns 格式化后的字符串。如果输入值为字符串，则直接返回该字符串；
 *          如果输入值为数字，则使用 `intl.format` 方法格式化后返回；
 *          如果输入值为空或格式化过程中发生错误，则返回原始值。
 */
const stringFormatNumber = (value: string | number) => {
  if (!value) return value;
  try {
    if (typeof value === 'string') return value;

    if (typeof value === 'number') {
      return intl.format(Number(value));
    }
    return value;
  } catch (error) {
    return value;
  }
};

/**
 * 生成图表配置属性的函数。
 *
 * @param config - 配置对象，包含以下属性：
 *   @param config.x - x轴字段名称。
 *   @param config.height - 图表高度。
 *   @param config.y - y轴字段名称。
 *   @param config.colorLegend - 颜色图例字段名称。
 * @returns 默认的图表配置属性对象。
 */
const genConfigProps = (config: {
  x: string;
  height: number;
  y: string;
  colorLegend?: string | null;
}) => {
  const defaultProps = {
    tooltip: {
      title: (d: any) => {
        return d[config.x];
      },
      items: [
        {
          field: config.y,
          valueFormatter: (value: string) => {
            return stringFormatNumber(value);
          },
        },
      ],
    },
    axis: {
      x: {
        label: { autoHide: true },
        labelFormatter: (value: number | string) => {
          return stringFormatNumber(value);
        },
      },
      y: {
        label: { autoHide: true },
        labelFormatter: (value: number | string) => {
          return stringFormatNumber(value);
        },
      },
    },
    style: {
      maxWidth: 20, // 圆角样式
      radiusTopLeft: 4,
      radiusTopRight: 4,
    },
    label: false,
    height: config.height || 400,
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
    color: [
      '#1677ff',
      '#15e7e4',
      '#8954FC',
      '#F45BB5',
      '#00A6FF',
      '#33E59B',
      '#D666E4',
      '#6151FF',
      '#BF3C93',
      '#005EE0',
    ],
    scale: {
      color: {
        type: 'ordinal',
        range: [
          '#1677ff',
          '#15e7e4',
          '#8954FC',
          '#F45BB5',
          '#00A6FF',
          '#33E59B',
          '#D666E4',
          '#6151FF',
          '#BF3C93',
          '#005EE0',
        ],
      },
    },
    colorField:
      config?.colorLegend && config?.colorLegend !== 'null'
        ? config.colorLegend
        : undefined,
  };
  return defaultProps;
};

const groupByCategory = (data: any[], key: any) => {
  return data.reduce((group, product) => {
    const category = product[key];
    group[category] = group[category] ?? [];
    group[category].push(product);
    return group;
  }, {});
};

/**
 * Chart 组件用于渲染图表元素。
 *
 * @component
 * @param {RenderElementProps} props - 组件的属性。
 * @returns {JSX.Element} 渲染的图表组件。
 *
 * @example
 * ```tsx
 * <Chart element={element} attributes={attributes} children={children} />
 * ```
 *
 * @description
 * 该组件使用 `useEditorStore` 和 `useSlate` 获取编辑器的状态和实例。
 * 使用 `useMemo` 计算图表数据，并根据 `node.otherProps?.dataSource` 生成列列表。
 * 通过 `getChartPopover` 函数生成图表配置的下拉菜单和弹出框。
 *
 * @remarks
 * - 支持多种图表类型：饼图、柱状图、折线图、面积图等。
 * - 使用 `ErrorBoundary` 组件包裹图表，处理渲染错误。
 * - 支持图表的拖拽和编辑功能。
 *
 * @param {number} index - 图表配置的索引。
 * @returns {JSX.Element[]} 返回图表配置的下拉菜单和弹出框。
 *
 * @example
 * ```tsx
 * const toolBar = getChartPopover(index);
 * ```
 *
 * @description
 * 该函数生成图表配置的下拉菜单和弹出框，用于更改图表类型和配置图表属性。
 *
 * @remarks
 * - 使用 `Dropdown` 和 `Popover` 组件生成菜单和弹出框。
 * - 支持图表类型的切换和属性的更新。
 */
export const Chart: React.FC<RenderElementProps> = (props) => {
  const { store, readonly, rootContainer } = useEditorStore();
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

  const config = [node.otherProps?.config].flat(1);
  const htmlRef = React.useRef<HTMLDivElement>(null);
  const [minWidth, setMinWidth] = React.useState(290);

  useEffect(() => {
    if (htmlRef.current) {
      const width = Math.max(
        rootContainer?.current?.clientWidth || htmlRef.current?.clientWidth,
        290,
      );
      setMinWidth(290);
      setColumnLength(width & 200);
    }
  }, []);

  return useMemo(
    () => (
      <div
        className={'ant-md-editor-drag-el'}
        {...attributes}
        data-be={'chart'}
        style={{
          flex: 1,
          minWidth,
        }}
        ref={htmlRef}
        onDragStart={store.dragStart}
      >
        <DragHandle />
        <div
          className="chart-box"
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 18,
            overflow: 'auto',
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

                    chartData = chartData.map((item: any) => {
                      return {
                        ...item,
                        [x]: numberString(item[x]),
                        [y]: numberString(item[y]),
                      };
                    });

                    const defaultProps = genConfigProps({
                      x,
                      y,
                      height,
                      colorLegend: rest?.colorLegend,
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
                              defaultProps,
                              height,
                              x,
                              y,
                              columns,
                              index: index * 10 + subIndex,
                              rest,
                            }}
                            title={key}
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
                        config={{
                          defaultProps,
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
                              border: '1px solid #eee',
                              borderRadius: 18,
                              margin: 'auto',
                              minWidth: `calc(${100 / columnLength}% - 16px)`,
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
                          border: '1px solid #eee',
                          borderRadius: 18,
                          margin: 'auto',
                          minWidth: `calc(${100 / columnLength}% - 16px)`,
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
    ],
  );
};
