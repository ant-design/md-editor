import { MarkdownEditor, parserMdToSchema } from '@ant-design/md-editor';
import React from 'react';

const defaultValue = `
![](https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*9F0qRYV8EjUAAAAAAAAAAAAADml6AQ/original?width=200&height=200)
![](https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*9F0qRYV8EjUAAAAAAAAAAAAADml6AQ/original?width=200&height=200)
![](https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*9F0qRYV8EjUAAAAAAAAAAAAADml6AQ/origina?width=400&height=400)
`;
export default () => {
  console.log(parserMdToSchema(defaultValue));
  return (
    <>
      <MarkdownEditor
        width={'100vw'}
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
        initValue={defaultValue}
        onChange={(e, value) => {
          console.log(e, value);
        }}
      />
      <MarkdownEditor
        readonly
        width={'100vw'}
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
          render: (props) => {
            return (
              <img
                {...props}
                style={{
                  border: '2px solid red',
                }}
              />
            );
          },
        }}
        initValue={defaultValue}
      />
    </>
  );
};
