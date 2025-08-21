import { MarkdownEditor, MarkdownEditorPlugin } from '@ant-design/md-editor';
import React from 'react';

// 自定义代码块插件
const customCodeBlockPlugin: MarkdownEditorPlugin = {
  parseMarkdown: [
    {
      match: (node) => node.type === 'code' && (node as any).lang === 'custom',
      convert: (node) => {
        const codeNode = node as any;
        return {
          type: 'code',
          language: 'javascript', // 强制转换为 JavaScript 语法高亮
          value: `// 自定义代码块\n${codeNode.value}`,
          children: [{ text: `// 自定义代码块\n${codeNode.value}` }],
        };
      },
    },
  ],
  elements: {
    code: ({ attributes, children, element }) => {
      if (
        (element as any).language === 'javascript' &&
        (element as any).value?.startsWith('// 自定义代码块')
      ) {
        return (
          <div
            {...attributes}
            style={{
              border: '2px solid #007acc',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
            }}
          >
            <div
              style={{
                color: '#007acc',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              🎨 自定义代码块
            </div>
            <pre
              style={{ margin: 0, fontFamily: 'Monaco, Consolas, monospace' }}
            >
              <code>{children}</code>
            </pre>
          </div>
        );
      }
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    },
  },
};

// 自定义引用块插件
const customBlockquotePlugin: MarkdownEditorPlugin = {
  parseMarkdown: [
    {
      match: (node) => node.type === 'blockquote',
      convert: (node) => ({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [{ text: '💡 提示：这是一个自定义处理的引用块' }],
          },
          ...(node as any).children.map((child: any) => ({
            type: 'paragraph',
            children: child.children || [{ text: child.value || '' }],
          })),
        ],
      }),
    },
  ],
  elements: {
    blockquote: ({ attributes, children }) => (
      <blockquote
        {...attributes}
        style={{
          borderLeft: '4px solid #ffa500',
          paddingLeft: '16px',
          margin: '16px 0',
          backgroundColor: '#fff8e1',
          borderRadius: '4px',
          padding: '16px',
        }}
      >
        {children}
      </blockquote>
    ),
  },
};

const initialValue = `# parseMarkdown 插件演示

这个演示展示了如何使用 parseMarkdown 插件来自定义 Markdown 解析行为。

## 自定义代码块

下面是一个使用 \`custom\` 语言标识的代码块，它会被插件特殊处理：

\`\`\`custom
console.log("这是一个自定义代码块");
alert("它会被特殊渲染！");
\`\`\`

## 普通代码块

这是一个普通的 JavaScript 代码块，不会被特殊处理：

\`\`\`javascript
console.log("这是普通的代码块");
\`\`\`

## 自定义引用块

下面的引用块会被插件特殊处理：

> 这是一个引用块
> 它会被自定义插件处理
> 添加特殊的样式和提示信息

## 普通段落

这是一个普通的段落，不会被插件影响。`;

export default function ParseMarkdownPluginDemo() {
  return (
    <div style={{ height: '600px' }}>
      <h2>parseMarkdown 插件演示</h2>
      <p>
        这个示例展示了如何使用 parseMarkdown 插件来自定义 Markdown 解析行为。
      </p>

      <MarkdownEditor
        initValue={initialValue}
        plugins={[customCodeBlockPlugin, customBlockquotePlugin]}
        onChange={(value) => {
          console.log('Editor value changed:', value);
        }}
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>initValue</code> - 初始化的 Markdown
            内容，包含自定义代码块和引用块示例
          </li>
          <li>
            <code>plugins</code> - 插件数组，包含自定义代码块插件和引用块插件
          </li>
          <li>
            <code>onChange</code> - 内容变化回调函数，输出到控制台
          </li>
          <li>
            <code>customCodeBlockPlugin</code> - 自定义代码块插件，处理 custom
            语言标识的代码块
          </li>
          <li>
            <code>customBlockquotePlugin</code> -
            自定义引用块插件，为引用块添加特殊样式
          </li>
          <li>
            <code>parseMarkdown</code> - 解析 Markdown 的插件配置
          </li>
          <li>
            <code>elements</code> - 自定义元素渲染配置
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3>插件说明：</h3>
        <ul>
          <li>
            <strong>自定义代码块插件</strong>：将 <code>```custom</code>{' '}
            代码块转换为带有特殊样式的 JavaScript 代码块
          </li>
          <li>
            <strong>自定义引用块插件</strong>
            ：为所有引用块添加提示信息和特殊样式
          </li>
        </ul>
      </div>
    </div>
  );
}
