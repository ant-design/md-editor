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
        width={'500px'}
        height={'500px'}
      />
    </div>
  );
};
