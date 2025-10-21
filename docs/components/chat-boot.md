---
title: ChatBoot - 对话启动
atomId: ChatBoot
group:
  title: 布局
  order: 3
---

# 对话流容器组件

该组件提供了一个完整的对话流容器，包含头部区域、内容区域和底部区域。

## 基础用法

<code src="../demos/ChatBoot/index.tsx" iframe=540></code>

## API 参考

### ChatLayoutProps

| 属性             | 类型                | 默认值    | 描述                 |
| ---------------- | ------------------- | --------- | -------------------- |
| title            | string              | 'AI 助手' | 头部标题文本         |
| showLeftCollapse | boolean             | true      | 是否显示左侧折叠按钮 |
| showShare        | boolean             | true      | 是否显示分享按钮     |
| onLeftCollapse   | () => void          | -         | 左侧折叠按钮点击事件 |
| onShare          | () => void          | -         | 分享按钮点击事件     |
| children         | ReactNode           | -         | 内容区域的自定义内容 |
| footer           | ReactNode           | -         | 底部区域的自定义内容 |
| className        | string              | -         | 自定义类名           |
| style            | React.CSSProperties | -         | 自定义样式           |

## 设计理念

1. 组件需要父容器有明确的高度才能正常显示
2. 内容区域支持自动滚动，建议配合虚拟滚动使用大量数据
3. 所有按钮都支持键盘导航和屏幕阅读器
