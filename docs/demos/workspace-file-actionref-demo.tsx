import { Workspace, type FileActionRef } from '@ant-design/md-editor';
import { Button, Card, Space, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const WorkspaceFileActionRefDemo: React.FC = () => {
  const actionRef = useRef<FileActionRef | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    setNodes([
      {
        name: '项目文档',
        type: 'markdown',
        children: [
          {
            name: 'README.md',
            type: 'markdown',
            size: '2.5KB',
            lastModified: '2024-01-15 10:00:00',
            content: '# 项目说明\n\n这是一个示例项目...',
          },
          {
            name: 'CHANGELOG.md',
            type: 'markdown',
            size: '1.8KB',
            loading: true, // 模拟文件加载中
            lastModified: '2024-01-14 15:30:00',
            content: `好的，我现在需要帮用户汇总谷歌I/O 2025大会的重要信息。首先，我得仔细看看用户提供的搜索结果，找出相关的信息点。
用户给了19个网页的结果，我需要逐一浏览，提取关键内容。
首先，大会的时间和地点。网页1、2、5、10、12、16都提到了时间，大部分说是在5月20日至21日举行，地点是加州山景城的Shoreline Amphitheatre。网页3和12提到具体日程，主题演讲在凌晨1点开始，开发者主题演讲在4：30 am。不过要注意时区转换，比如网页5提到北京时间是5月21日凌晨，这可能对国内用户来说需要换算时间。
接下来是大会的主要内容和亮点。AI肯定是重点，多个网页提到Gemini的更新，比如网页3、9、10、11、13、18. Gemini 2 5 Pro模型会被详细介绍，可能还有订阅服务的变化。网页18还提到250美元的UItra会员，这可能和Gemini Advanced有关。
此外，Project Astra作为下一代AI助手，网页3、10、13都有提到，可能涉及移动和可穿戴设备。
需要整合这些信息，分时间地点、核心内容、硬件动态、其他产品、合作与竞争几个部分。注意引用多个网页，避免重复引用同一个网页。比如AI部分可以引用网页3、9、10、11、13、18，智能眼镜引用4、6、7、8、19等。确保每个点都有对应的引用，并且正确标注。`,
          },
        ],
      },
      {
        name: '源代码',
        type: 'react',
        children: [
          {
            name: 'index.tsx',
            type: 'react',
            size: '3.2KB',
            lastModified: '2024-01-15 09:45:00',
            content:
              'import React from "react";\n\nconst App = () => {\n  return <div>Hello World</div>;\n};\n\nexport default App;',
          },
        ],
      },
    ]);
  }, []);

  const handleOpenReadme = () => {
    const readme = nodes?.[0]?.children?.[0];
    if (!readme) {
      message.warning('未找到 README.md');
      return;
    }
    actionRef.current?.openPreview(readme);
  };

  const handleBack = () => {
    actionRef.current?.backToList();
  };

  return (
    <div style={{ height: 520, width: '100%' }}>
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space>
          <Button size="small" type="primary" onClick={handleOpenReadme}>
            打开 README 预览（actionRef外部打开）
          </Button>
          <Button size="small" onClick={handleBack}>
            返回文件列表
          </Button>
        </Space>
      </Card>

      <Workspace title="文件工作台">
        <Workspace.File
          tab={{ key: 'files', title: '文件管理', count: nodes.length }}
          nodes={nodes}
          actionRef={actionRef}
          onPreview={(file) => {
            message.info(`准备预览: ${file.name}`);
            return file; // 返回 file 走内置预览逻辑
          }}
        />
      </Workspace>
    </div>
  );
};

export default WorkspaceFileActionRefDemo;
