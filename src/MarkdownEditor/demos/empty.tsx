import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';
import { Button } from 'antd';
import React, { useEffect } from 'react';

export default () => {
  const tabRef = React.useRef<MarkdownEditorInstance>();
  useEffect(() => {
    const insertMarkdown = () => {
      tabRef.current?.store.setMDContent(
        `## 标题
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
    };
    insertMarkdown();
  }, []);
  return (
    <>
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
**粗体**`,
                  );
                }}
              >
                <span>插入一个markdown</span>
              </Button>,
            ],
          }}
          image={{
            upload: async (fileList) => {
              return new Promise((resolve) => {
                const file = fileList[0];
                const url = URL.createObjectURL(file);
                resolve(url);
              });
            },
          }}
          onChange={(e, c) => console.log(e, c)}
          width={'60vw'}
          height={'500px'}
        />
      </div>
    </>
  );
};
