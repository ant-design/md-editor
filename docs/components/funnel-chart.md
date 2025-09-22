---
title: FunnelChart 漏斗图
atomId: FunnelChart
group:
  title: 图表
  order: 2
---

# FunnelChart 漏斗图

支持阶段排序、居中对称显示、内置筛选与主题配置，风格与其他图表一致。

## 代码演示

<code src="../demos/charts/funnel.tsx" background="var(--main-bg-color)" iframe=540></code>

## API

### FunnelChartProps

| 属性           | 类型                                     | 默认值     | 说明                                              |
| -------------- | ---------------------------------------- | ---------- | ------------------------------------------------- |
| title          | `string`                                 | -          | 图表标题                                          |
| data           | `FunnelChartDataItem[]`                  | -          | 扁平化数据数组（x 为阶段，y 为数值）              |
| color          | `string`                                 | -          | 自定义主色                                        |
| width          | `number \| string`                       | `600`      | 图表宽度（px），移动端自适应为 100%               |
| height         | `number \| string`                       | `400`      | 图表高度（px），移动端最大约 80% 屏宽（上限 400） |
| className      | `string`                                 | -          | 自定义类名                                        |
| dataTime       | `string`                                 | -          | 数据时间                                          |
| theme          | `'dark' \| 'light'`                      | `'light'`  | 主题风格                                          |
| showLegend     | `boolean`                                | `true`     | 是否显示图例                                      |
| legendPosition | `'top' \| 'left' \| 'bottom' \| 'right'` | `'bottom'` | 图例位置                                          |
| legendAlign    | `'start' \| 'center' \| 'end'`           | `'start'`  | 图例水平对齐方式                                  |
| showPercent    | `boolean`                                | `true`     | 是否显示百分比（相对第一层）                      |
| toolbarExtra   | `React.ReactNode`                        | -          | 头部工具条额外按钮                                |
| typeNames      | `{ rate?: string; name: string }`        | -          | 类型名称配置，用于图例和数据集标签                |
| statistic      | `StatisticConfigType`                    | -          | 统计数据组件配置                                  |

### FunnelChartDataItem

| 字段        | 类型               | 必填 | 说明                                                                             |
| ----------- | ------------------ | ---- | -------------------------------------------------------------------------------- |
| category    | `string`           | 否   | 分类（用于外层筛选）                                                             |
| type        | `string`           | 否   | 数据序列名称（默认单序列）                                                       |
| x           | `number \| string` | 是   | 阶段名（将作为 labels）                                                          |
| y           | `number \| string` | 是   | 数值                                                                             |
| filterLabel | `string`           | 否   | 二级筛选标签（可选）                                                             |
| ratio       | `number \| string` | 否   | 与下一层的转化率（0-100 或 '80%'），最后一层可为 0；用于绘制两层之间的梯形与文本 |

### ChartStatisticConfig

`ChartStatisticConfig` 继承自 [ChartStatistic](/components/chart-statistic#chartstatisticprops) 组件的所有属性，详细 API 请参考 [ChartStatistic 文档](/components/chart-statistic)。

| 字段           | 类型                                                                | 默认值      | 说明                                                   |
| -------------- | ------------------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| title          | `string`                                                            | -           | 指标标题                                               |
| tooltip        | `string`                                                            | -           | 鼠标悬停时显示的提示信息                               |
| value          | `number \| string \| null \| undefined`                             | -           | 显示的数值                                             |
| precision      | `number`                                                            | -           | 数值精度（小数点后位数）                               |
| groupSeparator | `string`                                                            | `','`       | 千分位分隔符                                           |
| prefix         | `string`                                                            | `''`        | 数值前缀（如货币符号）                                 |
| suffix         | `string`                                                            | `''`        | 数值后缀（如单位）                                     |
| formatter      | `(value: number \| string \| null \| undefined) => React.ReactNode` | -           | 自定义格式化函数，优先级高于其他格式化选项             |
| className      | `string`                                                            | `''`        | 自定义类名                                             |
| size           | `'small' \| 'default' \| 'large'`                                   | `'default'` | 组件尺寸                                               |
| block          | `boolean`                                                           | `false`     | 是否使用块级布局（弹性占用空间，多个时平分父容器宽度） |
| extra          | `React.ReactNode`                                                   | -           | 右上角自定义内容（图标、按钮等）                       |

## 说明

- 漏斗采用对称浮动条（Floating Bar）实现，自动按数值降序排列阶段。
- Tooltip 默认显示相对第一层的百分比，可通过 `showPercent` 关闭。
