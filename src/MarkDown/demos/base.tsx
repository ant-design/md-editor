import { MdToJSONRender } from '@chenshuai2144/mdToJSONSchema';
import { Card, Space } from 'antd';
//@ts-ignore
import pdfjs from 'html2pdf.js';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './air.css';

export default () => {
  const defaultValue = `# 顶部标题

### 注释

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse




### 加线
  
**这是加粗**
__这也是加粗__
*这是倾斜*
_这也是倾斜_
***这是加粗倾斜***
~~这是加删除线~~

### 列表


- 列表内容
- 列表内容
- 列表内容

### 链接

This is [an example](id) reference-style link.

### 图片

![This is an alt text.](https://gw.alipayobjects.com/zos/antfincdn/7VBnGHwjaW/bianzu%2525202.svg "This is a sample image.")


### 表格

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 获取 dataSource 的方法 | (params?: {pageSize,current},sort,filter) => {data,success,total} | - |
| params | 用于 request 查询的额外参数，一旦变化会触发重新加载 | object | - |
| postData | 对通过 request 获取的数据进行处理 | (data: T[]) => T[] | - |
| defaultData | 默认的数据 | T[] | - |

## 渲染表单

\`\`\`schema
[
  {
    "title": "标题",
    "dataIndex": "title",
    "formItemProps": {
      "rules": [{ "required": true, "message": "此项为必填项" }]
    },
    "width": "m"
  },
  {
    "title": "状态",
    "dataIndex": "state",
    "valueType": "select",
    "valueEnum": {},
    "width": "m"
  }
]
\`\`\`

### 图表
<!-- {"chartType": "pie"} -->
| type | value |
|------|-------|
| 分类一  | 27    |
| 分类二  | 25    |
| 分类三  | 18    |
| 分类四  | 15    |
| 分类五  | 10    |
| 其他   | 5     |

`;
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: 24,
      }}
    >
      <Card
        className="markdown-body"
        style={{
          flex: 1,
          maxWidth: '48%',
        }}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{defaultValue}</Markdown>
      </Card>
      <Card
        style={{
          flex: 1,
          maxWidth: '50%',
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
        extra={
          <Space>
            <a
              onClick={() => {
                pdfjs()
                  .set({
                    dpi: 120,
                    html2canvas: { scale: 3, useCORS: true },
                    pagebreak: { avoid: ['img', '.avoid-break'] },
                  })
                  .from(document.querySelector('#pdf'))
                  .save();
              }}
            >
              导出 PDF
            </a>
          </Space>
        }
      >
        <div
          id="pdf"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: 24,
          }}
        >
          <MdToJSONRender
            value={defaultValue}
            itemRender={(defaultDom, node) => {
              if (node.type === 'markdown' || node.type === 'heading') {
                return <div className="markdown-body">{defaultDom}</div>;
              }
              return (
                <Card bordered title={node.title} className="avoid-break">
                  {defaultDom}
                </Card>
              );
            }}
          />
        </div>
      </Card>
    </div>
  );
};
