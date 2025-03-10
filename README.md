# @ant-design/md-editor

[![NPM version](https://img.shields.io/npm/v/@ant-design/md-editor.svg?style=flat)](https://npmjs.org/package/@ant-design/md-editor)
[![NPM downloads](http://img.shields.io/npm/dm/@ant-design/md-editor.svg?style=flat)](https://npmjs.org/package/@ant-design/md-editor)

一个使用 dumi 开发的 React 库

## 用法

```tsx
import React from 'react';
import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <MarkdownEditor
      initValue={`'\n\nUmi 是一个可扩展的企业级前端应用框架，中文发音为「乌米」，由蚂蚁金服开发并广泛应用于复杂前端项目。以下是其核心特性和功能解析：\n\n### 1. 核心定位\nUmi 以路由为基础，支持**配置式路由**和**约定式路由**两种模式，既保证路由功能的完备性（如动态路由、嵌套路由、权限路由），又通过插件体系覆盖从开发到构建的全生命周期管理 [^DOC_1] [^DOC_2] [^DOC_8]。\n\n### 2. 核心功能\n- **开箱即用**：内置 React、Webpack、Babel 等工具链，集成路由、构建、部署、测试等基础设施，无需手动配置即可启动项目 [^DOC_1] [^DOC_8] [^DOC_10]。\n- **插件化架构**：内部功能均通过插件实现，支持按需加载和扩展（如状态管理、数据请求、国际化等），开发者可通过插件集快速集成 Ant Design Pro 等解决方案 [^DOC_1] [^DOC_4] [^DOC_8]。\n- **约定优于配置**：通过文件目录自动生成路由（如 `src/pages` 下的文件映射为页面路由），减少冗余配置 [^DOC_2] [^DOC_7] [^DOC_10]。\n\n### 3. 适用场景\n- **企业级应用**：适合中后台管理系统、大型复杂项目，提供标准化开发流程和可维护性保障                [^DOC_4]   [^DOC_8]。\n- **快速开发**：整合常用技术栈（如 Dva 状态管理、Ant Design UI 库），开发者可专注于业务逻辑而非环境配置     [^DOC_4]     [^DOC_5]。\n\n### 4. 技术对比\n- **与传统框架**：相比手动配置的 React 项目，Umi 通过预设最佳实践减少重复工作；相比 Next.js，更贴近业务需求（如深度整合 Ant Design、权限管理等）   [^DOC_5]   [^DOC_8]。\n- **性能优化**：支持路由懒加载、代码分割，通过动态导入组件减少首屏加载时间     [^DOC_7]     [^DOC_10]。\n\n### 5. 使用方式\n- **初始化项目**：通过命令行工具快速创建模板（如 `pnpm dlx create-umi@latest`），支持 Simple App、Ant Design Pro 等多种模板                 [^DOC_4]                 [^DOC_6]。\n- **开发与部署**：内置 `umi dev` 启动本地开发，`umi build` 生成生产环境代码，输出至 `dist` 目录                     [^DOC_5]                     [^DOC_6]。\n\n### 6. 限制\n- 不支持 IE 8 及以下浏览器、React 16.8.0 以下版本或 Node 10 以下环境      [^DOC_5]       [^DOC_10]。\n\n总结来说，Umi 通过规范化、插件化和企业级最佳实践，成为高效开发复杂 React 应用的首选框架，尤其适合需要快速迭代且注重可维护性的团队  [^DOC_1]  [^DOC_4]  [^DOC_8]。' 。
`}
    />
  );
};
```

## 选项

### MarkdownEditor

| 属性                    | 类型                                                                       | 描述                        |
| ----------------------- | -------------------------------------------------------------------------- | --------------------------- |
| className               | `string`                                                                   | 自定义类名                  |
| width                   | `string \| number`                                                         | 编辑器宽度                  |
| height                  | `string \| number`                                                         | 编辑器高度                  |
| codeProps               | `{ Languages?: string[] }`                                                 | 代码高亮配置                |
| image                   | `{ upload?: (file: File[] \| string[]) => Promise<string[] \| string> }`   | 图片上传配置                |
| initValue               | `string`                                                                   | 初始内容                    |
| readonly                | `boolean`                                                                  | 是否为只读模式              |
| style                   | `React.CSSProperties`                                                      | 容器样式                    |
| contentStyle            | `React.CSSProperties`                                                      | 内容区域样式                |
| editorStyle             | `React.CSSProperties`                                                      | 编辑器样式                  |
| toc                     | `boolean`                                                                  | 是否显示目录                |
| toolBar                 | `ToolBarProps`                                                             | 工具栏配置                  |
| rootContainer           | `React.MutableRefObject<HTMLDivElement \| undefined>`                      | markdown 编辑器的根容器引用 |
| fncProps                | `fnProps`                                                                  | 功能属性配置                |
| editorRef               | `React.MutableRefObject<MarkdownEditorInstance \| undefined>`              | 编辑器实例引用              |
| eleItemRender           | `(props: ElementProps, defaultDom: React.ReactNode) => React.ReactElement` | 自定义渲染元素              |
| initSchemaValue         | `Elements[]`                                                               | 初始结构数据                |
| onChange                | `(value: string, schema: Elements[]) => void`                              | 内容变化回调                |
| reportMode              | `boolean`                                                                  | 是否开启报告模式            |
| slideMode               | `boolean`                                                                  | 是否开启 PPT 模式           |
| typewriter              | `boolean`                                                                  | 是否开启打字机模式          |
| insertAutocompleteProps | `InsertAutocompleteProps`                                                  | 自动补全配置                |
| titlePlaceholderContent | `string`                                                                   | 标题占位符内容              |
| comment                 | `Comment`                                                                  | 评论功能配置                |

### ToolBarProps

| 属性      | 类型              | 描述                     |
| --------- | ----------------- | ------------------------ |
| min       | boolean           | 控制是否启用最小化模式   |
| enable    | boolean           | 控制是否启用工具栏       |
| extra     | React.ReactNode[] | 额外的自定义工具栏项目   |
| hideTools | ToolsKeyType[]    | 指定需要隐藏的工具栏选项 |

### fnProps

| 属性   | 类型                                                                            | 描述           |
| ------ | ------------------------------------------------------------------------------- | -------------- |
| render | `(props: { children: string }, defaultDom: React.ReactNode) => React.ReactNode` | 自定义渲染元素 |

### CommentProps

| Property            | Type                                                                                                                                                    | Description                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| enable              | `boolean`                                                                                                                                               | Flag to enable/disable the component                  |
| onSubmit            | `(id: string, comment: CommentDataType) => void`                                                                                                        | Callback when comment is submitted                    |
| commentList         | `CommentDataType[]`                                                                                                                                     | Array of comments to display                          |
| deleteConfirmText   | `string`                                                                                                                                                | Text shown in delete confirmation dialog              |
| loadMentions        | `(keyword: string) => Promise<{ name: string; avatar?: string }[]>`                                                                                     | Function to load mention suggestions based on keyword |
| mentionsPlaceholder | `string`                                                                                                                                                | Placeholder text for mentions input                   |
| editorRender        | `(defaultDom: ReactNode) => ReactNode`                                                                                                                  | Custom render function for editor                     |
| previewRender       | `(props: { comment: CommentDataType[] }, defaultDom: ReactNode) => React.ReactElement`                                                                  | Custom render function for preview                    |
| onDelete            | `(id: string \| number, item: CommentDataType) => void`                                                                                                 | Callback when comment is deleted                      |
| listItemRender      | `(doms: { checkbox: React.ReactNode; mentionsUser: React.ReactNode; children: React.ReactNode }, props: ElementProps<ListItemNode>) => React.ReactNode` | Custom render function for list items                 |

## 开发

```bash
# 安装依赖
$ pnpm install

# 通过文档示例开发库
$ pnpm start

# 构建库源代码
$ pnpm run build

# 以监视模式构建库源代码
$ pnpm run build:watch

# 构建文档
$ pnpm run docs:build

# 检查项目中的潜在问题
$ pnpm run doctor
```
