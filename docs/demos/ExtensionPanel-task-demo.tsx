import ExtensionPanel from '@ant-design/md-editor/ExtensionPanel';
import React from 'react';

export default () => {
  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: 400 }}>
      <ExtensionPanel
        title="扩展面板 Demo"
        realtimeData={{
          type: 'task',
          title: '创建文件 mdir',
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
