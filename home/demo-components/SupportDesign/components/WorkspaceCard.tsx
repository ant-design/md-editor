import { BrowserItem, Workspace } from '@ant-design/agentic-ui';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimationVisibility } from '../../../hooks/useAnimationVisibility';
import { useSiteI18n } from '../../../i18n';
import {
  CardDescription,
  CardTitle,
  DesignCard,
  WorkspaceWrapper,
} from '../style';

const WorkspaceCard: React.FC = () => {
  const [mdContent, setMdContent] = useState('');
  const { messages } = useSiteI18n();
  const { workspaceDemo } = messages.support;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const streamedLengthRef = useRef(0);
  const { isVisible, reducedMotion } = useAnimationVisibility(wrapperRef);
  const markdownCharacters = useMemo(
    () => Array.from(workspaceDemo.mdContent),
    [workspaceDemo.mdContent],
  );

  // 模拟建议列表
  const [suggestions] = useState(() =>
    workspaceDemo.suggestions.map((label, index) => ({
      id: String(index + 1),
      label,
      count: 3,
    })),
  );

  // 搜索结果映射
  const resultsMap: Record<string, BrowserItem[]> = useMemo(() => {
    const { results } = workspaceDemo;
    return {
      '1': [
        {
          id: '1-1',
          title: results.r11,
          site: 'www.report.com',
          url: 'https://www.report.com',
        },
        {
          id: '1-2',
          title: results.r12,
          site: 'www.analysis.com',
          url: 'https://www.analysis.com',
        },
        {
          id: '1-3',
          title: results.r13,
          site: 'www.trend.com',
          url: 'https://www.trend.com',
        },
      ],
      '2': [
        {
          id: '2-1',
          title: results.r21,
          site: 'www.binance.com',
          url: 'https://www.binance.com',
          icon: 'https://bin.bnbstatic.com/static/images/common/favicon.ico',
        },
        {
          id: '2-2',
          title: results.r22,
          site: 'm.duote.com',
          url: 'https://m.duote.com',
          icon: 'https://www.duote.com/favicon.ico',
        },
        {
          id: '2-3',
          title: results.r23,
          site: 'www.duote.com',
          url: 'https://www.duote.com',
          icon: 'https://www.duote.com/favicon.ico',
        },
      ],
      '3': [
        {
          id: '3-1',
          title: results.r31,
          site: 'www.policy.com',
          url: 'https://www.policy.com',
        },
        {
          id: '3-2',
          title: results.r32,
          site: 'www.law.com',
          url: 'https://www.law.com',
        },
        {
          id: '3-3',
          title: results.r33,
          site: 'www.news.com',
          url: 'https://www.news.com',
        },
      ],
      '4': [
        {
          id: '4-1',
          title: results.r41,
          site: 'www.volatility.com',
          url: 'https://www.volatility.com',
        },
        {
          id: '4-2',
          title: results.r42,
          site: 'www.marketdata.com',
          url: 'https://www.marketdata.com',
        },
        {
          id: '4-3',
          title: results.r43,
          site: 'www.price.com',
          url: 'https://www.price.com',
        },
      ],
    };
  }, [workspaceDemo]);

  // 请求处理函数
  const request = (suggestion: { id: string }) => ({
    items: resultsMap[suggestion.id] || [],
    loading: false,
  });

  // A small batch keeps the streaming example responsive without reparsing every character.
  useEffect(() => {
    streamedLengthRef.current = 0;
    setMdContent('');
  }, [markdownCharacters]);

  useEffect(() => {
    if (reducedMotion || process.env.NODE_ENV === 'test') {
      streamedLengthRef.current = markdownCharacters.length;
      setMdContent(workspaceDemo.mdContent);
      return;
    }
    if (!isVisible || streamedLengthRef.current >= markdownCharacters.length) {
      return;
    }

    const timer = setInterval(() => {
      const length = Math.min(
        streamedLengthRef.current + 4,
        markdownCharacters.length,
      );
      streamedLengthRef.current = length;
      setMdContent(markdownCharacters.slice(0, length).join(''));
      if (length === markdownCharacters.length) clearInterval(timer);
    }, 40);

    return () => clearInterval(timer);
  }, [isVisible, markdownCharacters, reducedMotion, workspaceDemo.mdContent]);

  const { files, tasks } = workspaceDemo;

  return (
    <DesignCard>
      <CardTitle>{messages.support.workspace.title}</CardTitle>
      <CardDescription>
        {messages.support.workspace.description}
      </CardDescription>
      <WorkspaceWrapper
        ref={wrapperRef}
        style={{ marginTop: '24px', height: '420px', overflow: 'hidden' }}
      >
        <Workspace
          title={workspaceDemo.title}
          onTabChange={(key: string) => console.log('Tab changed:', key)}
          onClose={() => console.log('Workspace closed')}
        >
          {/* 实时监控标签页 - Markdown 内容 */}
          <Workspace.Realtime
            tab={{
              key: 'realtime',
              title: workspaceDemo.realtimeTab,
            }}
            data={{
              type: 'md',
              content: mdContent,
              title: workspaceDemo.deepThinkTitle,
            }}
          />

          {/* 任务执行标签页 */}
          <Workspace.Task
            tab={{
              key: 'tasks',
              title: <div>{workspaceDemo.taskListTab}</div>,
            }}
            data={{
              items: [
                { key: '1', title: tasks[0], status: 'success' },
                {
                  key: '2',
                  title: (
                    <div>
                      {tasks[1]}
                      {workspaceDemo.taskStopped}
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </div>
                  ),
                  status: 'error',
                },
                { key: '3', title: tasks[2], status: 'loading' },
                { key: '4', title: tasks[3], status: 'pending' },
                { key: '5', title: tasks[4], status: 'pending' },
                { key: '6', title: tasks[5], status: 'pending' },
              ],
            }}
          />

          {/* 浏览器标签页 */}
          <Workspace.Browser
            tab={{
              key: 'browser',
              title: workspaceDemo.browserTab,
            }}
            suggestions={suggestions}
            request={request}
          />

          {/* 文件管理标签页 */}
          <Workspace.File
            tab={{
              key: 'files',
              count: 6,
            }}
            nodes={[
              {
                id: '1',
                name: files.projectPlan,
                size: '2.5MB',
                lastModified: '2025-08-11 10:00:00',
                url: '/docs/project-plan.txt',
                displayType: 'txt',
              },
              {
                id: '2',
                name: files.dataAnalysis,
                type: 'excel',
                size: '1.8MB',
                lastModified: '2025-08-11 10:00:00',
                url: '/docs/data-analysis.xlsx',
              },
              {
                id: '3',
                name: files.techDoc,
                type: 'pdf',
                size: '3.2MB',
                lastModified: '2025-08-11 10:00:00',
                url: '/docs/technical-doc.pdf',
              },
              {
                id: '4',
                name: files.architecture,
                type: 'image',
                size: '0.5MB',
                lastModified: '2025-08-11 10:00:00',
                url: '/images/architecture.png',
              },
              {
                id: '5',
                name: files.apiDoc,
                type: 'markdown',
                size: '0.3MB',
                lastModified: '2025-08-11 10:00:00',
                url: '/docs/api.md',
              },
              {
                id: '6',
                name: files.configNote,
                type: 'code',
                size: '0.1MB',
                lastModified: '2025-08-11 10:00:00',
                content:
                  '<!DOCTYPE html><html><body><h1>Hello</h1></body></html>',
              },
            ]}
          />
        </Workspace>
      </WorkspaceWrapper>
    </DesignCard>
  );
};

export default WorkspaceCard;
