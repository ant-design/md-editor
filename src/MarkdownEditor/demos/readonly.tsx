import { MarkdownEditor } from '@ant-design/md-editor';

const defaultValue = `
<!-- [{"chartType": "bar","title":"样本数据", "x": "sens_type", "y": "count"},{"chartType": "bar", "x": "sens_type", "y": "count"}, {"chartType": "pie", "x": "sens_type", "y": "percentage"}] -->
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

<!-- [{"chartType": "bar", "x": "月份","title":"月均降雨量", "y": "月均降雨量 (mm)", "colorField": "城市","group": "true"}] -->
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
    <div>
      <MarkdownEditor
        style={{
          border: '1px solid #eee',
        }}
        toc={false}
        width={'calc(99vw - 16px)'}
        initValue={defaultValue}
        onChange={(_, e) => console.log(e)}
      />

      <MarkdownEditor
        readonly
        style={{
          border: '1px solid #eee',
        }}
        toc={false}
        width={'calc(99vw - 16px)'}
        initValue={defaultValue}
      />
    </div>
  );
};
