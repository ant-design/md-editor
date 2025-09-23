---
title: RadarChart 雷达图
atomId: RadarChart
group:
  title: 图表
  order: 5
---

# RadarChart 雷达图

用于展示多指标对比的雷达图，支持分类与二级筛选，移动端自适应。

## 代码演示

<code src="../demos/charts/radar.tsx" background="var(--main-bg-color)" iframe=540></code>

## API

### RadarChartProps

| 属性                 | 类型                   | 默认值 | 说明                                       |
| -------------------- | ---------------------- | ------ | ------------------------------------------ |
| data                 | `RadarChartDataItem[]` | -      | 扁平化数据数组                             |
| title                | `string`               | -      | 图表标题                                   |
| width                | `number \| string`     | `600`  | 宽度（px），移动端自适应为 100%            |
| height               | `number \| string`     | `400`  | 高度（px），移动端按正方形比例，最大约 400 |
| className            | `string`               | -      | 自定义类名                                 |
| toolbarExtra         | `React.ReactNode`      | -      | 头部工具条额外按钮                         |
| dataTime             | `string`               | -      | 数据时间                                   |
| borderColor          | `string`               | -      | 边框颜色                                   |
| backgroundColor      | `string`               | -      | 背景颜色                                   |
| pointBackgroundColor | `string`               | -      | 点背景颜色                                 |
| statistic            | `StatisticConfigType`  | -      | 统计数据组件配置                           |

### RadarChartDataItem

| 字段        | 类型               | 必填 | 说明                             |
| ----------- | ------------------ | ---- | -------------------------------- |
| category    | `string`           | 否   | 分类（用于外层筛选）             |
| label       | `string`           | 是   | 指标名称（将作为雷达图各轴标签） |
| type        | `string`           | 否   | 数据序列名称（映射为 dataset）   |
| score       | `number \| string` | 是   | 指标分值                         |
| filterLabel | `string`           | 否   | 二级筛选标签（可选）             |

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

- 内置色板自动为不同 `type` 分配颜色并填充区域。
- 图例在移动端自动放置到底部、字体缩放优化。
