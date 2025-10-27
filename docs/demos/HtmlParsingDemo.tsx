import { MarkdownEditor } from '@ant-design/md-editor';
import React, { useState } from 'react';

/**
 * HTML 解析演示
 * 
 * 展示编辑器如何处理各种 HTML 标签
 */
const HtmlParsingDemo: React.FC = () => {
  const [value, setValue] = useState(`# HTML 解析演示

这个演示展示了编辑器如何处理各种类型的 HTML 标签。

---

## 1. 特殊标签：<think>

\`<think>\` 标签会被转换为特殊的思考块（在只读模式下显示为专门的 UI）：

<think>这是一个思考过程，会被转换为特殊的思考块组件</think>

<think>
可以包含多行内容：

1. 第一步分析
2. 第二步实现
3. 第三步验证

还可以嵌套代码块：

\`\`\`javascript
console.log('嵌套的代码');
\`\`\`
</think>

---

## 2. 标准 HTML 块级元素

### 2.1 段落和文本

<p>这是一个 p 标签段落</p>

<div>这是一个 div 容器</div>

### 2.2 列表

<ul>
  <li>无序列表项 1</li>
  <li>无序列表项 2</li>
</ul>

<ol>
  <li>有序列表项 1</li>
  <li>有序列表项 2</li>
</ol>

### 2.3 标题

<h1>H1 标题</h1>
<h2>H2 标题</h2>
<h3>H3 标题</h3>

### 2.4 表格

<table>
  <tr>
    <th>列1</th>
    <th>列2</th>
  </tr>
  <tr>
    <td>数据1</td>
    <td>数据2</td>
  </tr>
</table>

---

## 3. 标准 HTML 内联元素

这是 <strong>粗体文本</strong> 和 <em>斜体文本</em>。

这是 <b>加粗</b>、<i>倾斜</i>、<u>下划线</u>、<del>删除线</del>。

这是一个 <a href="https://example.com">链接</a>。

这是 <code>内联代码</code>。

带颜色的文本：<span style="color: red">红色</span> 和 <font color="blue">蓝色</font>。

---

## 4. 媒体元素

### 4.1 图片

<img src="https://via.placeholder.com/150" alt="示例图片" />

### 4.2 视频

<video width="320" height="240" controls>
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
</video>

### 4.3 嵌入内容

<iframe src="https://www.example.com" width="300" height="200"></iframe>

---

## 5. 非标准 HTML 元素（当作普通文本）

### 5.1 自定义标签

<custom>这是自定义标签，会被当作普通文本显示</custom>

<mycomponent>自定义组件标签</mycomponent>

<foo>foo 标签内容</foo>

### 5.2 <answer> 标签

<answer>这是 answer 标签，也会被当作普通文本显示</answer>

<answer>
可以包含多行内容
但不会有特殊渲染
就像普通文本一样
</answer>

### 5.3 混合使用

这里有 <custom>自定义标签</custom> 和 <standard>标准文本</standard> 混合在一起。

---

## 6. HTML 注释（用于配置）

HTML 注释会被解析为配置属性：

<!-- { "align": "center" } -->
这段文字会居中显示

<!-- { "align": "right" } -->
这段文字会右对齐

---

## 7. 换行标签

使用 <br/> 可以强制换行<br/>这是新的一行

---

## 8. 复杂混合场景

### 8.1 标准 HTML + 非标准标签

<div>
  <p>这是标准的 <strong>HTML</strong> 内容</p>
  <custom>这是自定义标签会显示为文本</custom>
</div>

### 8.2 think 标签 + 非标准标签

<think>思考：如何处理自定义标签？</think>

<answer>答案：当作普通文本处理</answer>

<custom>自定义标签也是文本</custom>

---

## 总结

| 标签类型 | 示例 | 处理方式 |
|---------|------|---------|
| \`<think>\` | \`<think>内容</think>\` | 转换为特殊思考块 UI |
| 标准 HTML | \`<div>\`, \`<p>\`, \`<ul>\`, \`<img>\` 等 | 正常解析为 HTML |
| HTML 注释 | \`<!-- {config} -->\` | 提取配置属性 |
| 非标准标签 | \`<answer>\`, \`<custom>\`, \`<foo>\` 等 | 当作普通文本 |

---

## 提示

- 切换到**只读模式**可以看到 \`<think>\` 标签的特殊 UI 效果
- 其他所有标签在只读模式和编辑模式下的显示一致
`);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <h3>编辑模式</h3>
          <MarkdownEditor
            initValue={value}
            onChange={(val) => setValue(val)}
            readonly={false}
            style={{ minHeight: '600px', border: '1px solid #d9d9d9' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3>只读模式（查看 think 块效果）</h3>
          <MarkdownEditor
            initValue={value}
            readonly={true}
            style={{ minHeight: '600px', border: '1px solid #d9d9d9' }}
          />
        </div>
      </div>
    </div>
  );
};

export default HtmlParsingDemo;

