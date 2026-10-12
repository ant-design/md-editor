import { Workspace } from '@ant-design/agentic-ui';
import type { GroupNode } from '@ant-design/agentic-ui/Workspace/types';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const fileGroups: GroupNode[] = [
  {
    id: 'project-documents',
    name: '交付文档',
    type: 'markdown',
    children: [
      {
        id: 'api-document',
        name: 'API文档-文本.md',
        content: `# API 文档（示例）

通过统一的任务接口创建、查询和管理项目交付成果。

## 创建任务

\`POST /api/tasks\`

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 任务名称，必填 |
| description | string | 任务说明 |
| attachments | string[] | 关联的文件标识 |

\`\`\`ts
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: '整理项目交付文档' }),
});

const task = await response.json();
\`\`\`

## 返回结果

成功创建后返回任务标识和当前状态。可以继续查询任务进度，并获取生成的文件列表。
`,
      },
      {
        id: 'delivery-checklist',
        name: '交付清单.md',
        content: `# 项目交付清单

## 已完成

- [x] 接口文档与请求示例
- [x] HTML 页面原型
- [x] React 组件与应用配置
- [x] 数据导出样例

## 使用说明

点击文件即可预览。Markdown 支持表格与代码展示；HTML 可在预览与源码之间切换。

每个文件均提供真实内容，可以通过下载按钮保存到本地。Office 样例来自本站的静态资源。
`,
      },
    ],
  },
  {
    id: 'project-source',
    name: '页面与源码',
    type: 'folder',
    children: [
      {
        id: 'html-prototype',
        name: 'hello.html',
        content: `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>项目页面原型</title>
    <style>
      :root { color-scheme: light dark; }
      body { margin: 0; padding: 32px; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; line-height: 1.7; }
      main { max-width: 640px; margin: auto; }
      h1 { margin: 8px 0 16px; font-size: clamp(24px, 5vw, 36px); line-height: 1.3; }
      .label { color: #1677ff; font-size: 13px; font-weight: 600; }
      p { opacity: 0.72; }
      details { margin-top: 24px; padding-block: 16px; border-top: 1px solid #80808040; }
      summary { cursor: pointer; font-weight: 500; }
      @media (max-width: 400px) { body { padding: 20px; } }
    </style>
  </head>
  <body>
    <main>
      <span class="label">页面原型 · 已就绪</span>
      <h1>你好，HTML！</h1>
      <p>这是一个用于 Workspace 预览的 HTML 示例。你可以直接查看页面效果，也可以切换到代码模式检查源码。</p>
      <details>
        <summary>查看设计说明</summary>
        <p>以清晰的标题、舒适的阅读宽度和自适应间距呈现内容。无需离开工作区，即可检查并下载交付成果。</p>
      </details>
    </main>
  </body>
</html>`,
      },
      {
        id: 'react-component',
        name: 'App.tsx',
        content: `import React, { useState } from 'react';
import { Button, Space } from 'antd';

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <Space>
      <span>已完成 {count} 个任务</span>
      <Button onClick={() => setCount((value) => value + 1)}>
        完成一个任务
      </Button>
    </Space>
  );
};

export default App;`,
      },
      {
        id: 'application-config',
        name: 'config.json',
        content: JSON.stringify(
          {
            name: 'project-delivery',
            version: '1.0.0',
            features: { filePreview: true, download: true },
          },
          null,
          2,
        ),
      },
    ],
  },
  {
    id: 'project-data',
    name: '数据与附件',
    type: 'excel',
    children: [
      {
        id: 'weekly-data',
        name: '周报数据.json',
        content: JSON.stringify(
          [
            { date: '2026-10-05', created: 12, completed: 10 },
            { date: '2026-10-06', created: 8, completed: 8 },
            { date: '2026-10-07', created: 15, completed: 13 },
          ],
          null,
          2,
        ),
      },
      {
        id: 'word-sample',
        name: 'Word样例.docx',
        url: '/office-samples/sample.docx',
      },
      {
        id: 'spreadsheet-sample',
        name: 'Excel样例.xlsx',
        url: '/office-samples/sample.xlsx',
      },
    ],
  },
];

const fileCount = fileGroups.reduce(
  (count, group) => count + group.children.length,
  0,
);

const WorkspaceFileDemo: React.FC = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [keyword, setKeyword] = useState('');
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleGroups = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return fileGroups;
    return fileGroups.flatMap((group) => {
      if (group.name.toLowerCase().includes(query)) return [group];
      const children = group.children.filter((file) =>
        file.name.toLowerCase().includes(query),
      );
      return children.length ? [{ ...group, children, collapsed: false }] : [];
    });
  }, [keyword]);

  useEffect(
    () => () => {
      if (refreshTimer.current !== null) clearTimeout(refreshTimer.current);
    },
    [],
  );

  const refreshFiles = () => {
    if (refreshTimer.current !== null) return;
    setLoading(true);
    setRefreshed(false);
    refreshTimer.current = setTimeout(() => {
      refreshTimer.current = null;
      setLoading(false);
      setRefreshed(true);
    }, 600);
  };

  return (
    <div style={{ height: 560, minWidth: 0 }}>
      <Workspace
        pure
        title="项目交付文件"
        style={{ width: '100%', height: '100%', minWidth: 0 }}
        headerExtra={
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: token.marginSM,
            }}
          >
            <span
              role="status"
              style={{
                color: token.colorTextSecondary,
                fontSize: token.fontSizeSM,
              }}
            >
              {loading ? '正在刷新' : refreshed ? '刷新完成' : '已就绪'}
            </span>
            <Button
              size="small"
              icon={<ReloadOutlined aria-hidden />}
              loading={loading}
              onClick={refreshFiles}
            >
              模拟刷新
            </Button>
          </div>
        }
      >
        <Workspace.File
          tab={{ title: '文件', count: fileCount }}
          nodes={visibleGroups}
          showSearch
          keyword={keyword}
          onChange={setKeyword}
          searchPlaceholder="搜索文件名或分组"
          isLoading={loading}
        />
      </Workspace>
    </div>
  );
};

export default WorkspaceFileDemo;
