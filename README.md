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

## 🧩 完整组件列表

### 🤖 核心智能体组件

| 组件               | 描述               | 主要功能                                     | 文档链接      |
| ------------------ | ------------------ | -------------------------------------------- | ------------- |
| `AgenticLayout`    | 智能体布局容器     | 提供统一的智能体应用布局结构                 | [查看文档](#) |
| `AgentRunBar`      | 智能体运行状态栏   | 显示运行、暂停、停止等状态控制               | [查看文档](#) |
| `Bubble`           | AI/用户对话气泡    | 展示对话内容，支持 AI 和用户消息的差异化展示 | [查看文档](#) |
| `ThoughtChainList` | 思维链可视化       | 展示"思考—行动—观察"的完整推理过程           | [查看文档](#) |
| `TaskList`         | 任务列表与进度跟踪 | 多步骤任务的状态管理与展示                   | [查看文档](#) |
| `ToolUseBar`       | 工具调用展示       | 可视化 API 调用、参数、状态与结果            | [查看文档](#) |
| `Workspace`        | 智能体工作空间     | 文件管理、浏览器、实时跟踪等功能             | [查看文档](#) |

### ✍️ 编辑与输入组件

| 组件                 | 描述                   | 主要功能                                     | 文档链接      |
| -------------------- | ---------------------- | -------------------------------------------- | ------------- |
| `MarkdownEditor`     | 富文本 Markdown 编辑器 | 支持流式输出、打字机效果、完整 Markdown 语法 | [查看文档](#) |
| `MarkdownInputField` | Markdown 输入框        | 支持多模态输入、文件上传、语音输入           | [查看文档](#) |
| `AttachmentButton`   | 附件上传按钮           | 文件、图片等多种附件上传                     | [查看文档](#) |
| `VoiceInput`         | 语音输入组件           | 语音转文字，支持实时识别                     | [查看文档](#) |
| `RefinePromptButton` | 提示词优化按钮         | AI 辅助优化用户输入的提示词                  | [查看文档](#) |

### 📋 布局与容器组件

| 组件         | 描述         | 主要功能                             | 文档链接      |
| ------------ | ------------ | ------------------------------------ | ------------- |
| `ChatLayout` | 聊天布局容器 | 标准聊天界面布局，支持左右栏、全屏等 | [查看文档](#) |
| `History`    | 历史记录组件 | 会话历史管理，支持搜索、筛选、导出   | [查看文档](#) |
| `Welcome`    | 欢迎页组件   | 应用启动欢迎页，展示功能介绍         | [查看文档](#) |
| `Quote`      | 引用组件     | 引用消息或内容                       | [查看文档](#) |

### 🎯 交互与反馈组件

| 组件             | 描述          | 主要功能                         | 文档链接      |
| ---------------- | ------------- | -------------------------------- | ------------- |
| `AnswerAlert`    | 答案提醒组件  | 显示成功、错误、警告、加载等状态 | [查看文档](#) |
| `BackTo`         | 返回顶部/底部 | 快速滚动到页面顶部或底部         | [查看文档](#) |
| `Loading`        | 加载动画      | 多种样式的加载状态展示           | [查看文档](#) |
| `SuggestionList` | 建议列表      | 智能推荐问题或操作               | [查看文档](#) |
| `ActionIconBox`  | 操作图标容器  | 统一的操作按钮样式               | [查看文档](#) |

### 🧠 智能体专属组件

| 组件             | 描述          | 主要功能                     | 文档链接      |
| ---------------- | ------------- | ---------------------------- | ------------- |
| `ChatBoot`       | 聊天引导组件  | 快速回复、案例推荐等引导功能 | [查看文档](#) |
| `SchemaEditor`   | Schema 编辑器 | 结构化数据编辑               | [查看文档](#) |
| `SchemaForm`     | Schema 表单   | 基于 Schema 自动生成表单     | [查看文档](#) |
| `SchemaRenderer` | Schema 渲染器 | 渲染结构化数据               | [查看文档](#) |

### 🔌 插件组件

| 插件类型    | 描述           | 支持功能                        |
| ----------- | -------------- | ------------------------------- |
| `code`      | 代码高亮插件   | 支持 100+ 编程语言语法高亮      |
| `katex`     | 数学公式插件   | 支持 LaTeX 数学公式渲染         |
| `mermaid`   | 图表插件       | 支持流程图、时序图、甘特图等    |
| `chart`     | 数据图表插件   | 支持 ECharts 各类数据可视化图表 |
| `formatter` | 代码格式化插件 | 自动格式化代码                  |

### 🛠️ 工具函数与 Hooks

| 名称                 | 类型 | 描述                   |
| -------------------- | ---- | ---------------------- |
| `useAutoScroll`      | Hook | 自动滚动到底部         |
| `useCopied`          | Hook | 复制到剪贴板           |
| `useLanguage`        | Hook | 国际化语言切换         |
| `useSpeechSynthesis` | Hook | 语音合成（文字转语音） |
| `useClickAway`       | Hook | 点击外部区域           |
| `useDebounceFn`      | Hook | 防抖函数               |
| `useThrottleFn`      | Hook | 节流函数               |

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

- [在线演示](https://ant-design.github.io/agentic-ui/)
- [完整文档](./docs/)
- [组件 API](./docs/components/)
- [设计规范](./docs/design-system/)

---

## 🌟 推荐使用场景

- 🤖 **企业 Copilot** - 智能办公助手
- 💬 **智能客服** - 知识检索与自动问答
- 📊 **数据分析与 BI** - 智能分析助理
- 🔄 **流程自动化（RPA）** - 协同智能体

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

查看 [贡献指南](./CONTRIBUTING.md) 了解详情。

---

## 📄 许可证

[MIT License](./LICENSE)

---

**让 AI 的思考过程透明化，让智能体真正成为你的协作伙伴 🤖**
