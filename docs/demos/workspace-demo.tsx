import {
  type BrowserItem,
  type FileNode,
  Workspace,
} from '@ant-design/agentic-ui';
import {
  CheckCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, theme } from 'antd';
import React, { useEffect, useState } from 'react';

export const reportContent = `# Agentic UI 调研简报

已完成资料检索与方案整理。这里可以查看生成过程、执行任务和最终交付文件。

## 结论

将对话、任务和成果放在同一个工作空间里，让每一步都有迹可循。正文以只读预览展示，需要时可以切换到文件查看完整内容。

| 交付项 | 内容 | 状态 |
| --- | --- | --- |
| 调研简报 | 使用场景与实施建议 | 已完成 |
| 参考资料 | 官方文档与设计规范 | 已整理 |
| 实施清单 | 分阶段交付与验收项 | 已生成 |

## 推荐方案

### 1. 让进度可见

任务列表记录资料收集、内容分析和报告生成的状态。遇到需要确认的步骤时保留上下文，用户可以直接在当前工作空间里继续处理。

### 2. 让成果可用

将 Markdown 简报和结构化配置保存到文件面板。文件内容与预览一致，支持直接阅读和下载，避免在对话中反复寻找最终版本。

### 3. 让过程可追溯

浏览器面板保留本次使用的参考来源。切换标签后可以回到正文，核对结论与原始资料之间的关系。

## 实施清单

- 收集官方文档，核对组件能力和使用限制。
- 按场景组织参考资料，优先保留可追溯的来源。
- 整理任务列表，明确已完成与待确认的步骤。
- 生成第一版简报，统一标题层级和表格字段。
- 将正文与配置保存到文件面板。
- 检查桌面与窄屏下的阅读和操作空间。
- 验证空状态、加载状态和异常状态。
- 完成最终验收后归档交付成果。

## 验收说明

重新演示可以查看正文逐步生成的过程；向上滚动时会暂停跟随。演示完成后，继续切换任务、参考资料与文件，查看同一次任务的不同侧面。

所有正文和文件都使用本地示例数据，不需要等待远程服务。参考资料链接可打开对应的官方页面。
`;

const suggestions = [
  { id: '1', label: '搜索 LLM 技术趋势', count: 2 },
  { id: '2', label: '搜索模型能力对比', count: 2 },
];

const resultsMap: Record<string, BrowserItem[]> = {
  '1': [
    {
      id: '1-1',
      title: 'LLM 趋势摘要（示例）',
      site: 'huggingface.co · Transformers 文档',
      url: 'https://huggingface.co/docs/transformers/index',
    },
    {
      id: '1-2',
      title: '多模态模型与任务',
      site: 'huggingface.co · 任务指南',
      url: 'https://huggingface.co/docs/transformers/task_summary',
    },
  ],
  '2': [
    {
      id: '2-1',
      title: '模型能力评测方法',
      site: 'huggingface.co · Evaluate 文档',
      url: 'https://huggingface.co/docs/evaluate/index',
    },
    {
      id: '2-2',
      title: '代码模型评测项目',
      site: 'github.com · EvalPlus',
      url: 'https://github.com/evalplus/evalplus',
    },
  ],
};

const request = (suggestion: { id: string }) => ({
  items: resultsMap[suggestion.id] || [],
  loading: false,
});

const files: FileNode[] = [
  {
    id: 'report',
    name: '调研简报.md',
    content: reportContent,
    lastModified: '今天 10:30',
  },
  {
    id: 'checklist',
    name: '实施清单.json',
    content: JSON.stringify(
      {
        project: 'Agentic UI',
        deliverables: ['调研简报', '参考资料', '实施清单'],
        status: 'completed',
      },
      null,
      2,
    ),
    lastModified: '今天 10:28',
  },
];

const tasks = [
  {
    key: 'research',
    title: '收集参考资料',
    content: '已整理官方文档和模型评测来源',
    status: 'success' as const,
  },
  {
    key: 'analysis',
    title: '分析使用场景',
    content: '已归纳交互流程与实施建议',
    status: 'success' as const,
  },
  {
    key: 'report',
    title: '生成交付文件',
    content: '简报和实施清单已保存到文件',
    status: 'success' as const,
  },
];

const Demo = () => {
  const { token } = theme.useToken();
  const [mdContent, setMdContent] = useState(reportContent);
  const [streaming, setStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!streaming) return;
    let offset = 0;
    const timer = setInterval(() => {
      offset = Math.min(offset + 8, reportContent.length);
      setMdContent(reportContent.slice(0, offset));
      if (offset === reportContent.length) setStreaming(false);
    }, 40);
    return () => clearInterval(timer);
  }, [streaming]);

  const replay = () => {
    setActiveTab('realtime');
    if (streaming) {
      setMdContent(reportContent);
      setStreaming(false);
      return;
    }
    setMdContent('# Agentic UI');
    setStreaming(true);
  };

  return (
    <div style={{ height: 560, width: '100%', minWidth: 0 }}>
      <Workspace
        pure
        title="调研与交付"
        activeTabKey={activeTab}
        onTabChange={setActiveTab}
        preserveFilePreviewOnTabChange
        headerExtra={
          <Button
            size="small"
            type="text"
            icon={<ReloadOutlined aria-hidden />}
            onClick={replay}
          >
            {streaming ? '显示完整结果' : '重新演示'}
          </Button>
        }
      >
        <Workspace.Custom tab={{ key: 'overview', title: '概览' }}>
          <article style={{ padding: token.paddingSM, color: token.colorText }}>
            <div
              style={{ color: token.colorSuccess, fontSize: token.fontSizeSM }}
            >
              <CheckCircleOutlined
                style={{ marginInlineEnd: token.marginXS }}
              />
              全部任务已完成
            </div>
            <h2
              style={{
                margin: `${token.marginSM}px 0`,
                fontSize: token.fontSizeHeading3,
                lineHeight: token.lineHeightHeading3,
              }}
            >
              从资料检索，到成果交付
            </h2>
            <p
              style={{
                margin: 0,
                color: token.colorTextSecondary,
                lineHeight: token.lineHeight,
              }}
            >
              已整理参考资料、生成调研简报和实施清单。切换标签查看执行过程，或直接预览交付文件。
            </p>
            <dl
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: token.marginLG,
                margin: `${token.marginLG}px 0`,
                paddingBlock: token.paddingLG,
                borderBlock: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              {[
                ['3', '已完成任务'],
                ['4', '参考来源'],
                ['2', '交付文件'],
              ].map(([value, label]) => (
                <div key={label} style={{ flex: '1 1 100px' }}>
                  <dd
                    style={{
                      margin: 0,
                      fontSize: token.fontSizeHeading2,
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {value}
                  </dd>
                  <dt
                    style={{
                      color: token.colorTextSecondary,
                      fontSize: token.fontSizeSM,
                    }}
                  >
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: token.marginXS }}
            >
              <Button type="primary" onClick={() => setActiveTab('files')}>
                查看交付文件
              </Button>
              <Button onClick={() => setActiveTab('browser')}>
                查看参考资料
              </Button>
            </div>
            <p
              style={{
                marginBlockStart: token.marginLG,
                color: token.colorTextTertiary,
                fontSize: token.fontSizeSM,
              }}
            >
              点击右上角「重新演示」，体验流式生成与实时跟随。
            </p>
          </article>
        </Workspace.Custom>
        <Workspace.Realtime
          tab={{ key: 'realtime', title: '实时跟随' }}
          data={{
            type: 'md',
            content: mdContent,
            title: '调研简报',
            subTitle: 'report.md',
            streaming,
            rightContent: (
              <span
                style={{
                  color: streaming ? token.colorPrimary : token.colorSuccess,
                  fontSize: token.fontSizeSM,
                  whiteSpace: 'nowrap',
                }}
              >
                {streaming ? (
                  <LoadingOutlined
                    style={{ marginInlineEnd: token.marginXS }}
                  />
                ) : (
                  <CheckCircleOutlined
                    style={{ marginInlineEnd: token.marginXS }}
                  />
                )}
                {streaming ? '正在生成' : '已完成'}
              </span>
            ),
          }}
        />
        <Workspace.Task
          tab={{ key: 'tasks', title: '任务列表' }}
          data={{ items: tasks }}
        />
        <Workspace.Browser
          tab={{ key: 'browser', title: '浏览器' }}
          suggestions={suggestions}
          request={request}
        />
        <Workspace.File
          tab={{ key: 'files', count: files.length }}
          nodes={files}
        />
      </Workspace>
    </div>
  );
};

export default Demo;
