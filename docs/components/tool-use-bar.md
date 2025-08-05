---
title: ToolUseBar 工具使用栏
group:
  title: 功能组件
  order: 2
---

# ToolUseBar 组件

ToolUseBar 是一个用于显示工具调用列表的组件，支持工具状态显示和交互功能。

## 代码演示

<code src="../demos/tool-use-bar-basic.tsx">基础用法</code>

<code src="../demos/tool-use-bar-active-keys.tsx">activeKeys 功能演示</code>

## API

### ToolUseBarProps

| 属性               | 类型                           | 默认值 | 说明               |
| ------------------ | ------------------------------ | ------ | ------------------ |
| tools              | ToolCall[]                     | -      | 工具列表           |
| onToolClick        | (id: string) => void           | -      | 工具点击回调       |
| className          | string                         | -      | 自定义类名         |
| activeKeys         | string[]                       | []     | 激活的工具 ID 数组 |
| onActiveKeysChange | (activeKeys: string[]) => void | -      | 激活状态变化回调   |

### ToolCall

| 属性       | 类型                                        | 默认值 | 说明         |
| ---------- | ------------------------------------------- | ------ | ------------ |
| id         | string                                      | -      | 工具唯一标识 |
| toolName   | React.ReactNode                             | -      | 工具名称     |
| toolTarget | React.ReactNode                             | -      | 工具目标     |
| time       | React.ReactNode                             | -      | 时间信息     |
| icon       | React.ReactNode                             | -      | 自定义图标   |
| status     | 'idle' \| 'loading' \| 'success' \| 'error' | -      | 工具状态     |

## 状态样式

组件会根据工具状态显示不同的样式：

- `idle`: 空闲状态
- `loading`: 加载状态（带有旋转动画）
- `success`: 成功状态
- `error`: 错误状态
- `active`: 激活状态（通过 activeKeys 控制）

## 注意事项

1. `activeKeys` 数组中的 ID 必须与 `tools` 中的 `id` 匹配
2. 如果不提供 `onActiveKeysChange`，`activeKeys` 将不会生效
3. 组件支持多选激活，可以同时激活多个工具项
4. 点击已激活的工具项会取消激活状态
