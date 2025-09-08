---
title: DonutChart 环形图
group:
  title: 图表
  order: 3
---

# DonutChart 环形图

支持单值/多值、自动分类、中心文本、筛选与工具栏，移动端优化良好。

## 代码演示

<code src="../demos/charts/donut/donut-single.tsx" background="var(--main-bg-color)" title="单值" iframe=450></code>
<code src="../demos/charts/donut/donut-single-categorized.tsx" background="var(--main-bg-color)" title="单值-带分类" iframe=540></code>
<code src="../demos/charts/donut/donut-multi.tsx" background="var(--main-bg-color)" title="多值" iframe=540></code>
<code src="../demos/charts/donut/donut-multi-categorized.tsx" background="var(--main-bg-color)" title="多值-带分类" iframe=540></code>

## API

### DonutChartProps

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| data | `DonutChartData[]` | - | 数据源 |
| configs | `DonutChartConfig[]` | `[{ showLegend: true }]` | 配置列表（可多视图）|
| width | `number` | `200` | 宽度（px），移动端自适应 |
| height | `number` | `200` | 高度（px），移动端自适应，移动端有最大尺寸限制 |
| className | `string` | - | 自定义类名 |
| title | `string` | - | 标题（同时用于工具栏）|
| showToolbar | `boolean` | `true` | 是否显示下载/全屏等工具按钮 |
| onDownload | `() => void` | - | 点击下载回调（未传时使用内置下载）|
| filterList | `string[]` | - | 筛选项列表（不传不显示筛选器）|
| selectedFilter | `string` | - | 外部受控的当前筛选值 |
| onFilterChange | `(value: string) => void` | - | 筛选变化回调 |
| enableAutoCategory | `boolean` | `true` | 是否启用自动分类（依据 `category`）|
| singleMode | `boolean` | `false` | 是否启用单值模式：每条数据一个独立环形图并自动着色 |

### DonutChartData

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| category | `string` | 否 | 分类（用于可选自动分类与筛选）|
| label | `string` | 是 | 标签（将用于图例与中心文字）|
| value | `number` | 是 | 数值（可自动计算百分比）|
| filterLable | `string` | 否 | 二级筛选标签（可选）|

### DonutChartConfig

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| lastModified | `string` | - | 最近更新时间（展示用）|
| theme | `'light' \| 'dark'` | `'light'` | 主题风格 |
| cutout | `string \| number` | - | 中心空心占比（如 `'60%'`）|
| showLegend | `boolean` | `true` | 是否显示图例 |
| showTooltip | `boolean` | `true` | 是否显示 tooltip |
| legendPosition | `'top' \| 'left' \| 'bottom' \| 'right'` | `'right'（移动端自动底部）` | 图例位置 |
| backgroundColor | `string[]` | 内置色板 | 每项对应一个扇区颜色 |
| borderColor | `string` | - | 边框颜色 |

## 说明
- 移动端字体与布局会自动缩放优化，避免中心文本溢出。
- 开启 `singleMode` 时，每条 `data` 将渲染独立的小环形图，便于对比多个单值。 
