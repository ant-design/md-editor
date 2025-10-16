import { I18nContext, Workspace } from '@ant-design/md-editor';
import { Empty } from 'antd';
import React, { useContext, useState } from 'react';

const WorkspaceRealtimeEmptyDemo: React.FC = () => {
  const [htmlContent] = useState('');
  const [mdContent] = useState('');
  const [shellContent] = useState('');
  const { setLanguage } = useContext(I18nContext);
  // 触发时
  setLanguage?.('zh-CN');

  return (
    <div style={{ height: 520, width: '100%' }}>
      <Workspace title="实时跟随空状态示例">
        {/* 默认空态：使用 AntD Empty */}
        <Workspace.Realtime
          tab={{ key: 'markdown-empty', title: '实时跟随' }}
          data={{
            type: 'md',
            content: mdContent,
            title: 'Markdown 内容',
            status: 'done',
          }}
        />

        {/* 默认空态：HTML 预览为空，展示 Empty */}
        <Workspace.Realtime
          tab={{ key: 'html-empty', title: 'HTML 空态' }}
          data={{
            type: 'html',
            content: htmlContent,
            title: 'HTML 渲染',
            status: 'done',
            defaultViewMode: 'preview',
          }}
        />

        {/* 自定义空态：覆盖 emptyRender */}
        <Workspace.Realtime
          tab={{ key: 'shell-empty-custom', title: 'Shell 空态（自定义）' }}
          data={{
            type: 'shell',
            content: shellContent,
            title: '命令执行',
            status: 'done',
            emptyRender: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无命令输出"
              />
            ),
          }}
        />
        <Workspace.File
          tab={{ key: 'shell-file-empty', title: '文件空态' }}
          nodes={[]}
        />
        <Workspace.File
          tab={{
            key: 'shell-file-empty-custom',
            title: '文件空态（自定义）',
          }}
          nodes={[]}
          emptyRender={() => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Empty />
              自定义空状态
            </div>
          )}
        />
      </Workspace>
    </div>
  );
};

export default WorkspaceRealtimeEmptyDemo;
