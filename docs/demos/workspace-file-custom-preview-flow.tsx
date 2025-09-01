import { Workspace } from '@ant-design/md-editor';
import type { FileNode, GroupNode } from '@ant-design/md-editor/Workspace/types';
import React, { useMemo, useState } from 'react';

// 支持“列表 -> 查看详情 -> 返回列表”的自定义预览组件（独立示例）
const VariableAnalysisPreview: React.FC<{
  file: FileNode;
  setPreviewHeader?: (h: React.ReactNode) => void;
  back?: () => void;
  download?: () => void;
}> = ({ file, setPreviewHeader, back }) => {
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
    setPreviewHeader?.(
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: 12, color: '#888' }}>详情的生成时间：2023-12-21 10:30:56</div>
        </div>
      </div>,
    );
  };

  const handleBack = () => {
    setMode('list');
    setCurrent(null);
    setPreviewHeader?.(undefined);
  };

  if (mode === 'detail' && current) {
    return (
      <div style={{ padding: 16 }} aria-label="变量详情">
        <button
          type="button"
          onClick={handleBack}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
          aria-label="返回列表"
          style={{ marginBottom: 12 }}
        >
          返回
        </button>
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

  if (mode === 'list') {
    setPreviewHeader?.(
      <div>
        <div onClick={back}>返回</div>
        自定义预览列表
      </div>,
    );
  }

  return (
    <div style={{ padding: 16 }} aria-label="变量分析列表">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #eee' }}>名称</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #eee' }}>类型</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #eee' }}>分箱方式</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #eee' }}>分箱数</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #eee' }}>IV</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #eee' }}>KS</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #eee' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: '8px 6px', borderBottom: '1px solid #f5f5f5' }}>{row.name}</td>
              <td style={{ padding: '8px 6px', borderBottom: '1px solid #f5f5f5' }}>{row.type}</td>
              <td style={{ padding: '8px 6px', borderBottom: '1px solid #f5f5f5' }}>{row.binMethod}</td>
              <td style={{ padding: '8px 6px', borderBottom: '1px solid #f5f5f5' }}>{row.binCount}</td>
              <td style={{ padding: '8px 6px', borderBottom: '1px solid #f5f5f5' }}>{row.iv}</td>
              <td style={{ padding: '8px 6px', borderBottom: '1px solid #f5f5f5' }}>{row.ks}</td>
              <td style={{ padding: '8px 6px', borderBottom: '1px solid #f5f5f5' }}>
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
};

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
          canDownload: false,
        },
        // 场景二：仅替换内容区（后端返回 HTML 片段 / 自定义展示）
        {
          id: 'customPreviewDomID1',
          name: '变量分析说明.html',
          size: '12KB',
          lastModified: '08-20 13:10',
          canPreview: true,
          canDownload: false,
        },
      ],
    },
  ]);

  const handlePreview = async (
    file: FileNode,
  ): Promise<FileNode | React.ReactNode> => {
    if (file.id === 'customPreviewListDemo') {
      return <VariableAnalysisPreview file={file} />;
    }

    // 场景二：后端返回 HTML 片段或需要自定义展示 → 直接返回 ReactNode，仅替换内容区
    if (file.id === 'customPreviewDomID1') {
      return (
        <div style={{ padding: 16 }} aria-label="HTML 片段预览">
          <h3 style={{ margin: '8px 0' }}>变量分析说明</h3>
          <p style={{ color: '#555', lineHeight: '20px' }}>
            以下为服务端返回的片段内容（以 ReactNode 形式直接渲染，仅替换内容区，不改动头部与工具栏）。
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
          <blockquote style={{ borderLeft: '3px solid #ddd', paddingLeft: 10, color: '#666' }}>
            该区域完全由业务自定义渲染逻辑控制。
          </blockquote>
        </div>
      );
    }

    return undefined;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          maxWidth: '600px',
        }}
      >
        <Workspace title="文件管理 - 自定义预览流程">
          <Workspace.File
            tab={{ count: 1 }}
            nodes={nodes}
            onPreview={handlePreview}
          />
        </Workspace>
      </div>
    </div>
  );
};

export default WorkspaceFileCustomPreviewFlow; 
