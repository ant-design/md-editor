import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';
import { Button } from 'antd';
import React from 'react';

export default () => {
  const tabRef = React.useRef<MarkdownEditorInstance>();
  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        width: '60vw',
        margin: '20px auto',
      }}
    >
      <MarkdownEditor
        toc={false}
        editorRef={tabRef}
        toolBar={{
          enable: true,
          extra: [
            <Button
              key="插入"
              onClick={() => {
                tabRef.current?.store.setMDContent(
                  `# 标题
**粗体**
*斜体*
~~删除线~~
\`行内代码\`
\`\`\`js
// 代码块
\`\`\`
- 无序列表
1. 有序列表`,
                );
              }}
            >
              <span>插入一个markdown</span>
            </Button>,
          ],
        }}
        image={{
          upload: async (fileList) => {
            return new Promise((resolve, reject) => {
              const file = fileList[0];
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                const base64 = reader.result?.toString() || '';
                resolve(base64);
              });
              reader.addEventListener('error', () => {
                reject(new Error('message'));
              });
              reader.readAsDataURL(file);
            });
          },
        }}
        width={'60vw'}
        height={'500px'}
      />
    </div>
  );
};
