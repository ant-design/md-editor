---
title: Bubble 气泡组件
group:
  title: 组件
  order: 2
---

# Bubble 气泡组件

Bubble 组件是一个用于显示聊天消息的气泡组件，支持多种消息类型、自定义渲染和文件附件。

## 代码演示

### 基础用法

展示了基本的左右消息布局、加载状态和文件附件功能。

<code src="../demos/bubble/basic.tsx"></code>

### 自定义渲染

展示如何自定义渲染标题、内容和头像。

<code src="../demos/bubble/custom-render.tsx"></code>

### 文件视图

展示如何处理和显示不同类型的文件附件。

<code src="../demos/bubble/file-view.tsx"></code>

### Pure 模式

展示如何使用 pure 模式，移除阴影和边框，适用于需要更简洁界面的场景。

<code src="../demos/bubble/pure.tsx"></code>

### 消息列表

使用 BubbleList 组件展示一组消息，支持加载状态和自定义样式。

<code src="../demos/bubble/list.tsx"></code>

## API

### Bubble

| 参数                 | 说明                              | 类型                                                                                                                                                                                                    | 默认值   |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| animation            | 动画配置                          | `MotionProps`                                                                                                                                                                                           | -        |
| avatar               | 头像的元数据，包含头像URL、名称等 | `BubbleMetaData`                                                                                                                                                                                        | -        |
| bubbleRef            | 气泡组件的引用                    | `MutableRefObject<any>`                                                                                                                                                                                 | -        |
| bubbleRenderConfig   | 渲染配置对象                      | `BubbleRenderConfig<T>`                                                                                                                                                                                 | -        |
| className            | 自定义 CSS 类名                   | `string`                                                                                                                                                                                                | -        |
| customConfig         | 自定义配置                        | `CustomConfig`                                                                                                                                                                                          | -        |
| deps                 | 依赖项数组                        | `any[]`                                                                                                                                                                                                 | -        |
| docListProps         | 文档列表配置                      | `DocInfoListProps & { enable?: boolean }`                                                                                                                                                               | -        |
| extraRender          | 额外内容渲染函数                  | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                                                | -        |
| id                   | 消息ID                            | `string`                                                                                                                                                                                                | -        |
| isLast               | 是否为最后一条消息                | `boolean`                                                                                                                                                                                               | `false`  |
| loading              | 是否处于加载状态                  | `boolean`                                                                                                                                                                                               | `false`  |
| markdownRenderConfig | Markdown 渲染配置                 | `MarkdownEditorProps`                                                                                                                                                                                   | -        |
| onAvatarClick        | 头像点击事件的回调函数            | `() => void`                                                                                                                                                                                            | -        |
| onDisLike            | 不喜欢回调                        | `(bubble: MessageBubbleData) => Promise<void> \| void`                                                                                                                                                  | -        |
| onDoubleClick        | 双击事件的回调函数                | `() => void`                                                                                                                                                                                            | -        |
| onLike               | 喜欢回调                          | `(bubble: MessageBubbleData) => Promise<void> \| void`                                                                                                                                                  | -        |
| onReply              | 回复回调                          | `(message: string) => void`                                                                                                                                                                             | -        |
| originData           | 消息的原始数据                    | `T & MessageBubbleData`                                                                                                                                                                                 | -        |
| placement            | 聊天项的放置位置                  | `'left' \| 'right'`                                                                                                                                                                                     | `'left'` |
| pure                 | 是否启用纯净模式                  | `boolean`                                                                                                                                                                                               | `false`  |
| readonly             | 是否只读                          | `boolean`                                                                                                                                                                                               | `false`  |
| slidesModeProps      | 幻灯片模式配置                    | `{ enable?: boolean; afterOpenChange?: (message: MessageBubbleData) => void }`                                                                                                                          | -        |
| style                | 自定义 CSS 样式                   | `React.CSSProperties`                                                                                                                                                                                   | -        |
| styles               | 样式配置对象                      | `{ bubbleListItemContentStyle?: React.CSSProperties; bubbleListItemTitleStyle?: React.CSSProperties; bubbleListItemAvatarStyle?: React.CSSProperties; bubbleListItemExtraStyle?: React.CSSProperties }` | -        |
| time                 | 消息时间戳                        | `number`                                                                                                                                                                                                | -        |

### BubbleMetaData

| 参数            | 说明       | 类型     | 默认值 |
| --------------- | ---------- | -------- | ------ |
| avatar          | 角色头像   | `string` | -      |
| backgroundColor | 背景色     | `string` | -      |
| title           | 名称       | `string` | -      |
| [key: string]   | 其他元数据 | `any`    | -      |

### BubbleRenderConfig

| 参数                   | 说明                 | 类型                                                                                                                                                                      | 默认值 |
| ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| titleRender            | 标题渲染函数         | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| contentRender          | 内容渲染函数         | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| contentAfterRender     | 内容后渲染函数       | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| contentBeforeRender    | 内容前渲染函数       | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| avatarRender           | 头像渲染函数         | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| extraRender            | 额外内容渲染函数     | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| bubbleRightExtraRender | 右侧额外内容渲染函数 | `BubbleExtraProps['render']`                                                                                                                                              | -      |
| render                 | 整体渲染函数         | `WithFalse<(props: BubbleProps<T>, domsMap: { avatar: ReactNode; title: ReactNode; messageContent: ReactNode; itemDom: ReactNode }, defaultDom: ReactNode) => ReactNode>` | -      |
| customConfig           | 自定义配置           | `CustomConfig`                                                                                                                                                            | -      |

### BubbleList

| 参数                 | 说明              | 类型                                                                                                                                                                                                                                                                                                                                                            | 默认值  |
| -------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| bubbleList           | 消息列表数据      | `MessageBubbleData[]`                                                                                                                                                                                                                                                                                                                                           | `[]`    |
| bubbleListRef        | 列表容器的引用    | `MutableRefObject<HTMLDivElement \| null>`                                                                                                                                                                                                                                                                                                                      | -       |
| bubbleRef            | 气泡组件的引用    | `MutableRefObject<any>`                                                                                                                                                                                                                                                                                                                                         | -       |
| loading              | 是否处于加载状态  | `boolean`                                                                                                                                                                                                                                                                                                                                                       | `false` |
| className            | 自定义 CSS 类名   | `string`                                                                                                                                                                                                                                                                                                                                                        | -       |
| style                | 自定义样式        | `React.CSSProperties`                                                                                                                                                                                                                                                                                                                                           | -       |
| userMeta             | 用户的元数据      | `BubbleMetaData`                                                                                                                                                                                                                                                                                                                                                | -       |
| assistantMeta        | 助手的元数据      | `BubbleMetaData`                                                                                                                                                                                                                                                                                                                                                | -       |
| readonly             | 是否只读          | `boolean`                                                                                                                                                                                                                                                                                                                                                       | `false` |
| bubbleRenderConfig   | 渲染配置          | `BubbleRenderConfig`                                                                                                                                                                                                                                                                                                                                            | -       |
| markdownRenderConfig | Markdown 渲染配置 | `MarkdownEditorProps`                                                                                                                                                                                                                                                                                                                                           | -       |
| docListProps         | 文档列表配置      | `DocInfoListProps & { enable?: boolean }`                                                                                                                                                                                                                                                                                                                       | -       |
| onDisLike            | 不喜欢回调        | `(bubble: MessageBubbleData) => Promise<void> \| void`                                                                                                                                                                                                                                                                                                          | -       |
| onLike               | 喜欢回调          | `(bubble: MessageBubbleData) => Promise<void> \| void`                                                                                                                                                                                                                                                                                                          | -       |
| onReply              | 回复回调          | `(message: string) => void`                                                                                                                                                                                                                                                                                                                                     | -       |
| slidesModeProps      | 幻灯片模式配置    | `{ enable?: boolean; afterOpenChange?: (message: MessageBubbleData) => void }`                                                                                                                                                                                                                                                                                  | -       |
| styles               | 样式配置对象      | `{ bubbleListItemStyle?: React.CSSProperties; bubbleListItemContentStyle?: React.CSSProperties; bubbleListLeftItemContentStyle?: React.CSSProperties; bubbleListRightItemContentStyle?: React.CSSProperties; bubbleListItemTitleStyle?: React.CSSProperties; bubbleListItemAvatarStyle?: React.CSSProperties; bubbleListItemExtraStyle?: React.CSSProperties }` | -       |

### MessageBubbleData

| 参数          | 说明         | 类型                                                                                                                                                                                                                      | 默认值  |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| content       | 消息内容     | `React.ReactNode`                                                                                                                                                                                                         | -       |
| originContent | 原始文本内容 | `string`                                                                                                                                                                                                                  | -       |
| error         | 错误信息     | `any`                                                                                                                                                                                                                     | -       |
| model         | AI模型标识符 | `string`                                                                                                                                                                                                                  | -       |
| name          | 发送者名称   | `string`                                                                                                                                                                                                                  | -       |
| parentId      | 父消息ID     | `string`                                                                                                                                                                                                                  | -       |
| role          | 发送者角色   | `'user' \| 'system' \| 'assistant' \| 'agent' \| 'bot'`                                                                                                                                                                   | -       |
| createAt      | 创建时间戳   | `number`                                                                                                                                                                                                                  | -       |
| endTime       | 结束时间戳   | `number`                                                                                                                                                                                                                  | -       |
| id            | 消息唯一标识 | `string`                                                                                                                                                                                                                  | -       |
| updateAt      | 修改时间戳   | `number`                                                                                                                                                                                                                  | -       |
| extra         | 额外信息     | `{ white_box_process?: WhiteBoxProcessInterface[] \| WhiteBoxProcessInterface; chat_trace_id?: string; sessionId?: string; uuid?: string; clientId?: string; tags?: ('REJECT_TO_ANSWER' \| 'ABOUT_YOU' \| 'NORMAL')[]; }` | -       |
| meta          | 模型元数据   | `BubbleMetaData`                                                                                                                                                                                                          | -       |
| isFinished    | 是否完成     | `boolean`                                                                                                                                                                                                                 | `false` |
| isAborted     | 是否被终止   | `boolean`                                                                                                                                                                                                                 | `false` |
| feedback      | 用户反馈     | `'thumbsUp' \| 'thumbsDown' \| 'none'`                                                                                                                                                                                    | -       |
| isRetry       | 是否重试     | `boolean`                                                                                                                                                                                                                 | `false` |
| fileMap       | 文件映射     | `Map<string, AttachmentFile>`                                                                                                                                                                                             | -       |
