# Foo

This is an example component.

```jsx
import { MarkDown } from 'mdToJSON';

export default () => (
  <MarkDown
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
