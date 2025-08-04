---
title: 工作空间
group:
  title: 工作空间
  order: 3
---

# Workspace 工作空间

支持动态插入工作空间内容，内置实时跟随、任务、文件 Tab。

## 代码演示

<code src="../demos/workspace-demo.tsx">基础用法</code>

## API

### Workspace

| 参数         | 说明                   | 类型                       | 默认值        |
| ------------ | ---------------------- | -------------------------- | ------------- |
| activeTabKey | 当前激活的标签页 key   | `string`                   | -             |
| onTabChange  | 切换标签页的回调函数   | `(tabKey: string) => void` | -             |
| style        | 自定义样式             | `React.CSSProperties`      | -             |
| className    | 自定义 CSS 类名        | `string`                   | -             |
| title        | 工作空间标题           | `ReactNode`                | `'Workspace'` |
| onClose      | 关闭工作空间的回调函数 | `() => void`               | -             |

### Workspace.Realtime

实时跟随组件，用于展示实时更新的内容。

| 参数 | 说明         | 类型                 | 默认值 |
| ---- | ------------ | -------------------- | ------ |
| data | 实时跟随数据 | `RealtimeFollowData` | -      |
| tab  | 标签页配置   | `TabConfiguration`   | -      |

#### RealtimeFollowData

| 参数                | 说明                | 类型                                   | 默认值 |
| ------------------- | ------------------- | -------------------------------------- | ------ |
| type                | 内容类型            | `RealtimeFollowMode`                   | -      |
| content             | 展示内容            | `string \| DiffContent \| HtmlContent` | -      |
| markdownEditorProps | Markdown 编辑器配置 | `Partial<MarkdownEditorProps>`         | -      |
| title               | 自定义主标题        | `string`                               | -      |
| subTitle            | 自定义副标题        | `string`                               | -      |
| icon                | 自定义图标          | `React.ComponentType`                  | -      |
| typewriter          | 是否启用打字机效果  | `boolean`                              | -      |
| rightContent        | 自定义右侧内容      | `React.ReactNode`                      | -      |

### Workspace.Task

任务组件，用于展示任务列表。

| 参数 | 说明       | 类型               | 默认值 |
| ---- | ---------- | ------------------ | ------ |
| data | 任务数据   | `TaskItemInput`    | -      |
| tab  | 标签页配置 | `TabConfiguration` | -      |

### Workspace.File

文件组件，用于展示文件列表和文件操作。

| 参数                | 说明                | 类型                                                | 默认值 |
| ------------------- | ------------------- | --------------------------------------------------- | ------ |
| nodes               | 文件节点数据        | `(GroupNode \| FileNode)[]`                         | -      |
| onGroupDownload     | 组下载回调          | `(files: FileNode[], groupType: FileType) => void`  | -      |
| onDownload          | 单文件下载回调      | `(file: FileNode) => void`                          | -      |
| onFileClick         | 文件点击回调        | `(file: FileNode) => void`                          | -      |
| onToggleGroup       | 组展开/收起回调     | `(groupType: FileType, collapsed: boolean) => void` | -      |
| onPreview           | 文件预览回调        | `(file: FileNode) => void`                          | -      |
| markdownEditorProps | Markdown 编辑器配置 | `Partial<MarkdownEditorProps>`                      | -      |
| tab                 | 标签页配置          | `TabConfiguration`                                  | -      |

### Workspace.Custom

自定义组件，用于展示自定义内容。

| 参数     | 说明       | 类型               | 默认值 |
| -------- | ---------- | ------------------ | ------ |
| children | 自定义内容 | `ReactNode`        | -      |
| tab      | 标签页配置 | `TabConfiguration` | -      |

### TabConfiguration

标签页配置项，适用于所有子组件。

| 参数  | 说明           | 类型        | 默认值 |
| ----- | -------------- | ----------- | ------ |
| key   | 标签页唯一标识 | `string`    | -      |
| icon  | 标签页图标     | `ReactNode` | -      |
| title | 标签页标题     | `string`    | -      |
