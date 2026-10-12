import { Workspace } from '@ant-design/agentic-ui';
import {
  CopyOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, message, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';

export const shellCommands = [
  '$ npm install @ant-design/agentic-ui',
  'added 156 packages in 2.3s',
  '$ npm run build',
  'webpack compiled successfully',
];

export const markdownText = `# 实时文档

工作空间将执行日志、文档和页面预览放在一起，方便检查生成结果。

## 本次交付

- 依赖安装和构建日志
- 支持 Markdown 的说明文档
- 可切换源代码的 HTML 页面

## 使用方式

点击「重新演示」可以查看生成过程。切换标签不会重新启动任务，也不会丢失已有内容。

\`\`\`tsx
<Workspace.Realtime
  data={{ type: 'md', content, streaming }}
/>
\`\`\`
`;

export const sampleHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>交付概览</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px; color: #1f2329; background: #fff; font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 1.7; }
    header { padding-bottom: 20px; border-bottom: 1px solid #eef0f3; }
    .status { color: #389e0d; font-size: 12px; }
    h1 { margin: 8px 0; font-size: 24px; line-height: 1.4; letter-spacing: -.5px; }
    p { margin: 0; color: #6b7280; }
    .metrics { display: flex; flex-wrap: wrap; gap: 24px; padding: 24px 0; }
    .metric { flex: 1 1 100px; }
    .metric strong { display: block; font-size: 28px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .metric span { color: #6b7280; font-size: 12px; }
    footer { padding-top: 16px; border-top: 1px solid #eef0f3; color: #6b7280; font-size: 12px; }
    @media (max-width: 360px) { body { padding: 16px; } h1 { font-size: 21px; } .metrics { gap: 16px; } }
    @media (prefers-color-scheme: dark) { body { background: #152833; color: #f0f4f8; } p, .metric span, footer { color: #aebbc6; } header, footer { border-color: #334552; } .status { color: #95de64; } }
  </style>
</head>
<body>
  <header>
    <span class="status">生成完成</span>
    <h1>实时 HTML 预览演示</h1>
    <p>从执行过程到最终页面，在同一个工作空间查看。</p>
  </header>
  <section class="metrics" aria-label="交付统计">
    <div class="metric"><strong>3</strong><span>交付成果</span></div>
    <div class="metric"><strong>4</strong><span>执行步骤</span></div>
    <div class="metric"><strong>100%</strong><span>完成进度</span></div>
  </section>
  <footer>支持预览与源代码切换 · 页面使用本地示例数据</footer>
</body>
</html>`;

const WorkspaceRealtimeDemo: React.FC = () => {
  const { token } = theme.useToken();
  const [shellContent, setShellContent] = useState(shellCommands.join('\n'));
  const [markdownContent, setMarkdownContent] = useState(markdownText);
  const [htmlContent, setHtmlContent] = useState(sampleHtml);
  const [streaming, setStreaming] = useState(false);
  const [htmlStatus, setHtmlStatus] = useState<'loading' | 'done'>('done');

  useEffect(() => {
    if (!streaming) return;
    let elapsed = 0;
    let shellIndex = 0;
    let mdIndex = 0;
    let htmlReady = false;
    const timer = setInterval(() => {
      elapsed += 40;
      const nextShellIndex = Math.min(
        Math.floor(elapsed / 600),
        shellCommands.length,
      );
      if (nextShellIndex !== shellIndex) {
        shellIndex = nextShellIndex;
        setShellContent(shellCommands.slice(0, shellIndex).join('\n'));
      }
      if (mdIndex < markdownText.length) {
        mdIndex = Math.min(mdIndex + 8, markdownText.length);
        setMarkdownContent(markdownText.slice(0, mdIndex));
      }
      if (!htmlReady && elapsed >= 1200) {
        htmlReady = true;
        setHtmlContent(sampleHtml);
        setHtmlStatus('done');
      }
      if (
        shellIndex === shellCommands.length &&
        mdIndex === markdownText.length &&
        htmlReady
      ) {
        setStreaming(false);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [streaming]);

  const replay = () => {
    if (streaming) {
      setShellContent(shellCommands.join('\n'));
      setMarkdownContent(markdownText);
      setHtmlContent(sampleHtml);
      setHtmlStatus('done');
      setStreaming(false);
      return;
    }
    setShellContent('');
    setMarkdownContent('');
    setHtmlContent('');
    setHtmlStatus('loading');
    setStreaming(true);
  };

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      message.success('HTML 源代码已复制');
    } catch {
      message.warning('无法访问剪贴板，请在代码视图中选择并复制');
    }
  };

  const downloadHtml = () => {
    const url = URL.createObjectURL(
      new Blob([htmlContent], { type: 'text/html;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.html';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div style={{ height: 560, width: '100%', minWidth: 0 }}>
      <Workspace
        pure
        title="实时生成"
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
        <Workspace.Realtime
          tab={{ key: 'shell', title: '执行日志' }}
          data={{
            type: 'shell',
            content: '```bash\n' + shellContent + '\n```',
            title: '命令执行',
            subTitle: streaming ? '运行中' : '构建成功',
            streaming,
          }}
        />
        <Workspace.Realtime
          tab={{ key: 'markdown', title: 'Markdown' }}
          data={{
            type: 'md',
            content: markdownContent,
            title: '说明文档',
            subTitle: 'readme.md',
            streaming,
          }}
        />
        <Workspace.Realtime
          tab={{ key: 'html', title: 'HTML 预览' }}
          data={{
            type: 'html',
            content: htmlContent,
            title: '创建 HTML 文件',
            subTitle: 'report.html',
            defaultViewMode: 'preview',
            labels: { preview: '预览', code: '代码' },
            iframeProps: { sandbox: '', title: '交付概览' },
            status: htmlStatus,
            segmentedExtra: (
              <Space size={token.marginXXS}>
                <Button
                  type="text"
                  size="small"
                  aria-label="复制 HTML"
                  title="复制 HTML"
                  icon={<CopyOutlined />}
                  disabled={!htmlContent}
                  onClick={copyHtml}
                />
                <Button
                  type="text"
                  size="small"
                  aria-label="下载 HTML"
                  title="下载 HTML"
                  icon={<DownloadOutlined />}
                  disabled={!htmlContent}
                  onClick={downloadHtml}
                />
              </Space>
            ),
          }}
        />
      </Workspace>
    </div>
  );
};

export default WorkspaceRealtimeDemo;
