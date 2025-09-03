# AgentRunBar 组件 Demo 文档

## 概述

AgentRunBar 是一个用于显示AI任务运行状态的React组件，支持多种任务状态管理和用户交互。

## Demo 文件

### 1. task-running.tsx - 基础功能演示

- **文件路径**: `docs/demos/task-running.tsx`
- **功能**: 展示组件的基本用法和6种不同状态
- **特点**:
  - 基础用法示例
  - 6种状态完整展示（运行中、暂停、停止、完成等）
  - 响应式网格布局
  - 详细的Props说明

### 2. agent-run-bar-advanced.tsx - 高级功能演示

- **文件路径**: `docs/demos/agent-run-bar-advanced.tsx`
- **功能**: 展示组件的高级功能和多任务管理
- **特点**:
  - 多任务同时管理
  - 实时进度更新
  - 进度条可视化
  - 任务统计面板
  - 动态状态切换

## 组件状态

### 任务状态 (TASK_STATUS)

- `RUNNING`: 任务正在运行
- `SUCCESS`: 任务成功完成
- `ERROR`: 任务执行出错
- `PAUSE`: 任务已暂停
- `CANCELLED`: 任务已取消

### 运行状态 (TASK_RUNNING_STATUS)

- `RUNNING`: 正在运行中
- `COMPLETE`: 已完成
- `PAUSE`: 已暂停

## 主要功能

### 1. 状态管理

- 支持多种任务状态
- 自动状态切换
- 状态持久化

### 2. 进度显示

- 实时进度更新
- 耗时显示
- 步骤进度显示

### 3. 操作按钮

- 暂停/继续
- 停止任务
- 创建新任务
- 重试任务
- 提交结果

### 4. 视觉反馈

- 机器人状态动画
- 状态颜色区分
- 进度条可视化
- 响应式设计

## 使用场景

1. **AI模型训练**: 显示训练进度和状态
2. **数据处理任务**: 展示处理进度和操作选项
3. **自动化工作流**: 管理工作流执行状态
4. **批量任务管理**: 同时管理多个任务
5. **实时监控面板**: 监控系统运行状态

## 技术特性

- **React Hooks**: 使用useState和useEffect管理状态
- **TypeScript**: 完整的类型定义
- **CSS-in-JS**: 使用@ant-design/cssinjs样式系统
- **响应式设计**: 支持不同屏幕尺寸
- **主题定制**: 支持自定义主题色

## 更新记录

### 2024年更新

- 新增6种状态的完整展示
- 添加高级功能演示
- 优化响应式布局
- 增加进度条可视化
- 完善文档说明

## 开发指南

### 安装依赖

```bash
npm install @ant-design/md-editor
```

### 基础使用

```tsx
import {
  TaskRunning,
  TASK_STATUS,
  TASK_RUNNING_STATUS,
} from '@ant-design/md-editor';

<TaskRunning
  title="任务运行中"
  description="任务执行中..."
  taskStatus={TASK_STATUS.RUNNING}
  taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
  onPause={() => {}}
  onCreateNewTask={() => {}}
  onReplay={() => {}}
  onViewResult={() => {}}
/>;
```

### 自定义样式

组件支持通过className和style属性进行样式自定义，也可以使用主题系统进行全局样式配置。

## 注意事项

1. 确保正确导入组件和类型
2. 根据实际需求选择合适的任务状态
3. 实现必要的回调函数处理用户交互
4. 注意组件的生命周期管理
5. 合理使用状态更新避免性能问题
