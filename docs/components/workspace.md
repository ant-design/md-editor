---
title: 工作空间
group:
  title: 工作空间
  order: 3
---

# Workspace 工作空间

支持动态插入工作空间内容，内置实时跟随、任务、文件Tab。

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

实时跟随组件，用于展示实时更新的内容（支持 shell、markdown/md、html）。

| 参数 | 说明         | 类型                 | 默认值 |
| ---- | ------------ | -------------------- | ------ |
| data | 实时跟随数据 | `RealtimeFollowData` | -      |
| tab  | 标签页配置   | `TabConfiguration`   | -      |

#### RealtimeFollowData

| 参数                | 说明                                                                 | 类型                                                                                  | 默认值 |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------ |
| type                | 内容类型                                                             | `'shell' \| 'html' \| 'markdown' \| 'md'`                                            | -      |
| content             | 展示内容                                                             | `string \| DiffContent`                                                               | -      |
| markdownEditorProps | Markdown 编辑器配置（仅 md/shell 或 html 的 code 视图生效）         | `Partial<MarkdownEditorProps>`                                                         | -      |
| title               | 自定义主标题                                                         | `string`                                                                              | -      |
| subTitle            | 自定义副标题                                                         | `string`                                                                              | -      |
| icon                | 自定义图标组件                                                       | `React.ComponentType`                                                                 | -      |
| typewriter          | 是否启用打字机效果（md/shell 默认启用）                              | `boolean`                                                                             | -      |
| rightContent        | 自定义右侧内容（优先级高于下方的 segmentedItems/默认视图切换）       | `React.ReactNode`                                                                     | -      |
| loadingRender       | 自定义加载渲染                                                       | `React.ReactNode \| () => React.ReactNode`                                           | -      |
| errorRender         | 自定义异常渲染                                                       | `React.ReactNode \| () => React.ReactNode`                                           | -      |
| className           | 额外类名                                                             | `string`                                                                              | -      |
| style               | 内联样式                                                             | `React.CSSProperties`                                                                 | -      |
| status              | 渲染状态（仅覆盖层处理，html 由 HtmlPreview 内部处理）               | `'loading' \| 'done' \| 'error'`                                                      | -      |
| viewMode            | html 受控视图模式                                                    | `'preview' \| 'code'`                                                                 | -      |
| defaultViewMode     | html 非受控默认视图模式                                              | `'preview' \| 'code'`                                                                 | `'preview'` |
| onViewModeChange    | 视图模式变更回调（html）                                              | `(mode: 'preview' \| 'code') => void`                                                | -      |
| iframeProps         | iframe 属性（html 预览模式）                                         | `React.IframeHTMLAttributes<HTMLIFrameElement>`                                       | -      |
| labels              | 视图切换文案（html）                                                 | `{ preview?: string; code?: string }`                                                 | -      |
| segmentedItems      | 自定义右上角 Segmented 选项（html，若提供则替换默认 预览/代码 切换） | `Array<{ label: React.ReactNode; value: string }>`                                    | -      |

#### DiffContent

| 参数     | 说明       | 类型     |
| -------- | ---------- | -------- |
| original | 原始内容   | `string` |
| modified | 修改后内容 | `string` |

### Workspace.Task

任务组件，用于展示任务列表。

| 参数 | 说明       | 类型               | 默认值 |
| ---- | ---------- | ------------------ | ------ |
| data | 任务数据   | `TaskItemInput`    | -      |
| tab  | 标签页配置 | `TabConfiguration` | -      |

#### TaskItemInput

| 参数                 | 说明                       | 类型                               | 默认值 |
| -------------------- | -------------------------- | ---------------------------------- | ------ |
| content              | 思维链/过程数据            | `WhiteBoxProcessInterface[]`       | -      |
| thoughtChainListProps| 思维链组件配置（可选）     | `Partial<ThoughtChainListProps>`   | -      |

### Workspace.File

文件组件，用于展示文件列表和文件操作。

| 参数                | 说明                                                         | 类型                                                                                         | 默认值 |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------ |
| nodes               | 文件/分组节点数据                                            | `(GroupNode \| FileNode)[]`                                                                  | -      |
| onGroupDownload     | 组下载回调                                                    | `(files: FileNode[], groupType: FileType) => void`                                           | -      |
| onDownload          | 单文件下载回调                                                | `(file: FileNode) => void`                                                                    | -      |
| onFileClick         | 文件点击回调                                                  | `(file: FileNode) => void`                                                                    | -      |
| onToggleGroup       | 组展开/收起回调                                               | `(groupType: FileType, collapsed: boolean) => void`                                          | -      |
| onPreview           | 文件预览回调（返回替换预览内容或异步返回）                    | `(file: FileNode) => FileNode \| ReactNode \| Promise<FileNode \| ReactNode>`               | -      |
| markdownEditorProps | Markdown 编辑器配置（覆盖默认预览配置，内部会忽略只读等字段） | `Partial<Omit<MarkdownEditorProps, 'editorRef' \| 'initValue' \| 'readonly'>>`              | -      |
| tab                 | 标签页配置                                                    | `TabConfiguration`                                                                            | -      |

#### FileNode

| 参数         | 说明                                                                 | 类型                                   |
| ------------ | -------------------------------------------------------------------- | -------------------------------------- |
| id           | 唯一标识（可选）                                                     | `string`                               |
| name         | 文件名                                                               | `string`                               |
| icon         | 自定义图标（可选）                                                   | `ReactNode`                            |
| displayType  | 展示在文件标题下方的类型（如类型/大小/更新时间等）                  | `string`                               |
| type         | 文件类型                                                             | `FileType`                             |
| size         | 文件大小                                                             | `string \| number`                     |
| lastModified | 最后修改时间                                                          | `string \| number \| Date`             |
| url          | 文件下载地址（或预览地址）                                           | `string`                               |
| file         | 文件二进制内容（浏览器环境）                                         | `File \| Blob`                         |
| previewUrl   | 预览地址（优先用于图片类预览）                                       | `string`                               |
| content      | 文本内容（如 md/html 等，优先用于内置预览）                          | `string`                               |
| metadata     | 额外元数据                                                           | `Record<string, unknown>`              |
| canPreview   | 是否允许预览（用户自定义开关，默认由系统推断是否可预览）                                       | `boolean`                              |
| canDownload	 | 是否在文件列表页面展示下载图标（用户自定义开关，默认展示）        | `boolean`                              |

#### GroupNode

| 参数      | 说明                         | 类型            |
| --------- | ---------------------------- | --------------- |
| id        | 唯一标识（可选）             | `string`        |
| name      | 分组名                       | `string`        |
| icon      | 自定义图标（可选）           | `ReactNode`     |
| collapsed | 是否折叠（可选）             | `boolean`       |
| children  | 子文件列表                   | `FileNode[]`    |
| type      | 分组文件类型（同组同类型）   | `FileType`      |

#### FileType

文件类型键值，内置常见文本/图片/视频/音频/办公文档/压缩包/代码等类型（如 `plainText`、`markdown`、`image`、`video`、`audio`、`pdf`、`word`、`excel`、`archive`、`javascript`、`typescript`、`react`、`python`、`java`、`cpp`、`c`、`csharp`、`go`、`rust`、`php`、`ruby`、`shell`、`powershell`、`sql`、`lua`、`perl`、`scala`、`config`）。

### Workspace.Custom

自定义组件，用于展示自定义内容。

| 参数     | 说明       | 类型               | 默认值 |
| -------- | ---------- | ------------------ | ------ |
| children | 自定义内容 | `ReactNode`        | -      |
| tab      | 标签页配置 | `TabConfiguration` | -      |

### TabConfiguration

标签页配置项，适用于所有子组件（不传则使用组件内置默认：图标与标题）。

| 参数  | 说明           | 类型        | 默认值 |
| ----- | -------------- | ----------- | ------ |
| key   | 标签页唯一标识 | `string`    | -      |
| icon  | 标签页图标     | `ReactNode` | -      |
| title | 标签页标题     | `ReactNode` | -      |
