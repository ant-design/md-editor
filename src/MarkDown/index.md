# MarkDownRender

MarkDownRender 可以把 table 修改为 antd 的 table，并进行样式上的修改

```tsx
import { MarkDownRender } from 'mdToJSON';

export default () => (
  <MarkDownRender
    tableProps={{ bordered: true }}
    value={`### pro-components 的 Table 有哪些配置？

#### ProTable - ProTable

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 获取 dataSource 的方法 | (params?: {pageSize,current},sort,filter) => {data,success,total} | - |
| params | 用于 request 查询的额外参数，一旦变化会触发重新加载 | object | - |
| postData | 对通过 request 获取的数据进行处理 | (data: T[]) => T[] | - |
| defaultData | 默认的数据 | T[] | - |`}
  />
);
```

```tsx
import { mdToApassifySchema } from 'mdToJSON';

export default () => {
  const schema = mdToApassifySchema(`### pro-components 的 Table 有哪些配置？

#### ProTable - ProTable

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 获取 dataSource 的方法 | (params?: {pageSize,current},sort,filter) => {data,success,total} | - |
| params | 用于 request 查询的额外参数，一旦变化会触发重新加载 | object | - |
| postData | 对通过 request 获取的数据进行处理 | (data: T[]) => T[] | - |
| defaultData | 默认的数据 | T[] | - |`);

  return <pre>{JSON.stringify(schema, null, 2)}</pre>;
};
```
