import React from 'react';
import { BaseMarkdownEditor } from '../../src/MarkdownEditor/BaseMarkdownEditor';

const CardClickDemo = () => {
  // 创建包含多个卡片的演示内容
  const demoContent = [
    {
      type: 'paragraph',
      children: [{ text: '🎯 卡片选中修复演示' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '点击下面的卡片，现在会直接定位到 card-after（可输入区域）：' }],
    },
    {
      type: 'card',
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          mediaType: 'image',
          alt: '演示图片',
          children: [{ text: '' }],
        },
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ],
    },
    {
      type: 'paragraph',
      children: [{ text: '测试步骤：' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '1. 点击上面的卡片' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '2. 光标应该自动定位到 card-after 位置' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '3. 直接输入文字，应该在卡片后面创建新段落' }],
    },
    {
      type: 'card',
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        {
          type: 'media',
          url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
          mediaType: 'video',
          children: [{ text: '' }],
        },
        {
          type: 'card-after',
          children: [{ text: '' }],
        },
      ],
    },
    {
      type: 'paragraph',
      children: [{ text: '✅ 修复前的问题：' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '- 点击卡片会先选中 card-before' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '- 需要额外的逻辑来重定向到 card-after' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '🚀 修复后的效果：' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '- 直接选中整个卡片节点' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '- normalizeCardSelection 自动重定向到 card-after' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '- 用户体验更加流畅' }],
    },
  ];

  const initValue = JSON.stringify(demoContent);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>🎯 卡片点击修复演示</h1>
        <div
          style={{
            backgroundColor: '#f0f9ff',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #0ea5e9',
          }}
        >
          <h3>🔧 技术修复详情：</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p><strong>问题根源：</strong></p>
            <ul>
              <li><code>Editor.start(editor, path)</code> 默认选中第一个可编辑位置</li>
              <li>卡片结构：card-before → content → card-after</li>
              <li>第一个位置就是 card-before，导致选中错误位置</li>
            </ul>
            
            <p><strong>解决方案：</strong></p>
            <ul>
              <li>修改 WarpCard 组件的点击逻辑</li>
              <li>使用 <code>Transforms.select(editor, path)</code> 直接选中卡片节点</li>
              <li>配合 <code>normalizeCardSelection</code> 自动重定向到 card-after</li>
            </ul>
          </div>
        </div>
      </div>
      
      <BaseMarkdownEditor
        initValue={initValue}
        onChange={() => {}}
        style={{
          border: '1px solid #e1e4e8',
          borderRadius: '8px',
          minHeight: '600px',
        }}
      />
      
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
        }}
      >
        <h3>📝 测试说明：</h3>
        <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>点击任意卡片，观察光标位置</li>
          <li>直接输入文字，验证是否在卡片后创建新段落</li>
          <li>使用键盘 Tab 键导航到卡片，按 Enter 或空格选中</li>
          <li>验证选中状态的视觉效果（蓝色边框和背景）</li>
        </ol>
      </div>
    </div>
  );
};

export default CardClickDemo;
