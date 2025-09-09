import {
  DownOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { ConfigProvider, Descriptions, Dropdown, Popover, Table } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import React, { useContext, useMemo, useState } from 'react';
import { I18nContext } from '../../i18n';
import { ActionIconBox } from '../../MarkdownEditor/editor/components';
import { useFullScreenHandle } from '../../MarkdownEditor/hooks/useFullScreenHandle';
import AreaChart from './AreaChart';
import BarChart from './BarChart';
import LineChart from './LineChart';
import RadarChart from './RadarChart';
import ScatterChart from './ScatterChart';
import DonutChart from './DonutChart';

/**
 * 图表类型映射配置
 */
const ChartMap = {
  pie: {
    title: '饼图',
    changeData: ['table'],
  },
  bar: {
    title: '条形图',
    changeData: ['column', 'line', 'area', 'table'],
  },
  line: {
    title: '折线图',
    changeData: ['column', 'bar', 'area', 'table'],
  },
  column: {
    title: '柱状图',
    changeData: ['bar', 'line', 'area', 'table'],
  },
  area: {
    title: '面积图',
    changeData: ['column', 'bar', 'line', 'table'],
  },
  radar: {
    title: '雷达图',
    changeData: ['table'],
  },
  scatter: {
    title: '散点图',
    changeData: ['table'],
  },
  table: {
    title: '表格',
    changeData: ['column', 'line', 'area', 'pie'],
  },
  descriptions: {
    title: '定义列表',
    changeData: ['column', 'line', 'area', 'table', 'pie'],
  },
};

/**
 * ChartRender 组件 - 图表渲染组件
 *
 * 该组件用于渲染各种类型的图表，支持饼图、柱状图、折线图、面积图、表格等。
 * 提供图表类型切换、全屏显示、下载、配置等功能。
 *
 * @component
 * @description 图表渲染组件，支持多种图表类型的渲染和交互
 * @param {Object} props - 组件属性
 * @param {'pie'|'bar'|'line'|'column'|'area'|'descriptions'|'table'} props.chartType - 图表类型
 * @param {Record<string, any>[]} props.chartData - 图表数据
 * @param {Object} props.config - 图表配置
 * @param {any} props.config.height - 图表高度
 * @param {any} props.config.x - X轴字段
 * @param {any} props.config.y - Y轴字段
 * @param {any} props.config.rest - 其他配置
 * @param {any} [props.config.index] - 图表索引
 * @param {any} [props.config.chartData] - 图表数据
 * @param {any} [props.config.columns] - 列配置
 * @param {any} [props.node] - 节点数据
 * @param {any} [props.title] - 图表标题
 * @param {boolean} [props.isChartList] - 是否为图表列表
 * @param {number} [props.columnLength] - 列长度
 * @param {(value: number) => void} [props.onColumnLengthChange] - 列长度变化回调
 * @param {string} [props.dataTime] - 数据时间
 * @param {string} [props.groupBy] - 业务分组维度
 * @param {string} [props.filterBy] - 主筛选维度
 * @param {string} [props.colorLegend] - 数据系列维度
 *
 * @example
 * ```tsx
 * <ChartRender
 *   chartType="pie"
 *   chartData={[{ name: "A", value: 10 }, { name: "B", value: 20 }]}
 *   config={{
 *     height: 300,
 *     x: "name",
 *     y: "value"
 *   }}
 *   title="销售数据"
 *   dataTime="2025-06-30 00:00:00"
 * />
 * ```
 *
 * @returns {React.ReactElement} 渲染的图表组件
 *
 * @remarks
 * - 支持多种图表类型（饼图、柱状图、折线图、面积图、表格等）
 * - 提供图表类型切换功能
 * - 支持全屏显示
 * - 提供图表下载功能
 * - 支持图表配置和自定义
 * - 提供响应式布局
 * - 集成国际化支持
 * - 提供图表属性工具栏
 */
export const ChartRender: React.FC<{
  chartType:
    | 'pie'
    | 'bar'
    | 'line'
    | 'column'
    | 'area'
    | 'radar'
    | 'scatter'
    | 'descriptions'
    | 'table';
  chartData: Record<string, any>[];
  config: {
    height: any;
    x: any;
    y: any;
    rest: any;
    index?: any;
    chartData?: any;
    columns?: any;
  };
  node?: any;
  title?: any;
  isChartList?: boolean;
  columnLength?: number;
  onColumnLengthChange?: (value: number) => void;
  dataTime?: string;
  groupBy?: string;
  filterBy?: string;
  colorLegend?: string;
}> = (props) => {
  const handle = useFullScreenHandle() || {};
  const [chartType, setChartType] = useState<
    'pie' | 'bar' | 'line' | 'column' | 'area' | 'radar' | 'scatter' | 'descriptions' | 'table'
  >(() => props.chartType as any);
  const {
    chartData,
    node,
    isChartList,
    onColumnLengthChange,
    columnLength,
    title,
    dataTime,
    groupBy,
    filterBy,
    colorLegend,
  } = props;
  const i18n = useContext(I18nContext);
  const [config, setConfig] = useState(() => props.config);
  const [renderKey, setRenderKey] = useState(0);

  const toNumber = (val: any, fallback: number) => {
    if (typeof val === 'number' && !Number.isNaN(val)) return val;
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  };

  const getAxisTitles = () => {
    const xCol = config?.columns?.find?.((c: any) => c?.dataIndex === config?.x);
    const yCol = config?.columns?.find?.((c: any) => c?.dataIndex === config?.y);
    return {
      xTitle: xCol?.title || String(config?.x || ''),
      yTitle: yCol?.title || String(config?.y || ''),
    };
  };

  const buildXIndexer = () => {
    const map = new Map<any, number>();
    let idx = 1;
    (chartData || []).forEach((row: any) => {
      const key = row?.[config?.x as any];
      if (!map.has(key)) map.set(key, idx++);
    });
    return map;
  };

  const convertFlatData = useMemo(() => {
    const { xTitle, yTitle } = getAxisTitles();
    const xIndexer = buildXIndexer();

    const legendField: string | undefined = colorLegend // 图例维度 → type
    const groupByField: string | undefined = groupBy // 业务分组维度 → category
    const filterByField: string | undefined = filterBy // 主筛选维度 → filterLable

    return (chartData || []).map((row: any, i: number) => {
      const rawX = row?.[config?.x as any];
      const rawY = row?.[config?.y as any];

      // category: 一个表中的不同数据（主筛选）
      const category =
        groupByField && row?.[groupByField] != null
          ? String(row[groupByField])
          : row?.category != null
          ? String(row.category)
          : (title || '默认');

      // type: 一个数据里的不同维度（图例）
      const type =
        legendField && row?.[legendField] != null
          ? String(row[legendField])
          : row?.type != null
          ? String(row.type)
          : (yTitle || '系列');

      // filterLable: 多个不同的表（二级筛选）
      const filterLable =
        filterByField && row?.[filterByField] != null
          ? String(row[filterByField])
          : undefined;

      return {
        category,
        type,
        x:
          typeof rawX === 'number'
            ? rawX
            : rawX != null
            ? String(rawX)
            : String(xIndexer.get(rawX) ?? i + 1),
        y: typeof rawY === 'number' ? rawY : rawY != null ? String(rawY) : '',
        xtitle: xTitle,
        ytitle: yTitle,
        ...(filterLable != null ? { filterLable } : {}),
      };
    });
  }, [JSON.stringify(chartData), JSON.stringify(config), title]);

  const convertDonutData = useMemo(() => {
    const groupByField: string | undefined = groupBy // 业务分组维度 → category
    const filterByField: string | undefined = filterBy // 主筛选维度 → filterLable

    return (chartData || []).map((row: any) => {
      const category =
        groupByField && row?.[groupByField] != null
          ? String(row[groupByField])
          : row?.category != null
          ? String(row.category)
          : (title || '默认');
      const label = String(row?.[config?.x as any] ?? '');
      const value = toNumber(row?.[config?.y as any], 0);
      const filterLable =
        filterByField && row?.[filterByField] != null
          ? String(row[filterByField])
          : undefined;

      return {
        category,
        label,
        value,
        ...(filterLable != null ? { filterLable } : {}),
      };
    });
  }, [JSON.stringify(chartData), JSON.stringify(config), title]);
  /**
   * 图表配置
   */
  const getChartPopover = () =>
    [
      <Dropdown
        key="dropdown"
        menu={{
          items:
            ChartMap[chartType as 'pie']?.changeData?.map((key: string) => {
              return {
                key,
                label:
                  i18n?.locale?.[(key + 'eChart') as 'pieChart'] ||
                  ChartMap[key as 'pie']?.title,
                onClick: () => {
                  setChartType(key as 'pie');
                },
              };
            }) || [],
        }}
        getPopupContainer={() => document.body}
      >
        <span
          style={{
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: '1px solid #f0f0f0',
            padding: '4px 12px',
            borderRadius: '1em',
          }}
        >
          {ChartMap[chartType]?.title}
          <DownOutlined
            style={{
              fontSize: 8,
            }}
          />
        </span>
      </Dropdown>,
      isChartList ? (
        <Dropdown
          key="dropdown"
          menu={{
            items: new Array(4).fill(0).map((_, i) => {
              return {
                key: i + 1,
                label: i + 1,
                onClick: () => {
                  onColumnLengthChange?.(i + 1);
                },
              };
            }),
          }}
          getPopupContainer={() => document.body}
        >
          <span
            style={{
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              border: '1px solid #f0f0f0',
              padding: '4px 12px',
              borderRadius: '1em',
            }}
          >
            {columnLength} 列
            <DownOutlined
              style={{
                fontSize: 8,
              }}
            />
          </span>
        </Dropdown>
      ) : null,
      <Popover
        arrow={false}
        styles={{
          body: {
            padding: 8,
          },
        }}
        key="config"
        title={i18n?.locale?.configChart || '配置图表'}
        trigger={'click'}
        getPopupContainer={() => document.body}
        content={
          <ConfigProvider componentSize="small">
            <ProForm
              submitter={{
                searchConfig: {
                  submitText: i18n?.locale?.updateChart || '更新',
                },
              }}
              style={{
                width: 300,
              }}
              initialValues={config}
              onFinish={(values) => {
                setConfig({
                  ...props.config,
                  ...values,
                });
                setRenderKey((k) => k + 1);
              }}
            >
              <div
                style={{
                  maxHeight: '70vh',
                  overflow: 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                  }}
                >
                  <ProFormSelect
                    label="X"
                    name="x"
                    fieldProps={{
                      onClick: (e) => {
                        e.stopPropagation();
                      },
                    }}
                    options={config.columns
                      ?.filter((item: any) => item.title)
                      ?.map((item: any) => {
                        return {
                          label: item.title,
                          value: item.dataIndex,
                        };
                      })}
                  />
                  <ProFormSelect
                    name="y"
                    label="Y"
                    fieldProps={{
                      onClick: (e) => {
                        e.stopPropagation();
                      },
                    }}
                    options={config.columns
                      ?.filter((item: any) => item.title)
                      ?.map((item: any) => {
                        return {
                          label: item.title,
                          value: item.dataIndex,
                        };
                      })}
                  />
                </div>
              </div>
            </ProForm>
          </ConfigProvider>
        }
      >
        <ActionIconBox
          title={i18n?.locale?.configChart || '配置图表'}
          onClick={() => setRenderKey((k) => k + 1)}
        >
          <SettingOutlined />
        </ActionIconBox>
      </Popover>,
    ].filter((item) => !!item) as JSX.Element[];

  const chartDom = useMemo(() => {
    if (typeof window === 'undefined') return null;
    if (process.env.NODE_ENV === 'test') return null;
    //@ts-ignore
    if (window?.notRenderChart) return null;
    if (chartType === 'table') {
      return (
        <div
          key={config?.index}
          contentEditable={false}
          style={{
            margin: 12,
            overflow: 'auto',
            border: '1px solid #eee',
            borderRadius: '0.5em',
            flex: 1,
            maxWidth: 'calc(100% - 32px)',
            maxHeight: 400,
            userSelect: 'none',
          }}
        >
          <Table
            size="small"
            dataSource={chartData}
            columns={config?.columns}
            pagination={false}
            rowKey={(record) => record.key}
          />
        </div>
      );
    }
    if (chartType === 'pie') {
      return (
        <DonutChart
          key={`${config?.index}-donut-${renderKey}`}
          data={convertDonutData}
          height={config?.height || 400}
          title={title}
          showToolbar={true}
          dataTime={dataTime}
        />
      );
    }
    if (chartType === 'bar') {
      return (
        <BarChart
          key={`${config?.index}-bar-${renderKey}`}
          data={convertFlatData}
          height={config?.height || 400}
          title={title || ''}
          indexAxis={'y'}
          stacked={config?.rest?.stacked}
          showLegend={config?.rest?.showLegend ?? true}
          showGrid={config?.rest?.showGrid ?? true}
          dataTime={dataTime}
        />
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart
          key={`${config?.index}-line-${renderKey}`}
          data={convertFlatData}
          height={config?.height || 400}
          title={title || ''}
          showLegend={config?.rest?.showLegend ?? true}
          showGrid={config?.rest?.showGrid ?? true}
          dataTime={dataTime}
        />
      );
    }
    if (chartType === 'column') {
      return (
        <BarChart
          key={`${config?.index}-column-${renderKey}`}
          data={convertFlatData}
          height={config?.height || 400}
          title={title || ''}
          indexAxis={'x'}
          stacked={config?.rest?.stacked}
          showLegend={config?.rest?.showLegend ?? true}
          showGrid={config?.rest?.showGrid ?? true}
          dataTime={dataTime}
        />
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart
          key={`${config?.index}-area-${renderKey}`}
          data={convertFlatData}
          height={config?.height || 400}
          title={title || ''}
          showLegend={config?.rest?.showLegend ?? true}
          showGrid={config?.rest?.showGrid ?? true}
          dataTime={dataTime}
        />
      );
    }
    if (chartType === 'radar') {
      // Radar 数据需要映射为 { category, label, type, score }
      const radarData = (chartData || []).map((row: any, i: number) => {
        const groupByField: string | undefined = groupBy;
        const legendField: string | undefined = colorLegend;
        return {
          category:
            groupByField && row?.[groupByField] != null
              ? String(row[groupByField])
              : String(title || '默认'),
          label: String(row?.[config?.x as any] ?? i + 1),
          type:
            legendField && row?.[legendField] != null
              ? String(row[legendField])
              : '系列',
          score: row?.[config?.y as any],
          ...(row?.filterLable != null ? { filterLable: row.filterLable } : {}),
        };
      });
      return (
        <RadarChart
          key={`${config?.index}-radar-${renderKey}`}
          data={radarData}
          height={config?.height || 400}
          title={title || ''}
          dataTime={dataTime}
        />
      );
    }
    if (chartType === 'scatter') {
      // Scatter 数据需要映射为 { category, type, x, y }
      const groupByField: string | undefined = groupBy;
      const legendField: string | undefined = colorLegend;
      const filterByField: string | undefined = filterBy;
      const scatterData = (chartData || []).map((row: any, i: number) => {
        return {
          category:
            groupByField && row?.[groupByField] != null
              ? String(row[groupByField])
              : String(title || '默认'),
          type:
            legendField && row?.[legendField] != null
              ? String(row[legendField])
              : '系列',
          x: row?.[config?.x as any],
          y: row?.[config?.y as any],
          ...(filterByField && row?.[filterByField] != null
            ? { filterLable: String(row[filterByField]) }
            : {}),
        };
      });
      return (
        <ScatterChart
          key={`${config?.index}-scatter-${renderKey}`}
          data={scatterData}
          height={config?.height || 400}
          title={title || ''}
          dataTime={dataTime}
        />
      );
    }
    if (
      chartType === 'descriptions' ||
      (chartData.length < 2 && config?.columns.length > 8)
    ) {
      return (
        <div
          key={config?.index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {chartData.map((row: Record<string, any>) => {
            return (
              <Descriptions
                bordered
                key={config?.index}
                column={{
                  xxl: 2,
                  xl: 2,
                  lg: 2,
                  md: 2,
                  sm: 1,
                  xs: 1,
                }}
                items={
                  config?.columns
                    .map((column: { title: string; dataIndex: string }) => {
                      if (!column.title || !column.dataIndex) return null;
                      return {
                        label: column.title || '',
                        children: row[column.dataIndex],
                      };
                    })
                    .filter((item: any) => !!item) as DescriptionsItemType[]
                }
              />
            );
          })}
        </div>
      );
    }
  }, [
    chartType,
    JSON.stringify(chartData),
    handle.active,
    JSON.stringify(config),
  ]);

  const toolBar = getChartPopover();

  if (!chartDom) return null;

  return (
    <ConfigProvider
      getPopupContainer={(node) => (handle.node.current || node) as HTMLElement}
      getTargetContainer={() =>
        (handle.node.current || document?.body) as HTMLElement
      }
    >
      <div
        ref={handle.node}
      >
        {chartDom ?? null}
      </div>
    </ConfigProvider>
  );
};
