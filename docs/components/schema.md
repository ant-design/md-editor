---
nav:
  title: 组件
  order: 1
---

# Schema

本文档介绍如何使用 Schema 系统来创建和配置组件。

## 基本结构

Schema 由以下几个主要部分组成：

```typescript | pure
{
  version: string;          // 版本号
  name: string;            // 组件名称
  description: string;     // 组件描述
  author: string;          // 作者
  createTime: string;      // 创建时间
  updateTime: string;      // 更新时间
  pageConfig: {...};       // 页面配置
  dataSources: {...};      // 数据源配置
  component: {...};        // 组件配置
  theme: {...};            // 主题配置
  previewSettings: {...};  // 预览设置
}
```

## 组件属性定义

组件属性在 `component.properties` 中定义，支持两种类型：

### 字符串属性

```typescript | pure
{
  title: string;           // 属性标题
  type: "string";         // 类型声明
  default: string;        // 默认值
  enum?: string[];        // 可选的枚举值
  pattern?: string;       // 正则表达式校验
  patternMessage?: string; // 校验失败提示
  minLength?: number;     // 最小长度
  maxLength?: number;     // 最大长度
}
```

### 数字属性

```typescript | pure
{
  title: string;          // 属性标题
  type: "number";        // 类型声明
  default: number;       // 默认值
  minimum?: number;      // 最小值
  maximum?: number;      // 最大值
  step?: number;         // 步进值
  unit?: string;         // 单位
}
```

## 使用示例

以下是一个天气组件的配置示例：

```typescript | pure
{
  component: {
    properties: {
      weather: {
        title: "天气",
        type: "string",
        default: "晴"
      },
      temperature: {
        title: "温度",
        type: "string",
        default: "25"
      }
    },
    type: "html",
    schema: "<div>今天天气是 {{weather}}，温度是 {{temperature}}。</div>"
  }
}
```

## 模板引擎

组件支持使用模板语法渲染内容：

- 使用 `{{propertyName}}` 语法引用属性值
- 模板引擎内置 XSS 防护
- 支持属性值的动态更新

## 主题配置

主题系统支持以下配置：

- 颜色系统（primary、secondary、success 等）
- 间距系统（base、multiplier）
- 排版系统（字体、字号、行高）
- 响应式断点（xs、sm、md、lg、xl）

## 最佳实践

1. 属性命名使用驼峰式命名
2. 为每个属性提供合理的默认值
3. 使用 TypeScript 类型定义确保类型安全
4. 需要枚举值的属性优先使用 enum 定义
5. 合理使用正则表达式进行输入验证

## 注意事项

1. type 属性必须使用字面量类型（使用 `as const`）
2. 属性的默认值类型必须与声明的类型匹配
3. 模板中的变量名必须与属性名完全匹配
4. 所有必需的配置项都要填写

## 核心组件使用指南

### SchemaForm 使用

SchemaForm 组件用于根据 schema 定义自动生成表单：

```tsx | pure
import { SchemaForm } from '@ant-design/md-editor';

const MyFormComponent: React.FC = () => {
  const schema = {
    component: {
      properties: {
        name: {
          title: '姓名',
          type: 'string' as const,
          default: '',
          required: true,
          minLength: 2,
          maxLength: 10,
        },
        age: {
          title: '年龄',
          type: 'number' as const,
          default: 18,
          minimum: 0,
          maximum: 120,
        },
        gender: {
          title: '性别',
          type: 'string' as const,
          default: '男',
          enum: ['男', '女', '其他'],
        },
      },
    },
  };

  const handleValuesChange = (values: Record<string, any>) => {
    console.log('表单值变化：', values);
  };

  return (
    <SchemaForm
      schema={schema}
      onValuesChange={handleValuesChange}
      initialValues={{
        name: '张三',
        age: 25,
        gender: '男',
      }}
    />
  );
};
```

### SchemaRenderer 使用

SchemaRenderer 组件用于根据 schema 和模板渲染内容：

```tsx | pure
import { SchemaRenderer } from '@ant-design/md-editor';

const MyRendererComponent: React.FC = () => {
  const schema = {
    component: {
      properties: {
        title: {
          title: '标题',
          type: 'string' as const,
          default: '我的博客',
        },
        content: {
          title: '内容',
          type: 'string' as const,
          default: '这是一篇博客文章',
        },
      },
      type: 'html' as const,
      schema: `
        <div class="blog-post">
          <h1>{{title}}</h1>
          <div class="content">{{content}}</div>
        </div>
      `,
    },
  };

  return <SchemaRenderer schema={schema} />;
};
```

### validator 使用

validator 用于验证 schema 数据的合法性：

```typescript | pure
import { validator } from '@ant-design/md-editor';

// 验证整个 schema
const validateSchema = () => {
  const schema = {
    version: '1.0.0',
    name: '测试组件',
    description: '这是一个测试组件',
    author: '开发团队',
    createTime: '2024-03-20T10:00:00Z',
    updateTime: '2024-03-20T10:00:00Z',
    component: {
      properties: {
        name: {
          title: '姓名',
          type: 'string' as const,
          default: '',
        },
      },
      type: 'html' as const,
      schema: '<div>{{name}}</div>',
    },
  };

  try {
    const validationResult = validator.validate(schema);
    if (validationResult?.valid) {
      console.log('Schema 验证通过');
    } else {
      console.error('Schema 验证失败：', validationResult.errors);
    }
  } catch (error) {
    console.error('验证过程出错：', error);
  }
};

// 验证单个属性值
const validateValue = () => {
  const property = {
    title: '年龄',
    type: 'number' as const,
    default: 18,
    minimum: 0,
    maximum: 120,
  };

  const value = 25;

  try {
    const isValid = validator.validateValue(value, property);
    console.log('值是否有效：', isValid);
  } catch (error) {
    console.error('验证过程出错：', error);
  }
};
```

## 完整示例

下面是一个完整的使用示例，展示了如何组合使用这些组件：

```tsx
import React, { useState } from 'react';
import { SchemaForm, SchemaRenderer, validator } from '@ant-design/md-editor';

const CompleteExample: React.FC = () => {
  const [formValues, setFormValues] = useState({});

  const schema = {
    version: '1.0.0',
    name: 'Weather Card Component',
    description: 'A beautiful weather display card component',
    author: 'Weather Team',
    createTime: '2024-03-20T10:00:00Z',
    updateTime: '2024-03-20T10:00:00Z',
    component: {
      properties: {
        title: {
          title: '标题',
          type: 'string' as const,
          default: '我的文章',
          required: true,
          minLength: 2,
          maxLength: 50,
        },
        content: {
          title: '内容',
          type: 'string' as const,
          default: '请输入文章内容',
          required: true,
        },
        category: {
          title: '分类',
          type: 'string' as const,
          default: '技术',
          enum: ['技术', '生活', '其他'],
        },
      },
      type: 'html' as const,
      schema: `
        <div class="article">
          <h1>{{title}}</h1>
          <div class="category">分类：{{category}}</div>
          <div class="content">{{content}}</div>
        </div>
      `,
    },
  };
  const handleValuesChange = (_, values: Record<string, any>) => {
    console.log(values);
    // 验证数据
    const validationResult = validator.validate(schema);
    if (validationResult?.valid) {
      setFormValues(values);
    } else {
      console.error('Schema 验证失败：', validationResult.errors);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2>编辑表单</h2>
        <SchemaForm schema={schema} onValuesChange={handleValuesChange} />
      </div>
      <div style={{ flex: 1 }}>
        <h2>预览效果</h2>
        <SchemaRenderer schema={schema} values={formValues} />
      </div>
    </div>
  );
};

export default CompleteExample;
```

这个完整示例展示了：

1. 如何定义和使用 schema
2. 如何使用 SchemaForm 创建表单
3. 如何使用 SchemaRenderer 渲染内容
4. 如何使用 validator 进行数据验证
5. 如何处理表单值的变化
6. 如何实现实时预览功能

## 调试技巧

1. 使用浏览器开发者工具查看生成的 DOM 结构
2. 在 validator 验证失败时查看详细的错误信息
3. 使用 React DevTools 查看组件的 props 和 state
4. 在 onValuesChange 回调中添加 console.log 查看数据变化
