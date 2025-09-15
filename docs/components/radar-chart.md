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

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| data | `RadarChartDataItem[]` | - | 扁平化数据数组 |
| title | `string` | - | 图表标题 |
| width | `number` | `600` | 宽度（px），移动端自适应为 100% |
| height | `number` | `400` | 高度（px），移动端按正方形比例，最大约 400 |
| className | `string` | - | 自定义类名 |

### RadarChartDataItem

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| category | `string` | 是 | 分类（用于外层筛选）|
| label | `string` | 是 | 指标名称（将作为雷达图各轴标签）|
| type | `string` | 是 | 数据序列名称（映射为 dataset）|
| score | `number` | 是 | 指标分值 |
| filterLabel | `string` | 否 | 二级筛选标签（可选）|

## 说明
- 内置色板自动为不同 `type` 分配颜色并填充区域。
- 图例在移动端自动放置到底部、字体缩放优化。 
