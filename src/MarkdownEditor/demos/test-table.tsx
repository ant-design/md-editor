import { MarkdownEditor } from '@ant-design/md-editor';
import React from 'react';

const defaultValue = `
| 业务          | 2021Q1  | 2021Q2  | 2021Q3  | 2021Q4  | 2022Q1  | 2022Q2  | 2022Q3  | 2022Q4  | 2023Q1  | 2023Q2  | 2023Q3  | 2023Q4  |
| ------------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| 收入          | 135,303 | 138,259 | 142,368 | 144,188 | 135,471 | 134,034 | 140,093 | 144,954 | 149,986 | 149,208 | 154,625 | 155,200 |
| 社交网络收入增值服务     | 72,443  | 72,013  | 75,203  | 71,913  | 72,738  | 71,683  | 72,727  | 70,417  | 79,337  | 74,211  | 75,748  | 69,100  |
| 网络游戏     | 43,600  | 43,000  | 44,900  | 42,800  | 43,600  | 42,500  | na      | na      | na      | 44,500  | 46,000  | 40,900  |
| 社交网络收入 | 28,800  | 29,000  | 30,300  | 29,100  | 29,100  | 29,200  | na      | na      | na      | 29,700  | 29,700  | 28,200  |
| 网络广告      | 21,820  | 22,833  | 22,495  | 21,518  | 17,988  | 18,638  | 21,443  | 24,660  | 20,964  | 25,003  | 25,721  | 29,794  |
| 其他          | 41,040  | 43,413  | 44,670  | 50,757  | 44,745  | 43,713  | 45,923  | 49,877  | 49,685  | 49,994  | 53,156  | 54,379  |
`;
export default () => {
  return (
    <>
      <MarkdownEditor
        width={'100vw'}
        height={'50vh'}
        reportMode
        style={{ padding: 0 }}
        contentStyle={{
          padding: 0,
          margin: 0,
          paddingLeft: 0,
        }}
        tableConfig={{
          minColumn: 10,
          minRows: 20,
          excelMode: true,
        }}
        initValue={defaultValue}
      />

      <MarkdownEditor
        width={'100vw'}
        height={'50vh'}
        reportMode
        readonly
        style={{ padding: 0 }}
        contentStyle={{
          padding: 0,
          margin: 0,
          paddingLeft: 0,
        }}
        tableConfig={{
          minColumn: 20,
          minRows: 10,
        }}
        initValue={defaultValue}
      />
    </>
  );
};
