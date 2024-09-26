import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';
import { Button } from 'antd';
import React, { useEffect } from 'react';

export default () => {
  const editorRef = React.useRef<MarkdownEditorInstance>();
  useEffect(() => {
    const insertMarkdown = () => {
      editorRef.current?.store.setMDContent(
        `
<!-- {"elementType":"column"} -->       
| column1                                                                         | column2 |
| ------------------------------------------------------------------------------- | ------- |
| ![](blob:http://localhost:8000/b3fb90af-d975-4954-8299-88b06c03673e) | xxxx    |
  
        
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}
 \`\`\`

 <!-- {"submitText":"Al 辅助","chartType": "bar", "x":"业务", "y":"2021Q1"} -->
 \`\`\`schema
[{
    fieldProps: {
      nodeData: {
        id: "d451a556d866ba7b",
        topic: "new topic",
        root: true,
        children: [
          {
            topic: "new node",
            id: "d451a6f027c33b1f",
            direction: 0,
            children: [
              {
                topic: "new node",
                id: "d451a724b7c10970",
              },
              {
                topic: "new node",
                id: "d451a77ca7348eae",
              },
              {
                topic: "new node",
                id: "d451a78e1ec7181c",
              },
            ],
          },
        ],
      },
    },
  },
]
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
          border: '1px solid #000',
          width: '40vw',
          borderRadius: 16,
          margin: '20px auto',
        }}
      >
        <MarkdownEditor
          toc={false}
          editorRef={editorRef}
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
              <Button
                key="clear"
                onClick={() => {
                  editorRef.current?.store.setMDContent('');
                  editorRef.current?.store.updateNodeList([
                    {
                      type: 'head',
                      level: 2,
                      children: [{ text: '' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ text: '' }],
                    },
                  ]);
                }}
              >
                清空
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
          titlePlaceholderContent="请输入公司标题"
          onChange={(e, c) => console.log(e, c)}
          width={'60vw'}
          height={'500px'}
        />
      </div>
      <div
        style={{
          border: '1px solid #f0f0f0',
          width: '40vw',
          margin: '20px auto',
        }}
      >
        <MarkdownEditor
          toc={false}
          initValue={`
<!-- {"elementType":"column"} -->       
| column1                                                                         | column2 |
| ------------------------------------------------------------------------------- | ------- |
| ![](blob:http://localhost:8000/b3fb90af-d975-4954-8299-88b06c03673e) | xxxx    |
              
                    
\`\`\`java
  public class HelloWorld {
     public static void main(String[] args) {
        System.out.println("Hello, World");
     }
}
\`\`\`
             `}
          readonly
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
    </div>
  );
};
