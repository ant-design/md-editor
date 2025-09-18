---
title: BarChart 柱状图
atomId: BarChart
group:
  title: 图表
  order: 2
---

# BarChart 柱状图

支持垂直/水平、堆叠、多序列以及筛选，含响应式与主题配置。

## 代码演示

<code src="../demos/charts/bar/bar.tsx" background="var(--main-bg-color)" iframe=540></code>
<code src="../demos/charts/bar/bar-stacked.tsx" background="var(--main-bg-color)" title="堆叠柱状图" iframe=540></code>
<code src="../demos/charts/bar/bar-negative.tsx" background="var(--main-bg-color)" title="正负柱状图" iframe=540></code>
<code src="../demos/charts/bar/bar-horizontal.tsx" background="var(--main-bg-color)" title="条形图（横向）" iframe=540></code>

## API

### BarChartProps

| 属性           | 类型                                       | 默认值     | 说明                                                       |
| -------------- | ------------------------------------------ | ---------- | ---------------------------------------------------------- |
| title          | `string`                                   | -          | 图表标题                                                   |
| data           | `BarChartDataItem[]`                       | -          | 扁平化数据数组                                             |
| width          | `number \| string`                         | `600`      | 图表宽度（px），移动端自适应为 100%                        |
| height         | `number \| string`                         | `400`      | 图表高度（px），移动端最大约 80% 屏宽（上限 400）          |
| className      | `string`                                   | -          | 自定义类名                                                 |
| dataTime       | `string`                                   | -          | 数据时间                                                   |
| theme          | `'dark' \| 'light'`                        | `'light'`  | 主题风格                                                   |
| color          | `string \| string[]`                       | -          | 自定义主色；正负图取数组前两位为正/负色，一位则单色        |
| showLegend     | `boolean`                                  | `true`     | 是否显示图例                                               |
| legendPosition | `'top' \| 'left' \| 'bottom' \| 'right'`   | `'bottom'` | 图例位置                                                   |
| legendAlign    | `'start' \| 'center' \| 'end'`             | `'start'`  | 图例水平对齐方式                                           |
| showGrid       | `boolean`                                  | `true`     | 是否显示网格线                                             |
| xPosition      | `'top' \| 'bottom'`                        | `'bottom'` | X 轴位置                                                   |
| yPosition      | `'left' \| 'right'`                        | `'left'`   | Y 轴位置                                                   |
| stacked        | `boolean`                                  | `false`    | 是否堆叠显示多个数据集                                     |
| indexAxis      | `'x' \| 'y'`                               | `'x'`      | 轴向：`'x'` 垂直柱状图，`'y'` 水平条形图                   |
| toolbarExtra   | `React.ReactNode`                          | -          | 头部工具条额外按钮                                         |
| static         | `ChartStaticConfig \| ChartStaticConfig[]` | -          | ChartStatic组件配置：object表示单个配置，array表示多个配置 |

### BarChartDataItem

| 字段        | 类型     | 必填 | 说明                           |
| ----------- | -------- | ---- | ------------------------------ |
| category    | `string` | 是   | 分类（用于外层筛选）           |
| type        | `string` | 是   | 数据序列名称（映射为 dataset） |
| x           | `number` | 是   | 横轴值（将作为 labels）        |
| y           | `number` | 是   | 纵轴值                         |
| xtitle      | `string` | 否   | X 轴标题（从数据中提取）       |
| ytitle      | `string` | 否   | Y 轴标题（从数据中提取）       |
| filterLabel | `string` | 否   | 二级筛选标签（可选）           |

### ChartStaticConfig

| 字段           | 类型                                                                | 默认值      | 说明                     |
| -------------- | ------------------------------------------------------------------- | ----------- | ------------------------ |
| title          | `string`                                                            | -           | 静态数据标题             |
| tooltip        | `string`                                                            | -           | 提示信息                 |
| value          | `number \| string \| null \| undefined`                             | -           | 显示的数值               |
| precision      | `number`                                                            | -           | 数值精度（小数点后位数） |
| groupSeparator | `string`                                                            | -           | 千分位分隔符             |
| prefix         | `string`                                                            | -           | 数值前缀                 |
| suffix         | `string`                                                            | -           | 数值后缀                 |
| formatter      | `(value: number \| string \| null \| undefined) => React.ReactNode` | -           | 自定义格式化函数         |
| className      | `string`                                                            | -           | 自定义类名               |
| size           | `'small' \| 'default' \| 'large'`                                   | `'default'` | 组件尺寸                 |

## 说明

- `stacked` 为 `true` 时，将按 `type` 将数据叠加显示。
- `indexAxis='y'` 时为横向条形图。
- `static` 属性支持数组形式，可同时渲染多个静态数据组件，如 `[{title: '总销量', value: 1200}, {title: '增长率', value: '15%'}]`。
