---
title: ScatterChart 散点图
atomId: ScatterChart
group:
  title: 图表
  order: 6
---

# ScatterChart 散点图

用于展示二维坐标的离散点分布，支持分类与二级筛选，含响应式优化。

## 代码演示

<code src="../demos/charts/scatter.tsx" background="var(--main-bg-color)" iframe=540></code>

## API

### ScatterChartProps

| 属性      | 类型                     | 默认值 | 说明                                          |
| --------- | ------------------------ | ------ | --------------------------------------------- |
| data      | `ScatterChartDataItem[]` | -      | 扁平化数据数组                                |
| title     | `string`                 | -      | 图表标题                                      |
| width     | `number`                 | `800`  | 宽度（px），移动端自适应为 100%               |
| height    | `number`                 | `600`  | 高度（px），移动端最大约 80% 屏宽（上限 400） |
| className | `string`                 | -      | 自定义类名                                    |

### ScatterChartDataItem

| 字段        | 类型     | 必填 | 说明                             |
| ----------- | -------- | ---- | -------------------------------- |
| category    | `string` | 是   | 分类（用于外层筛选）             |
| type        | `string` | 是   | 数据序列名称（映射为 dataset）   |
| x           | `number` | 是   | 横坐标                           |
| y           | `number` | 是   | 纵坐标                           |
| filterLabel | `string` | 否   | 二级筛选标签（可选，支持“全部”） |

## 说明

- 移动端会减小点的半径与 hover 半径以提升观感。
