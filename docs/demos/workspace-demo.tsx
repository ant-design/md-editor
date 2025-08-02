import { Workspace } from '@ant-design/md-editor';
import React, { useEffect, useState } from 'react';
import { defaultValue } from './shared/defaultValue';

const Demo = () => {
  const [mdContent, setMdContent] = useState('');
  useEffect(() => {
    // setMdContent(defaultValue);
    let md = '';
    const list = defaultValue.split('');
    const run = async () => {
      for await (const item of list) {
        md += item;
        await new Promise((resolve) => {
          setTimeout(() => {
            setMdContent(md);
            resolve(true);
          }, 10);
        });
      }
    };
    run();
  }, []);
  return (
    <div style={{ height: 600, width: '100%' }}>
      <Workspace
        title="开发工作空间"
        onTabChange={(key: string) => console.log('切换到标签页:', key)}
        onClose={() => console.log('关闭工作空间')}
      >
        {/* 实时监控标签页 */}
        <Workspace.Realtime
          tab={{
            key: 'realtime',
          }}
          data={{
            type: 'md',
            content: mdContent,
            title: '深度思考',
          }}
        />

        {/* 任务执行标签页 */}
        <Workspace.Task
          tab={{
            key: 'tasks',
            title: '任务列表',
          }}
          data={{
            content: [
              {
                category: 'DeepThink',
                info: '性能分析报告',
                runId: 'perf-analysis',
                output: {
                  data: '正在生成系统性能分析报告，包含 CPU、内存、磁盘 IO 和网络性能指标...',
                  type: 'RUNNING',
                },
              },
              {
                category: 'ToolCall',
                info: '日志分析',
                runId: 'log-analysis',
                input: {
                  inputArgs: {
                    params: {
                      logPath: '/var/log/system.log',
                      pattern: 'ERROR|WARN',
                      timeRange: '24h',
                    },
                  },
                },
                output: {
                  data: '已完成最近24小时的日志分析，发现3个错误和5个警告',
                  type: 'END',
                },
              },
              {
                category: 'DeepThink',
                info: '安全扫描',
                runId: 'security-scan',
                output: {
                  data: '完成系统安全扫描，未发现重大安全隐患',
                  type: 'END',
                },
              },
            ],
          }}
        />

        {/* 文件管理标签页 */}
        <Workspace.File
          tab={{
            key: 'files',
          }}
          nodes={[
            {
              id: '1',
              name: '项目计划.docx',
              type: 'word',
              size: '2.5MB',
              lastModified: new Date(Date.now() - 3600000).toLocaleTimeString(),
              url: '/docs/project-plan.docx',
            },
            {
              id: '2',
              name: '数据分析.xlsx',
              type: 'excel',
              size: '1.8MB',
              lastModified: new Date(Date.now() - 7200000).toLocaleTimeString(),
              url: '/docs/data-analysis.xlsx',
            },
            {
              id: '3',
              name: '技术文档.pdf',
              type: 'pdf',
              size: '3.2MB',
              lastModified: new Date(
                Date.now() - 86400000,
              ).toLocaleTimeString(),
              url: '/docs/technical-doc.pdf',
            },
            {
              id: '4',
              name: '系统架构图.png',
              type: 'image',
              size: '0.5MB',
              lastModified: new Date(Date.now() - 1800000).toLocaleTimeString(),
              url: '/images/architecture.png',
            },
            {
              id: '5',
              name: '接口文档.md',
              type: 'markdown',
              size: '0.3MB',
              lastModified: new Date(
                Date.now() - 14400000,
              ).toLocaleTimeString(),
              url: '/docs/api.md',
            },
            {
              id: '6',
              name: '配置说明.html',
              type: 'plainText',
              size: '0.1MB',
              lastModified: new Date(
                Date.now() - 28800000,
              ).toLocaleTimeString(),
              url: '/docs/config.html',
            },
          ]}
        />
      </Workspace>
    </div>
  );
};

export default Demo;
