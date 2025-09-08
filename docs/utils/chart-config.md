---
nav:
  title: 高级功能
  order: 4
---

# 图表配置文档

## 配置方式

图表配置通过 Markdown 注释的方式添加，格式如下：

```markdown
<!-- [配置JSON] -->

| 表头1 | 表头2 | 表头3 |
| ----- | ----- | ----- |
| 数据1 | 数据2 | 数据3 |
```

## 配置参数

### 基础配置

```typescript | pure
type ChartConfig = {
  chartType: string; // 图表类型
  x: string; // X 轴字段
  y: string; // Y 轴字段
  title?: string; // 图表标题
  height?: number; // 图表高度，默认400
  groupBy: 主筛选维度; //（映射为 category）
  filterBy: 二级筛选维度; //（映射为 filterLable）
  colorLegend: 图例维度; //（映射为 type）
  subgraphBy: 分组字段，用于生成子图表; //（同段落按该字段拆分）
};
```

### 支持的图表类型

1. **饼图 (pie)**

   ```markdown
   <!-- {"chartType": "pie", "x": "业务", "y": "2021Q1"} -->
   ```

2. **条形图 (bar)**

   ```markdown
   <!-- {"chartType": "bar", "x": "业务", "y": "2021Q1"} -->
   ```

3. **折线图 (line)**

   ```markdown
   <!-- {"chartType": "line", "x": "业务", "y": "2021Q1"} -->
   ```

4. **柱状图 (column)**

   ```markdown
   <!-- {"chartType": "column", "x": "业务", "y": "2021Q1"} -->
   ```

5. **面积图 (area)**

   ```markdown
   <!-- {"chartType": "area", "x": "业务", "y": "2021Q1"} -->
   ```

6. **雷达图 (radar)**

   ```markdown
   <!-- {"chartType": "radar", "x": "label", "y": "score", "colorLegend": "type", "groupBy": "category", "filterBy": "region"} -->
   ```

7. **散点图 (scatter)**

   ```markdown
   <!-- {"chartType": "scatter", "x": "x", "y": "y", "colorLegend": "type", "groupBy": "category", "filterBy": "region"} -->
   ```


8. **表格 (table)**

   ```markdown
   <!-- {"chartType": "table"} -->
   ```

9. **定义列表 (descriptions)**
   ```markdown
   <!-- {"chartType": "descriptions"} -->
   ```

## 高级配置示例

### 1. 多图表配置

```markdown
<!-- [{"chartType": "bar", "title": "样本数据", "x": "sens_type", "y": "count"}, {"chartType": "column", "x": "sens_type", "y": "count"}, {"chartType": "pie", "x": "sens_type", "y": "percentage"}, {"chartType": "line", "x": "sens_type", "y": "percentage"}, {"chartType": "area", "x": "sens_type", "y": "percentage"}] -->
```

### 2. 带分组的折线图

```markdown
<!-- {"chartType": "line", "x": "日期", "y": "uv点击标记", "title": "UV 点击标记",
      "rest": {"colorLegend": "内容", "groupBy": "名称"}} -->
```

### 3. 带标题的图表

```markdown
<!-- {"chartType": "bar", "x": "业务", "y": "2021Q1", "title": "2021年第一季度业务数据"} -->
```

## 数据格式要求

1. **表格数据**
   - 必须包含表头
   - 数据必须与表头对应
   - 数值类型会自动格式化

2. **日期数据**
   - 日期格式会自动排序
   - 支持标准日期格式

3. **数值数据**
   - 支持数字格式化
   - 支持千分位显示

## 特殊功能

1. **图表切换**
   - 支持在图表类型之间切换
   - 切换时会保持数据不变

2. **图表配置**
   - 支持动态修改X轴和Y轴字段
   - 支持自定义图表高度
   - 支持图表标题设置

3. **响应式布局**
   - 支持多列布局
   - 自动适应容器宽度
   - 最小宽度为256px

## 完整示例

```markdown
## 业务数据图表

<!-- {"chartType": "bar", "x": "业务", "y": "2021Q1", "title": "2021年第一季度业务数据",
      "rest": {"groupBy": "业务", "colorLegend": "系列", "filterBy": "地区"}} -->

| 业务         | 2021Q1  | 2021Q2  | 2021Q3  | 2021Q4  |
| ------------ | ------- | ------- | ------- | ------- |
| 收入         | 135,303 | 138,259 | 142,368 | 144,188 |
| 增值服务     | 72,443  | 72,013  | 75,203  | 71,913  |
| 网络游戏     | 43,600  | 43,000  | 44,900  | 42,800  |
| 社交网络收入 | 28,800  | 29,000  | 30,300  | 29,100  |
| 网络广告     | 21,820  | 22,833  | 22,495  | 21,518  |
| 其他         | 41,040  | 43,413  | 44,670  | 50,757  |
| 金融科技     | 39,028  | 41,892  | 43,317  | 47,958  |
| 云           | 162,012 | 111,521 | 111,353 | 112,799 |
```

## 注意事项

1. 配置必须放在表格之前
2. 配置必须是有效的JSON格式
3. 表格数据必须与配置的字段对应
4. 日期类型的数据会自动排序
5. 数值类型的数据会自动格式化
6. 图表支持全屏显示
7. 支持数据导出为CSV格式
8. 支持图表的拖拽和编辑功能
