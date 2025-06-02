import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';
import { Button } from 'antd';
import React from 'react';
import { defaultValue } from './shared/defaultValue';

export default () => {
  const [value, setValue] = React.useState(() => defaultValue);

  const markdownEditorRef = React.useRef<MarkdownEditorInstance>();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fff',
      }}
    >
      <MarkdownEditor
        editorRef={markdownEditorRef}
        toc={false}
        toolBar={{
          enable: true,
          hideTools: ['code', 'inline-code'],
          extra: [
            <Button key="save" type="primary" size="small">
              Save
            </Button>,
          ],
        }}
        comment={{
          enable: true,
        }}
        readonly
        reportMode
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
        style={{
          width: '50vw',
          margin: '0 auto',
          height: '100vh',
          border: '1px solid #e5e5e9',
        }}
        initValue={value}
      />
      <MarkdownEditor
        toc={false}
        toolBar={{
          enable: true,
          hideTools: ['code', 'inline-code'],
          extra: [
            <Button
              key="save"
              type="primary"
              size="small"
              onClick={() => {
                setValue(value);
                markdownEditorRef?.current?.store?.setMDContent(value);
              }}
            >
              Save
            </Button>,
          ],
        }}
        comment={{
          enable: true,
        }}
        reportMode
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
        style={{
          width: '50vw',
          margin: '0 auto',
          border: '1px solid #e5e5e9',
          height: '100vh',
        }}
        onChange={(value, _) => {
          console.log(value, _);
          setValue(value);
        }}
        initValue={defaultValue}
      />
    </div>
  );
};
