# Agentic UI - 面向智能体的 UI 组件库

[![NPM version](https://img.shields.io/npm/v/@ant-design/agentic-ui.svg?style=flat)](https://npmjs.org/package/@ant-design/agentic-ui)
[![NPM downloads](http://img.shields.io/npm/dm/@ant-design/agentic-ui.svg?style=flat)](https://npmjs.org/package/@ant-design/agentic-ui)

> 从"回答一句话"到"完成一件事"——让智能体真正成为你的协作伙伴

## ✨ 什么是 Agentic UI

**Agentic UI** 是一种面向"**思考—行动—观察**"闭环的智能体交互组件库，强调**任务执行全过程的协同**。

### 核心特性

- 🤖 **多步推理可视化** - 展示智能体的思考、行动、观察过程
- 🔧 **工具调用展示** - 可视化工具编排与执行状态
- 👤 **人在回路** - 支持人工审批、干预或纠偏
- 📊 **过程透明化** - 让 AI 决策过程可见、可控、可复盘

### 与传统 Chat UI 的区别

| 维度       | Chat UI    | Agentic UI     |
| ---------- | ---------- | -------------- |
| 核心目标   | 回答一句话 | 完成一件事     |
| 交互深度   | 单轮问答   | 端到端任务协同 |
| 过程可见性 | 黑盒       | 透明化         |
| 人机关系   | 被动响应   | 主动协作       |

---

## 🚀 快速开始

### 安装

```bash
npm install @ant-design/agentic-ui
# 或
pnpm add @ant-design/agentic-ui
```

### 基础示例：AI 对话气泡

```tsx
import { Bubble } from '@ant-design/agentic-ui';

<Bubble.AIBubble
  content="我已经完成了数据分析，这是结果："
  thoughtChain={[
    { type: 'thought', content: '首先需要查询数据库' },
    { type: 'action', content: '执行 SQL 查询' },
    { type: 'observation', content: '获取到 1000 条记录' },
  ]}
/>;
```

### 任务列表组件

```tsx
import { TaskList } from '@ant-design/agentic-ui';

<TaskList
  tasks={[
    { id: 1, title: '数据查询', status: 'completed' },
    { id: 2, title: '数据分析', status: 'in_progress' },
    { id: 3, title: '生成报告', status: 'pending' },
  ]}
/>;
```

### 工具调用展示

```tsx
import { ToolUseBar } from '@ant-design/agentic-ui';

<ToolUseBar
  toolName="database_query"
  status="running"
  params={{ table: 'users', limit: 100 }}
  result={{ count: 1000, data: [...] }}
/>
```

### Markdown 编辑器（支持流式输出）

```tsx
import { MarkdownEditor } from '@ant-design/agentic-ui';

<MarkdownEditor
  initValue="# AI 生成内容"
  typewriter={true} // 打字机效果
  readonly={false}
/>;
```

---

## 🧩 核心组件

| 组件               | 描述            | 适用场景          |
| ------------------ | --------------- | ----------------- |
| `Bubble`           | AI/用户对话气泡 | 对话界面          |
| `ThoughtChainList` | 思维链可视化    | 展示推理过程      |
| `TaskList`         | 任务列表与进度  | 多步骤任务        |
| `ToolUseBar`       | 工具调用展示    | 展示 API/工具调用 |
| `MarkdownEditor`   | 富文本编辑器    | 内容编辑与展示    |
| `AgenticLayout`    | 智能体布局容器  | 整体页面布局      |
| `Workspace`        | 工作空间        | 文件管理          |
| `History`          | 历史记录        | 会话历史          |

---

## 📦 特性

- ✅ **开箱即用** - 预设样式与交互，快速集成
- ✅ **TypeScript** - 完整的类型定义
- ✅ **主题定制** - 基于 Ant Design 主题系统
- ✅ **响应式** - 适配桌面端与移动端
- ✅ **流式输出** - 支持打字机效果
- ✅ **多模态** - 支持文本、图像、语音
- ✅ **插件化** - 可扩展的插件系统
- ✅ **国际化** - 内置多语言支持

---

## 📖 文档与示例

- [在线演示](https://ant-design.github.io/md-editor/)
- [完整文档](./docs/)
- [组件 API](./docs/components/)
- [设计规范](./docs/design-system/)

---

## 🌟 推荐使用场景

- 🤖 企业 Copilot（智能办公助手）
- 💬 智能客服与知识检索
- 📊 数据分析与 BI 助手
- 🔄 流程自动化（RPA）协同智能体

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

查看 [贡献指南](./CONTRIBUTING.md) 了解详情。

---

## 📄 许可证

[MIT License](./LICENSE)

---

**让 AI 的思考过程透明化，让智能体真正成为你的协作伙伴 🤖**
