# AgenticLayout 组件演示

## 概述

`AgenticLayout` 是一个专为智能体应用设计的三栏布局组件，支持左中右三个区域的灵活配置。

## 功能特性

- **三栏布局**: 支持左中右三个区域的灵活配置
- **折叠功能**: 左右侧栏支持独立折叠控制
- **响应式设计**: 中间区域自适应剩余宽度
- **主题集成**: 集成 Ant Design 主题系统
- **动画效果**: 平滑的折叠展开动画

## 使用方式

```tsx
import { AgenticLayout, History, ChatFlowContainer, Workspace } from '@ant-design/md-editor';

const App = () => {
  return (
    <AgenticLayout
      left={<History />}
      center={<ChatFlowContainer />}
      right={<Workspace />}
      leftCollapsible={true}
      rightCollapsible={true}
      onLeftCollapse={(collapsed) => console.log('左侧折叠:', collapsed)}
      onRightCollapse={(collapsed) => console.log('右侧折叠:', collapsed)}
    />
  );
};
```

## 演示内容

本演示展示了 `AgenticLayout` 组件的完整功能：

- **左侧**: 历史记录组件 (`History`)
- **中间**: 对话流容器 (`ChatFlowContainer`)
- **右侧**: 工作空间组件 (`Workspace`)

## 文件结构

```
docs/demos/AgenticLayout/
├── index.tsx          # 主演示组件
├── style.css          # 演示样式
└── README.md          # 说明文档
```

## 运行演示

```bash
# 启动开发服务器
npm run dev

# 访问演示页面
# http://localhost:3000/demos/AgenticLayout
```
