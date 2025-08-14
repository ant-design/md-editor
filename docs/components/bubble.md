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

### 自定义额外操作区域

展示如何使用 `extraRender` 功能自定义气泡消息的额外操作区域，包括添加自定义按钮、禁用默认操作等。

<code src="../demos/bubble/extra-render.tsx"></code>

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

| 参数                | 说明                   | 类型                                                                                                                                                                      | 默认值 |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| titleRender         | 标题渲染函数           | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| contentRender       | 内容渲染函数           | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| contentAfterRender  | 内容后渲染函数         | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| contentBeforeRender | 内容前渲染函数         | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| afterContentRender  | afterContent 渲染函数  | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| beforeContentRender | beforeContent 渲染函数 | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| avatarRender        | 头像渲染函数           | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| extraRender         | 额外内容渲染函数       | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| extraRightRender    | 右侧额外内容渲染函数   | `BubbleExtraProps['render']`                                                                                                                                              | -      |
| render              | 整体渲染函数           | `WithFalse<(props: BubbleProps<T>, domsMap: { avatar: ReactNode; title: ReactNode; messageContent: ReactNode; itemDom: ReactNode }, defaultDom: ReactNode) => ReactNode>` | -      |
| customConfig        | 自定义配置             | `CustomConfig`                                                                                                                                                            | -      |

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

| 参数          | 说明         | 类型                                                                                                                                                                                                                      | 默认值 |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| content       | 消息内容     | `React.ReactNode`                                                                                                                                                                                                         | -      |
| originContent | 原始文本内容 | `string`                                                                                                                                                                                                                  | -      |
| error         | 错误信息     | `any`                                                                                                                                                                                                                     | -      |
| model         | AI模型标识符 | `string`                                                                                                                                                                                                                  | -      |
| name          | 发送者名称   | `string`                                                                                                                                                                                                                  | -      |
| parentId      | 父消息ID     | `string`                                                                                                                                                                                                                  | -      |
| role          | 发送者角色   | `'user' \| 'system' \| 'assistant' \| 'agent' \| 'bot'`                                                                                                                                                                   | -      |
| createAt      | 创建时间戳   | `number`                                                                                                                                                                                                                  | -      |
| endTime       | 结束时间戳   | `number`                                                                                                                                                                                                                  | -      |
| id            | 消息唯一标识 | `string`                                                                                                                                                                                                                  | -      |
| updateAt      | 修改时间戳   | `number`                                                                                                                                                                                                                  | -      |
| extra         | 额外信息     | `{ white_box_process?: WhiteBoxProcessInterface[] \| WhiteBoxProcessInterface; chat_trace_id?: string; sessionId?: string; uuid?: string; clientId?: string; tags?: ('REJECT_TO_ANSWER' \| 'ABOUT_YOU' \| 'NORMAL')[]; }` | -      |
| meta          | 模型元数据   | `BubbleMetaData`                                                                                                                                                                                                          | -      |

## 功能特性

### extraRender 自定义额外操作区域

`extraRender` 功能允许您完全自定义气泡消息的额外操作区域，您可以：

1. **自定义操作按钮**：添加点赞、收藏、分享等自定义操作
2. **保留默认操作**：通过 `defaultDom` 参数包含默认的点赞、点踩、复制等操作
3. **完全替换**：完全替换默认操作区域为自定义内容
4. **禁用操作区域**：设置为 `false` 完全禁用额外操作区域

#### 使用示例

```tsx | pure
// 自定义 extraRender 函数
const customExtraRender = (props, defaultDom) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* 自定义操作按钮 */}
      <Button icon={<HeartOutlined />} onClick={() => handleLike(props.id)}>
        点赞
      </Button>
      <Button icon={<StarOutlined />} onClick={() => handleFavorite(props.id)}>
        收藏
      </Button>

      {/* 包含默认操作按钮 */}
      {defaultDom}
    </div>
  );
};

// 使用配置
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    extraRender: customExtraRender, // 自定义渲染
    // extraRender: false,           // 或者禁用额外操作
  }}
/>;
```

#### 参数说明

- `props: BubbleProps<T>` - 当前气泡组件的所有属性，包括消息数据、配置等
- `defaultDom: ReactNode` - 默认的额外操作区域内容，包含点赞、点踩、复制等按钮

#### 注意事项

- `extraRender` 只在左侧消息（AI回复）中生效，右侧消息（用户消息）不会显示额外操作区域
- 当设置 `extraRender: false` 时，会完全禁用额外操作区域
- 在异常状态下，自定义的 `extraRender` 仍然会生效

### afterContentRender 和 beforeContentRender 自定义内容前后渲染

`afterContentRender` 和 `beforeContentRender` 功能允许您在消息内容的前后添加自定义内容，这些内容会直接插入到 Markdown 内容的前后。

#### 使用示例

```tsx | pure
// 自定义 beforeContentRender 和 afterContentRender 函数
const customBeforeContentRender = (props, defaultDom) => {
  return (
    <div
      style={{
        padding: '8px 12px',
        background: '#f5f5f5',
        borderRadius: '6px',
        marginBottom: '8px',
        fontSize: '12px',
        color: '#666',
      }}
    >
      📝 消息创建时间: {new Date(props.originData?.createAt).toLocaleString()}
    </div>
  );
};

const customAfterContentRender = (props, defaultDom) => {
  return (
    <div
      style={{
        padding: '8px 12px',
        background: '#e6f7ff',
        borderRadius: '6px',
        marginTop: '8px',
        fontSize: '12px',
        color: '#1890ff',
      }}
    >
      ✅ 消息状态: {props.originData?.isFinished ? '已完成' : '生成中...'}
    </div>
  );
};

// 使用配置
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    beforeContentRender: customBeforeContentRender, // 内容前渲染
    afterContentRender: customAfterContentRender, // 内容后渲染
  }}
/>;
```

#### 参数说明

- `props: BubbleProps<T>` - 当前气泡组件的所有属性，包括消息数据、配置等
- `defaultDom: ReactNode` - 默认为 `null`，可以忽略

#### 注意事项

- `beforeContentRender` 和 `afterContentRender` 只在左侧消息（AI回复）中生效
- 当设置为 `false` 时，不会渲染任何内容
- 这些内容会直接插入到 Markdown 内容的前后，不会影响其他功能
- 支持返回任何有效的 React 节点，包括组件、HTML 元素等
  | isFinished | 是否完成 | `boolean` | `false` |
  | isAborted | 是否被终止 | `boolean` | `false` |
  | feedback | 用户反馈 | `'thumbsUp' \| 'thumbsDown' \| 'none'` | - |
  | isRetry | 是否重试 | `boolean` | `false` |
  | fileMap | 文件映射 | `Map<string, AttachmentFile>` | - |
