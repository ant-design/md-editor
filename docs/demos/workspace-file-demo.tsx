import { CoffeeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Workspace from '../../src/Workspace';
import type {
  FileComponentData,
  FileNode,
  FileType,
} from '../../src/Workspace/types';

const WorkspaceFileDemo: React.FC = () => {
  const [fileData, setFileData] = useState<FileComponentData>({
    nodes: [
      {
        name: '文档',
        type: 'doc',
        typeName: '文档',
        collapsed: true,
        children: [
          {
            name: '项目需求文档.docx',
            type: 'doc',
            size: '2.3MB',
            lastModified: '12:30',
            url: '/downloads/project-requirements.docx',
          },
          {
            name: '用户手册.docx',
            type: 'doc',
            size: '1.8MB',
            lastModified: '09:15',
          },
          {
            name: '技术规范.docx',
            type: 'doc',
            size: '3.1MB',
            lastModified: '14:45',
          },
        ],
      },
      {
        name: 'Excel表格',
        type: 'excel',
        typeName: 'Excel表格',
        children: [
          {
            name: '数据统计表.xlsx',
            type: 'excel',
            size: '1.2MB',
            lastModified: '10:20',
            url: '/downloads/data-statistics.xlsx',
          },
          {
            name: '财务报表.xlsx',
            type: 'excel',
            size: '2.8MB',
            lastModified: '16:30',
          },
        ],
      },
      {
        name: 'CSV文件',
        type: 'csv',
        typeName: 'CSV文件',
        children: [
          {
            name: '用户数据.csv',
            type: 'csv',
            size: '856KB',
            lastModified: '08:45',
          },
          {
            name: '销售记录.csv',
            type: 'csv',
            size: '1.1MB',
            lastModified: '11:25',
          },
          {
            name: '产品目录.csv',
            type: 'csv',
            size: '432KB',
            lastModified: '15:10',
          },
        ],
      },
      {
        name: 'Markdown文档',
        type: 'md',
        typeName: 'Markdown文档',
        children: [
          {
            name: 'README.md',
            type: 'md',
            size: '15KB',
            lastModified: '07:30',
            url: '/downloads/readme.md',
          },
          {
            name: 'API文档.md',
            type: 'md',
            size: '28KB',
            lastModified: '13:20',
          },
        ],
      },
    ],
    onDownload: (file: FileNode) => {
      console.log('下载单个文件:', file);
      alert(`正在下载文件: ${file.name}`);
    },
    onGroupDownload: (files: FileNode[], groupType?: FileType) => {
      console.log('下载文件组:', files);
      alert(
        `正在下载${files.length}个${groupType ? groupType + '文件' : '文件'}...`,
      );
    },
    onToggleGroup: (type: FileType, collapsed: boolean) => {
      console.log(`切换分组 ${type} 状态:`, collapsed ? '收起' : '展开');
    },
  });

  useEffect(() => {
    console.log(fileData);
  }, [fileData]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>文件组件演示</h2>

      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          maxWidth: '600px',
        }}
      >
        <Workspace title="文件管理">
          <Workspace.File data={fileData} />
          <Workspace.Custom
            tab={{
              key: 'custom',
              title: '自定义',
              icon: <CoffeeOutlined />,
            }}
          >
            <div>
              <div>文件组件演示</div>
              <p>自定义内容</p>
            </div>
          </Workspace.Custom>
        </Workspace>
      </div>
    </div>
  );
};

export default WorkspaceFileDemo;
