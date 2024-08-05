import { MarkdownEditor } from '@ant-design/md-editor';

const defaultValue = `<!-- [{"chartType": "bar", "x": "sens_type", "y": "count"},{"chartType": "bar", "x": "sens_type", "y": "count"}, {"chartType": "pie", "x": "sens_type", "y": "percentage"},{"chartType": "descriptions", "x": "sens_type", "y": "percentage"}] -->
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
|  9 | 正则中英文       |       2 |       1.2195 |
| 10 | 正则英文         |       4 |       2.439  |
| 11 | 银行卡号         |       4 |       2.439  |
| 12 | 车牌号           |       2 |       1.2195 |
| 13 | IP               |       3 |       1.8293 |
| 14 | 座机号           |       2 |       1.2195 |
| 15 | mac地址          |       3 |       1.8293 |
| 16 | 星座             |       2 |       1.2195 |
| 17 | 国籍             |       2 |       1.2195 |
| 18 | 民族             |       2 |       1.2195 |

`;
export default () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <MarkdownEditor
        style={{
          border: '1px solid #eee',
        }}
        toc={false}
        width={'calc(50vw - 16px)'}
        height={'99vh'}
        initValue={defaultValue}
      />

      <MarkdownEditor
        readonly
        style={{
          border: '1px solid #eee',
        }}
        toc={false}
        width={'calc(50vw - 16px)'}
        height={'99vh'}
        initValue={defaultValue}
      />
    </div>
  );
};
