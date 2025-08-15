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
| beforeMessageRender | 消息前渲染函数         | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
| afterMessageRender  | 消息后渲染函数         | `WithFalse<(props: BubbleProps<T>, defaultDom: ReactNode) => ReactNode>`                                                                                                  | -      |
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

### titleRender 自定义标题渲染

`titleRender` 功能允许您完全自定义消息标题的渲染方式，可以替换默认的标题显示逻辑。

#### 使用示例

```tsx | pure
// 自定义 titleRender 函数
const customTitleRender = (props, defaultDom) => {
  const { originData, avatar } = props;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 0',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      <span style={{ color: '#1890ff' }}>
        {avatar?.title || originData?.name || 'AI助手'}
      </span>
      <span style={{ color: '#999', fontSize: '12px' }}>
        {originData?.model && `(${originData.model})`}
      </span>
      <span style={{ color: '#999', fontSize: '12px' }}>
        {originData?.createAt &&
          new Date(originData.createAt).toLocaleTimeString()}
      </span>
    </div>
  );
};

// 使用配置
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    titleRender: customTitleRender, // 自定义标题渲染
    // titleRender: false,          // 或者隐藏标题
  }}
/>;
```

#### 参数说明

- `props: BubbleProps<T>` - 当前气泡组件的所有属性，包括消息数据、配置等
- `defaultDom: ReactNode` - 默认的标题内容，可以忽略或包含在自定义渲染中

#### 注意事项

- `titleRender` 在所有消息类型中都生效
- 当设置 `titleRender: false` 时，会完全隐藏标题区域
- 自定义标题不会影响其他功能，如头像、内容等

### contentRender 自定义内容渲染

`contentRender` 功能允许您完全自定义消息内容的渲染方式，可以替换默认的 Markdown 内容渲染逻辑。

#### 使用示例

```tsx | pure
// 自定义 contentRender 函数
const customContentRender = (props, defaultDom) => {
  const { originData, loading } = props;

  if (loading) {
    return (
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Spin size="small" />
        <span style={{ marginLeft: 8 }}>正在生成回复...</span>
      </div>
    );
  }

  // 如果是错误状态
  if (originData?.error) {
    return (
      <div
        style={{
          padding: '12px',
          background: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '6px',
          color: '#cf1322',
        }}
      >
        ❌ 生成失败: {originData.error.message}
      </div>
    );
  }

  // 返回默认内容或自定义内容
  return (
    defaultDom || (
      <div style={{ padding: '12px' }}>{originData?.content || '暂无内容'}</div>
    )
  );
};

// 使用配置
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    contentRender: customContentRender, // 自定义内容渲染
  }}
/>;
```

#### 参数说明

- `props: BubbleProps<T>` - 当前气泡组件的所有属性，包括消息数据、配置等
- `defaultDom: ReactNode` - 默认的内容渲染结果，通常是 Markdown 渲染后的内容

#### 注意事项

- `contentRender` 在所有消息类型中都生效
- 当设置 `contentRender: false` 时，会完全隐藏内容区域
- 自定义内容渲染会替换默认的 Markdown 渲染逻辑

### beforeMessageRender 和 afterMessageRender 自定义消息前后渲染

`beforeMessageRender` 和 `afterMessageRender` 功能允许您在消息内容的前后添加自定义内容，这些内容会直接插入到 Markdown 内容的前后。

#### 使用示例

```tsx | pure
// 自定义 beforeMessageRender 函数
const customBeforeMessageRender = (props, defaultDom) => {
  const { originData } = props;

  return (
    <div
      style={{
        padding: '8px 12px',
        background: '#f6ffed',
        border: '1px solid #b7eb8f',
        borderRadius: '6px',
        marginBottom: '8px',
        fontSize: '12px',
        color: '#52c41a',
      }}
    >
      🔍 分析结果: 共找到 {originData?.extra?.searchCount || 0} 个相关结果
    </div>
  );
};

// 自定义 afterMessageRender 函数
const customAfterMessageRender = (props, defaultDom) => {
  const { originData } = props;

  return (
    <div
      style={{
        padding: '8px 12px',
        background: '#fff7e6',
        border: '1px solid #ffd591',
        borderRadius: '6px',
        marginTop: '8px',
        fontSize: '12px',
        color: '#fa8c16',
      }}
    >
      📊 生成统计: 耗时 {originData?.extra?.duration || 0}ms，使用{' '}
      {originData?.model || 'unknown'} 模型
    </div>
  );
};

// 使用配置
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    beforeMessageRender: customBeforeMessageRender, // 消息前渲染
    afterMessageRender: customAfterMessageRender, // 消息后渲染
  }}
/>;
```

#### 参数说明

- `props: BubbleProps<T>` - 当前气泡组件的所有属性，包括消息数据、配置等
- `defaultDom: ReactNode` - 默认为 `null`，可以忽略

#### 注意事项

- `beforeMessageRender` 和 `afterMessageRender` 在所有消息类型中都生效
- 当设置为 `false` 时，不会渲染任何内容
- 这些内容会直接插入到 Markdown 内容的前后，不会影响其他功能

### afterContentRender 和 beforeContentRender 自定义内容前后渲染

`afterContentRender` 和 `beforeContentRender` 功能允许您在消息内容的前后添加自定义内容，这些内容会直接插入到 Markdown 内容的前后。

**注意**: 这两个属性与 `beforeMessageRender` 和 `afterMessageRender` 功能类似，但它们是不同的属性。`beforeMessageRender` 和 `afterMessageRender` 是更新的 API，建议优先使用。

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

### avatarRender 自定义头像渲染

`avatarRender` 功能允许您完全自定义头像的渲染方式，可以替换默认的头像显示逻辑。

#### 使用示例

```tsx | pure
// 自定义 avatarRender 函数
const customAvatarRender = (props, defaultDom) => {
  const { avatar, originData, placement } = props;

  // 根据角色显示不同的头像
  if (placement === 'right') {
    return (
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        👤
      </div>
    );
  }

  // AI 头像
  if (avatar?.avatar) {
    return (
      <img
        src={avatar.avatar}
        alt={avatar.title || 'AI'}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  }

  // 默认 AI 头像
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#52c41a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
      }}
    >
      🤖
    </div>
  );
};

// 使用配置
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    avatarRender: customAvatarRender, // 自定义头像渲染
    // avatarRender: false,          // 或者隐藏头像
  }}
/>;
```

#### 参数说明

- `props: BubbleProps<T>` - 当前气泡组件的所有属性，包括消息数据、配置等
- `defaultDom: ReactNode` - 默认的头像内容，可以忽略或包含在自定义渲染中

#### 注意事项

- `avatarRender` 在所有消息类型中都生效
- 当设置 `avatarRender: false` 时，会完全隐藏头像区域
- 自定义头像不会影响其他功能，如标题、内容等

### render 整体自定义渲染

`render` 功能允许您完全自定义整个气泡组件的渲染方式，提供最大的灵活性。

#### 使用示例

```tsx | pure
// 自定义 render 函数
const customRender = (props, domsMap, defaultDom) => {
  const { avatar, title, messageContent, itemDom } = domsMap;
  const { originData, placement, loading } = props;

  // 完全自定义布局
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: placement === 'right' ? 'row-reverse' : 'row',
        gap: '12px',
        padding: '16px',
        background: placement === 'right' ? '#f0f9ff' : '#fafafa',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* 头像区域 */}
      <div style={{ flexShrink: 0 }}>{avatar}</div>

      {/* 内容区域 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 标题区域 */}
        <div style={{ marginBottom: '8px' }}>{title}</div>

        {/* 消息内容 */}
        <div
          style={{
            background: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          {messageContent}
        </div>

        {/* 额外信息 */}
        {originData?.extra && (
          <div
            style={{
              marginTop: '8px',
              padding: '8px',
              background: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#6c757d',
            }}
          >
            💡 提示: 这是自定义渲染的消息
          </div>
        )}
      </div>
    </div>
  );
};

// 使用配置
<Bubble
  originData={messageData}
  bubbleRenderConfig={{
    render: customRender, // 自定义整体渲染
  }}
/>;
```

#### 参数说明

- `props: BubbleProps<T>` - 当前气泡组件的所有属性，包括消息数据、配置等
- `domsMap: { avatar: ReactNode; title: ReactNode; messageContent: ReactNode; itemDom: ReactNode }` - 各个部分的默认渲染结果
- `defaultDom: ReactNode` - 默认的整体渲染结果

#### 注意事项

- `render` 在所有消息类型中都生效
- 当设置 `render: false` 时，会使用默认的渲染逻辑
- 自定义整体渲染会完全替换默认的布局和样式
- 可以通过 `domsMap` 参数获取各个部分的默认渲染结果进行组合

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

### extraRightRender 自定义右侧额外操作区域

`extraRightRender` 功能允许您自定义右侧消息的额外操作区域，通常用于用户消息的自定义操作。

#### 使用示例

```tsx | pure
// 自定义 extraRightRender 函数
const customExtraRightRender = (props, defaultDom) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {/* 自定义操作按钮 */}
      <Button
        size="small"
        icon={<EditOutlined />}
        onClick={() => handleEdit(props.id)}
      >
        编辑
      </Button>
      <Button
        size="small"
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDelete(props.id)}
      >
        删除
      </Button>
    </div>
  );
};

// 使用配置
<Bubble
  originData={messageData}
  placement="right"
  bubbleRenderConfig={{
    extraRightRender: customExtraRightRender, // 自定义右侧额外操作
  }}
/>;
```

#### 参数说明

- `props: BubbleProps<T>` - 当前气泡组件的所有属性，包括消息数据、配置等
- `defaultDom: ReactNode` - 默认的右侧额外操作区域内容

#### 注意事项

- `extraRightRender` 只在右侧消息（用户消息）中生效
- 当设置 `extraRightRender: false` 时，会完全禁用右侧额外操作区域
- 自定义右侧操作区域不会影响左侧消息的额外操作区域

## Render 方法优先级说明

当同时配置多个 render 方法时，它们的优先级和执行顺序如下：

1. **render** - 最高优先级，如果设置了 `render`，其他所有 render 方法都会被忽略
2. **titleRender** - 自定义标题渲染
3. **avatarRender** - 自定义头像渲染
4. **contentRender** - 自定义内容渲染
5. **contentBeforeRender** - 内容前渲染
6. **contentAfterRender** - 内容后渲染
7. **beforeMessageRender** - 消息前渲染
8. **afterMessageRender** - 消息后渲染
9. **beforeContentRender** - 内容前渲染（仅左侧消息）
10. **afterContentRender** - 内容后渲染（仅左侧消息）
11. **extraRender** - 额外操作区域渲染（仅左侧消息）
12. **extraRightRender** - 右侧额外操作区域渲染（仅右侧消息）

### 组合使用示例

```tsx
import { Bubble } from '@ant-design/md-editor';
import { Button } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const messageData = {
  id: '1',
  content: 'Hello, world!',
  createAt: Date.now(),
  updateAt: Date.now(),
  extra: {
    like: 0,
  },
};

// 组合使用多个 render 方法
const App = () => {
  return (
    <>
      <Bubble
        originData={messageData}
        bubbleRenderConfig={{
          // 自定义标题
          titleRender: (props) => (
            <div style={{ color: '#1890ff', fontWeight: 'bold' }}>
              {props.avatar?.title || 'AI助手'}
            </div>
          ),

          // 自定义头像
          avatarRender: (props) => (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#52c41a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              🤖
            </div>
          ),
          beforeMessageRender: (props) => (
            <div
              style={{
                padding: '8px',
                background: '#fff7e6',
                borderRadius: '4px',
                marginBottom: '8px',
                fontSize: '12px',
              }}
            >
              <div>💡 消息前提示</div>
            </div>
          ),
          afterMessageRender: (props) => (
            <div
              style={{
                padding: '8px',
                background: '#f6ffed',
                borderRadius: '4px',
                marginTop: '8px',
                fontSize: '12px',
              }}
            >
              <div>💡 消息后提示</div>
            </div>
          ),
          // 内容前添加提示
          contentBeforeRender: (props) => (
            <div
              style={{
                padding: '8px',
                background: '#fff7e6',
                borderRadius: '4px',
                marginBottom: '8px',
                fontSize: '12px',
              }}
            >
              💡 这是 AI 生成的回复
            </div>
          ),

          // 内容后添加统计
          contentAfterRender: (props) => (
            <div
              style={{
                padding: '8px',
                background: '#f6ffed',
                borderRadius: '4px',
                marginTop: '8px',
                fontSize: '12px',
              }}
            >
              📊 生成时间:{' '}
              {new Date(props.originData?.createAt).toLocaleTimeString()}
            </div>
          ),
          // 自定义额外操作
          extraRender: (props, defaultDom) => (
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Button
                size="small"
                type="text"
                icon={<StarOutlined />}
                style={{
                  width: 120,
                }}
              >
                收藏
              </Button>
              {defaultDom}
            </div>
          ),
        }}
      />
    </>
  );
};
export default App;
```

通过合理组合这些 render 方法，您可以实现高度自定义的消息气泡组件，满足各种复杂的业务需求。
