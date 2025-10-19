---
title: AgenticLayout 智能体布局组件
atomId: AgenticLayout
group:
  title: 对话流
  order: 1
---

# AgenticLayout 智能体布局组件

`AgenticLayout` 是一个专为智能体应用设计的三栏布局组件，支持左中右三个区域的灵活配置。

## 基本用法

```tsx
import {
  AgenticLayout,
  History,
  ChatFlowContainer,
  Workspace,
} from '@ant-design/md-editor';

const App = () => {
  return (
    <AgenticLayout
      left={<History />}
      center={<ChatFlowContainer />}
      right={<Workspace />}
    />
  );
};
```

## API

### AgenticLayoutProps

| 参数                  | 说明                 | 类型                           | 默认值    |
| --------------------- | -------------------- | ------------------------------ | --------- |
| left                  | 左侧内容             | `ReactNode`                    | -         |
| center                | 中间内容             | `ReactNode`                    | -         |
| right                 | 右侧内容             | `ReactNode`                    | -         |
| leftCollapsible       | 左侧是否可折叠       | `boolean`                      | `true`    |
| rightCollapsible      | 右侧是否可折叠       | `boolean`                      | `true`    |
| leftDefaultCollapsed  | 左侧默认折叠状态     | `boolean`                      | `false`   |
| rightDefaultCollapsed | 右侧默认折叠状态     | `boolean`                      | `false`   |
| onLeftCollapse        | 左侧折叠状态变化回调 | `(collapsed: boolean) => void` | -         |
| onRightCollapse       | 右侧折叠状态变化回调 | `(collapsed: boolean) => void` | -         |
| style                 | 自定义样式           | `React.CSSProperties`          | -         |
| className             | 自定义类名           | `string`                       | -         |
| leftWidth             | 左侧宽度             | `number`                       | `256`     |
| rightWidth            | 右侧宽度             | `number`                       | `256`     |
| minHeight             | 最小高度             | `string \| number`             | `'600px'` |

## 特性

- **三栏布局**: 支持左中右三个区域的灵活配置
- **折叠功能**: 左右侧栏支持独立折叠控制
- **响应式设计**: 中间区域自适应剩余宽度
- **主题集成**: 集成 Ant Design 主题系统
- **动画效果**: 平滑的折叠展开动画

## 使用场景

- 智能体对话界面
- 多面板工作台
- 需要侧边栏的复杂布局

## 注意事项

- `center` 属性是必需的
- 左右侧栏是可选的，可以根据需要配置
- 折叠状态变化会触发相应的回调函数
