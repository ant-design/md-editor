import { MarkdownEditor } from '@ant-design/md-editor';
import React, { useState } from 'react';

/**
 * Think 标签演示
 *
 * 展示如何使用 <think> 标签来显示 AI 的思考过程
 */
const ThinkTagDemo: React.FC = () => {
  const [value, setValue] = useState(`# 思考过程展示 Demo

支持两种方式展示 AI 的思考过程，两种格式在只读模式下都会渲染为相同的思考块 UI。

---

## 方式一：使用 think 标签格式

### 简单示例

<think>这是一个简单的思考过程</think>

### 单行分析

<think>分析用户需求：用户想要在 Markdown 编辑器中展示 AI 的深度思考过程</think>

### 多行思考过程

<think>
让我逐步分析这个问题：

第一步：理解需求
- 用户希望展示 AI 的思考过程
- 需要支持多行内容
- 在只读模式下有特殊的 UI 展示

第二步：技术实现
- 支持 think 标签解析
- 转换为内部代码块结构
- 复用现有的 ThinkBlock 组件

第三步：测试验证
- 编写完整的测试用例
- 确保双向转换正确
- 验证各种边界情况

\`\`\`think
这也是一个思考块
\`\`\`

</think>

### 结构化思考

<think>
这是一个思考过程
<answer>
这是一个答案
</answer>

**问题分析：** 如何实现思考过程的展示？

**解决方案：**
1. 支持 think 标签格式
2. 支持代码块格式（兼容性）
3. 统一渲染为思考块组件

**优势：**
- ✅ 语法简洁直观
- ✅ 支持多行内容
- ✅ 在只读模式下有专门的 UI
- ✅ 完全双向兼容
</think>

---

## 方式二：使用代码块格式

### 简单示例

\`\`\`think
这也是一个思考块
\`\`\`

### 多行思考

\`\`\`think
让我思考一下这个问题：

1. 首先，分析用户的真实需求
2. 然后，评估技术可行性
3. 最后，给出最佳解决方案

这种方式与标签格式完全等效。
\`\`\`

---

## 两种格式对比

| 特性 |  think 标签 | 代码块格式 |
|------|-------------|-----------|
| 语法简洁性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 多行支持 | ✅ | ✅ |
| 渲染效果 | 完全相同 | 完全相同 |

## 使用建议

<think>
**推荐做法：**

1. 对于简短的单行思考，使用 <think> 标签格式更简洁
2. 对于多行结构化的思考过程，两种格式都可以，选择你喜欢的
3. 在只读模式下查看效果最佳

**注意事项：**
- 两种格式会被转换为相同的内部结构
- 在编辑模式下可以看到原始格式
- 在只读模式下统一显示为思考块 UI
</think>
`);

  return (
    <div style={{ padding: '20px' }}>
      <MarkdownEditor
        initValue={value}
        onChange={(val) => setValue(val)}
        readonly
        style={{ minHeight: '500px' }}
      />
    </div>
  );
};

export default ThinkTagDemo;
