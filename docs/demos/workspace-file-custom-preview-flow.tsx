import { ArrowLeftOutlined } from '@ant-design/icons';
import { Workspace, type FileActionRef } from '@ant-design/md-editor';
import type {
  FileNode,
  GroupNode,
} from '@ant-design/md-editor/Workspace/types';
import { message } from 'antd';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

// 支持“列表 -> 查看详情 -> 返回列表”的自定义预览组件（独立示例）
type VariableAnalysisPreviewRef = {
  getMode: () => 'list' | 'detail';
  toList: () => void;
};

const VariableAnalysisPreview = React.forwardRef<
  VariableAnalysisPreviewRef,
  {
    file: FileNode;
    setPreviewHeader?: (h: React.ReactNode) => void;
    back?: () => void;
    download?: () => void;
    fileActionRef?: React.MutableRefObject<FileActionRef | null>;
  }
>(({ file, setPreviewHeader, fileActionRef }, ref) => {
  const [mode, setMode] = useState<'list' | 'detail'>('list');
  const [current, setCurrent] = useState<{
    id: string;
    name: string;
    type: string;
    binMethod: string;
    binCount: number;
    iv: string | number;
    ks: string | number;
  } | null>(null);

  // 当模式切换回 list 时，清理详情态数据与头部
  useEffect(() => {
    if (mode === 'list') {
      setCurrent(null);
      setPreviewHeader?.(undefined);
      // 还原标题区域为原始文件信息
      fileActionRef?.current?.updatePreviewHeader?.({
        name: file.name,
        lastModified: file.lastModified,
        icon: file.icon,
      });
    }
  }, [mode, setPreviewHeader, fileActionRef, file]);

  useImperativeHandle(
    ref,
    () => ({
      getMode: () => mode,
      toList: () => {
        setMode('list');
        setCurrent(null);
        setPreviewHeader?.(undefined);
      },
    }),
    [mode, setPreviewHeader],
  );

  const rows = useMemo(
    () => [
      {
        id: '1',
        name: '变量1',
        type: 'double',
        binMethod: '等频',
        binCount: 11,
        iv: 0.075298,
        ks: 0.075298,
      },
      {
        id: '2',
        name: '变量2',
        type: 'double',
        binMethod: '等频',
        binCount: 1,
        iv: 0.075298,
        ks: 0.075298,
      },
      {
        id: '3',
        name: '变量3',
        type: 'double',
        binMethod: '等频',
        binCount: 2,
        iv: 0.075298,
        ks: 0.075298,
      },
      {
        id: '4',
        name: '变量4',
        type: 'double',
        binMethod: '等频',
        binCount: 3,
        iv: 0.075298,
        ks: 0.075298,
      },
    ],
    [],
  );

  const handleViewDetail = (row: (typeof rows)[number]) => {
    setCurrent(row);
    setMode('detail');
    // 进入详情态：通过 actionRef.updatePreviewHeader 更新预览标题区域
    fileActionRef?.current?.updatePreviewHeader?.({
      name: `变量详情 - ${row.name}`,
      lastModified: new Date().toLocaleString(),
    });
  };

  const handleBack = () => {
    setMode('list');
    setCurrent(null);
    setPreviewHeader?.(undefined);
    fileActionRef?.current?.updatePreviewHeader?.({
      name: file.name,
      lastModified: file.lastModified,
      icon: file.icon,
    });
  };

  if (mode === 'detail' && current) {
    return (
      <div style={{ padding: 16 }} aria-label="变量详情">
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1, display: 'flex', gap: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowLeftOutlined onClick={handleBack} />
              返回上一级
            </span>
            <div style={{ fontWeight: 600 }}>【{current.name}】详情</div>
          </div>
        </div>
        <h3 style={{ margin: '8px 0' }}>变量详情 - {current.name}</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            rowGap: 8,
          }}
        >
          <div>名称</div>
          <div>{current.name}</div>
          <div>类型</div>
          <div>{current.type}</div>
          <div>分箱方式</div>
          <div>{current.binMethod}</div>
          <div>分箱数</div>
          <div>{current.binCount}</div>
          <div>IV</div>
          <div>{current.iv}</div>
          <div>KS</div>
          <div>{current.ks}</div>
          <div>文件名</div>
          <div>{file.name}</div>
          <div>文件ID</div>
          <div>{file.id || '未指定'}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }} aria-label="变量分析列表">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '8px 6px',
                borderBottom: '1px solid #eee',
              }}
            >
              名称
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '8px 6px',
                borderBottom: '1px solid #eee',
              }}
            >
              类型
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '8px 6px',
                borderBottom: '1px solid #eee',
              }}
            >
              分箱方式
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '8px 6px',
                borderBottom: '1px solid #eee',
              }}
            >
              分箱数
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '8px 6px',
                borderBottom: '1px solid #eee',
              }}
            >
              IV
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '8px 6px',
                borderBottom: '1px solid #eee',
              }}
            >
              KS
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '8px 6px',
                borderBottom: '1px solid #eee',
              }}
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td
                style={{
                  padding: '8px 6px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                {row.name}
              </td>
              <td
                style={{
                  padding: '8px 6px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                {row.type}
              </td>
              <td
                style={{
                  padding: '8px 6px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                {row.binMethod}
              </td>
              <td
                style={{
                  padding: '8px 6px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                {row.binCount}
              </td>
              <td
                style={{
                  padding: '8px 6px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                {row.iv}
              </td>
              <td
                style={{
                  padding: '8px 6px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                {row.ks}
              </td>
              <td
                style={{
                  padding: '8px 6px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                <a
                  role="button"
                  tabIndex={0}
                  aria-label={`查看${row.name}详情`}
                  onClick={() => handleViewDetail(row)}
                  onKeyDown={(e) => e.key === 'Enter' && handleViewDetail(row)}
                  style={{ color: '#1677ff', cursor: 'pointer' }}
                >
                  查看详情
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const WorkspaceFileCustomPreviewFlow: React.FC = () => {
  const [nodes] = useState<(FileNode | GroupNode)[]>([
    {
      name: '自定义预览',
      type: 'word',
      collapsed: false,
      children: [
        {
          id: 'customPreviewListDemo',
          name: '变量分析结果.docx',
          size: '2.3MB',
          lastModified: '08-20 12:30',
          canPreview: true,
        },
        {
          id: 'customPreviewDomID1',
          name: '变量分析说明.html',
          size: '12KB',
          lastModified: '08-20 13:10',
          canPreview: true,
        },
      ],
    },
  ]);
  const previewRef = useRef<VariableAnalysisPreviewRef | null>(null);
  const fileActionRef = useRef<FileActionRef | null>(null);

  const handlePreview = async (
    file: FileNode,
  ): Promise<FileNode | React.ReactNode> => {
    // 场景一：后端返回 JSON 列表数据 → 自定义展示
    if (file.id === 'customPreviewListDemo') {
      return (
        <VariableAnalysisPreview
          ref={previewRef}
          file={file}
          fileActionRef={fileActionRef}
        />
      );
    }

    // 场景二：后端返回 HTML 片段或需要自定义展示 → 直接返回 ReactNode，仅替换内容区
    if (file.id === 'customPreviewDomID1') {
      return (
        <div style={{ padding: 16 }} aria-label="HTML 片段预览">
          <h3 style={{ margin: '8px 0' }}>变量分析说明</h3>
          <p style={{ color: '#555', lineHeight: '20px' }}>
            以下为服务端返回的片段内容（以 ReactNode
            形式直接渲染，仅替换内容区，不改动头部与工具栏）。
          </p>
          <ul style={{ paddingLeft: 18, margin: '12px 0' }}>
            <li>支持列表、标题、段落等基础排版</li>
            <li>可在内部放置代码片段、提示信息等</li>
          </ul>
          <pre
            aria-label="代码示例"
            style={{
              background: '#f6f8fa',
              padding: 12,
              borderRadius: 6,
              overflowX: 'auto',
              border: '1px solid #eee',
            }}
          >
            {`const sum = (a: number, b: number) => a + b;
console.log(sum(1, 2));`}
          </pre>
          <blockquote
            style={{
              borderLeft: '3px solid #ddd',
              paddingLeft: 10,
              color: '#666',
            }}
          >
            该区域完全由业务自定义渲染逻辑控制。
          </blockquote>
        </div>
      );
    }

    return undefined;
  };

  const handleDownload = (file: FileNode) => {
    message.info(`下载文件：${file.name}`);
  };

  const handleGroupDownload = (files: FileNode[]) => {
    message.info(`分组下载：${files.map((f) => f.name).join(', ')}`);
  };

  // 自定义返回示例：返回前先执行自定义逻辑，然后继续默认返回
  const handleBackFromPreview = async (file: FileNode) => {
    // 处于详情态：切回列表态并阻止默认返回（留在预览页）
    if (previewRef.current?.getMode() === 'detail') {
      previewRef.current.toList();
      message.info(`自定义返回：${file.name}`);
      return false;
    }
    // 列表态：允许执行默认返回（退出预览页，回到文件列表）
    return true;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          maxWidth: '600px',
        }}
      >
        <Workspace title="文件管理 - 自定义预览流程">
          <Workspace.File
            tab={{ count: 1 }}
            nodes={nodes}
            onDownload={handleDownload}
            onGroupDownload={handleGroupDownload}
            onPreview={handlePreview}
            onBack={handleBackFromPreview}
            actionRef={fileActionRef}
          />
        </Workspace>
      </div>
    </div>
  );
};

export default WorkspaceFileCustomPreviewFlow;
