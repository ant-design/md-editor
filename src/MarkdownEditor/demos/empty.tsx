import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        width: '40vw',
      }}
    >
      <MarkdownEditor
        toc={false}
        toolBar={{
          enable: true,
        }}
        width={'40vw'}
        height={'40vh'}
      />
    </div>
  );
};
