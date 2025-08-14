import { Workspace } from '@ant-design/md-editor';
import { Button, Card, Space, Switch, message } from 'antd';
import React, { useEffect, useState } from 'react';

const WorkspaceAdvancedDemo: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('');
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [customTitle, setCustomTitle] = useState('高级工作空间');
  const [fileNodes, setFileNodes] = useState<any[]>([]);
  const [realtimeData, setRealtimeData] = useState({
    shell: '',
    markdown: '',
    html: '',
  });

  // 模拟文件数据
  useEffect(() => {
    setFileNodes([
      {
        name: '项目文档',
        type: 'markdown',
        children: [
          {
            name: 'README.md',
            type: 'markdown',
            size: '2.5KB',
            lastModified: '2024-01-15 10:00:00',
            content: '# 项目说明\n\n这是一个示例项目...',
          },
          {
            name: 'CHANGELOG.md',
            type: 'markdown',
            size: '1.8KB',
            lastModified: '2024-01-14 15:30:00',
            content: '# 更新日志\n\n## v1.0.0\n- 初始版本发布',
          },
        ],
      },
      {
        name: '源代码',
        type: 'javascript',
        children: [
          {
            name: 'index.tsx',
            type: 'react',
            size: '3.2KB',
            lastModified: '2024-01-15 09:45:00',
            content:
              'import React from "react";\n\nconst App = () => {\n  return <div>Hello World</div>;\n};\n\nexport default App;',
          },
          {
            name: 'utils.ts',
            type: 'typescript',
            size: '1.5KB',
            lastModified: '2024-01-14 16:20:00',
            content:
              'export const formatDate = (date: Date) => {\n  return date.toLocaleDateString();\n};',
          },
        ],
      },
    ]);
  }, []);

  // 模拟实时数据
  useEffect(() => {
    const shellCommands = [
      '$ git status',
      'On branch main',
      'Your branch is up to date with origin/main',
      '$ npm run build',
      'webpack compiled successfully',
    ];

    let shellIndex = 0;
    const shellInterval = setInterval(() => {
      if (shellIndex < shellCommands.length) {
        setRealtimeData((prev) => ({
          ...prev,
          shell:
            prev.shell + (prev.shell ? '\n' : '') + shellCommands[shellIndex],
        }));
        shellIndex++;
      } else {
        clearInterval(shellInterval);
      }
    }, 1500);

    const markdownText = `# 高级功能演示

## 动态内容更新

这个演示展示了 Workspace 组件的高级功能：

- **动态标签页切换**
- **自定义标题和关闭按钮**
- **文件预览和下载**
- **实时数据更新**

## 代码示例

\`\`\`typescript
const [activeTab, setActiveTab] = useState('realtime');
\`\`\`

## 数学公式

$\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$
`;

    let mdIndex = 0;
    const mdInterval = setInterval(() => {
      if (mdIndex < markdownText.length) {
        setRealtimeData((prev) => ({
          ...prev,
          markdown: markdownText.slice(0, mdIndex + 1),
        }));
        mdIndex++;
      } else {
        clearInterval(mdInterval);
      }
    }, 30);

    return () => {
      clearInterval(shellInterval);
      clearInterval(mdInterval);
    };
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    message.info(`切换到标签页: ${key}`);
  };

  const handleClose = () => {
    message.success('工作空间已关闭');
  };

  const handleFileDownload = (file: any) => {
    message.success(`下载文件: ${file.name}`);
  };

  const handleFilePreview = (file: any) => {
    message.info(`预览文件: ${file.name}`);
    return file;
  };

  const CustomContent: React.FC = () => (
    <Card title="自定义内容面板" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <strong>当前激活标签页:</strong> {activeTabKey || '无'}
        </div>
        <div>
          <strong>工作空间标题:</strong> {customTitle}
        </div>
        <div>
          <strong>显示关闭按钮:</strong> {showCloseButton ? '是' : '否'}
        </div>
        <Space>
          <Button
            size="small"
            onClick={() =>
              setCustomTitle('新标题 - ' + new Date().toLocaleTimeString())
            }
          >
            更新标题
          </Button>
          <Switch
            checked={showCloseButton}
            onChange={setShowCloseButton}
            size="small"
          />
          <span>显示关闭按钮</span>
        </Space>
      </Space>
    </Card>
  );

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Workspace
        title={customTitle}
        activeTabKey={activeTabKey}
        onTabChange={handleTabChange}
        onClose={showCloseButton ? handleClose : undefined}
      >
        <Workspace.Realtime
          tab={{ key: 'realtime', title: '实时数据', count: 3 }}
          data={{
            type: 'shell',
            content: '```bash\n' + realtimeData.shell + '\n```',
            title: 'Shell 终端',
            typewriter: true,
          }}
        />

        <Workspace.Realtime
          tab={{ key: 'markdown', title: 'Markdown 编辑' }}
          data={{
            type: 'md',
            content: realtimeData.markdown,
            title: '动态文档',
            typewriter: true,
          }}
        />

        <Workspace.File
          tab={{ key: 'files', title: '文件管理', count: fileNodes.length }}
          nodes={fileNodes}
          onDownload={handleFileDownload}
          onPreview={handleFilePreview}
          onFileClick={(file) => message.info(`点击文件: ${file.name}`)}
          onToggleGroup={(groupType, collapsed) =>
            message.info(`${groupType} 组 ${collapsed ? '收起' : '展开'}`)
          }
        />

        <Workspace.Custom tab={{ key: 'custom', title: '自定义面板' }}>
          <CustomContent />
        </Workspace.Custom>
      </Workspace>
    </div>
  );
};

export default WorkspaceAdvancedDemo;
