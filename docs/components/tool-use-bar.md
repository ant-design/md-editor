---
title: ToolUseBar 工具使用栏
group:
  title: 功能组件
  order: 2
---

# ToolUseBar 组件

ToolUseBar 是一个用于显示工具调用状态的组件，支持多种动画效果。

## 代码演示

<code src="../demos/tool-use-bar.tsx">基础用法</code>

<code src="../demos/tool-use-bar-all.tsx">全量 api</code>

<code src="../demos/tool-use-bar-advanced.tsx">高级用法</code>

## API

### ToolUseBarProps

| 参数        | 说明             | 类型                   | 默认值 |
| ----------- | ---------------- | ---------------------- | ------ |
| tools       | 工具列表         | `ToolCall[]`           | -      |
| onToolClick | 点击工具时的回调 | `(id: string) => void` | -      |

### ToolCall

| 参数       | 说明          | 类型                                          | 默认值 |
| ---------- | ------------- | --------------------------------------------- | ------ |
| id         | 工具唯一标识  | `string`                                      | -      |
| toolName   | 工具名称      | `React.ReactNode`                             | -      |
| toolTarget | 工具目标/描述 | `React.ReactNode`                             | -      |
| time       | 执行时间      | `React.ReactNode`                             | -      |
| icon       | 自定义图标    | `React.ReactNode`                             | -      |
| status     | 工具状态      | `'idle' \| 'loading' \| 'success' \| 'error'` | -      |

## 状态说明

- `idle`: 空闲状态，无动画
- `loading`: 加载状态，显示所有动画效果
- `success`: 成功状态，无动画
- `error`: 错误状态，图标显示红色
