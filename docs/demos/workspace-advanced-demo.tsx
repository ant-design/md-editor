import { Workspace, type FileProps } from '@ant-design/agentic-ui';
import { Button, Empty, Input, Switch, Tag, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const shellLines = [
  '$ pnpm run build',
  '✓ TypeScript 类型检查通过',
  '✓ 已构建 24 个模块',
  '✓ 输出目录：dist/',
  'Build completed in 1.2s.',
];
const markdownContent = `# 发布检查

本次构建已完成，交付物可在「文件」标签中预览或下载。

## 检查结果

- [x] 组件类型检查通过
- [x] 关键交互回归通过
- [x] 生产环境构建完成

## 接入示例

\`\`\`tsx
const [activeTabKey, setActiveTabKey] = useState('realtime');

<Workspace
  activeTabKey={activeTabKey}
  onTabChange={setActiveTabKey}
/>
\`\`\`
`;
const fileNodes: FileProps['nodes'] = [
  {
    id: 'release-notes',
    name: '发布检查.md',
    type: 'markdown',
    size: '1 KB',
    content: markdownContent,
  },
  {
    id: 'build-summary',
    name: 'build-summary.json',
    type: 'config',
    size: '128 B',
    content:
      '{\n  "status": "passed",\n  "modules": 24,\n  "duration": "1.2s"\n}',
  },
];

const WorkspaceAdvancedDemo: React.FC = () => {
  const { token } = theme.useToken();
  const [activeTabKey, setActiveTabKey] = useState('realtime');
  const [open, setOpen] = useState(true);
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [title, setTitle] = useState('发布工作台');
  const [shell, setShell] = useState(shellLines.join('\n'));
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancel = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  useEffect(() => cancel, []);
  const replay = () => {
    cancel();
    setActiveTabKey('realtime');
    setShell(shellLines[0]);
    setRunning(true);
    let index = 1;
    timerRef.current = setInterval(() => {
      const line = shellLines[index];
      setShell((current) => `${current}\n${line}`);
      index += 1;
      if (index === shellLines.length) {
        cancel();
        setRunning(false);
      }
    }, 300);
  };
  return (
    <div style={{ height: 560, minWidth: 0, fontFamily: token.fontFamily }}>
      {open ? (
        <Workspace
          pure
          title={title || '发布工作台'}
          activeTabKey={activeTabKey}
          onTabChange={setActiveTabKey}
          onClose={
            showCloseButton
              ? () => {
                  cancel();
                  setRunning(false);
                  setShell(shellLines.join('\n'));
                  setOpen(false);
                }
              : undefined
          }
          headerExtra={
            <Tag
              color={running ? 'processing' : 'success'}
              style={{ marginInlineEnd: 0 }}
            >
              {running ? '构建中' : '已完成'}
            </Tag>
          }
        >
          <Workspace.Realtime
            tab={{ key: 'realtime', title: '构建日志' }}
            data={{
              type: 'shell',
              content: `\`\`\`bash\n${shell}\n\`\`\``,
              title: 'pnpm build',
              status: 'done',
              streaming: running,
            }}
          />
          <Workspace.Realtime
            tab={{ key: 'markdown', title: '检查报告' }}
            data={{
              type: 'md',
              content: markdownContent,
              title: '发布检查.md',
              status: 'done',
              typewriter: false,
            }}
          />
          <Workspace.File
            tab={{ key: 'files', title: '文件', count: fileNodes.length }}
            nodes={fileNodes}
          />
          <Workspace.Custom tab={{ key: 'settings', title: '设置' }}>
            <div
              style={{
                padding: token.paddingLG,
                overflow: 'auto',
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  maxWidth: 480,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: token.marginLG,
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: token.marginSM,
                  }}
                >
                  工作台标题
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={24}
                    placeholder="输入工作台标题"
                  />
                </label>
                <div
                  style={{
                    display: 'flex',
                    gap: token.marginSM,
                    alignItems: 'center',
                  }}
                >
                  <Switch
                    checked={showCloseButton}
                    onChange={setShowCloseButton}
                    aria-label="显示关闭按钮"
                  />
                  <span>显示关闭按钮</span>
                </div>
                <div>
                  <Button onClick={replay} disabled={running}>
                    重新演示构建
                  </Button>
                  <p
                    style={{ color: token.colorTextSecondary, marginBottom: 0 }}
                  >
                    重播只更新示例日志，文件和检查报告始终可以查看。
                  </p>
                </div>
              </div>
            </div>
          </Workspace.Custom>
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
export default WorkspaceAdvancedDemo;
