import { Workspace } from '@ant-design/md-editor';
import React, { useState } from 'react';

const WorkspaceBrowserDemo: React.FC = () => {
  const [browserData] = useState({
    items: [
      {
        id: '1',
        title: 'Ant Design 官网',
        url: 'https://ant.design',
        description: '企业级 UI 设计语言和 React 组件库',
        icon: '🌐',
        tags: ['UI', 'React', '组件库'],
        lastVisited: '2024-01-15 10:30:00',
      },
      {
        id: '2',
        title: 'MD Editor 文档',
        url: 'https://md-editor.vercel.app',
        description: 'Markdown 编辑器组件，支持多种插件',
        icon: '📝',
        tags: ['Markdown', '编辑器', '插件'],
        lastVisited: '2024-01-15 09:15:00',
      },
      {
        id: '3',
        title: 'GitHub',
        url: 'https://github.com',
        description: '全球最大的代码托管平台',
        icon: '🐙',
        tags: ['代码托管', '开源', '协作'],
        lastVisited: '2024-01-14 16:45:00',
      },
      {
        id: '4',
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        description: '程序员问答社区',
        icon: '💡',
        tags: ['问答', '编程', '社区'],
        lastVisited: '2024-01-14 14:20:00',
      },
      {
        id: '5',
        title: 'React 官方文档',
        url: 'https://react.dev',
        description: 'React 官方文档和教程',
        icon: '⚛️',
        tags: ['React', '文档', '教程'],
        lastVisited: '2024-01-13 11:10:00',
      },
    ],
    categories: [
      {
        name: '开发工具',
        items: ['1', '2', '5'],
      },
      {
        name: '社区平台',
        items: ['3', '4'],
      },
    ],
  });

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Workspace title="浏览器工作空间">
        <Workspace.Browser
          tab={{
            key: 'browser',
            title: '浏览器',
            count: browserData.items.length,
          }}
          data={browserData}
        />
      </Workspace>
    </div>
  );
};

export default WorkspaceBrowserDemo;
