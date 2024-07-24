import { MarkdownEditor } from '@ant-design/md-editor';

const defaultValue = `<!-- [{"chartType": "bar", "x": "sens_type", "y": "count"}, {"chartType": "bar", "x": "sens_type", "y": "percentage"},{"chartType": "bar", "x": "sens_type", "y": "percentage"}] -->
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
| 19 | PFE文件1         |       1 |       0.6098 |
| 20 | 工商注册号       |       1 |       0.6098 |
| 21 | suxiangtest      |       1 |       0.6098 |
| 22 | 军官证           |       1 |       0.6098 |
| 23 | 组织结构代码     |       1 |       0.6098 |
| 24 | MEID             |       1 |       0.6098 |
| 25 | 车架号           |       1 |       0.6098 |
| 26 | idfa             |       1 |       0.6098 |
| 27 | imei             |       1 |       0.6098 |
| 28 | imsi             |       1 |       0.6098 |
| 29 | android_id       |       1 |       0.6098 |
| 30 | 发票代码         |       1 |       0.6098 |
| 31 | 护照号码         |       1 |       0.6098 |
| 32 | 统一社会信用代码 |       1 |       0.6098 |
| 33 | 元数据           |       1 |       0.6098 |
| 34 | 3位数字          |       2 |       1.2195 |

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
        width={'calc(50vw - 8px)'}
        height={'99vh'}
        initValue={defaultValue}
      />
      <MarkdownEditor
        readonly
        style={{
          border: '1px solid #eee',
        }}
        toc={false}
        width={'calc(50vw - 8px)'}
        height={'99vh'}
        initValue={defaultValue}
      />
    </div>
  );
};
