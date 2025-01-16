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
      initValue={`## 创始人

腾讯，全称深圳市腾讯计算机系统有限公司，是由五位创始人共同创立的，他们是马化腾、张志东、许晨晔、陈一丹和曾李青。 以下是关于这些创始人的详细信息： 马化腾 马化腾，1971 年 10 月 29 日出生于广东省东方县（现海南省东方市）八所港，广东汕头人，汉族，无党派人士。他毕业于深圳大学电子工程系计算机专业。马化腾是腾讯科技（深圳）有限公司的创始人、董事会主席、首席执行官，并曾是中华人民共和国第十二、十三届全国人民代表大会代表 。马化腾在 1998 年 11 月 11 日与合伙人共同注册成立了腾讯，并在 2004 年 6 月 16 日带领腾讯在香港联合交易所有限公司主板上市。 张志东 张志东，马化腾的同学，被称为 QQ 之父。他的计算机技术非常出色，曾是深圳大学最拔尖的学生之一。张志东在腾讯担任 CTO，并在 2014 年 9 月离职，转任腾讯公司终身荣誉顾问及腾讯学院荣誉院长等职位 。
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
