import type { AttachmentFile, UploadResponse } from '@ant-design/agentic-ui';
import { MarkdownInputField } from '@ant-design/agentic-ui';
import { Card, Space } from 'antd';
import React, { useState } from 'react';

/**
 * uploadWithResponse 使用演示
 * 展示如何使用新的上传接口返回完整的响应对象
 */
const UploadWithResponseDemo: React.FC = () => {
  const [value, setValue] = useState('尝试上传文件，查看完整的上传响应信息...');
  const [fileMap, setFileMap] = useState<Map<string, AttachmentFile>>(
    new Map(),
  );

  // 模拟文件上传 - 返回完整的响应对象
  const handleUploadWithResponse = async (
    file: AttachmentFile,
    index: number,
  ): Promise<UploadResponse> => {
    console.log('上传文件:', file.name, '索引:', index);

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 模拟不同的上传结果
    const random = Math.random();

    if (random > 0.8) {
      // 20% 概率模拟上传失败
      return {
        contentId: null,
        errorMessage: '文件上传失败：服务器返回 500 错误',
        fileId: '',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: '',
        uploadStatus: 'FAIL',
      };
    }

    // 80% 概率成功
    const fileId = `${file.name.replace(/\.[^/.]+$/, '')}-${Date.now()}`;
    return {
      contentId: `content-${Date.now()}`,
      errorMessage: null,
      fileId: fileId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type.split('/')[1] || 'unknown',
      fileUrl: `https://example.com/files/${fileId}.${file.type.split('/')[1]}`,
      uploadStatus: 'SUCCESS',
    };
  };

  // 处理文件映射变化
  const handleFileMapChange = (files?: Map<string, AttachmentFile>) => {
    if (files) {
      setFileMap(files);
    }
  };

  // 渲染文件信息
  const renderFileInfo = () => {
    if (fileMap.size === 0) return null;
    console.log('fileMap：', fileMap);
    const filesData = Array.from(fileMap.entries());

    return (
      <Card size="small" title="上传响应详情">
        <pre
          style={{
            background: '#f5f5f5',
            padding: 12,
            borderRadius: 4,
            overflow: 'auto',
            maxHeight: 400,
          }}
        >
          {JSON.stringify(filesData, null, 2)}
        </pre>
        打开控制台查看fileMap： “fileMap：”
      </Card>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>uploadWithResponse 使用演示</h2>
      <p>
        使用 <code>uploadWithResponse</code>{' '}
        接口可以返回完整的上传响应对象，包含文件ID、URL、状态等详细信息。
      </p>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 基本使用 */}
        <Card title="基本使用" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <MarkdownInputField
              value={value}
              onChange={setValue}
              attachment={{
                enable: true,
                uploadWithResponse: handleUploadWithResponse,
                fileMap: fileMap,
                onFileMapChange: handleFileMapChange,
              }}
              placeholder="点击附件按钮上传文件，查看完整的响应信息..."
            />

            {fileMap.size > 0 && (
              <div style={{ marginTop: 16 }}>{renderFileInfo()}</div>
            )}
          </Space>
        </Card>

        {/* 使用说明 */}
        <Card title="使用说明" size="small">
          <Space direction="vertical">
            <div>
              <strong>1. 接口定义：</strong>
              <pre
                style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}
              >
                {`uploadWithResponse?: (
  file: AttachmentFile,
  index: number
) => Promise<UploadResponse>;`}
              </pre>
            </div>

            <div>
              <strong>2. 返回对象 UploadResponse：</strong>
              <pre
                style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}
              >
                {`{
  contentId?: string | null;      // 内容ID
  errorMessage?: string | null;   // 错误消息
  fileId: string;                 // 文件ID
  fileName: string;               // 文件名
  fileSize?: number | null;       // 文件大小（字节）
  fileType: string;               // 文件类型
  fileUrl: string;                // 文件URL
  uploadStatus: 'SUCCESS' | 'FAIL' | string;  // 上传状态
}`}
              </pre>
            </div>

            <div>
              <strong>3. 访问响应数据：</strong>
              <pre
                style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}
              >
                {`onFileMapChange={(fileMap) => {
  fileMap?.forEach(file => {
    // 访问完整的上传响应
    const response = file.uploadResponse;
    console.log('文件ID:', response?.fileId);
    console.log('文件URL:', response?.fileUrl);
    console.log('上传状态:', response?.uploadStatus);
  });
}}`}
              </pre>
            </div>

            <div>
              <strong>4. 特性：</strong>
              <ul>
                <li>✅ 返回完整的响应对象，包含更多元信息</li>
                <li>✅ 响应数据自动存储在 file.uploadResponse 中</li>
                <li>✅ 支持自定义错误消息（errorMessage）</li>
                <li>✅ 优先级高于旧的 upload 接口</li>
                <li>✅ 向后兼容，可与 upload 接口共存</li>
              </ul>
            </div>

            <div>
              <strong>5. 注意事项：</strong>
              <ul>
                <li>
                  如果同时提供 uploadWithResponse 和 upload，会优先使用
                  uploadWithResponse
                </li>
                <li>uploadStatus 为 'SUCCESS' 时视为上传成功</li>
                <li>失败时可通过 errorMessage 返回具体的错误信息</li>
              </ul>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default UploadWithResponseDemo;
