import React, { useState } from 'react';
import { MarkdownInputField } from '../../src/MarkdownInputField/MarkdownInputField';

/**
 * 粘贴配置演示组件
 *
 * 展示如何使用 MarkdownInputField 的粘贴配置功能
 */
export const PasteConfigDemo: React.FC = () => {
  const [value, setValue] = useState('');

  // 粘贴配置示例 1: 只允许纯文本
  const plainTextOnlyConfig = {
    enabled: true,
    allowedTypes: ['text/plain'] as Array<
      | 'text/plain'
      | 'text/html'
      | 'text/markdown'
      | 'application/x-slate-md-fragment'
      | 'Files'
    >,
  };

  // 粘贴配置示例 2: 允许 HTML 和 Markdown
  const htmlMarkdownConfig = {
    enabled: true,
    allowedTypes: ['text/html', 'text/markdown'] as Array<
      | 'text/plain'
      | 'text/html'
      | 'text/markdown'
      | 'application/x-slate-md-fragment'
      | 'Files'
    >,
  };

  // 粘贴配置示例 3: 禁用粘贴功能
  const disabledConfig = {
    enabled: false,
  };

  // 粘贴配置示例 4: 允许所有类型
  const allTypesConfig = {
    enabled: true,
    allowedTypes: [
      'application/x-slate-md-fragment',
      'text/html',
      'Files',
      'text/markdown',
      'text/plain',
    ] as Array<
      | 'text/plain'
      | 'text/html'
      | 'text/markdown'
      | 'application/x-slate-md-fragment'
      | 'Files'
    >,
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>MarkdownInputField 粘贴配置演示</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>功能说明</h2>
        <p>粘贴配置允许你控制 MarkdownInputField 支持哪些类型的粘贴内容：</p>
        <ul>
          <li>
            <code>application/x-slate-md-fragment</code> - Slate Markdown 片段
          </li>
          <li>
            <code>text/html</code> - HTML 内容
          </li>
          <li>
            <code>Files</code> - 文件
          </li>
          <li>
            <code>text/markdown</code> - Markdown 文本
          </li>
          <li>
            <code>text/plain</code> - 纯文本
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>示例 1: 只允许纯文本</h2>
        <MarkdownInputField
          value={value}
          onChange={setValue}
          placeholder="只能粘贴纯文本内容..."
          pasteConfig={plainTextOnlyConfig}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>示例 2: 允许 HTML 和 Markdown</h2>
        <MarkdownInputField
          value={value}
          onChange={setValue}
          placeholder="可以粘贴 HTML 和 Markdown 内容..."
          pasteConfig={htmlMarkdownConfig}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>示例 3: 禁用粘贴功能</h2>
        <MarkdownInputField
          value={value}
          onChange={setValue}
          placeholder="粘贴功能已被禁用..."
          pasteConfig={disabledConfig}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>示例 4: 允许所有类型</h2>
        <MarkdownInputField
          value={value}
          onChange={setValue}
          placeholder="可以粘贴任何类型的内容..."
          pasteConfig={allTypesConfig}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>使用说明</h2>
        <ol>
          <li>
            尝试从其他应用复制不同类型的内容（纯文本、HTML、Markdown、文件等）
          </li>
          <li>粘贴到上面的不同示例输入框中</li>
          <li>观察哪些类型被允许或阻止</li>
          <li>在示例 3 中，任何粘贴操作都会被阻止</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>代码示例</h2>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '5px',
            overflow: 'auto',
          }}
        >
          {`// 只允许纯文本
<MarkdownInputField
  pasteConfig={{
    enabled: true,
    allowedTypes: ['text/plain']
  }}
/>

// 允许 HTML 和 Markdown
<MarkdownInputField
  pasteConfig={{
    enabled: true,
    allowedTypes: ['text/html', 'text/markdown']
  }}
/>

// 禁用粘贴功能
<MarkdownInputField
  pasteConfig={{
    enabled: false
  }}
/>

// 允许所有类型（默认行为）
<MarkdownInputField
  pasteConfig={{
    enabled: true,
    allowedTypes: [
      'application/x-slate-md-fragment',
      'text/html',
      'Files',
      'text/markdown',
      'text/plain'
    ]
  }}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default PasteConfigDemo;
