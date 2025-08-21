---
nav:
  order: 1
group:
  title: 编辑器
  order: 1
---

# Markdown Editor

Markdown Editor 是一个功能强大的 Markdown 编辑器组件，支持丰富的编辑功能、工具栏、代码高亮、评论等多种功能。

## 功能特点

- ✍️ 丰富的文本编辑能力，支持各种 Markdown 语法
- 🧰 可自定义的工具栏和浮动工具栏
- 🌈 代码块语法高亮显示
- 💬 内置评论功能，支持提及用户
- 🖱️ 支持拖拽操作
- 📑 自动生成目录(TOC)
- 📝 脚注支持和自定义渲染
- 🖼️ 图片上传和自定义渲染
- 📊 高级表格编辑，支持 Excel 模式
- 🎞️ 演示模式(PPT/幻灯片)
- ⌨️ 打字机模式
- 🏷️ 标签输入支持
- 🎨 高度可定制的元素渲染
- 🔌 支持插件扩展

## 基本使用

````tsx
import { MarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <MarkdownEditor
      readonly
      initValue={
        '```think\n\n\n好的，用户打招呼说“你好”，我需要按照设定的交互逻辑来回应。首先，用户的核心诉求可能是开始对话，需要友好回应并引导用户提出具体问题。根据注意事项，要保持专业但易懂，同时遵守合规底线。\n\n首先，需求拆解：用户没有具体问题，只是问候，所以需要欢迎并邀请用户提出金融相关的问题。结构输出方面，核心结论可以是欢迎语，分层解析可能不需要，但实操建议是引导用户提问。动态适配这里没有上下文，所以直接回应。\n\n注意事项方面，合规底线要求不提供具体推荐，这里没问题。风险提示也不需要，因为用户没有具体问题。专业性和时效性这里不涉及，因为是问候。\n\n所以，回应应该是友好，欢迎用户，并邀请他们提出金融相关的问题，比如理财、投资、贷款等，同时保持专业态度。\n\n\n```\n\n\n<answer>\n您好！我是您的金融顾问助手，专注于个人理财、企业投融资、风险管理等领域的专业解答。如果您有关于资金规划、产品选择、风险控制或政策解读等问题，欢迎随时告诉我，我会结合您的具体需求提供清晰、合规的建议。\n</answer>'
      }
      onBlur={(e) => console.log(e)}
      onChange={(value, schema) => console.log(value)}
      width="100%"
      height="400px"
    />
  );
};
````

## API

| 属性                                  | 类型                                                                                                                                                                                                                                        | 默认值          | 描述                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------- |
| `className`                           | `string`                                                                                                                                                                                                                                    | -               | 自定义样式类名          |
| `width`                               | `string \| number`                                                                                                                                                                                                                          | `'400px'`       | 编辑器宽度              |
| `height`                              | `string \| number`                                                                                                                                                                                                                          | `'auto'`        | 编辑器高度              |
| `codeProps`                           | `object`                                                                                                                                                                                                                                    | -               | 代码高亮配置            |
| `codeProps.Languages`                 | `string[]`                                                                                                                                                                                                                                  | -               | 支持的编程语言列表      |
| `codeProps.hideToolBar`               | `boolean`                                                                                                                                                                                                                                   | -               | 是否隐藏代码块工具栏    |
| `anchorProps`                         | `AnchorProps`                                                                                                                                                                                                                               | -               | 锚点链接属性            |
| `image`                               | `object`                                                                                                                                                                                                                                    | -               | 图片配置                |
| `image.upload`                        | `(file: File[] \| string[]) => Promise<string[] \| string>`                                                                                                                                                                                 | -               | 图片上传方法            |
| `image.render`                        | `(props: ImageProps, defaultDom: React.ReactNode) => React.ReactNode`                                                                                                                                                                       | -               | 自定义图片渲染          |
| `initValue`                           | `string`                                                                                                                                                                                                                                    | -               | 初始 Markdown 文本内容  |
| `readonly`                            | `boolean`                                                                                                                                                                                                                                   | `false`         | 只读模式                |
| `style`                               | `React.CSSProperties`                                                                                                                                                                                                                       | -               | 自定义样式              |
| `contentStyle`                        | `React.CSSProperties`                                                                                                                                                                                                                       | -               | 内容区域自定义样式      |
| `editorStyle`                         | `React.CSSProperties`                                                                                                                                                                                                                       | -               | 编辑器自定义样式        |
| `toc`                                 | `boolean`                                                                                                                                                                                                                                   | `true`          | 是否显示目录            |
| `toolBar`                             | `object`                                                                                                                                                                                                                                    | `{}`            | 工具栏配置              |
| `toolBar.min`                         | `boolean`                                                                                                                                                                                                                                   | -               | 是否使用最小化工具栏    |
| `toolBar.enable`                      | `boolean`                                                                                                                                                                                                                                   | -               | 是否启用工具栏          |
| `toolBar.extra`                       | `React.ReactNode[]`                                                                                                                                                                                                                         | -               | 额外的工具栏项          |
| `toolBar.hideTools`                   | `ToolsKeyType[]`                                                                                                                                                                                                                            | -               | 要隐藏的工具项          |
| `floatBar`                            | `object`                                                                                                                                                                                                                                    | -               | 浮动工具栏配置          |
| `floatBar.enable`                     | `boolean`                                                                                                                                                                                                                                   | -               | 是否启用浮动工具栏      |
| `drag`                                | `object`                                                                                                                                                                                                                                    | -               | 拖拽配置                |
| `drag.enable`                         | `boolean`                                                                                                                                                                                                                                   | -               | 是否启用拖拽功能        |
| `rootContainer`                       | `React.MutableRefObject<HTMLDivElement \| undefined>`                                                                                                                                                                                       | `document.body` | Markdown 编辑器的根容器 |
| `fncProps`                            | `object`                                                                                                                                                                                                                                    | -               | 脚注配置                |
| `fncProps.render`                     | `(props: { children: string; identifier?: string }, defaultDom: React.ReactNode) => React.ReactNode`                                                                                                                                        | -               | 自定义脚注渲染          |
| `fncProps.onFootnoteDefinitionChange` | `(value: { id: any; placeholder: any; origin_text: any; url: any; origin_url: any }[]) => void`                                                                                                                                             | -               | 脚注定义变更回调        |
| `fncProps.onOriginUrlClick`           | `(url?: string) => void`                                                                                                                                                                                                                    | -               | 原始链接点击回调        |
| `editorRef`                           | `React.MutableRefObject<MarkdownEditorInstance \| undefined>`                                                                                                                                                                               | -               | 用于外部获取编辑器实例  |
| `eleItemRender`                       | `(props: ElementProps, defaultDom: React.ReactNode) => React.ReactElement`                                                                                                                                                                  | -               | 自定义元素渲染方法      |
| `leafRender`                          | `(props: RenderLeafProps & { hashId: string; comment: MarkdownEditorProps['comment']; fncProps: MarkdownEditorProps['fncProps']; tagInputProps: MarkdownEditorProps['tagInputProps'] }, defaultDom: React.ReactNode) => React.ReactElement` | -               | 自定义叶子节点渲染方法  |
| `apaasify`                            | `object`                                                                                                                                                                                                                                    | -               | apaasify 配置           |
| `apaasify.enable`                     | `boolean`                                                                                                                                                                                                                                   | -               | 是否启用 apaasify       |
| `apaasify.render`                     | `(props: ElementProps<SchemaNode>) => React.ReactNode`                                                                                                                                                                                      | -               | 自定义 apaasify 渲染    |
| `initSchemaValue`                     | `Elements[]`                                                                                                                                                                                                                                | -               | 初始化 Schema 数据      |
| `onChange`                            | `(value: string, schema: Elements[]) => void`                                                                                                                                                                                               | -               | 内容变化回调            |
| `reportMode`                          | `boolean`                                                                                                                                                                                                                                   | `false`         | 是否开启报告模式        |
| `id`                                  | `string \| number`                                                                                                                                                                                                                          | -               | 编辑器 ID               |
| `slideMode`                           | `boolean`                                                                                                                                                                                                                                   | `false`         | 是否开启 PPT 模式       |
| `typewriter`                          | `boolean`                                                                                                                                                                                                                                   | `false`         | 是否开启打字机模式      |
| `insertAutocompleteProps`             | `InsertAutocompleteProps`                                                                                                                                                                                                                   | -               | 插入自动补全配置        |
| `titlePlaceholderContent`             | `string`                                                                                                                                                                                                                                    | -               | 标题占位符内容          |
| `comment`                             | `object`                                                                                                                                                                                                                                    | -               | 评论配置                |
| `comment.enable`                      | `boolean`                                                                                                                                                                                                                                   | -               | 是否开启评论功能        |
| `comment.onSubmit`                    | `(id: string, comment: CommentDataType) => void`                                                                                                                                                                                            | -               | 提交评论回调            |
| `comment.commentList`                 | `CommentDataType[]`                                                                                                                                                                                                                         | -               | 评论列表                |
| `comment.deleteConfirmText`           | `string`                                                                                                                                                                                                                                    | -               | 删除评论确认文本        |
| `comment.loadMentions`                | `(keyword: string) => Promise<{ name: string; avatar?: string }[]>`                                                                                                                                                                         | -               | 加载提及用户            |
| `comment.mentionsPlaceholder`         | `string`                                                                                                                                                                                                                                    | -               | 提及占位符              |
| `comment.editorRender`                | `(defaultDom: ReactNode) => ReactNode`                                                                                                                                                                                                      | -               | 编辑器模式渲染          |
| `comment.previewRender`               | `(props: { comment: CommentDataType[] }, defaultDom: ReactNode) => React.ReactElement`                                                                                                                                                      | -               | 预览渲染                |
| `comment.onDelete`                    | `(id: string \| number, item: CommentDataType) => void`                                                                                                                                                                                     | -               | 删除评论回调            |
| `comment.listItemRender`              | `(doms: { checkbox: React.ReactNode; mentionsUser: React.ReactNode; children: React.ReactNode }, props: ElementProps<ListItemNode>) => React.ReactNode`                                                                                     | -               | 评论列表项渲染          |
| `comment.onEdit`                      | `(id: string \| number, item: CommentDataType) => void`                                                                                                                                                                                     | -               | 编辑评论回调            |
| `comment.onClick`                     | `(id: string \| number, item: CommentDataType) => void`                                                                                                                                                                                     | -               | 点击评论回调            |
| `tableConfig`                         | `object`                                                                                                                                                                                                                                    | -               | 表格配置                |
| `tableConfig.minRows`                 | `number`                                                                                                                                                                                                                                    | -               | 最小行数                |
| `tableConfig.minColumn`               | `number`                                                                                                                                                                                                                                    | -               | 最小列数                |
| `tableConfig.excelMode`               | `boolean`                                                                                                                                                                                                                                   | -               | 是否启用Excel模式       |
| `tableConfig.previewTitle`            | `ReactNode`                                                                                                                                                                                                                                 | -               | 预览标题                |
| `tableConfig.actions`                 | `object`                                                                                                                                                                                                                                    | -               | 操作配置                |
| `tableConfig.actions.download`        | `['csv']`                                                                                                                                                                                                                                   | -               | 下载选项                |
| `tableConfig.actions.fullScreen`      | `'modal'`                                                                                                                                                                                                                                   | -               | 全屏模式                |
| `tableConfig.actions.copy`            | `'md' \| 'html' \| 'csv'`                                                                                                                                                                                                                   | -               | 复制格式                |
| `markdown`                            | `object`                                                                                                                                                                                                                                    | -               | Markdown配置            |
| `markdown.enable`                     | `boolean`                                                                                                                                                                                                                                   | -               | 是否启用Markdown        |
| `markdown.matchInputToNode`           | `boolean`                                                                                                                                                                                                                                   | -               | 是否匹配输入到节点      |
| `plugins`                             | `MarkdownEditorPlugin[]`                                                                                                                                                                                                                    | -               | 编辑器插件配置          |
| `textAreaProps`                       | `object`                                                                                                                                                                                                                                    | -               | 文本区域配置            |
| `textAreaProps.enable`                | `boolean`                                                                                                                                                                                                                                   | -               | 是否启用文本区域        |
| `textAreaProps.placeholder`           | `string`                                                                                                                                                                                                                                    | -               | 占位符文本              |
| `textAreaProps.triggerSendKey`        | `'Enter' \| 'Mod+Enter'`                                                                                                                                                                                                                    | -               | 触发发送的按键          |
| `tagInputProps`                       | `object`                                                                                                                                                                                                                                    | -               | 标签输入配置            |
| `tagInputProps.enable`                | `boolean`                                                                                                                                                                                                                                   | -               | 是否启用标签输入        |

## 示例

### 基本使用

```tsx
import { BaseMarkdownEditor } from '@ant-design/md-editor';

export default () => {
  return (
    <>
      <BaseMarkdownEditor
        initValue="# Hello World "
        width="100%"
        height="500px"
        onChange={(value, schema) => {
          console.log('Markdown content:', value);
        }}
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>initValue</code> - 初始 Markdown 文本内容
          </li>
          <li>
            <code>width</code> - 编辑器宽度
          </li>
          <li>
            <code>height</code> - 编辑器高度
          </li>
          <li>
            <code>onChange</code> - 内容变化回调函数
            <ul>
              <li>
                <code>value</code> - 当前的 Markdown 文本内容
              </li>
              <li>
                <code>schema</code> - 当前的 Schema 数据结构
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};
```

### 只读模式

```tsx
import { BaseMarkdownEditor } from '@ant-design/md-editor';
export default () => {
  return (
    <>
      <BaseMarkdownEditor
        initValue={`只读模式示例：

- **90%+** 得的利润
- **高效** performance
- **成功率** 达到 95%

> **注意**：以上数据仅供参考`}
        readonly={true}
        width="100%"
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>readonly</code> - 只读模式，用户无法编辑内容
          </li>
        </ul>
      </div>
    </>
  );
};
```

### 自定义工具栏

```tsx
import { BaseMarkdownEditor } from '@ant-design/md-editor';
export default () => {
  return (
    <>
      <BaseMarkdownEditor
        initValue="# 自定义工具栏"
        toolBar={{
          enable: true,
          min: false,
          hideTools: ['image', 'code'],
          extra: [<a key="custom">自定义按钮</a>],
        }}
        onChange={(e, s) => console.log(e, s)}
        width="100%"
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>toolBar</code> - 工具栏配置
            <ul>
              <li>
                <code>enable</code> - 是否启用工具栏
              </li>
              <li>
                <code>min</code> - 是否使用最小化工具栏
              </li>
              <li>
                <code>hideTools</code> - 要隐藏的工具项
              </li>
              <li>
                <code>extra</code> - 额外的工具栏项
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};
```

### 评论功能

```tsx
import { BaseMarkdownEditor } from '@ant-design/md-editor';
export default () => {
  return (
    <>
      <BaseMarkdownEditor
        initValue="# 支持评论功能"
        readonly={true}
        reportMode={true}
        comment={{
          enable: true,
          onSubmit: (id, comment) => {
            // 处理评论提交
            console.log(id, comment);
          },
          commentList: [
            // 评论列表数据
          ],
        }}
        width="100%"
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>readonly</code> - 只读模式，用户无法编辑内容
          </li>
          <li>
            <code>reportMode</code> - 报告模式，启用评论功能
          </li>
          <li>
            <code>comment</code> - 评论配置
            <ul>
              <li>
                <code>enable</code> - 是否启用评论功能
              </li>
              <li>
                <code>onSubmit</code> - 评论提交回调函数
              </li>
              <li>
                <code>commentList</code> - 评论列表数据
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};
```

### 自定义叶子节点渲染

```tsx
import { BaseMarkdownEditor } from '@ant-design/md-editor';
export default () => {
  return (
    <>
      <BaseMarkdownEditor
        initValue="**粗体文本** *斜体文本* `代码` 普通文本"
        leafRender={(props, defaultDom) => {
          const { leaf, children } = props;

          // 自定义粗体样式
          if (leaf.bold) {
            return (
              <strong style={{ color: '#1890ff', backgroundColor: '#e6f7ff' }}>
                {children}
              </strong>
            );
          }

          // 自定义斜体样式
          if (leaf.italic) {
            return (
              <em style={{ color: '#722ed1', backgroundColor: '#f9f0ff' }}>
                {children}
              </em>
            );
          }

          // 自定义代码样式
          if (leaf.code) {
            return (
              <code
                style={{
                  color: '#d83931',
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                }}
              >
                {children}
              </code>
            );
          }

          // 返回默认渲染
          return defaultDom;
        }}
        width="100%"
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>leafRender</code> - 自定义叶子节点渲染方法
            <ul>
              <li>
                <code>props</code> - 渲染属性，包含 leaf（叶子节点属性）和
                children（子元素）
              </li>
              <li>
                <code>defaultDom</code> - 默认渲染的 DOM 元素
              </li>
              <li>返回值 - 自定义的 React 元素</li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};
```
