import React from 'react';
import { BaseMarkdownEditor } from '../../src/MarkdownEditor/BaseMarkdownEditor';

const CardSelectionDemo = () => {
  // 创建包含多个卡片的演示内容
  const demoContent = [
    {
      type: 'paragraph',
      children: [{ text: '卡片选中效果演示 🎯' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '点击下面的卡片查看选中效果：' }],
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
          alt: '演示图片 1',
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
      children: [{ text: '第二个卡片：' }],
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
      children: [{ text: '内联卡片：' }],
    },
    {
      type: 'card',
      block: false,
      children: [
        {
          type: 'card-before',
          children: [{ text: '' }],
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=200',
          mediaType: 'image',
          alt: '内联图片',
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
      children: [{ text: ' 这是内联卡片的效果展示。' }],
    },
  ];

  const initValue = JSON.stringify(demoContent);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>🎯 卡片选中效果演示</h1>
        <div
          style={{
            backgroundColor: '#f6f8fa',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e1e4e8',
          }}
        >
          <h3>功能特性：</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>🔵 <strong>边框高亮</strong>：选中时显示蓝色边框</li>
            <li>🎨 <strong>背景提示</strong>：淡蓝色背景表示选中状态</li>
            <li>📍 <strong>顶部指示条</strong>：醒目的蓝色指示条</li>
            <li>✅ <strong>选中角标</strong>：带有勾选图标的圆形角标</li>
            <li>🛠️ <strong>工具栏</strong>：显示操作选项和删除按钮</li>
            <li>✨ <strong>平滑动画</strong>：0.2s 的过渡动画效果</li>
          </ul>
        </div>

        <div
          style={{
            backgroundColor: '#fff3cd',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #ffeaa7',
          }}
        >
          <strong>💡 使用提示：</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>点击任意卡片查看选中效果</li>
            <li>选中后会显示工具栏，包含删除功能</li>
            <li>在 card-before 区域无法输入内容</li>
            <li>在 card-after 区域输入会创建新段落</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #e1e4e8',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <BaseMarkdownEditor
          initValue={initValue}
          onChange={(value) => {
            console.log('编辑器内容更新:', value);
          }}
          style={{
            minHeight: '400px',
            padding: '20px',
          }}
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
        }}
      >
        <h3>🔧 技术实现：</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <h4>视觉效果：</h4>
            <ul style={{ fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
              <li>动态边框：transparent → #1890ff</li>
              <li>背景色：transparent → rgba(24, 144, 255, 0.05)</li>
              <li>阴影效果：多层阴影叠加</li>
              <li>圆角过渡：4px → 8px</li>
            </ul>
          </div>
          <div>
            <h4>交互功能：</h4>
            <ul style={{ fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
              <li>点击选中：onClick 事件处理</li>
              <li>删除操作：工具栏删除按钮</li>
              <li>输入重定向：card-after 智能处理</li>
              <li>状态管理：useSelStatus hook</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSelectionDemo; 