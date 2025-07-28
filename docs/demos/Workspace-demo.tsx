import React from 'react';
import Workspace from '../../src/Workspace';

const Demo = () => {
  return (
    <div style={{ height: 600, width: 400 }}>
      <Workspace
        title="开发工作空间"
        onTabChange={(key) => console.log('切换到标签页:', key)}
        onClose={() => console.log('关闭工作空间')}
      >
        <Workspace.Realtime
          tab={{
            key: 'realtime',
            // icon: <SearchOutlined />,
            // title: '实时跟随',
          }}
          data={{
            type: 'shell',
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
            customTitle: '系统监控',
            customSubTitle: '实时监控系统状态',
          }}
        />

        <Workspace.Task
          tab={{
            key: 'tasks',
          }}
          data={{
            content: [
              {
                category: 'DeepThink' as const,
                info: '分析系统性能',
                runId: 'task-1',
                output: {
                  data: '正在分析系统CPU、内存和磁盘使用情况...',
                  type: 'END' as const,
                },
              },
              {
                category: 'ToolCall' as const,
                info: '执行监控脚本',
                runId: 'task-2',
                input: {
                  inputArgs: {
                    params: {
                      script: 'system_monitor.sh',
                      args: ['--verbose', '--output=json'],
                    },
                  },
                },
                output: {
                  response: {
                    error: false,
                    data: '监控脚本执行成功，系统状态正常',
                  },
                  type: 'END' as const,
                },
              },
            ],
          }}
        />

        <Workspace.File
          tab={{
            key: 'files',
          }}
          data={
            <div style={{ padding: '16px' }}>
              <h4>项目文件结构</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>📁 src/</li>
                <li style={{ marginLeft: '20px' }}>📁 components/</li>
                <li style={{ marginLeft: '40px' }}>📄 Workspace.tsx</li>
                <li style={{ marginLeft: '40px' }}>📄 index.less</li>
                <li style={{ marginLeft: '20px' }}>📁 hooks/</li>
                <li style={{ marginLeft: '40px' }}>📄 useWorkspace.ts</li>
                <li>📁 docs/</li>
                <li style={{ marginLeft: '20px' }}>📄 README.md</li>
              </ul>
            </div>
          }
        />
      </Workspace>
    </div>
  );
};

export default Demo;
