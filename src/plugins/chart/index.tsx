import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { ErrorBoundary } from '../../MarkdownEditor/editor/elements/ErrorBoundary';
import {
  RenderElementProps,
  useSlate,
} from '../../MarkdownEditor/editor/slate-react';
import { useEditorStore } from '../../MarkdownEditor/editor/store';
import { DragHandle } from '../../MarkdownEditor/editor/tools/DragHandle';
import { TableNode } from '../../MarkdownEditor/el';
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
      return isValidDate(value);
    }
    return value;
  } catch (error) {
    return value;
  }
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
export const ChartElement: React.FC<RenderElementProps> = (props) => {
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
        }}
        ref={htmlRef}
        onDragStart={store.dragStart}
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
                              border: '1px solid #eee',
                              borderRadius: '0.5em',
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
                          border: '1px solid #eee',
                          borderRadius: '0.5em',
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
