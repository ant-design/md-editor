import {
  Workspace,
  type FileActionRef,
  type GroupNode,
} from '@ant-design/agentic-ui';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';

const WorkspaceFileActionRefDemo: React.FC = () => {
  const actionRef = useRef<FileActionRef | null>(null);
  const [nodes] = useState<GroupNode[]>(() => [
    {
      name: '项目文档',
      type: 'markdown',
      children: [
        {
          name: 'README.md',
          type: 'markdown',
          size: '2.5KB',
          lastModified: '2024-01-15 10:00:00',
          content:
            '# @ant-design/agentic-ui\n\n本 Demo 演示 Workspace 文件树与 `FileActionRef`（展开、定位等）。',
        },
        {
          name: 'CHANGELOG.md',
          type: 'markdown',
          size: '1.8KB',
          lastModified: '2024-01-14 15:30:00',
          content:
            '# 更新记录\n\n- 支持通过 actionRef 打开 README 预览。\n- 支持从外部返回文件列表。',
        },
      ],
    },
    {
      name: '源代码',
      type: 'react',
      children: [
        {
          name: 'index.tsx',
          type: 'react',
          size: '3.2KB',
          lastModified: '2024-01-15 09:45:00',
          content:
            'import React from "react";\n\nconst App = () => {\n  return <div>Hello World</div>;\n};\n\nexport default App;',
        },
      ],
    },
  ]);

  const handleOpenReadme = () => {
    const readme = nodes?.[0]?.children?.[0];
    if (!readme) {
      message.warning('未找到 README.md');
      return;
    }
    actionRef.current?.openPreview(readme);
  };

  const handleBack = () => {
    actionRef.current?.backToList();
  };

  return (
    <div
      style={{
        height: 560,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          flexShrink: 0,
          minWidth: 0,
        }}
      >
        <Button size="small" type="primary" onClick={handleOpenReadme}>
          打开 README 预览
        </Button>
        <Button size="small" onClick={handleBack}>
          返回文件列表
        </Button>
      </div>

      <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Workspace pure title="文件工作台">
          <Workspace.File
            tab={{ key: 'files', title: '文件管理', count: nodes.length }}
            nodes={nodes}
            actionRef={actionRef}
            onPreview={(file) => {
              message.info(`准备预览: ${file.name}`);
              return file; // 返回 file 走内置预览逻辑
            }}
          />
        </Workspace>
      </div>
    </div>
  );
};

export default WorkspaceFileActionRefDemo;
