---
title: LineChart 折线图
group:
  title: 图表
  order: 4
---

# LineChart 折线图

支持多序列、筛选、图例与网格线配置，含移动端响应式优化。

## 代码演示

<code src="../demos/charts/line.tsx" background="var(--main-bg-color)" iframe=540></code>

## API

### LineChartProps

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | `string` | - | 图表标题 |
| data | `LineChartDataItem[]` | - | 扁平化数据数组 |
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

### LineChartDataItem

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| category | `string` | 是 | 分类（用于外层筛选）|
| type | `string` | 是 | 数据序列名称（映射为 dataset）|
| x | `number` | 是 | 横轴值（将自动排序并作为 labels）|
| y | `number` | 是 | 纵轴值 |
| xtitle | `string` | 否 | X 轴标题（从数据中提取）|
| ytitle | `string` | 否 | Y 轴标题（从数据中提取）|
| filterLable | `string` | 否 | 二级筛选标签（可选）|

## 说明
- 自动按 `x` 升序生成横轴，按 `type` 组装数据集并分配调色板。 
