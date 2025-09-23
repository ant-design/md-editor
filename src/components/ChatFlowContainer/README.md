# ChatFlowContainer 对话流容器组件

## 概述

`ChatFlowContainer` 是一个完整的对话流容器组件，提供了标准的对话界面布局，包含头部区域、内容区域和底部区域。

## 功能特性

- **头部区域**：包含标题、左侧折叠按钮、分享按钮和右侧折叠按钮
- **内容区域**：可滚动的对话内容区域，用于放置 BubbleList 等组件
- **底部区域**：固定在底部的操作区域，用于放置输入框或AI对话按钮
- **响应式设计**：支持不同屏幕尺寸的适配
- **可定制性**：支持自定义样式、类名和事件处理

## 基本用法

```tsx
import React from 'react';
import { ChatFlowContainer } from './components/ChatFlowContainer';

const App = () => {
  const handleLeftCollapse = () => {
    console.log('左侧边栏折叠');
  };

  const handleRightCollapse = () => {
    console.log('右侧边栏折叠');
  };

  const handleShare = () => {
    console.log('分享对话');
  };

  return (
    <ChatFlowContainer
      title="AI 助手"
      onLeftCollapse={handleLeftCollapse}
      onRightCollapse={handleRightCollapse}
      onShare={handleShare}
      footer={
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <button>发送消息</button>
        </div>
      }
    >
      <div>这里是对话内容区域</div>
    </ChatFlowContainer>
  );
};
```

## 高级用法

### 自定义头部按钮显示

```tsx
<ChatFlowContainer
  title="自定义标题"
  showLeftCollapse={false} // 隐藏左侧折叠按钮
  showRightCollapse={true} // 显示右侧折叠按钮
  showShare={false} // 隐藏分享按钮
  onRightCollapse={() => console.log('右侧折叠')}
>
  <div>对话内容</div>
</ChatFlowContainer>
```

### 自定义样式

```tsx
<ChatFlowContainer
  title="AI 助手"
  className="custom-chat-container"
  style={{ backgroundColor: '#f5f5f5' }}
  onLeftCollapse={handleLeftCollapse}
  onRightCollapse={handleRightCollapse}
  onShare={handleShare}
>
  <div>对话内容</div>
</ChatFlowContainer>
```

### 与 BubbleList 结合使用

```tsx
import { BubbleList } from './BubbleList';

<ChatFlowContainer
  title="AI 助手"
  onLeftCollapse={handleLeftCollapse}
  onRightCollapse={handleRightCollapse}
  onShare={handleShare}
  footer={<InputArea />}
>
  <BubbleList messages={messages} />
</ChatFlowContainer>;
```

## API 参考

### ChatFlowContainerProps

| 属性              | 类型                | 默认值    | 描述                 |
| ----------------- | ------------------- | --------- | -------------------- |
| title             | string              | 'AI 助手' | 头部标题文本         |
| showLeftCollapse  | boolean             | true      | 是否显示左侧折叠按钮 |
| showRightCollapse | boolean             | true      | 是否显示右侧折叠按钮 |
| showShare         | boolean             | true      | 是否显示分享按钮     |
| onLeftCollapse    | () => void          | -         | 左侧折叠按钮点击事件 |
| onRightCollapse   | () => void          | -         | 右侧折叠按钮点击事件 |
| onShare           | () => void          | -         | 分享按钮点击事件     |
| children          | ReactNode           | -         | 内容区域的自定义内容 |
| footer            | ReactNode           | -         | 底部区域的自定义内容 |
| className         | string              | -         | 自定义类名           |
| style             | React.CSSProperties | -         | 自定义样式           |

## 样式定制

组件使用 CSS 变量进行样式定制，支持以下变量：

- `--color-gray-bg-card-white`: 背景色
- `--color-gray-border-light`: 边框色
- `--color-gray-text-default`: 默认文本色
- `--color-gray-text-secondary`: 次要文本色
- `--color-blue-control-fill-hover`: 悬停背景色
- `--color-primary-control-fill-primary`: 主色调

## 注意事项

1. 组件需要父容器有明确的高度才能正常显示
2. 底部区域使用 `position: sticky` 固定在底部
3. 内容区域支持自动滚动，建议配合虚拟滚动使用大量数据
4. 所有按钮都支持键盘导航和屏幕阅读器
