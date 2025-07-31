import React from 'react';
import Workspace from '../../src/Workspace';

const Demo = () => {
  return (
    <div style={{ height: 600, width: 400 }}>
      <Workspace
        title="开发工作空间"
        onTabChange={(key: string) => console.log('切换到标签页:', key)}
        onClose={() => console.log('关闭工作空间')}
      >
        <Workspace.Realtime
          tab={{
            key: 'realtime',
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
            markdownEditorProps: { typewriter: false },
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
          data={{
            nodes: [
              {
                id: '1',
                name: '项目需求文档.docx',
                type: 'doc',
                size: '2.3MB',
                createTime: '12:30',
                url: '/downloads/project-requirements.docx',
              },
              {
                id: '2',
                name: '用户手册.docx',
                type: 'doc',
                size: '1.8MB',
                createTime: '09:15',
              },
              {
                id: '3',
                name: '技术规范.docx',
                type: 'doc',
                size: '3.1MB',
                createTime: '14:45',
              },
            ],
          }}
        />
      </Workspace>
    </div>
  );
};

export default Demo;
