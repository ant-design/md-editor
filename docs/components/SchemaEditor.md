# SchemaEditor 组件

SchemaEditor 是一个强大的 schema 编辑和预览工具，类似于 markdown 编辑器，底层使用 AceEditor 来编辑 schema 中的 HTML 内容。

## 功能特性

- 🎨 **实时编辑**: 支持 HTML 模板和 JSON schema 的实时编辑
- 👀 **实时预览**: 实时显示编辑结果，支持模板变量替换
- 🔍 **语法高亮**: 使用 AceEditor 提供 HTML 和 JSON 语法高亮
- ⚡ **错误提示**: 自动检测 schema 格式错误并显示提示
- 📱 **响应式设计**: 支持不同屏幕尺寸的适配
- 🛡️ **安全渲染**: 支持配置允许的 HTML 标签和属性

## 基本用法

```tsx
import { SchemaEditor } from '@ant-design/md-editor';
import { useState } from 'react';
const MyComponent = () => {
  const [schema, setSchema] = useState({
    version: '1.2.0',
    name: '7-Day Weather Forecast Component',
    description: 'A component displaying 7-day weather forecast data',
    author: 'Forecast Team',
    createTime: '2024-03-22T08:00:00Z',
    updateTime: '2024-03-22T08:00:00Z',
    pageConfig: {
      layout: 'flex',
      router: { mode: 'hash', basePath: '/7days-weather' },
      globalVariables: {
        colors: {
          sunny: '#FFD700',
          cloudy: '#A9A9A9',
          rainy: '#4682B4',
          snow: '#87CEEB',
        },
        constants: { refreshInterval: 3600000 },
      },
    },
    dataSources: {
      restAPI: {
        baseURL: 'https://api.7days-weather.com/v3',
        defaultHeaders: { 'Content-Type': 'application/json' },
        timeout: 5000,
        interceptors: { request: true, response: true },
      },
      mock: {
        enable: true,
        responseDelay: 150,
        dataPath: '/mock/7days-weather',
      },
    },
    component: {
      properties: {
        title: {
          title: '标题',
          type: 'string',
          default: '我的博客',
        },
        content: {
          title: '内容',
          type: 'string',
          default: '这是一篇博客文章',
        },
      },
      type: 'html',
      schema: `
        <div class="blog-post">
          <h1>{{title}}</h1>
          <div class="content">{{content}}</div>
        </div>
      `,
    },
  });

  const [values, setValues] = useState({
    name: 'World',
  });

  const handleChange = (newSchema, newValues) => {
    setSchema(newSchema);
    setValues(newValues);
  };

  return (
    <SchemaEditor
      initialSchema={schema}
      initialValues={values}
      height={600}
      onChange={handleChange}
      showPreview={true}
    />
  );
};
export default MyComponent;
```

## API 参考

### Props

| 属性            | 类型                                                           | 默认值  | 说明             |
| --------------- | -------------------------------------------------------------- | ------- | ---------------- |
| `initialSchema` | `LowCodeSchema`                                                | -       | 初始 schema 数据 |
| `initialValues` | `Record<string, any>`                                          | `{}`    | 初始值           |
| `height`        | `number \| string`                                             | `600`   | 编辑器高度       |
| `readonly`      | `boolean`                                                      | `false` | 是否只读         |
| `onChange`      | `(schema: LowCodeSchema, values: Record<string, any>) => void` | -       | 变更回调         |
| `onError`       | `(error: Error) => void`                                       | -       | 错误回调         |
| `className`     | `string`                                                       | `''`    | 自定义样式类名   |
| `showPreview`   | `boolean`                                                      | `true`  | 是否显示预览     |
| `previewConfig` | `object`                                                       | -       | 预览配置         |

### previewConfig

| 属性           | 类型       | 默认值 | 说明             |
| -------------- | ---------- | ------ | ---------------- |
| `ALLOWED_TAGS` | `string[]` | -      | 允许的 HTML 标签 |
| `ALLOWED_ATTR` | `string[]` | -      | 允许的 HTML 属性 |

## 高级用法

### 自定义预览配置

```tsx | pure
<SchemaEditor
  initialSchema={schema}
  initialValues={values}
  previewConfig={{
    ALLOWED_TAGS: ['div', 'h1', 'h2', 'p', 'span', 'button'],
    ALLOWED_ATTR: ['class', 'style', 'onclick'],
  }}
/>
```

### 只读模式

```tsx | pure
<SchemaEditor
  initialSchema={schema}
  initialValues={values}
  readonly={true}
  showPreview={true}
/>
```

### 隐藏预览

```tsx | pure
<SchemaEditor
  initialSchema={schema}
  initialValues={values}
  showPreview={false}
/>
```

### 错误处理

```tsx | pure
<SchemaEditor
  initialSchema={schema}
  initialValues={values}
  onError={(error) => {
    console.error('SchemaEditor 错误:', error);
    // 显示错误提示
  }}
/>
```

## Schema 格式

SchemaEditor 使用 `LowCodeSchema` 类型定义，主要包含以下字段：

```tsx | pure
interface LowCodeSchema {
  version?: string;
  name?: string;
  description?: string;
  component?: {
    type?: 'html' | 'mustache';
    schema?: string;
  };
  initialValues?: Record<string, any>;
}
```

### 示例 Schema

```json
{
  "version": "1.0.0",
  "name": "用户卡片",
  "description": "显示用户信息的卡片组件",
  "component": {
    "type": "html",
    "schema": "<div class=\"user-card\">\n  <h2>{{name}}</h2>\n  <p>{{email}}</p>\n  <button onclick=\"alert('{{name}}')\">点击</button>\n</div>"
  },
  "initialValues": {
    "name": "张三",
    "email": "zhangsan@example.com"
  }
}
```

## 模板语法

SchemaEditor 支持 Mustache 模板语法，可以在 HTML 中使用 `{{变量名}}` 来插入动态内容。

### 基本变量

```html
<div>
  <h1>{{title}}</h1>
  <p>{{description}}</p>
</div>
```

### 条件渲染

```html
<div>
  {{#if showTitle}}
  <h1>{{title}}</h1>
  {{/if}}
  <p>{{content}}</p>
</div>
```

### 循环渲染

```html
<ul>
  {{#each items}}
  <li>{{name}}: {{value}}</li>
  {{/each}}
</ul>
```

## 样式定制

SchemaEditor 提供了丰富的 CSS 类名，可以用于样式定制：

```css
/* 主容器 */
.schema-editor

/* 左侧编辑区域 */
.schema-editor-left

/* 右侧预览区域 */
.schema-editor-right

/* HTML 编辑器 */
.schema-editor-html
.schema-editor-html-header
.schema-editor-html-content

/* JSON 编辑器 */
.schema-editor-json
.schema-editor-json-header
.schema-editor-json-content

/* 预览区域 */
.schema-editor-preview
.schema-editor-preview-header
.schema-editor-preview-content

/* 错误提示 */
.schema-editor-error

/* 回退内容 */
.schema-editor-fallback
```

## 注意事项

1. **安全性**: 在生产环境中，建议配置 `previewConfig` 来限制允许的 HTML 标签和属性
2. **性能**: 大型 schema 可能会影响编辑性能，建议适当分页或懒加载
3. **兼容性**: 组件依赖 AceEditor，确保在支持的环境中运行
4. **模板语法**: 目前支持 Mustache 模板语法，未来可能支持更多模板引擎

## 相关组件

- [SchemaRenderer](./SchemaRenderer.md) - Schema 渲染器
- [SchemaForm](./SchemaForm.md) - Schema 表单生成器
- [AceEditor](../../plugins/code/components/AceEditor.md) - 代码编辑器
