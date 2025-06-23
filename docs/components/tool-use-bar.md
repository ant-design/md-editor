---
title: ToolUseBar 工具使用栏
group:
  title: 功能组件
  order: 2
---

# ToolUseBar 工具使用栏

用于展示工具调用状态和结果的组件。支持展示工具名称、执行状态和执行结果。

## 代码演示

<code src="../demos/tool-use-bar.tsx">基础用法</code>

## API

### ToolUseBar

| 参数     | 说明             | 类型         | 默认值 |
| -------- | ---------------- | ------------ | ------ |
| tools    | 工具列表         | `ToolCall[]` | -      |
| activeId | 当前执行的工具ID | `string`     | -      |

### ToolCall

| 参数     | 说明     | 类型     | 默认值 |
| -------- | -------- | -------- | ------ |
| id       | 工具ID   | `string` | -      |
| toolName | 工具名称 | `string` | -      |
| result   | 执行结果 | `string` | -      |

### 样式定制

组件使用了以下的样式变量，可以通过 CSS-in-JS 进行样式定制：

```ts
{
  // 工具项
  tool: {
    marginBottom: 12,
    borderRadius: 200,
    background: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
    padding: '2px 3px',
  },
  // 工具项 - 展开状态
  toolCollapse: {
    marginBottom: 12,
    borderRadius: 12,
    background: token.colorBgContainer,
    padding: 12,
  },
  // 工具名称
  toolName: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '22px',
    color: token.colorText,
  },
  // 执行结果
  toolResult: {
    padding: 8,
    lineHeight: '160%',
    backgroundColor: '#f5f5f5',
  }
}
```
