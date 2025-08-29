---
title: Workspace 工作空间
group:
  title: 组件
  order: 2
---

# Workspace 工作空间

Workspace 是一个功能强大的工作空间组件，提供了标签页式的内容管理界面。支持多种内容类型的展示，包括实时跟随、任务管理、文件预览、浏览器内容等，为用户提供统一的工作环境。

## ✨ 功能特点

- 🔄 **实时跟随**: 支持 shell、markdown、html 等内容的实时更新显示
- 📋 **任务管理**: 内置任务列表和任务状态管理功能
- 📁 **文件预览**: 支持多种文件格式的预览和下载
- 🌐 **浏览器集成**: 可嵌入浏览器内容和网页预览
- 🎛️ **自定义内容**: 支持自定义组件和内容渲染
- 📱 **响应式设计**: 适配不同屏幕尺寸，提供良好的用户体验

## 代码演示

### 基础用法

<code src="../demos/workspace-demo.tsx" title="基础工作空间" description="展示工作空间的基本功能和标签页切换">基础用法</code>

### 文件管理

<code src="../demos/workspace-file-demo.tsx" title="文件管理" description="演示文件上传、预览、下载等文件管理功能">文件管理</code>

### 实时跟随

<code src="../demos/workspace-realtime-demo.tsx" title="实时跟随" description="展示实时内容更新和跟随功能">实时跟随</code>

### 任务管理

<code src="../demos/workspace-task-demo.tsx" title="任务管理" description="演示任务创建、编辑、状态管理等功能">任务管理</code>

### 自定义内容

<code src="../demos/workspace-custom-demo.tsx" title="自定义内容" description="展示如何添加自定义组件和内容">自定义内容</code>

### 浏览器

<code src="../demos/workspace-browser-demo.tsx" title="浏览器集成" description="演示浏览器内容嵌入和网页预览功能">浏览器</code>

### 高级用法

<code src="../demos/workspace-advanced-demo.tsx" title="高级用法" description="展示复杂场景下的工作空间配置和使用">高级用法</code>

<code src="../demos/workspace-file-actionref-demo.tsx">编程式打开预览</code>

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

| 参数                | 说明                                                                 | 类型                                               | 默认值      |
| ------------------- | -------------------------------------------------------------------- | -------------------------------------------------- | ----------- |
| type                | 内容类型                                                             | `'shell' \| 'html' \| 'markdown' \| 'md'`          | -           |
| content             | 展示内容                                                             | `string \| DiffContent`                            | -           |
| markdownEditorProps | Markdown 编辑器配置（仅 md/shell 或 html 的 code 视图生效）          | `Partial<MarkdownEditorProps>`                     | -           |
| title               | 自定义主标题                                                         | `string`                                           | -           |
| subTitle            | 自定义副标题                                                         | `string`                                           | -           |
| icon                | 自定义图标组件                                                       | `React.ComponentType`                              | -           |
| typewriter          | 是否启用打字机效果（md/shell 默认启用）                              | `boolean`                                          | -           |
| rightContent        | 自定义右侧内容（优先级高于下方的 segmentedItems/默认视图切换）       | `React.ReactNode`                                  | -           |
| errorRender         | 自定义异常渲染                                                       | `React.ReactNode \| () => React.ReactNode`         | -           |
| className           | 额外类名                                                             | `string`                                           | -           |
| style               | 内联样式                                                             | `React.CSSProperties`                              | -           |
| status              | 渲染状态（仅覆盖层处理，html 由 HtmlPreview 内部处理）               | `'loading' \| 'done' \| 'error'`                   | -           |
| loadingRender       | 自定义加载渲染，非必传                                                       | `React.ReactNode \| () => React.ReactNode`         | -           |
| viewMode            | html 受控视图模式                                                    | `'preview' \| 'code'`                              | -           |
| defaultViewMode     | html 非受控默认视图模式                                              | `'preview' \| 'code'`                              | `'preview'` |
| onViewModeChange    | 视图模式变更回调（html）                                             | `(mode: 'preview' \| 'code') => void`              | -           |
| iframeProps         | iframe 属性（html 预览模式）                                         | `React.IframeHTMLAttributes<HTMLIFrameElement>`    | -           |
| labels              | 视图切换文案（html）                                                 | `{ preview?: string; code?: string }`              | -           |
| segmentedItems      | 自定义右上角 Segmented 选项（html，若提供则替换默认 预览/代码 切换） | `Array<{ label: React.ReactNode; value: string }>` | -           |

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

| 参数                  | 说明                   | 类型                             | 默认值 |
| --------------------- | ---------------------- | -------------------------------- | ------ |
| content               | 思维链/过程数据        | `WhiteBoxProcessInterface[]`     | -      |
| thoughtChainListProps | 思维链组件配置（可选） | `Partial<ThoughtChainListProps>` | -      |

### Workspace.File

文件组件，用于展示文件列表和文件操作。

| 参数                | 说明                                                          | 类型                                                                           | 默认值 |
| ------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------ |
| nodes               | 文件/分组节点数据                                             | `(GroupNode \| FileNode)[]`                                                    | -      |
| onGroupDownload     | 组下载回调                                                    | `(files: FileNode[], groupType: FileType) => void`                             | -      |
| onDownload          | 单文件下载回调                                                | `(file: FileNode) => void`                                                     | -      |
| onFileClick         | 文件点击回调                                                  | `(file: FileNode) => void`                                                     | -      |
| onToggleGroup       | 组展开/收起回调                                               | `(groupType: FileType, collapsed: boolean) => void`                            | -      |
| onPreview           | 文件预览回调（返回替换预览内容或异步返回）                    | `(file: FileNode) => FileNode \| ReactNode \| Promise<FileNode \| ReactNode>`  | -      |
| markdownEditorProps | Markdown 编辑器配置（覆盖默认预览配置，内部会忽略只读等字段） | `Partial<Omit<MarkdownEditorProps, 'editorRef' \| 'initValue' \| 'readonly'>>` | -      |
| actionRef           | 对外操作引用（编程式打开/返回）                                | `React.MutableRefObject<FileActionRef \| null>`                                 | -      |
| loading             | 是否显示加载状态                                              | `boolean`                                                                      | -      |
| loadingRender       | 自定义加载渲染函数，非必传                                           | `() => React.ReactNode`                                                        | -      |
| tab                 | 标签页配置                                                    | `TabConfiguration`                                                             | -      |

#### FileActionRef

| 方法         | 说明                   | 类型                                   |
| ------------ | ---------------------- | -------------------------------------- |
| openPreview  | 编程式打开文件预览页   | `(file: FileNode) => void`             |
| backToList   | 从预览页返回到文件列表 | `() => void`                           |

#### FileNode

| 参数         | 说明                                                       | 类型                       |
| ------------ | ---------------------------------------------------------- | -------------------------- |
| id           | 唯一标识（可选）                                           | `string`                   |
| name         | 文件名                                                     | `string`                   |
| icon         | 自定义图标（可选）                                         | `ReactNode`                |
| displayType  | 展示在文件标题下方的类型（如类型/大小/更新时间等）         | `string`                   |
| type         | 文件类型                                                   | `FileType`                 |
| size         | 文件大小                                                   | `string \| number`         |
| lastModified | 最后修改时间                                               | `string \| number \| Date` |
| url          | 文件下载地址（或预览地址）                                 | `string`                   |
| file         | 文件二进制内容（浏览器环境）                               | `File \| Blob`             |
| previewUrl   | 预览地址（优先用于图片类预览）                             | `string`                   |
| content      | 文本内容（如 md/html 等，优先用于内置预览）                | `string`                   |
| metadata     | 额外元数据                                                 | `Record<string, unknown>`  |
| canPreview   | 是否允许预览（用户自定义开关，默认由系统推断是否可预览）   | `boolean`                  |
| canDownload  | 是否在文件列表页面展示下载图标（用户自定义开关，默认展示） | `boolean`                  |

#### GroupNode

| 参数      | 说明                       | 类型         |
| --------- | -------------------------- | ------------ |
| id        | 唯一标识（可选）           | `string`     |
| name      | 分组名                     | `string`     |
| icon      | 自定义图标（可选）         | `ReactNode`  |
| collapsed | 是否折叠（可选）           | `boolean`    |
| children  | 子文件列表                 | `FileNode[]` |
| type      | 分组文件类型（同组同类型） | `FileType`   |

#### FileType

文件类型键值，内置常见文本/图片/视频/音频/办公文档/压缩包/代码等类型（如 `plainText`、`markdown`、`image`、`video`、`audio`、`pdf`、`word`、`excel`、`archive`、`javascript`、`typescript`、`react`、`python`、`java`、`cpp`、`c`、`csharp`、`go`、`rust`、`php`、`ruby`、`shell`、`powershell`、`sql`、`lua`、`perl`、`scala`、`config`）。

### Workspace.Browser

浏览器组件，用于展示浏览器内容。

| 参数 | 说明       | 类型               | 默认值 |
| ---- | ---------- | ------------------ | ------ |
| data | 浏览器数据 | `BrowserItemInput` | -      |
| tab  | 标签页配置 | `TabConfiguration` | -      |

### Workspace.Custom

自定义组件，用于展示自定义内容。

| 参数     | 说明       | 类型               | 默认值 |
| -------- | ---------- | ------------------ | ------ |
| children | 自定义内容 | `ReactNode`        | -      |
| tab      | 标签页配置 | `TabConfiguration` | -      |

### TabConfiguration

标签页配置项，适用于所有子组件（不传则使用组件内置默认：图标与标题）。

| 参数  | 说明               | 类型        | 默认值 |
| ----- | ------------------ | ----------- | ------ |
| key   | 标签页唯一标识     | `string`    | -      |
| icon  | 标签页图标         | `ReactNode` | -      |
| title | 标签页标题         | `ReactNode` | -      |
| count | 标签页标题右侧数字 | `number`    | -      |

## 使用场景

### 1. 开发工作空间

适用于开发环境中的多标签页工作空间，可以同时查看代码、日志、文档等。

### 2. 数据分析工作台

用于数据分析场景，可以同时展示数据文件、分析结果、可视化图表等。

### 3. 文档管理系统

用于文档的预览、编辑、版本对比等功能。

### 4. 实时监控面板

用于展示实时数据、日志流、系统状态等信息。

### 5. 任务管理界面

用于展示任务进度、执行状态、结果输出等。

## 最佳实践

1. **合理使用标签页数量**：建议单个工作空间内的标签页数量不超过 8 个，避免界面过于拥挤。

2. **标签页命名**：使用简洁明了的标签页标题，便于用户快速识别。

3. **文件类型支持**：充分利用内置的文件类型支持，为不同类型的文件提供合适的预览方式。

4. **自定义预览**：对于特殊文件类型，可以通过 `onPreview` 回调实现自定义预览逻辑。

5. **响应式设计**：考虑在不同屏幕尺寸下的显示效果，合理设置工作空间的高度和宽度。

6. **性能优化**：对于大量文件或复杂内容，考虑使用虚拟滚动或分页加载。

7. **错误处理**：为文件预览、下载等操作添加适当的错误处理和用户提示。

8. **无障碍支持**：确保工作空间组件具有良好的键盘导航和屏幕阅读器支持。
