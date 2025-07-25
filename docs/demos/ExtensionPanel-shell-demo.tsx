import React from 'react';
import ExtensionPanel from '../../src/ExtensionPanel';

export default () => {
  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: 400 }}>
      <ExtensionPanel
        title="扩展面板 Demo"
        realtimeData={{
          type: 'shell',
          customSubTitle: '创建文件 mdir',
          content: `\`\`\`shell
#!/bin/bash

# 系统信息
echo "系统信息:"
uname -a

# 磁盘空间
echo -e "\\n磁盘使用情况:"
df -h

# 内存使用
echo -e "\\n内存使用情况:"
free -h

# 列出当前目录
echo -e "\\n当前目录内容:"
ls -la

# 查找大文件
echo -e "\\n查找大于100MB的文件:"
find / -type f -size +100M 2>/dev/null | head -n 5
\`\`\``,
        }}
        taskData={{
          thoughtChainListProps: {
            bubble: {
              isFinished: true,
              endTime: Date.now(),
              createAt: Date.now(),
            },
          },
          content: [
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
          ],
        }}
        browserData={{
          title: '创建文件 mdir',
          content: `\`\`\`shell
          `,
        }}
        fileData={<div>文件</div>}
        onTabChange={(tabKey) => {
          // eslint-disable-next-line no-console
          console.log('切换到 tab:', tabKey);
        }}
        onClose={() => {
          // eslint-disable-next-line no-console
          console.log('关闭面板');
        }}
        style={{ maxWidth: 480, margin: '0 auto' }}
      />
    </div>
  );
};
