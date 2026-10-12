import {
  Workspace,
  type BrowserItem,
  type BrowserSuggestion,
} from '@ant-design/agentic-ui';
import { Tag, theme } from 'antd';
import React from 'react';

const suggestions: BrowserSuggestion[] = [
  { id: 'design', label: 'Ant Design 组件与主题', count: 2 },
  { id: 'react', label: 'React 渲染与性能', count: 2 },
];
const resultsMap: Record<string, BrowserItem[]> = {
  design: [
    {
      id: 'components',
      title: 'Ant Design · 组件总览',
      site: 'ant.design',
      url: 'https://ant.design/components/overview/',
      description:
        '查找布局、数据展示与反馈组件，快速定位适合当前任务的 UI 能力。',
    },
    {
      id: 'theme',
      title: 'Ant Design · 定制主题',
      site: 'ant.design',
      url: 'https://ant.design/docs/react/customize-theme/',
      description: '了解 Design Token、主题算法与组件级样式配置。',
    },
  ],
  react: [
    {
      id: 'render',
      title: 'React · Render and Commit',
      site: 'react.dev',
      url: 'https://react.dev/learn/render-and-commit',
      description: '理解从触发更新到提交 DOM 的渲染过程。',
    },
    {
      id: 'memo',
      title: 'React · memo',
      site: 'react.dev',
      url: 'https://react.dev/reference/react/memo',
      description: '了解组件记忆化的适用范围，减少无必要的重新渲染。',
    },
  ],
};
// 结果保存在本地，选择主题不会发起网络请求。
const request = (suggestion: BrowserSuggestion) => ({
  items: resultsMap[suggestion.id] || [],
  loading: false,
});

const WorkspaceBrowserDemo: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <div style={{ height: 560, minWidth: 0, fontFamily: token.fontFamily }}>
      <Workspace
        pure
        title="资料检索工作台"
        headerExtra={<Tag style={{ marginInlineEnd: 0 }}>本地示例</Tag>}
      >
        <Workspace.Browser suggestions={suggestions} request={request} />
      </Workspace>
    </div>
  );
};
export default WorkspaceBrowserDemo;
