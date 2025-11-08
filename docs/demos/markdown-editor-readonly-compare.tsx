import { MarkdownEditor } from '@ant-design/agentic-ui';
import { Input } from 'antd';
import React, { useState } from 'react';

const defaultMarkdown = `# Markdown 编辑器示例

## 功能特性

- **粗体文本**
- *斜体文本*
- ~~删除线~~

## 代码块


\`\`\`javascript
const hello = () => {
  console.log('Hello World!');
};
\`\`\`

## 引用

> 这是一个引用文本示例

## 列表

1. 第一项
2. 第二项
3. 第三项

\`\`\`mermaid
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
 
\`\`\`
`;

export default () => {
  const [value, setValue] = useState(defaultMarkdown);

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: 16 }}>可编辑模式</h3>
        <Input.TextArea
          style={{ height: '500px' }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: 16 }}>只读模式</h3>
        <MarkdownEditor
          width="100%"
          height="500px"
          readonly
          initValue={value}
        />
      </div>
    </div>
  );
};
