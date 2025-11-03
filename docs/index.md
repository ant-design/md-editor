---
hero:
  title: 'Agentic UI'
  description: 面向智能体的 UI 组件库，从"回答一句话"到"完成一件事"，让 AI 的思考过程透明化
  actions:
    - text: 快速开始
      link: /components/api
    - text: 查看 GitHub
      link: https://github.com/ant-design/md-editor
      type: primary
group:
  title: 通用
  order: 0

features:
  - title: 多步推理可视化
    emoji: 🤖
    description: 展示智能体的思考、行动、观察过程，让 AI 决策过程透明化、可理解
  - title: 工具调用展示
    emoji: 🔧
    description: 可视化工具编排与执行状态，实时展示 API 调用、数据查询等操作过程
  - title: 人在回路机制
    emoji: 👤
    description: 支持人工审批、干预或纠偏，在关键节点介入智能体决策流程
  - title: 任务执行协同
    emoji: 📊
    description: 从单轮问答升级为端到端任务协同，支持多步骤、多目标的复杂任务执行
  - title: 富文本编辑能力
    emoji: 📝
    description: 基于 Slate.js 的强大 Markdown 编辑器，支持流式输出、打字机效果、语法高亮
  - title: 开箱即用组件
    emoji: 📦
    description: 预设样式与交互，提供 Bubble、TaskList、ThoughtChainList 等专业组件，快速集成
---

## 🚀 核心能力

### 🤖 Agentic 交互模式

- **对话容器**: 支持聊天与并行多会话
- **流式输出**: 实时流式内容展示，支持打字机效果
- **多模态输入**: 支持文本、语音、图像等多种输入方式
- **提示词编辑**: 灵活的 Prompt 管理与优化

### 🧠 推理过程可视化

- **思考链展示**: 可视化"思考—行动—观察"的完整闭环
- **计划时间线**: 展示任务分解与执行进度
- **工具调用面板**: 展示 API 调用参数、状态与结果
- **历史回溯**: 支持复盘与优化，对比不同决策路径

### 📦 丰富的组件生态

- **Bubble**: AI/用户对话气泡组件
- **ThoughtChainList**: 思维链可视化组件
- **TaskList**: 任务列表与进度跟踪
- **ToolUseBar**: 工具调用状态展示
- **MarkdownEditor**: 富文本编辑器
- **AgenticLayout**: 智能体布局容器
- **Workspace**: 文件管理工作空间
- **History**: 会话历史记录

## 🔗 生态系统

| 项目                                                                           | 状态                                                                                                                    | 描述               |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------ |
| [@ant-design/agentic-ui](https://www.npmjs.com/package/@ant-design/agentic-ui) | [![npm](https://img.shields.io/npm/v/@ant-design/agentic-ui.svg)](https://www.npmjs.com/package/@ant-design/agentic-ui) | 核心编辑器组件     |
| [dumi](https://d.umijs.org/)                                                   | [![npm](https://img.shields.io/npm/v/dumi.svg)](https://www.npmjs.com/package/dumi)                                     | 文档站点生成工具   |
| [antd](https://ant.design/)                                                    | [![npm](https://img.shields.io/npm/v/antd.svg)](https://www.npmjs.com/package/antd)                                     | 企业级 UI 设计语言 |
| [slate](https://docs.slatejs.org/)                                             | [![npm](https://img.shields.io/npm/v/slate.svg)](https://www.npmjs.com/package/slate)                                   | 富文本编辑器框架   |

## 📱 兼容性

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge 79+                                                                                                                                                                                              | Firefox 70+                                                                                                                                                                                                       | Chrome 70+                                                                                                                                                                                                    | Safari 12+                                                                                                                                                                                                    |
