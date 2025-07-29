import { CoffeeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Workspace from '../../src/Workspace';
import type {
  FileComponentData,
  FileItem,
  FileType,
} from '../../src/Workspace/types';

const WorkspaceFileDemo: React.FC = () => {
  // 模拟文件数据
  const [fileData, setFileData] = useState<FileComponentData>({
    mode: 'group',
    groups: [
      {
        type: 'doc',
        typeName: 'docx',
        collapsed: false,
        files: [
          {
            id: '1',
            name: '项目需求文档.docx',
            type: 'doc',
            size: '2.3MB',
            lastModified: '12:30',
            url: '/downloads/project-requirements.docx',
            previewUrl: '/preview/project-requirements.docx',
          },
          {
            id: '2',
            name: '用户手册.docx',
            type: 'doc',
            size: '1.8MB',
            lastModified: '09:15',
          },
          {
            id: '3',
            name: '技术规范.docx',
            type: 'doc',
            size: '3.1MB',
            lastModified: '14:45',
          },
        ],
      },
      {
        type: 'excel',
        typeName: 'Excel表格',
        collapsed: false,
        files: [
          {
            id: '4',
            name: '数据统计表.xlsx',
            type: 'excel',
            size: '1.2MB',
            lastModified: '10:20',
            url: '/downloads/data-statistics.xlsx',
          },
          {
            id: '5',
            name: '财务报表.xlsx',
            type: 'excel',
            size: '2.8MB',
            lastModified: '16:30',
          },
        ],
      },
      {
        type: 'csv',
        typeName: 'CSV文件',
        collapsed: true,
        files: [
          {
            id: '6',
            name: '用户数据.csv',
            type: 'csv',
            size: '856KB',
            lastModified: '08:45',
          },
          {
            id: '7',
            name: '销售记录.csv',
            type: 'csv',
            size: '1.1MB',
            lastModified: '11:25',
          },
          {
            id: '8',
            name: '产品目录.csv',
            type: 'csv',
            size: '432KB',
            lastModified: '15:10',
          },
        ],
      },
      {
        type: 'md',
        typeName: 'Markdown文档',
        collapsed: false,
        files: [
          {
            id: '9',
            name: 'README.md',
            type: 'md',
            size: '15KB',
            lastModified: '07:30',
            url: '/downloads/readme.md',
            previewUrl: '/preview/readme.md',
          },
          {
            id: '10',
            name: 'API文档.md',
            type: 'md',
            size: '28KB',
            lastModified: '13:20',
          },
        ],
      },
    ],
    onDownload: (file: FileItem) => {
      console.log('下载单个文件:', file);
      alert(`正在下载文件: ${file.name}`);
    },
    onGroupDownload: (files: FileItem[], groupType?: FileType) => {
      console.log(`下载${groupType}类型的所有文件:`, files);
      alert(`正在下载${files.length}个${groupType}文件...`);
    },
    onToggleGroup: (groupType: FileType, collapsed: boolean) => {
      console.log(`切换分组 ${groupType} 状态:`, collapsed ? '收起' : '展开');

      setFileData((prev) => ({
        ...prev,
        groups: prev.groups?.map((group) =>
          group.type === groupType ? { ...group, collapsed } : group,
        ),
      }));
    },
  });

  // 切换展示模式
  const toggleMode = () => {
    setFileData((prev) => {
      if (prev.mode === 'group') {
        // 切换到平铺模式，保留原始数据以便切换回分组模式
        const allFiles = prev.groups?.flatMap((group) => group.files) || [];
        return {
          ...prev,
          mode: 'flat',
          files: allFiles,
        };
      } else {
        // 切换到分组模式，保留所有必要的属性
        return {
          ...prev,
          mode: 'group',
        };
      }
    });
  };

  useEffect(() => {
    console.log(fileData);
  }, [fileData]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>文件组件演示</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={toggleMode}
          style={{
            padding: '8px 16px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          切换到{fileData.mode === 'group' ? '平铺' : '分组'}展示
        </button>
      </div>

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
