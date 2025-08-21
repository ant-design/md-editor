import { MarkdownEditor } from '@ant-design/md-editor';
import React from 'react';
const defaultValue = `
<!-- [{"chartType": "bar","title":"样本数据", "x": "sens_type", "y": "count"},{"chartType": "column", "x": "sens_type", "y": "count"}, {"chartType": "pie", "x": "sens_type", "y": "percentage"}, {"chartType": "line", "x": "sens_type", "y": "percentage"},{"chartType": "area", "x": "sens_type", "y": "percentage"}] -->
|    | sens_type        |   count |   percentage |
|---:|:-----------------|--------:|-------------:|
|  0 | 12312322         |       4 |       2.439  |
|  1 | 邮箱             |      28 |      17.0732 |
|  2 | 身份证号2级      |       5 |       3.0488 |
|  3 | 姓名             |      26 |      15.8537 |
|  4 | 自定义-手机号01  |      41 |      25      |
|  5 | 性别             |       4 |       2.439  |
|  6 | 公司名           |       4 |       2.439  |
|  7 | 样本中英文       |       7 |       4.2683 |
|  8 | 正则中文         |       2 |       1.2195 |


## 图表

<!-- [{"chartType": "line", "x": "日期","title":"uv点击标记", "y": "uv点击标记", "colorLegend": "内容","groupBy": "名称"}] -->
| 名称    | 内容   | 日期       | uv点击标记 |
|-------|------|----------|--------|
| mytab | 提现额  | 2024-11-29| 0      |
| mytab | 提现额  | 2024-11-30| 4    |
| mytab | 提现额  | 2024-12-01 | 9    |
| mytab | 提现额  | 2024-12-01 | 7      |
| mytab | 提现额  | 2024-12-02 | 6     |
| mytab | 提现额  | 2024-12-03 | 0      |
| mytab | 提现额  | 2024-12-04 | 14     |
| mytab | 提现额  | 2024-12-05 | 12     |
| mytab | 提现额  | 2024-12-06| 1     |
| mytab | 涨    |2024-11-29| 502    |
| mytab | 涨    | 2024-11-30| 807    |
| mytab | 涨    | 2024-12-01 | 752    |
| mytab | 涨    | 2024-12-02 | 621    |
| mytab | 涨    | 2024-12-03 | 1272   |
| mytab | 涨    | 2024-12-04 | 1021   |
| mytab | 涨    | 2024-12-05 | 1148   |
| mytab | 涨    | 2024-12-06 | 1088   |
| mytab | 涨    | 2024-12-07 | 1175   |
| mytab | 涨    | 2024-12-08 | 1099   |
| mytab | 涨    | 2024-12-09 | 857    |
| mytab | 涨    | 2024-12-10| 991    |
| mytab | 涨    | 2024-12-11| 1056   |
| mytab | 加一笔  | 2024-11-29| 563    |
| mytab | 加一笔  |2024-11-29| 608    |
| mytab | 加一笔  | 2024-11-30| 752    |
| mytab | 加一笔  | 2024-12-01 | 858    |
| mytab | 加一笔  | 2024-12-02 | 783    |
| mytab | 加一笔  | 2024-12-03 | 1183   |
| mytab | 加一笔  | 2024-12-04 | 973    |
| mytab | 加一笔  | 2024-12-05 | 1229   |
| mytab | 加一笔  | 2024-12-06 | 1156   |
| mytab | 加一笔  | 2024-12-07 | 1353   |
| mytab | 加一笔  | 2024-12-08 | 1157   |
| mytab | 加一笔  | 2024-12-09 | 1319   |
| mytab | 加一笔  | 2024-12-10| 1152   |
| mytab | 加一笔  | 2024-12-11| 1174   |
| mytab | 免费提现 |2024-11-29| 167    |
| mytab | 免费提现 | 2024-11-30| 215    |
| mytab | 免费提现 | 2024-12-01 | 291    |
| mytab | 免费提现 | 2024-12-02 | 300    |
| mytab | 免费提现 | 2024-12-03 | 261    |
| mytab | 免费提现 | 2024-12-04 | 210    |
| mytab | 免费提现 | 2024-12-05 | 249    |
| mytab | 免费提现 | 2024-12-06 | 203    |
| mytab | 免费提现 | 2024-12-07 | 222    |
| mytab | 免费提现 | 2024-12-08 | 196    |
| mytab | 免费提现 | 2024-12-09 | 182    |
| mytab | 免费提现 | 2024-12-10| 233    |
| mytab | 免费提现 | 2024-12-11| 283    |
| G+    | 现金奖励 |2024-11-29| 1     |
| G+    | 现金奖励 | 2024-11-30| 0      |
| G+    | 现金奖励 | 2024-12-01 | 4      |
| G+    | 现金奖励 | 2024-12-02 | 12    |
| G+    | 现金奖励 | 2024-12-03 | 0      |
| G+    | 现金奖励 | 2024-12-04 | 212    |
| G+    | 现金奖励 | 2024-12-05 | 19      |
| G+    | 现金奖励 | 2024-12-06 | 21      |
| G+    | 现金奖励 | 2024-12-07 | 3      |
| G+    | 现金奖励 | 2024-12-08 | 7      |
| G+    | 现金奖励 | 2024-12-10| 5      |
| G+    | 现金奖励 | 2024-12-11| 77     |
| G+    | 免费提现 | 2024-11-29| 8     |
| G+    | 免费提现 | 2024-11-30| 0      |
| G+    | 免费提现 | 2024-12-01 | 4      |
| G+    | 免费提现 | 2024-12-02 | 12    |
| G+    | 免费提现 | 2024-12-03 | 54      |
| G+    | 免费提现 | 2024-12-04 | 212    |
| G+    | 免费提现 | 2024-12-05 | 192      |
| G+    | 免费提现 | 2024-12-06 | 21      |
| G+    | 免费提现 | 2024-12-07 | 3      |
| G+    | 免费提现 | 2024-12-08 | 7      |
| G+    | 免费提现 | 2024-12-10| 5      |
| G+    | 免费提现 | 2024-12-11| 77     |


## 表格

| 城市   | 月份 | 月均降雨量 (mm) |
|--------|------|-----------------|
| London | Jan. | 18.9            |
| London | Feb. | 28.8            |
| London | Mar. | 39.3            |
| London | Apr. | 81.4            |
| London | May  | 47.0            |
| London | Jun. | 20.3            |
| London | Jul. | 24.0            |
| London | Aug. | 35.6            |
| Berlin | Jan. | 12.4            |
| Berlin | Feb. | 23.2            |
| Berlin | Mar. | 34.5            |
| Berlin | Apr. | 99.7            |
| Berlin | May  | 52.6            |
| Berlin | Jun. | 35.5            |
| Berlin | Jul. | 37.4            |
| Berlin | Aug. | 42.4            |

`;

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'auto',
      }}
    >
      <MarkdownEditor
        readonly
        style={{
          border: '1px solid #eee',
        }}
        toc={false}
        width={'calc(99vw - 16px)'}
        initValue={defaultValue}
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>readonly</code> - 只读模式，用户无法编辑内容
          </li>
          <li>
            <code>style</code> - 样式配置，设置边框样式
          </li>
          <li>
            <code>toc</code> - 是否显示目录，设置为 false 隐藏目录
          </li>
          <li>
            <code>width</code> - 编辑器宽度，设置为 calc(99vw - 16px) 占满视口
          </li>
          <li>
            <code>initValue</code> - 初始化的 Markdown 内容，包含多种图表配置
          </li>
          <li>
            <code>chartType</code> - 图表类型，如 bar、column、pie、line、area
          </li>
          <li>
            <code>x</code> - X 轴数据字段
          </li>
          <li>
            <code>y</code> - Y 轴数据字段
          </li>
          <li>
            <code>title</code> - 图表标题
          </li>
          <li>
            <code>colorLegend</code> - 颜色图例字段
          </li>
          <li>
            <code>groupBy</code> - 分组字段
          </li>
        </ul>
      </div>
    </div>
  );
};
