---
title: LineChart 折线图
atomId: LineChart
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

| 属性           | 类型                                     | 默认值     | 说明                                              |
| -------------- | ---------------------------------------- | ---------- | ------------------------------------------------- |
| title          | `string`                                 | -          | 图表标题                                          |
| data           | `LineChartDataItem[]`                    | -          | 扁平化数据数组                                    |
| width          | `number \| string`                       | `600`      | 图表宽度（px），移动端自适应为 100%               |
| height         | `number \| string`                       | `400`      | 图表高度（px），移动端最大约 80% 屏宽（上限 400） |
| className      | `string`                                 | -          | 自定义类名                                        |
| dataTime       | `string`                                 | -          | 数据时间                                          |
| theme          | `'dark' \| 'light'`                      | `'light'`  | 主题风格                                          |
| color          | `string \| string[]`                     | -          | 自定义主色；数组按序对应各数据序列                |
| showLegend     | `boolean`                                | `true`     | 是否显示图例                                      |
| legendPosition | `'top' \| 'left' \| 'bottom' \| 'right'` | `'bottom'` | 图例位置                                          |
| legendAlign    | `'start' \| 'center' \| 'end'`           | `'start'`  | 图例水平对齐方式                                  |
| showGrid       | `boolean`                                | `true`     | 是否显示网格线                                    |
| xPosition      | `'top' \| 'bottom'`                      | `'bottom'` | X 轴位置                                          |
| yPosition      | `'left' \| 'right'`                      | `'left'`   | Y 轴位置                                          |
| toolbarExtra   | `React.ReactNode`                        | -          | 头部工具条额外按钮                                |
| static         | `boolean \| ChartStaticConfig`               | -      | ChartStatic组件配置：boolean表示是否启用（使用默认配置），object表示详细配置 |

### LineChartDataItem

| 字段        | 类型     | 必填 | 说明                              |
| ----------- | -------- | ---- | --------------------------------- |
| category    | `string` | 是   | 分类（用于外层筛选）              |
| type        | `string` | 是   | 数据序列名称（映射为 dataset）    |
| x           | `number` | 是   | 横轴值（将自动排序并作为 labels） |
| y           | `number` | 是   | 纵轴值                            |
| xtitle      | `string` | 否   | X 轴标题（从数据中提取）          |
| ytitle      | `string` | 否   | Y 轴标题（从数据中提取）          |
| filterLabel | `string` | 否   | 二级筛选标签（可选）              |

### ChartStaticConfig

| 字段           | 类型                                        | 默认值 | 说明                                         |
| -------------- | ------------------------------------------- | ------ | -------------------------------------------- |
| title          | `string`                                    | -      | 静态数据标题                                 |
| tooltip        | `string`                                    | -      | 提示信息                                     |
| value          | `number \| string \| null \| undefined`    | -      | 显示的数值                                   |
| precision      | `number`                                    | -      | 数值精度（小数点后位数）                     |
| groupSeparator | `string`                                    | -      | 千分位分隔符                                 |
| prefix         | `string`                                    | -      | 数值前缀                                     |
| suffix         | `string`                                    | -      | 数值后缀                                     |
| formatter      | `(value: number \| string \| null \| undefined) => React.ReactNode` | -      | 自定义格式化函数 |
| className      | `string`                                    | -      | 自定义类名                                   |
| size           | `'small' \| 'default' \| 'large'`           | `'default'` | 组件尺寸                                |

## 说明

- 自动按 `x` 升序生成横轴，按 `type` 组装数据集并分配调色板。
