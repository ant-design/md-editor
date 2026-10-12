import { MarkdownEditor, MarkdownEditorPlugin } from '@ant-design/agentic-ui';
import React, { useState } from 'react';

// 自定义代码块插件 - 将特殊的代码块转换为警告格式
const customCodeBlockPlugin: MarkdownEditorPlugin = {
  parseMarkdown: [
    {
      match: (node: any) => node.type === 'code' && node.lang === 'warning',
      convert: (node: any) =>
        ({
          type: 'warning-code',
          language: 'text',
          value: node.value,
          children: [{ text: node.value }],
        }) as any,
    },
  ],
  toMarkdown: [
    {
      match: (node: any) => node.type === 'warning-code',
      convert: (node: any) => ({
        type: 'code',
        lang: 'warning',
        value: node.value || '',
      }),
    },
  ],
  elements: {
    'warning-code': ({ attributes, children, element }) => (
      <div
        {...attributes}
        style={{
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#fff5f5',
          margin: '16px 0',
        }}
      >
        <div
          style={{
            color: '#ff6b6b',
            fontWeight: 'bold',
            marginBottom: '8px',
            fontSize: '13px',
          }}
        >
          ⚠️ 警告
        </div>
        <pre
          style={{
            margin: 0,
            fontFamily: 'monospace',
            color: '#333',
            whiteSpace: 'pre-wrap',
          }}
        >
          {(element as any).value}
        </pre>
        {children}
      </div>
    ),
  },
};

// 自定义引用块插件 - 将特殊的引用块转换为提示格式
const customBlockquotePlugin: MarkdownEditorPlugin = {
  parseMarkdown: [
    {
      match: (node: any) => {
        // 检查是否是包含 "💡 提示:" 的引用块
        if (
          node.type === 'blockquote' &&
          node.children?.[0]?.children?.[0]?.value?.startsWith('💡 提示:')
        ) {
          return true;
        }
        return false;
      },
      convert: (node: any) =>
        ({
          type: 'tip-blockquote',
          children: node.children || [],
        }) as any,
    },
  ],
  toMarkdown: [
    {
      match: (node: any) => node.type === 'tip-blockquote',
      convert: (node: any) => ({
        type: 'blockquote',
        children: node.children || [],
      }),
    },
  ],
  elements: {
    'tip-blockquote': ({ attributes, children }) => (
      <div
        {...attributes}
        style={{
          border: '2px solid #4dabf7',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#f0f8ff',
          margin: '16px 0',
          borderLeft: '4px solid #4dabf7',
        }}
      >
        {children}
      </div>
    ),
  },
};

const initialValue = `# toMarkdown 插件演示

这个演示展示了如何使用 toMarkdown 插件来自定义 Markdown 输出格式。

## 警告代码块

下面是一个警告代码块，它会被特殊处理：

\`\`\`warning
这是一个重要的警告信息！
请仔细阅读并遵循相关指导。
系统可能会因为不当操作而出现问题。
\`\`\`

## 提示引用块

> 💡 提示: 这是一个特殊的提示引用块
> 它会被渲染为蓝色的提示框
> 用于提供有用的建议和信息

## 普通内容

这些是普通的内容，不会被插件特殊处理：

\`\`\`javascript
console.log("这是普通的 JavaScript 代码");
\`\`\`

> 这是普通的引用块
> 不会被特殊处理

## 说明

- 使用 \`warning\` 语言标识的代码块会被转换为警告框
- 以 "💡 提示:" 开头的引用块会被转换为提示框
- 其他内容保持原样
- 导出 Markdown 时，自定义元素会被正确转换回原始格式
`;

export default function ToMarkdownPluginDemo() {
  const [markdown, setMarkdown] = useState('');

  const handleExportMarkdown = () => {
    // 这里需要从编辑器实例获取 Markdown 内容
    // 在实际使用中，你可以通过 ref 访问编辑器实例
    console.log('导出的 Markdown:', markdown);
  };

  return (
    <div style={{ padding: '12px' }}>
      <h1>toMarkdown 插件演示</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={handleExportMarkdown}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          导出 Markdown
        </button>
      </div>

      <MarkdownEditor
        initValue={initialValue}
        plugins={[customCodeBlockPlugin, customBlockquotePlugin]}
        onChange={(value) => {
          setMarkdown(value);
          console.log('编辑器内容变化:', value);
        }}
      />

      {markdown && (
        <div style={{ marginTop: '20px' }}>
          <h3>导出的 Markdown:</h3>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px',
            }}
          >
            {markdown}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>initValue</strong>: 编辑器的初始内容值
          </li>
          <li>
            <strong>plugins</strong>: 插件数组，用于扩展编辑器功能
          </li>
          <li>
            <strong>plugins[].parseMarkdown</strong>: parseMarkdown 插件配置数组
          </li>
          <li>
            <strong>plugins[].toMarkdown</strong>: toMarkdown 插件配置数组
          </li>
          <li>
            <strong>plugins[].elements</strong>: 自定义元素渲染配置
          </li>
          <li>
            <strong>parseMarkdown[].match</strong>:
            匹配函数，用于判断是否应用转换
          </li>
          <li>
            <strong>parseMarkdown[].convert</strong>:
            转换函数，用于转换匹配的节点
          </li>
          <li>
            <strong>toMarkdown[].match</strong>: 匹配函数，用于判断是否应用转换
          </li>
          <li>
            <strong>toMarkdown[].convert</strong>: 转换函数，用于转换匹配的节点
          </li>
          <li>
            <strong>onChange</strong>: 内容变化时的回调函数
          </li>
        </ul>
      </div>
    </div>
  );
}
