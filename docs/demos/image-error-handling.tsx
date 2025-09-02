import { MarkdownEditor } from '@ant-design/md-editor';
import React from 'react';

const ImageErrorHandlingDemo: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>图片加载失败处理演示</h2>
      <p>当图片加载失败时，会自动转换为可点击的链接：</p>

      <MarkdownEditor
        initValue={[
          {
            type: 'paragraph',
            children: [{ text: '正常图片：' }],
          },
          {
            type: 'media',
            url: 'https://picsum.photos/400/300',
            alt: '正常图片',
            children: [{ text: '' }],
          },
          {
            type: 'paragraph',
            children: [{ text: '无效图片URL（会显示为链接）：' }],
          },
          {
            type: 'media',
            url: 'https://invalid-image-url.com/image.jpg',
            alt: '无效图片',
            children: [{ text: '' }],
          },
          {
            type: 'paragraph',
            children: [{ text: '另一个无效图片：' }],
          },
          {
            type: 'media',
            url: 'https://example.com/nonexistent-image.png',
            alt: '不存在的图片',
            children: [{ text: '' }],
          },
        ]}
        readonly
        style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}
      />

      <div style={{ marginTop: '20px' }}>
        <h3>功能说明：</h3>
        <ul>
          <li>当图片URL无效或加载失败时，会自动显示为可点击的链接</li>
          <li>链接样式为蓝色，带有虚线边框，便于识别</li>
          <li>点击链接可以在新标签页中打开原始URL</li>
          <li>支持alt文本显示，如果没有alt则显示URL</li>
          <li>在编辑模式和只读模式下都有效</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageErrorHandlingDemo;
