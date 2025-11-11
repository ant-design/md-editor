/**
 * title: 懒加载渲染示例
 * description: 展示 BaseMarkdownEditor 的懒加载功能，适用于长文档场景
 */
import { BaseMarkdownEditor } from '@ant-design/agentic-ui';
import { Switch } from 'antd';
import React, { useState } from 'react';

// 生成长文档内容
const generateLongContent = () => {
  const sections = [];

  for (let i = 1; i <= 50; i++) {
    sections.push(`## 第 ${i} 章节\n\n`);
    sections.push(`这是第 ${i} 个章节的内容。`);
    sections.push(`包含一些**粗体文本**和*斜体文本*。\n\n`);
    sections.push(`> 这是一个引用块，用于展示不同的元素类型。\n\n`);
    sections.push(
      `\`\`\`javascript\n// 代码块示例\nconst chapter = ${i};\nconsole.log('Chapter:', chapter);\n\`\`\`\n\n`,
    );
    sections.push(`- 列表项 1\n- 列表项 2\n- 列表项 3\n\n`);
    sections.push(`1. 有序列表项 1\n2. 有序列表项 2\n3. 有序列表项 3\n\n`);
    sections.push(`---\n\n`);
  }

  return sections.join('');
};

export default () => {
  const [lazyEnabled, setLazyEnabled] = useState(true);
  const [renderTime, setRenderTime] = useState(0);
  const longContent = generateLongContent();

  const handleSwitchChange = (checked: boolean) => {
    const startTime = performance.now();
    setLazyEnabled(checked);
    // 在下一帧测量渲染时间
    requestAnimationFrame(() => {
      const endTime = performance.now();
      setRenderTime(Math.round(endTime - startTime));
    });
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          background: '#f5f5f5',
          borderRadius: 8,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <Switch checked={lazyEnabled} onChange={handleSwitchChange} />
          <span style={{ marginLeft: 8 }}>
            启用懒加载 {lazyEnabled ? '(已开启)' : '(已关闭)'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>
          <div>文档包含 50 个章节，约 500+ 个元素</div>
          {renderTime > 0 && (
            <div style={{ color: lazyEnabled ? '#52c41a' : '#ff4d4f' }}>
              渲染切换时间: {renderTime}ms
            </div>
          )}
        </div>
      </div>

      <BaseMarkdownEditor
        key={lazyEnabled ? 'lazy-on' : 'lazy-off'}
        lazy={{
          enable: lazyEnabled,
          placeholderHeight: 120,
          rootMargin: '300px',
        }}
        initValue={longContent}
        readonly={true}
        height={600}
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 8,
        }}
      />
    </div>
  );
};
