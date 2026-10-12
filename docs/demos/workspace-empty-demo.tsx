import { Workspace } from '@ant-design/agentic-ui';
import { Empty, theme } from 'antd';
import React from 'react';

const WorkspaceRealtimeEmptyDemo: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <div style={{ height: 560, minWidth: 0, fontFamily: token.fontFamily }}>
      <Workspace pure title="等待任务输出" style={{ boxShadow: 'none' }}>
        <Workspace.Realtime
          tab={{ key: 'markdown-empty', title: '文档' }}
          data={{ type: 'md', content: '', title: '分析报告', status: 'done' }}
        />
        <Workspace.Realtime
          tab={{ key: 'html-empty', title: '页面' }}
          data={{
            type: 'html',
            content: '',
            title: '页面预览',
            status: 'done',
            defaultViewMode: 'preview',
          }}
        />
        <Workspace.Realtime
          tab={{ key: 'shell-empty', title: '命令' }}
          data={{
            type: 'shell',
            content: '',
            title: '命令执行',
            status: 'done',
            emptyRender: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <>
                    <div>暂无命令输出</div>
                    <div
                      style={{
                        color: token.colorTextSecondary,
                        marginTop: token.marginXS,
                      }}
                    >
                      任务执行后，日志会显示在这里。
                    </div>
                  </>
                }
              />
            ),
          }}
        />
        <Workspace.File
          tab={{ key: 'files-empty', title: '文件' }}
          nodes={[]}
          emptyRender={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <>
                  <div>还没有生成文件</div>
                  <div
                    style={{
                      color: token.colorTextSecondary,
                      marginTop: token.marginXS,
                    }}
                  >
                    任务完成后的报告、代码与附件会收集在这里。
                  </div>
                </>
              }
            />
          }
        />
      </Workspace>
    </div>
  );
};
export default WorkspaceRealtimeEmptyDemo;
