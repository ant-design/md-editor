import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        width: '500px',
        margin: '20px auto',
      }}
    >
      <MarkdownEditor
        toc={false}
        toolBar={{
          enable: true,
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
        width={'500px'}
        height={'500px'}
      />
    </div>
  );
};
