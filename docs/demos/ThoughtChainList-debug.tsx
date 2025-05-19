import { ThoughtChainList } from '@ant-design/md-editor';
import React from 'react';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: 64,
        fontSize: 14,
      }}
    >
      <ThoughtChainList
        loading={false}
        thoughtChainList={[
          {
            category: 'TableSql',
            info: '查看 ${tableName} 数据',
            input: {
              sql: 'SELECT * FROM table_name',
            },
            meta: {
              data: {
                tableName: [
                  {
                    name: '用户表',
                  },
                ],
              },
            },
            runId: '1',
            output: {
              columns: ['name', 'age', 'address'],
              tableData: {
                name: ['Tom', 'Jim', 'Lucy'],
                age: ['18', '20', '22'],
                address: ['Shanghai', 'Beijing', 'Hangzhou'],
              },
            },
          },
          {
            category: 'RagRetrieval',
            info: '查询 ${article} 相关文章',
            input: {
              searchQueries: ['内容', '标题'],
            },
            meta: {
              data: {
                article: [
                  {
                    name: '文章标题',
                  },
                  {
                    name: '文章内容',
                  },
                ],
              },
            },
            runId: '2',
            output: {
              chunks: [
                {
                  content: '产品介绍',
                  originUrl: 'https://www.alipay.com',
                  docMeta: { doc_name: '产品手册', doc_id: '1', type: 'doc' },
                },
                {
                  content: '产品使用',
                  originUrl: 'https://www.alipay.com',
                  docMeta: {
                    doc_name: '产品使用说明',
                    doc_id: '2',
                    type: 'doc',
                  },
                },
              ],
            },
          },
          {
            category: 'DeepThink',
            info: '如何解决工作效率问题',
            runId: '3',
            output: {
              data: '工作效率问题解决方案，提高工作效率，提高工作效率，工作效率问题解决方案 ，提高工作效率 ，提高工作效率工作效率问题解决方案 ，提高工作效率 ，提高工作效率工作效率问题解决方案 ，提高工作效率 ，提高工作效率工作效率问题解决方案 ，提高工作效率 ，提高工作效率工作效率问题解决方案 ，提高工作效率 ，提高工作效率',
              type: 'END',
            },
          },
          {
            category: 'ToolCall',
            info: '调用 ${toolName} 工具',
            input: {
              inputArgs: {
                params: { name: '参数' },
              },
            },
            meta: {
              data: {
                toolName: [
                  {
                    name: '工具1',
                  },
                  {
                    name: '工具2',
                  },
                ],
              },
            },
            runId: '4',
            output: {
              response: {
                error: false,
                data: '调用工具成功',
              },
              type: 'END',
            },
          },
        ]}
        markdownRenderProps={{
          eleItemRender: (ele) => {
            console.log(ele);
            return <div>ele</div>;
          },
        }}
      />
    </div>
  );
}
