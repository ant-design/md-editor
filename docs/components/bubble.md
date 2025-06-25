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

## API

### Bubble

| 参数                     | 说明                              | 类型                  | 默认值   |
| ------------------------ | --------------------------------- | --------------------- | -------- |
| avatar                   | 头像的元数据，包含头像URL、名称等 | `BubbleMetaData`      | -        |
| className                | 聊天项的自定义 CSS 类名           | `string`              | -        |
| loading                  | 聊天项是否处于加载状态            | `boolean`             | `false`  |
| onAvatarClick            | 头像点击事件的回调函数            | `() => void`          | -        |
| onDoubleClick            | 双击事件的回调函数                | `() => void`          | -        |
| placement                | 聊天项的放置位置                  | `'left' \| 'right'`   | `'left'` |
| time                     | 聊天项的时间戳                    | `number`              | -        |
| style                    | 聊天项组件的自定义 CSS 样式       | `React.CSSProperties` | -        |
| chatListItemContentStyle | 聊天项内容的自定义 CSS 样式       | `React.CSSProperties` | -        |
| chatListItemTitleStyle   | 聊天项标题的自定义 CSS 样式       | `React.CSSProperties` | -        |
| chatListItemAvatarStyle  | 聊天项头像的自定义 CSS 样式       | `React.CSSProperties` | -        |
| originData               | 消息的原始数据                    | `ChatMessage`         | -        |
| deps                     | 依赖项数组                        | `any[]`               | -        |
| chatRef                  | 聊天列表的引用                    | `MutableRefObject`    | -        |

### BubbleMetaData

| 参数            | 说明     | 类型     | 默认值 |
| --------------- | -------- | -------- | ------ |
| avatar          | 角色头像 | `string` | -      |
| backgroundColor | 背景色   | `string` | -      |
| title           | 名称     | `string` | -      |

### bubbleRenderConfig

聊天项组件的自定义渲染配置对象，提供以下渲染函数：

| 参数                | 说明                       | 类型                                                                         |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| titleRender         | 标题组件的自定义渲染函数   | `(props: BubbleProps, defaultDom: ReactNode) => ReactNode`                   |
| contentRender       | 内容组件的自定义渲染函数   | `(props: BubbleProps, defaultDom: ReactNode) => ReactNode`                   |
| contentAfterRender  | 操作组件的自定义渲染函数   | `(props: BubbleProps, defaultDom: ReactNode) => ReactNode`                   |
| contentBeforeRender | 前置组件的自定义渲染函数   | `(props: BubbleProps, defaultDom: ReactNode) => ReactNode`                   |
| avatarRender        | 头像组件的自定义渲染函数   | `(props: BubbleProps, defaultDom: ReactNode) => ReactNode`                   |
| render              | 整个聊天项的自定义渲染函数 | `(props: BubbleProps, domsMap: DomsMap, defaultDom: ReactNode) => ReactNode` |

### BubbleAvatar

| 参数       | 说明                             | 类型                   | 默认值     |
| ---------- | -------------------------------- | ---------------------- | ---------- |
| avatar     | 头像图片的URL或base64数据        | `string`               | -          |
| background | 头像的背景颜色                   | `string`               | -          |
| shape      | 头像的形状                       | `'circle' \| 'square'` | `'circle'` |
| size       | 头像的尺寸（像素）               | `number`               | `24`       |
| title      | 如果未提供头像，则显示的标题文本 | `string`               | -          |

### BubbleExtra

| 参数            | 说明                 | 类型                                                                     | 默认值  |
| --------------- | -------------------- | ------------------------------------------------------------------------ | ------- |
| onReply         | 回复消息的回调函数   | `(message: string) => void`                                              | -       |
| onDisLike       | 点踩的回调函数       | `() => void`                                                             | -       |
| onLike          | 点赞的回调函数       | `() => void`                                                             | -       |
| readonly        | 是否为只读模式       | `boolean`                                                                | `false` |
| isLatest        | 是否为最新消息       | `boolean`                                                                | `false` |
| slidesModeProps | 幻灯片模式的配置属性 | `{ enable?: boolean; afterOpenChange?: (message: ChatMessage) => void }` | -       |
