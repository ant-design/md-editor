# Agentic UI

[![NPM version](https://img.shields.io/npm/v/@ant-design/md-editor.svg?style=flat)](https://npmjs.org/package/@ant-design/md-editor)
[![NPM downloads](http://img.shields.io/npm/dm/@ant-design/md-editor.svg?style=flat)](https://npmjs.org/package/@ant-design/md-editor)

基于 React + TypeScript 的现代化 Markdown 编辑器组件库，专为 AI 智能体应用设计。提供从富文本编辑到 AI 对话展示的全套组件，支持思维链可视化、工具调用展示、任务管理等 AI 应用场景。

## ✨ 特性

### 🎯 核心编辑功能

- **富文本编辑**: 基于 Slate.js 的强大编辑器，支持完整的 Markdown 语法
- **实时预览**: 所见即所得的编辑体验，支持双栏或单栏模式
- **语法高亮**: 基于 Prism.js 的多语言代码高亮显示
- **表格编辑**: 可视化表格编辑器，支持行列操作和格式化

### 🧩 插件化架构

- **数学公式**: 基于 KaTeX 的数学公式渲染支持
- **图表渲染**: 支持 Mermaid 流程图、时序图、甘特图等
- **代码执行**: 支持多种编程语言的代码块执行
- **幻灯片模式**: 支持演示文稿模式，适合展示和教学

### 💬 AI 智能体支持

- **对话容器**: 专为 AI 对话设计的 Bubble 组件系统
- **思维链展示**: ThoughtChainList 组件，可视化 AI 推理过程
- **工具调用**: ToolUseBar 组件，展示 AI 工具使用情况
- **任务管理**: TaskList 组件，管理 AI 执行的任务

### 🎨 现代化 UI 组件

- **工作空间**: Workspace 组件，提供文件管理和浏览器功能
- **历史记录**: History 组件，支持操作历史和版本管理
- **语音交互**: 支持语音输入和语音合成功能
- **响应式设计**: 完美适配桌面端和移动端

### ⚡ 性能与体验

- **高性能渲染**: 优化的虚拟化渲染，支持大文档编辑
- **增量更新**: 智能的内容变更检测和更新机制
- **懒加载**: 按需加载插件和资源，提升加载速度
- **TypeScript**: 完整的类型定义，提供优秀的开发体验

### 🔧 开发友好

- **高度可定制**: 丰富的配置选项和自定义接口
- **插件开发**: 完整的插件开发 API 和文档
- **主题定制**: 支持 Ant Design 主题定制
- **国际化**: 内置多语言支持，易于扩展

## 🚀 快速开始

### 安装

```bash
npm install @ant-design/md-editor
# 或
yarn add @ant-design/md-editor
# 或
pnpm add @ant-design/md-editor
```

### 基础用法

```tsx
import React from 'react';
import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <MarkdownEditor
      initValue={`# Hello World

欢迎使用 md-editor！这是一个功能强大的 Markdown 编辑器。

## 主要特性

- ✅ 支持标准 Markdown 语法
- ✅ 实时预览功能
- ✅ 语法高亮
- ✅ 数学公式渲染 $E=mc^2$
- ✅ 代码块高亮

\`\`\`javascript
function hello() {
  console.log('Hello, md-editor!');
}
\`\`\`

## 表格支持

| 功能 | 支持 | 说明 |
|------|------|------|
| 基础编辑 | ✅ | 支持所有标准语法 |
| 实时预览 | ✅ | 所见即所得 |
| 插件系统 | ✅ | 可扩展架构 |

> 这只是一个简单的示例，更多功能等你探索！
`}
    />
  );
};
```

### 高级用法

```tsx
import React, { useRef } from 'react';
import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';

export default () => {
  const editorRef = useRef<MarkdownEditorInstance>();

  const handleSave = () => {
    const content = editorRef.current?.getValue();
    console.log('保存内容:', content);
  };

  return (
    <MarkdownEditor
      editorRef={editorRef}
      height={600}
      initValue={# Hello World

欢迎使用 md-editor！这是一个功能强大的 Markdown 编辑器。

## 主要特性

- ✅ 支持标准 Markdown 语法
- ✅ 实时预览功能
- ✅ 语法高亮
- ✅ 数学公式渲染 $E=mc^2$
- ✅ 代码块高亮

\`\`\`javascript
function hello() {
  console.log('Hello, md-editor!');
}
\`\`\`

## 表格支持

| 功能 | 支持 | 说明 |
|------|------|------|
| 基础编辑 | ✅ | 支持所有标准语法 |
| 实时预览 | ✅ | 所见即所得 |
| 插件系统 | ✅ | 可扩展架构 |

> 这只是一个简单的示例，更多功能等你探索！
`}
      toolBar={{
        enable: true,
        extra: [
          <button key="save" onClick={handleSave}>
            保存
          </button>,
        ],
      }}
      onChange={(value, schema) => {
        console.log('内容变化:', value);
      }}
      image={{
        upload: async (files) => {
          // 自定义图片上传逻辑
          return ['https://example.com/uploaded-image.png'];
        },
      }}
    />
  );
};
```

## 📖 文档

- [快速开始](./docs/components/api.md)
- [API 文档](./docs/components/api.md)
- [组件文档](./docs/components/)
- [插件开发](./docs/plugin/)
- [开发指南](./docs/development/)

## 🔗 相关链接

- [在线演示](https://ant-design.github.io/md-editor/)
- [GitHub 仓库](https://github.com/ant-design/md-editor)
- [问题反馈](https://github.com/ant-design/md-editor/issues)
- [更新日志](https://github.com/ant-design/md-editor/releases)

## 📋 API 文档

### MarkdownEditor 属性

| 属性                    | 类型                                                                       | 默认值  | 描述               |
| ----------------------- | -------------------------------------------------------------------------- | ------- | ------------------ |
| **基础配置**            |
| className               | `string`                                                                   | -       | 自定义类名         |
| width                   | `string \| number`                                                         | -       | 编辑器宽度         |
| height                  | `string \| number`                                                         | -       | 编辑器高度         |
| initValue               | `string`                                                                   | -       | 初始内容           |
| readonly                | `boolean`                                                                  | `false` | 是否为只读模式     |
| **样式配置**            |
| style                   | `React.CSSProperties`                                                      | -       | 容器样式           |
| contentStyle            | `React.CSSProperties`                                                      | -       | 内容区域样式       |
| editorStyle             | `React.CSSProperties`                                                      | -       | 编辑器样式         |
| **功能配置**            |
| toc                     | `boolean`                                                                  | `false` | 是否显示目录       |
| toolBar                 | `ToolBarProps`                                                             | -       | 工具栏配置         |
| typewriter              | `boolean`                                                                  | `false` | 是否开启打字机模式 |
| reportMode              | `boolean`                                                                  | `false` | 是否开启报告模式   |
| slideMode               | `boolean`                                                                  | `false` | 是否开启 PPT 模式  |
| **扩展配置**            |
| codeProps               | `{ Languages?: string[] }`                                                 | -       | 代码高亮配置       |
| image                   | `ImageConfig`                                                              | -       | 图片上传配置       |
| comment                 | `CommentProps`                                                             | -       | 评论功能配置       |
| fncProps                | `FnProps`                                                                  | -       | 功能属性配置       |
| **高级配置**            |
| rootContainer           | `React.MutableRefObject<HTMLDivElement>`                                   | -       | 根容器引用         |
| editorRef               | `React.MutableRefObject<MarkdownEditorInstance>`                           | -       | 编辑器实例引用     |
| eleItemRender           | `(props: ElementProps, defaultDom: React.ReactNode) => React.ReactElement` | -       | 自定义元素渲染     |
| initSchemaValue         | `Elements[]`                                                               | -       | 初始结构数据       |
| insertAutocompleteProps | `InsertAutocompleteProps`                                                  | -       | 自动补全配置       |
| titlePlaceholderContent | `string`                                                                   | -       | 标题占位符内容     |
| **事件回调**            |
| onChange                | `(value: string, schema: Elements[]) => void`                              | -       | 内容变化回调       |

### ToolBarProps

| 属性      | 类型                | 默认值  | 描述                   |
| --------- | ------------------- | ------- | ---------------------- |
| min       | `boolean`           | `false` | 是否启用最小化模式     |
| enable    | `boolean`           | `true`  | 是否启用工具栏         |
| extra     | `React.ReactNode[]` | -       | 额外的自定义工具栏项目 |
| hideTools | `ToolsKeyType[]`    | -       | 需要隐藏的工具栏选项   |

### ImageConfig

| 属性   | 类型                                                        | 描述                      |
| ------ | ----------------------------------------------------------- | ------------------------- |
| upload | `(file: File[] \| string[]) => Promise<string[] \| string>` | 图片上传函数，返回图片URL |

### CommentProps

| 属性                | 类型                                                                | 描述              |
| ------------------- | ------------------------------------------------------------------- | ----------------- |
| enable              | `boolean`                                                           | 是否启用评论功能  |
| onSubmit            | `(id: string, comment: CommentDataType) => void`                    | 评论提交回调      |
| commentList         | `CommentDataType[]`                                                 | 评论列表数据      |
| deleteConfirmText   | `string`                                                            | 删除确认文本      |
| loadMentions        | `(keyword: string) => Promise<{ name: string; avatar?: string }[]>` | 加载@提及用户列表 |
| mentionsPlaceholder | `string`                                                            | @提及输入框占位符 |
| onDelete            | `(id: string \| number, item: CommentDataType) => void`             | 评论删除回调      |

### MarkdownEditorInstance

编辑器实例提供以下方法：

| 方法       | 类型                      | 描述               |
| ---------- | ------------------------- | ------------------ |
| getValue   | `() => string`            | 获取当前编辑器内容 |
| setValue   | `(value: string) => void` | 设置编辑器内容     |
| getSchema  | `() => Elements[]`        | 获取当前文档结构   |
| insertText | `(text: string) => void`  | 在光标位置插入文本 |
| focus      | `() => void`              | 聚焦编辑器         |
| blur       | `() => void`              | 失焦编辑器         |

## 🛠️ 开发

：

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 pnpm >= 7.0.0

### 本地开发

```bash
# 克隆项目
git clone https://github.com/ant-design/md-editor.git
cd md-editor

# 安装依赖
pnpm install

# 启动开发服务器
pnpm start

# 在浏览器中打开 http://localhost:8000
```

### 可用脚本

```bash
# 启动开发服务器（带热重载）
pnpm start

# 构建库文件
pnpm run build

# 监听模式构建
pnpm run build:watch

# 构建文档站点
pnpm run docs:build

# 运行测试
pnpm run test

# 测试覆盖率
pnpm run test:coverage

# 代码检查
pnpm run lint

# 格式化代码
pnpm run prettier

# 类型检查
pnpm run tsc

# 项目健康检查
pnpm run doctor
```

### 项目结构

```
md-editor/
├── src/                    # 源代码
│   ├── MarkdownEditor/     # 核心编辑器
│   ├── MarkdownInputField/ # 输入组件
│   ├── History/           # 历史记录
│   ├── Bubble/            # 气泡组件
│   ├── Workspace/         # 工作空间
│   ├── plugins/           # 插件系统
│   ├── hooks/             # 自定义 Hooks
│   ├── utils/             # 工具函数
│   └── types/             # 类型定义
├── docs/                  # 文档和示例
├── tests/                 # 测试文件
└── scripts/               # 构建脚本
```

### 贡献指南

1. Fork 本仓库
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

更多详细信息请查看 [贡献指南](./CONTRIBUTING.md)。

## 🤝 社区

- [讨论区](https://github.com/ant-design/md-editor/discussions) - 技术讨论和问答
- [问题反馈](https://github.com/ant-design/md-editor/issues) - Bug 报告和功能建议
- [更新日志](https://github.com/ant-design/md-editor/releases) - 版本更新记录

## 📄 许可证

本项目基于 [MIT 许可证](./LICENSE) 开源。

## 🙏 致谢

感谢所有为该项目做出贡献的开发者！

<a href="https://github.com/ant-design/md-editor/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ant-design/md-editor" />
</a>
