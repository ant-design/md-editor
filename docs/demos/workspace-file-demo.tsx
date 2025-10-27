import { Workspace } from '@ant-design/agentic-ui';
import {
  FileNode,
  FileType,
  GroupNode,
} from '@ant-design/agentic-ui/Workspace/types';
import { CoffeeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

// 自定义 markdownEditorProps 配置
const customMarkdownEditorProps = {
  height: '300px',
  width: '100%',
  style: {
    fontSize: '16px',
    lineHeight: '1.6',
  },
};

const WorkspaceFileDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [nodes] = useState<(FileNode | GroupNode)[]>([
    {
      name: 'Word',
      type: 'word',
      collapsed: true,
      children: [
        {
          name: '项目需求文档.docx',
          id: 'customPreviewDomID1',
          // type: 'word',// 非必填，会自动推断
          size: '2.3MB',
          lastModified: '12:30',
          url: '/downloads/project-requirements.docx',
          canPreview: true,
          canShare: true,
        },
        {
          id: 'customPreviewDomID2',
          name: 'md-preview用户手册.docx',
          size: '1.8MB',
          lastModified: '2025-08-01 09:15:00',
          content: '# 项目需求文档',
        },
        {
          name: '技术规范.docx',
          // type: 'word',
          size: '3.1MB',
          lastModified: '2025-08-01 14:45:00',
        },
      ],
    },
    {
      name: '不同的文件类型',
      type: 'folder',
      children: [
        {
          id: 'file-7',
          name: '配置文件.json',
          size: '5KB',
          lastModified: '2025-08-01 17:00:00',
          url: '/downloads/config.json',
          type: 'code',
          canShare: true,
        },
        {
          name: '数据统计表.xlsx',
          // type: 'excel',
          size: '1.2MB',
          lastModified: '2025-08-01 10:20:00',
          url: '/downloads/data-statistics.xlsx',
        },
        {
          name: '财务报表.xlsx',
          // type: 'excel',
          size: '2.8MB',
          lastModified: '2025-08-01 16:30:00',
          content: '12345财务报表内容678',
        },
      ],
    },
    {
      name: 'PDF文档',
      type: 'pdf',
      children: [
        {
          name: '产品说明书.pdf',
          // type: 'pdf',
          size: '3.2MB',
          lastModified: '2025-08-01 11:20:00',
          url: '/downloads/product-manual.pdf',
        },
        {
          name: '研究报告.pdf',
          type: 'pdf',
          size: '4.5MB',
          lastModified: '2025-08-01 13:45:00',
        },
      ],
    },
    {
      name: '音频文件',
      type: 'audio',
      children: [
        {
          name: '产品介绍.mp3',
          type: 'audio',
          size: '5.2MB',
          lastModified: '2025-08-01 10:30:00',
          url: '/downloads/product-intro.mp3',
        },
        {
          name: '会议记录.wav',
          type: 'audio',
          size: '12.5MB',
          lastModified: '2025-08-01 09:15:00',
          url: '/downloads/meeting-record.wav',
        },
      ],
    },
    {
      name: 'CSV文件',
      type: 'plainText',
      children: [
        {
          name: '用户数据.csv',
          // type: 'plainText',
          size: '856KB',
          lastModified: '2025-08-01 08:45:00',
          content: '下载/downloads/user-data.csv',
        },
        {
          name: '销售记录.csv',
          // type: 'plainText',
          size: '1.1MB',
          lastModified: '2025-08-01 11:25:00',
        },
        {
          name: '产品目录.csv',
          // type: 'plainText',
          size: '432KB',
          lastModified: '2025-08-01 15:10:00',
          content: '产品目录',
        },
      ],
    },
    {
      name: 'Markdown文档23',
      // type: 'markdown',
      children: [
        {
          name: 'README.md',
          // type: 'markdown',
          size: '15KB',
          lastModified: '2025-08-01 13:15:00',
          url: '/downloads/readme.md',
        },
        {
          name: 'API文档-文本.md',
          // type: 'markdown',
          size: '28KB',
          canDownload: false,
          content: `# API文档

## 代码示例
\`\`\`typescript
const example = () => {
  console.log("Hello World");
}
\`\`\`

## 表格示例
| 名称 | 类型 | 说明 |
|------|------|------|
| name | string | 文件名 |
| type | string | 文件类型 |

## 数学公式
$E = mc^2$

## 流程图
\`\`\`mermaid
graph TD
    A[开始] --> B{是否继续?}
    B -- Yes --> C[继续]
    B -- No --> D[结束]
\`\`\`
`,
          lastModified: '2025-08-01 13:20:00',
        },
      ],
    },
    {
      name: '图片',
      type: 'image',
      children: [
        {
          name: '产品展示.jpg',
          // type: 'image',
          size: '1.5MB',
          lastModified: '2025-08-01 09:30:00',
          url: `https://t15.baidu.com/it/u=1723601087,48527874&fm=224&app=112&f=JPEG?w=500&h=500`,
        },
      ],
    },
    {
      name: '视频',
      type: 'video',
      children: [
        {
          name: '产品演示.mp4',
          type: 'video',
          size: '15.5MB',
          lastModified: '10:30',
          url: '/downloads/demo.mp4',
        },
        {
          name: '教程.webm',
          type: 'video',
          size: '12.1MB',
          lastModified: '15:20',
          url: '/downloads/tutorial.webm',
        },
      ],
    },
    {
      type: 'archive',
      name: '压缩包文件',
      children: [
        {
          name: '项目源码.zip',
          type: 'archive',
          size: '25.5MB',
          lastModified: '16:30',
          url: '/downloads/source-code.zip',
        },
        {
          name: '资源文件.rar',
          type: 'archive',
          size: '18.2MB',
          lastModified: '17:45',
          url: '/downloads/resources.rar',
        },
        {
          name: '文档备份.7z',
          type: 'zip',
          size: '8.7MB',
          lastModified: '18:20',
          url: '/downloads/docs-backup.7z',
        },
      ],
    },
    {
      name: '代码示例',
      type: 'javascript',
      children: [
        {
          name: 'hello.html',
          size: '156B',
          lastModified: '2025-08-01 09:00:00',
          content:
            '<!doctype html>\n<html lang="zh-CN">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Hello HTML</title>\n  <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";padding:24px} .btn{padding:8px 12px;border:1px solid #d9d9d9;border-radius:6px;cursor:pointer} .btn:active{transform:scale(0.98)}</style>\n</head>\n<body>\n  <h1>你好，HTML！</h1>\n  <p>这是一个用于 Workspace 预览的 HTML 示例。</p>\n  <button class="btn" onclick="alert(\'Hello from HTML!\')">点我</button>\n</body>\n</html>',
        },
        {
          name: 'App.tsx',
          size: '521B',
          lastModified: '2025-08-01 09:05:00',
          content:
            "import React, { useState } from 'react';\n\nconst App: React.FC = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;\n};\n\nexport default App;",
        },
        {
          name: 'server.py',
          size: '754B',
          lastModified: '2025-08-01 09:10:00',
          content:
            "from flask import Flask\napp = Flask(__name__)\n\n@app.get('/')\ndef index():\n    return 'OK'\n\nif __name__ == '__main__':\n    app.run()",
        },
        {
          name: 'package.json',
          size: '428B',
          lastModified: '2025-08-01 09:12:00',
          content:
            '{\n  "name": "code-preview-demo",\n  "version": "1.0.0",\n  "scripts": { \n    "build": "webpack --mode production" \n  }\n}',
          type: 'config',
        },
      ],
    },
  ]);

  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  const handleDownload = (file: FileNode) => {
    console.log('下载单个文件:', file);
    alert(`正在下载文件: ${file.name}`);
  };

  const handleGroupDownload = (files: FileNode[], groupType?: FileType) => {
    console.log('下载文件组:', files);
    // 获取文件类型的可读名称
    const getTypeDisplayName = (type: FileType) => {
      switch (type) {
        case 'plainText':
          return '文本文件';
        case 'image':
          return '图片文件';
        case 'video':
          return '视频文件';
        case 'pdf':
          return 'PDF文档';
        case 'word':
          return 'Word文档';
        case 'excel':
          return 'Excel表格';
        case 'markdown':
          return 'Markdown文档';
        case 'archive':
          return '压缩包文件';
        default:
          return '文件';
      }
    };

    alert(
      `正在下载${files.length}个${groupType ? getTypeDisplayName(groupType) : '文件'}...`,
    );
  };

  const handleToggleGroup = (type: FileType, collapsed: boolean) => {
    console.log(`切换分组 ${type} 状态:`, collapsed ? '收起' : '展开');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>文件组件演示</h2>

      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          onClick={() => setLoading(!loading)}
          style={{ marginRight: '8px' }}
        >
          {loading ? '停止加载' : '显示加载'}
        </Button>
      </div>

      <div
        style={{
          maxWidth: '600px',
          maxHeight: '600px',
          height: '600px',
        }}
      >
        <Workspace title="文件管理">
          <Workspace.File
            tab={{
              count: 123,
            }}
            nodes={nodes}
            loading={loading}
            onDownload={handleDownload}
            onGroupDownload={handleGroupDownload}
            onToggleGroup={handleToggleGroup}
            markdownEditorProps={customMarkdownEditorProps}
          />
          <Workspace.Custom
            tab={{
              key: 'custom',
              title: '自定义',
              icon: <CoffeeOutlined />,
              count: 123,
            }}
          >
            <div>
              <div>文件组件演示</div>
              <p>自定义内容</p>
            </div>
          </Workspace.Custom>
        </Workspace>
      </div>
    </div>
  );
};
export default WorkspaceFileDemo;
