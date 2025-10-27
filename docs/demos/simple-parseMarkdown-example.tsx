import { MarkdownEditor, MarkdownEditorPlugin } from '@ant-design/agentic-ui';
import React from 'react';

// 简单的自定义代码块插件
const customCodePlugin: MarkdownEditorPlugin = {
  parseMarkdown: [
    {
      match: (node) => node.type === 'code' && (node as any).lang === 'alert',
      convert: (node) => {
        const codeNode = node as any;
        return {
          type: 'code',
          language: 'text',
          value: `🚨 警告: ${codeNode.value}`,
          children: [{ text: `🚨 警告: ${codeNode.value}` }],
        };
      },
    },
  ],
};

const markdown = `# parseMarkdown 插件示例

这是一个简单的 parseMarkdown 插件示例。

## 普通代码块

\`\`\`javascript
console.log("这是普通的 JavaScript 代码");
\`\`\`

## 自定义警告代码块

下面的代码块会被插件特殊处理：

\`\`\`alert
这是一个重要的警告信息！
请注意这个内容会被特殊处理。
\`\`\`

## 说明

- 普通的代码块不会被插件影响
- 使用 \`alert\` 语言标识的代码块会被转换为警告格式
- 插件会在内容前添加警告图标`;

export default function SimpleParseMarkdownExample() {
  return (
    <>
      <div style={{ height: '500px' }}>
        <h2>简单的 parseMarkdown 插件示例</h2>
        <MarkdownEditor
          initValue={markdown}
          plugins={[customCodePlugin]}
          onChange={(value) => {
            console.log('内容变化:', value);
          }}
        />
      </div>

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
            <strong>parseMarkdown[].match</strong>:
            匹配函数，用于判断是否应用转换
          </li>
          <li>
            <strong>parseMarkdown[].convert</strong>:
            转换函数，用于转换匹配的节点
          </li>
          <li>
            <strong>onChange</strong>: 内容变化时的回调函数
          </li>
        </ul>
      </div>
    </>
  );
}
