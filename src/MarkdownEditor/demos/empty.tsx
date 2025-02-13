import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';
import { Button } from 'antd';
import React, { useEffect } from 'react';

export default () => {
  const editorRef = React.useRef<MarkdownEditorInstance>();
  useEffect(() => {
    const insertMarkdown = () => {
      editorRef.current?.store.setMDContent(
        `        
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}
 \`\`\`

 `,
      );
    };
    insertMarkdown();
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div
        style={{
          border: '1px solid #f0f0f0',
          width: '40vw',
          margin: '20px auto',
        }}
      >
        <MarkdownEditor
          reportMode
          toc={false}
          initValue={`             
\`\`\`java
  public class HelloWorld {
     public static void main(String[] args) {
        System.out.println("Hello, World");
     }
}
\`\`\`
             `}
          toolBar={{
            min: true,
            enable: true,
            extra: [
              <Button
                key="插入"
                onClick={() => {
                  editorRef.current?.store.setMDContent(
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
                if (typeof file === 'string') {
                  fetch(file)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const url = URL.createObjectURL(blob);
                      resolve(url);
                    });
                } else {
                  const url = URL.createObjectURL(file);
                  resolve(url);
                }
              });
            },
          }}
          onChange={(e, c) => console.log(e, c)}
          width={'60vw'}
          height={'500px'}
        />
      </div>
    </div>
  );
};
