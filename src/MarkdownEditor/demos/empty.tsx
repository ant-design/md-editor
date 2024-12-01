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
                if (typeof file === 'string') {
                  fetch(file)
                    .then((res) => res.blob())
                    .then((blob) => {
                      console.log(blob);
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
\`\`\`java
  public class HelloWorld {
     public static void main(String[] args) {
        System.out.println("Hello, World");
     }
}
\`\`\`


\`\`\`json
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://json-schema.org/draft/2020-12/schema",
    "$vocabulary": {
        "https://json-schema.org/draft/2020-12/vocab/core": true,
        "https://json-schema.org/draft/2020-12/vocab/applicator": true,
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
        "https://json-schema.org/draft/2020-12/vocab/validation": true,
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true,
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
        "https://json-schema.org/draft/2020-12/vocab/content": true
    },
    "$dynamicAnchor": "meta",
    "title": "Core and Validation specifications meta-schema",
    "allOf": [
        {
            "$ref": "meta/core"
        },
        {
            "$ref": "meta/applicator"
        },
        {
            "$ref": "meta/unevaluated"
        },
        {
            "$ref": "meta/validation"
        },
        {
            "$ref": "meta/meta-data"
        },
        {
            "$ref": "meta/format-annotation"
        },
        {
            "$ref": "meta/content"
        }
    ],
    "type": [
        "object",
        "boolean"
    ],
    "$comment": "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
    "properties": {
        "definitions": {
            "$comment": ""definitions" has been replaced by "$defs".",
            "type": "object",
            "additionalProperties": {
                "$dynamicRef": "#meta"
            },
            "deprecated": true,
            "default": {}
        },
        "dependencies": {
            "$comment": ""dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.",
            "type": "object",
            "additionalProperties": {
                "anyOf": [
                    {
                        "$dynamicRef": "#meta"
                    },
                    {
                        "$ref": "meta/validation#/$defs/stringArray"
                    }
                ]
            },
            "deprecated": true,
            "default": {}
        },
        "$recursiveAnchor": {
            "$comment": ""$recursiveAnchor" has been replaced by "$dynamicAnchor".",
            "$ref": "meta/core#/$defs/anchorString",
            "deprecated": true
        },
        "$recursiveRef": {
            "$comment": ""$recursiveRef" has been replaced by "$dynamicRef".",
            "$ref": "meta/core#/$defs/uriReferenceString",
            "deprecated": true
        }
    }
}
\`\`\`

\`\`\`sql
SELECT employees.name, departments.department_name FROM employees INNER JOIN departments ON employees.department_id = departments.id;
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
                if (typeof file === 'string') {
                  fetch(file)
                    .then((res) => res.blob())
                    .then((blob) => {
                      console.log(blob);
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
