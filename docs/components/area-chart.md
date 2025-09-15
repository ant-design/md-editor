---
title: AreaChart 面积图
atomId: AreaChart
group:
  title: 图表
  order: 1
---

# AreaChart 面积图

用于渲染分类型、多序列的面积图，支持筛选、图例、主题与响应式。

## 代码演示

<code src="../demos/charts/area.tsx" background="var(--main-bg-color)" iframe=540></code>

## API

### AreaChartProps

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | `string` | - | 图表标题 |
| data | `AreaChartDataItem[]` | - | 扁平化数据数组 |
| width | `number` | `600` | 图表宽度（px），移动端自适应为 100% |
| height | `number` | `400` | 图表高度（px），移动端最大约 80% 屏宽（上限 400）|
| className | `string` | - | 自定义类名 |
| theme | `'dark' \| 'light'` | `'light'` | 主题风格 |
| showLegend | `boolean` | `true` | 是否显示图例 |
| legendPosition | `'top' \| 'left' \| 'bottom' \| 'right'` | `'bottom'` | 图例位置 |
| legendAlign | `'start' \| 'center' \| 'end'` | `'start'` | 图例水平对齐方式 |
| showGrid | `boolean` | `true` | 是否显示网格线 |
| xPosition | `'top' \| 'bottom'` | `'bottom'` | X 轴位置 |
| yPosition | `'left' \| 'right'` | `'left'` | Y 轴位置 |

### AreaChartDataItem

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| category | `string` | 是 | 分类（用于外层筛选）|
| type | `string` | 是 | 数据序列名称（会映射为一个 dataset）|
| x | `number` | 是 | 横轴值（将自动排序并作为 labels）|
| y | `number` | 是 | 纵轴值 |
| xtitle | `string` | 否 | X 轴标题（从数据中提取）|
| ytitle | `string` | 否 | Y 轴标题（从数据中提取）|
| filterLabel | `string` | 否 | 二级筛选标签（可选）|

## 说明
- 移动端自动启用响应式：宽度 100%，高度不超过 400px。
- 当 `filterLabel` 存在时，组件会在分类基础上增加二级筛选。
- 不同 `type` 自动分配调色板并以填充形式展示面积。 
