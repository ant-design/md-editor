import { Workspace } from '@ant-design/agentic-ui';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Empty, theme } from 'antd';
import React, { useState } from 'react';

const guide = `# 工作台快捷操作

标题栏的更多菜单可以连接当前任务的常用操作。

- **下载说明**：将本页说明保存为 Markdown 文件。
- **查看任务**：切换到任务列表，查看交付进度。
- **关闭工作台**：收起当前工作空间，可随时重新打开。

## 接入示例

\`\`\`tsx
<Workspace headerExtra={headerExtra} />
\`\`\`
`;
const downloadGuide = () => {
  const url = URL.createObjectURL(
    new Blob([guide], { type: 'text/markdown;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'workspace-guide.md';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const WorkspaceHeaderExtraDemo: React.FC = () => {
  const { token } = theme.useToken();
  const [activeTabKey, setActiveTabKey] = useState('guide');
  const [open, setOpen] = useState(true);
  const headerExtra = (
    <Dropdown
      menu={{
        items: [
          { key: 'download', label: '下载说明', onClick: downloadGuide },
          {
            key: 'tasks',
            label: '查看任务',
            onClick: () => setActiveTabKey('tasks'),
          },
          { type: 'divider' },
          { key: 'close', label: '关闭工作台', onClick: () => setOpen(false) },
        ],
      }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button
        type="text"
        aria-label="更多工作台操作"
        icon={<MoreOutlined aria-hidden />}
      />
    </Dropdown>
  );
  return (
    <div style={{ height: 560, minWidth: 0, fontFamily: token.fontFamily }}>
      {open ? (
        <Workspace
          pure
          title="工作台快捷操作"
          activeTabKey={activeTabKey}
          onTabChange={setActiveTabKey}
          onClose={() => setOpen(false)}
          headerExtra={headerExtra}
        >
          <Workspace.Realtime
            tab={{ key: 'guide', title: '使用说明' }}
            data={{
              type: 'md',
              content: guide,
              title: 'workspace-guide.md',
              typewriter: false,
              status: 'done',
            }}
          />
          <Workspace.Task
            tab={{ key: 'tasks', title: '任务', count: 3 }}
            data={{
              items: [
                {
                  key: 'header',
                  title: '配置快捷入口',
                  content: '将更多菜单放入 headerExtra，保持主界面简洁。',
                  status: 'success',
                },
                {
                  key: 'actions',
                  title: '连接菜单操作',
                  content: '下载文档、切换面板与关闭工作台均可直接体验。',
                  status: 'success',
                },
                {
                  key: 'verify',
                  title: '检查操作体验',
                  content: '尝试键盘打开菜单，并在关闭后重新打开工作台。',
                  status: 'pending',
                },
              ],
            }}
          />
        </Workspace>
      ) : (
        <div
          style={{
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            padding: token.paddingLG,
            boxSizing: 'border-box',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="工作台已关闭"
          >
            <Button type="primary" onClick={() => setOpen(true)}>
              重新打开
            </Button>
          </Empty>
        </div>
      )}
    </div>
  );
};
export default WorkspaceHeaderExtraDemo;
