---
title: ToolUseBar 工具使用栏
atomId: ToolUseBar
group:
  title: 功能组件
  order: 2
---

# ToolUseBar 组件

ToolUseBar 是一个用于显示工具调用列表的组件，支持工具状态显示和交互功能。

## 代码演示

<code src="../demos/tool-use-bar-basic.tsx">基础用法</code>

<code src="../demos/tool-use-bar-active-keys.tsx">activeKeys 功能演示</code>

<code src="../demos/tool-use-bar-expanded-keys.tsx">expandedKeys 功能演示</code>

<code src="../demos/tool-use-bar-think-standalone.tsx">ToolUseBarThink 独立组件</code>

<code src="../demos/tool-use-bar-think-simple.tsx">ToolUseBarThink 简单示例</code>

## API

### ToolUseBarProps

| 属性                 | 类型                             | 默认值 | 说明                   |
| -------------------- | -------------------------------- | ------ | ---------------------- |
| tools                | ToolCall[]                       | -      | 工具列表               |
| onToolClick          | (id: string) => void             | -      | 工具点击回调           |
| className            | string                           | -      | 自定义类名             |
| activeKeys           | string[]                         | []     | 激活的工具 ID 数组     |
| defaultActiveKeys    | string[]                         | []     | 默认激活的工具 ID 数组 |
| onActiveKeysChange   | (activeKeys: string[]) => void   | -      | 激活状态变化回调       |
| expandedKeys         | string[]                         | []     | 展开的工具 ID 数组     |
| defaultExpandedKeys  | string[]                         | []     | 默认展开的工具 ID 数组 |
| onExpandedKeysChange | (expandedKeys: string[]) => void | -      | 展开状态变化回调       |

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

## ToolUseBarThink 独立组件

ToolUseBarThink 是一个专门为 Think 功能设计的独立组件，拥有独特的样式和功能。

### ToolUseBarThinkProps

| 属性             | 类型                                        | 默认值 | 说明                    |
| ---------------- | ------------------------------------------- | ------ | ----------------------- |
| id               | string                                      | -      | 组件唯一标识            |
| toolName         | React.ReactNode                             | -      | 工具名称                |
| toolTarget       | React.ReactNode                             | -      | 工具目标                |
| time             | React.ReactNode                             | -      | 工具执行时间            |
| icon             | React.ReactNode                             | -      | 自定义图标              |
| thinkContent     | React.ReactNode                             | -      | Think 模块完整内容      |
| isThinkLoading   | boolean                                     | false  | Think 模块 loading 状态 |
| status           | 'idle' \| 'loading' \| 'success' \| 'error' | 'idle' | 组件状态                |
| onClick          | (id: string) => void                        | -      | 点击回调                |
| isActive         | boolean                                     | false  | 是否激活                |
| onActiveChange   | (id: string, active: boolean) => void       | -      | 激活状态变化回调        |
| isExpanded       | boolean                                     | -      | 是否展开                |
| onExpandedChange | (id: string, expanded: boolean) => void     | -      | 展开状态变化回调        |
| defaultExpanded  | boolean                                     | false  | 默认展开状态            |
| testId           | string                                      | -      | 测试 ID                 |

### ToolUseBarThink 特性

- **独立组件**: 专门为 Think 功能设计的独立组件
- **专用样式**: 拥有独特的蓝色主题样式
- **Loading 状态**: 显示 8 行占位符，支持展开收起
- **完整内容**: 支持显示 thinkContent 完整内容
- **状态管理**: 支持激活状态和展开状态管理
- **自定义图标**: 默认使用 ThinkIcon，支持自定义

## 注意事项

1. `activeKeys` 数组中的 ID 必须与 `tools` 中的 `id` 匹配
2. 如果不提供 `onActiveKeysChange`，`activeKeys` 将不会生效
3. 组件支持多选激活，可以同时激活多个工具项
4. 点击已激活的工具项会取消激活状态
5. `expandedKeys` 数组中的 ID 必须与 `tools` 中的 `id` 匹配
6. 如果不提供 `onExpandedKeysChange`，展开状态将使用内部状态管理
7. 只有包含 `content` 或 `errorMessage` 的工具项才会显示展开按钮
8. 支持受控和非受控两种展开模式
