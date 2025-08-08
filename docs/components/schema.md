---
nav:
  title: 组件
  order: 1
group:
  title: 渲染器
  order: 3
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
          type: 'string',
          default: '',
          required: true,
          minLength: 2,
          maxLength: 10,
        },
        age: {
          title: '年龄',
          type: 'number',
          default: 18,
          minimum: 0,
          maximum: 120,
        },
        gender: {
          title: '性别',
          type: 'string',
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
          type: 'string',
          default: '',
        },
      },
      type: 'html',
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
    type: 'number',
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
    version: '1.2.0',
    name: '七日天气预报',
    description: '七日天气预报组件',
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
        sevenDaysWeather: {
          title: '七日天气',
          type: 'array',
          required: true,
          items: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                format: 'date',
                description: '日期（格式：YYYY-MM-DD）',
              },
              weather: {
                type: 'string',
                enum: ['☀️ 晴', '⛅ 晴间多云', '🌧️ 雨', '❄️ 雪', '🌩️ 雷暴'],
              },
              temperatureRange: {
                type: 'object',
                required: ['min', 'max'],
                properties: {
                  min: { type: 'number', description: '最低温度 (°C)' },
                  max: { type: 'number', description: '最高温度 (°C)' },
                },
              },
              precipitation: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: '降水概率 (%)',
              },
            },
            required: ['date', 'weather', 'temperatureRange'],
          },
          default: [
            {
              date: '2024-03-22',
              weather: '☀️ 晴',
              temperatureRange: { min: 12, max: 24 },
              precipitation: 5,
            },
            {
              date: '2024-03-23',
              weather: '⛅ 晴间多云',
              temperatureRange: { min: 10, max: 22 },
              precipitation: 15,
            },
            {
              date: '2024-03-24',
              weather: '🌧️ 雨',
              temperatureRange: { min: 8, max: 18 },
              precipitation: 90,
            },
            {
              date: '2024-03-25',
              weather: '⛅ 晴间多云',
              temperatureRange: { min: 9, max: 20 },
              precipitation: 20,
            },
            {
              date: '2024-03-26',
              weather: '☀️ 晴',
              temperatureRange: { min: 11, max: 25 },
              precipitation: 0,
            },
            {
              date: '2024-03-27',
              weather: '❄️ 雪',
              temperatureRange: { min: -3, max: 2 },
              precipitation: 80,
            },
            {
              date: '2024-03-28',
              weather: '🌩️ 雷暴',
              temperatureRange: { min: 15, max: 28 },
              precipitation: 70,
            },
          ],
        },
      },
      type: 'mustache',
      schema:
        '<div style="background: linear-gradient(135deg, #1e3c72, #2a5298); padding: 2rem; border-radius: 16px; color: white;"><h2 style="text-align: center; margin-bottom: 1.5rem;">七日天气预报</h2><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">{{#sevenDaysWeather}}<div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; text-align: center;"><div style="font-size: 1.2rem;">{{date}}</div><div style="font-size: 2rem; margin: 0.5rem 0;">{{weather}}</div><div style="opacity: 0.8;">{{temperatureRange.min}}°C ~ {{temperatureRange.max}}°C</div><div style="margin-top: 0.5rem;">💧 {{precipitation}}%</div></div>{{/sevenDaysWeather}}</div></div>',
    },
    theme: {
      colorPalette: {
        primary: '#1e3c72',
        secondary: '#2a5298',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        text: { primary: '#FFFFFF', secondary: '#CCCCCC' },
      },
      spacing: { base: 8, multiplier: 2 },
      typography: {
        fontFamily: 'Arial',
        fontSizes: [12, 14, 16, 20],
        lineHeights: { normal: 1.5, heading: 1.2 },
      },
    },
    previewSettings: {
      viewport: {
        defaultDevice: 'desktop',
        responsive: true,
        customSizes: [{ name: 'Desktop Wide', width: 1440, height: 900 }],
      },
      environment: {
        mockData: true,
        networkThrottle: 'fast-3g',
        debugMode: false,
      },
    },
  };
  const handleValuesChange = (_, values: Record<string, any>) => {
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
        <div>
          <h2>预览效果</h2>
          <SchemaRenderer schema={schema} values={formValues} />
        </div>
      </div>
    </div>
  );
};

export default CompleteExample;
```

## mustache 示例

```tsx
import React, { useState } from 'react';
import { SchemaForm, SchemaRenderer, validator } from '@ant-design/md-editor';

const CompleteExample: React.FC = () => {
  const [formValues, setFormValues] = useState({});

  const schema = {
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
        sevenDaysWeather: {
          title: '七日天气',
          type: 'array',
          required: true,
          items: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                format: 'date',
                description: '日期（格式：YYYY-MM-DD）',
              },
              weather: {
                type: 'string',
                enum: ['☀️ 晴', '⛅ 晴间多云', '🌧️ 雨', '❄️ 雪', '🌩️ 雷暴'],
              },
              temperatureRange: {
                type: 'object',
                title: '温度范围',
                required: ['min', 'max'],
                properties: {
                  min: { type: 'number', description: '最低温度 (°C)' },
                  max: { type: 'number', description: '最高温度 (°C)' },
                },
              },
              precipitation: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: '降水概率 (%)',
              },
            },
            required: ['date', 'weather', 'temperatureRange'],
          },
          default: [
            {
              date: '2024-03-22',
              weather: '☀️ 晴',
              temperatureRange: { min: 12, max: 24 },
              precipitation: 5,
            },
            {
              date: '2024-03-23',
              weather: '⛅ 晴间多云',
              temperatureRange: { min: 10, max: 22 },
              precipitation: 15,
            },
            {
              date: '2024-03-24',
              weather: '🌧️ 雨',
              temperatureRange: { min: 8, max: 18 },
              precipitation: 90,
            },
            {
              date: '2024-03-25',
              weather: '⛅ 晴间多云',
              temperatureRange: { min: 9, max: 20 },
              precipitation: 20,
            },
            {
              date: '2024-03-26',
              weather: '☀️ 晴',
              temperatureRange: { min: 11, max: 25 },
              precipitation: 0,
            },
            {
              date: '2024-03-27',
              weather: '❄️ 雪',
              temperatureRange: { min: -3, max: 2 },
              precipitation: 80,
            },
            {
              date: '2024-03-28',
              weather: '🌩️ 雷暴',
              temperatureRange: { min: 15, max: 28 },
              precipitation: 70,
            },
          ],
        },
      },
      type: 'mustache',
      schema:
        '<div style="background: linear-gradient(135deg, #1e3c72, #2a5298); padding: 2rem; border-radius: 16px; color: white;"><h2 style="text-align: center; margin-bottom: 1.5rem;">七日天气预报</h2><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">{{#sevenDaysWeather}}<div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; text-align: center;"><div style="font-size: 1.2rem;">{{date}}</div><div style="font-size: 2rem; margin: 0.5rem 0;">{{weather}}</div><div style="opacity: 0.8;">{{temperatureRange.min}}°C ~ {{temperatureRange.max}}°C</div><div style="margin-top: 0.5rem;">💧 {{precipitation}}%</div></div>{{/sevenDaysWeather}}</div></div>',
    },
    theme: {
      colorPalette: {
        primary: '#1e3c72',
        secondary: '#2a5298',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        text: { primary: '#FFFFFF', secondary: '#CCCCCC' },
      },
      spacing: { base: 8, multiplier: 2 },
      typography: {
        fontFamily: 'Arial',
        fontSizes: [12, 14, 16, 20],
        lineHeights: { normal: 1.5, heading: 1.2 },
      },
    },
    previewSettings: {
      viewport: {
        defaultDevice: 'desktop',
        responsive: true,
        customSizes: [{ name: 'Desktop Wide', width: 1440, height: 900 }],
      },
      environment: {
        mockData: true,
        networkThrottle: 'fast-3g',
        debugMode: false,
      },
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
        <div>
          <h2>预览效果</h2>
          <SchemaRenderer schema={schema} values={formValues} />
        </div>
      </div>
    </div>
  );
};

export default CompleteExample;
```

## 输入 json 直接渲染

```tsx
import React, { useState, useEffect } from 'react';
import { SchemaRenderer, validator } from '@ant-design/md-editor';
import { Input, Button, message, Spin, Tabs } from 'antd';

const { TextArea } = Input;

const SchemaEditor: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 提供默认示例
  const defaultSchema = {
    version: '1.0.0',
    name: 'Simple Card Component',
    description: '可自定义的卡片组件',
    author: 'Schema Team',
    createTime: '2024-03-30T10:00:00Z',
    updateTime: '2024-03-30T10:00:00Z',
    component: {
      properties: {
        title: {
          title: '标题',
          type: 'string',
          default: '卡片标题',
        },
        content: {
          title: '内容',
          type: 'string',
          format: 'textarea',
          default: '这是卡片的内容区域，可以输入任意文本。',
        },
        bgColor: {
          title: '背景颜色',
          type: 'string',
          default: '#f5f5f5',
          format: 'color',
        },
      },
      type: 'html',
      schema: `
        <div style="background-color: {{bgColor}}; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 400px;">
          <h2 style="margin-top: 0; color: #333;">{{title}}</h2>
          <div style="color: #666;">{{content}}</div>
        </div>
      `,
    },
  };

  useEffect(() => {
    // 初始化默认示例
    setJsonInput(JSON.stringify(defaultSchema, null, 2));
  }, []);

  const parseAndValidate = () => {
    setLoading(true);
    setError('');

    try {
      // 解析 JSON
      const parsedSchema = JSON.parse(jsonInput);

      // 验证 schema
      const validationResult = validator.validate(parsedSchema);

      if (validationResult?.valid) {
        setSchema(parsedSchema);
        message.success('Schema 解析成功');
      } else {
        setError(
          `Schema 验证失败: ${JSON.stringify(validationResult?.errors)}`,
        );
        message.error('Schema 验证失败');
      }
    } catch (err) {
      setError(`JSON 解析错误: ${err.message}`);
      message.error('JSON 解析错误');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const loadExample = () => {
    setJsonInput(JSON.stringify(defaultSchema, null, 2));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ marginBottom: '8px' }}>
        <Button onClick={loadExample} style={{ marginRight: '8px' }}>
          加载示例
        </Button>
        <Button type="primary" onClick={parseAndValidate}>
          渲染预览
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', minWidth: '350px' }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            Schema JSON:
          </div>
          <TextArea
            value={jsonInput}
            onChange={handleInputChange}
            style={{ fontFamily: 'monospace', height: '500px' }}
            placeholder="在这里输入 JSON Schema..."
          />
          {error && (
            <div
              style={{
                marginTop: '10px',
                color: 'red',
                whiteSpace: 'pre-wrap',
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div style={{ flex: '1 1 400px', minWidth: '350px' }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            渲染结果:
          </div>
          <div
            style={{
              border: '1px solid #d9d9d9',
              padding: '16px',
              borderRadius: '2px',
              minHeight: '500px',
            }}
          >
            {loading ? (
              <Spin
                tip="正在渲染..."
                style={{ width: '100%', marginTop: '100px' }}
              />
            ) : schema ? (
              <SchemaRenderer schema={schema} />
            ) : (
              <div
                style={{
                  color: '#999',
                  textAlign: 'center',
                  marginTop: '100px',
                }}
              >
                点击"渲染预览"按钮查看渲染结果
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 高级示例，支持多个 Schema 渲染和代码/预览切换
const AdvancedSchemaEditor: React.FC = () => {
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState('1');
  const [schemas, setSchemas] = useState([
    {
      id: '1',
      json: JSON.stringify(defaultSchema, null, 2),
      schema: defaultSchema,
      error: '',
    },
  ]);

  // 同样的默认示例
  const defaultSchema = {
    version: '1.0.0',
    name: 'Simple Card Component',
    description: '可自定义的卡片组件',
    component: {
      properties: {
        title: {
          title: '标题',
          type: 'string',
          default: '卡片标题',
        },
        content: {
          title: '内容',
          type: 'string',
          default: '这是卡片的内容区域',
        },
        bgColor: {
          title: '背景颜色',
          type: 'string',
          default: '#f5f5f5',
        },
      },
      type: 'html',
      schema: `
        <div style="background-color: {{bgColor}}; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 400px;">
          <h2 style="margin-top: 0; color: #333;">{{title}}</h2>
          <div style="color: #666;">{{content}}</div>
        </div>
      `,
    },
  };

  const parseSchema = (id, json) => {
    try {
      const parsedSchema = JSON.parse(json);
      const validationResult = validator.validate(parsedSchema);

      setSchemas((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              json,
              schema: validationResult?.valid ? parsedSchema : null,
              error: validationResult?.valid
                ? ''
                : `Schema 验证失败: ${JSON.stringify(validationResult?.errors)}`,
            };
          }
          return item;
        }),
      );

      if (validationResult?.valid) {
        message.success('Schema 解析成功');
      } else {
        message.error('Schema 验证失败');
      }
    } catch (err) {
      setSchemas((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              json,
              schema: null,
              error: `JSON 解析错误: ${err.message}`,
            };
          }
          return item;
        }),
      );
      message.error('JSON 解析错误');
    }
  };

  const handleInputChange = (id, e) => {
    const json = e.target.value;
    setSchemas((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, json };
        }
        return item;
      }),
    );
  };

  const renderTabContent = (item) => {
    return (
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', minWidth: '350px' }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            Schema JSON:
          </div>
          <TextArea
            value={item.json}
            onChange={(e) => handleInputChange(item.id, e)}
            style={{ fontFamily: 'monospace', height: '500px' }}
            placeholder="在这里输入 JSON Schema..."
          />
          <Button
            type="primary"
            onClick={() => parseSchema(item.id, item.json)}
            style={{ marginTop: '8px' }}
          >
            渲染预览
          </Button>
          {item.error && (
            <div
              style={{
                marginTop: '10px',
                color: 'red',
                whiteSpace: 'pre-wrap',
              }}
            >
              {item.error}
            </div>
          )}
        </div>

        <div style={{ flex: '1 1 400px', minWidth: '350px' }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            渲染结果:
          </div>
          <div
            style={{
              border: '1px solid #d9d9d9',
              padding: '16px',
              borderRadius: '2px',
              minHeight: '500px',
            }}
          >
            {item.schema ? (
              <SchemaRenderer schema={item.schema} />
            ) : (
              <div
                style={{
                  color: '#999',
                  textAlign: 'center',
                  marginTop: '100px',
                }}
              >
                {item.error
                  ? '存在错误，无法渲染'
                  : '点击"渲染预览"按钮查看渲染结果'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <SchemaEditor />
    </div>
  );
};

export default SchemaEditor;
```

### 嵌套对象

```tsx
import React, { useState } from 'react';
import { SchemaForm, SchemaRenderer, validator } from '@ant-design/md-editor';

const CompleteExample: React.FC = () => {
  const [formValues, setFormValues] = useState({});

  const schema = {
    version: '1.0.0',
    name: '动物介绍卡片',
    description: '展示单个动物详细信息的卡片组件',
    author: 'Wildlife Info',
    createTime: '2025-05-23T08:00:00Z',
    updateTime: '2025-05-23T08:00:00Z',
    component: {
      properties: {
        animal: {
          title: '动物信息',
          type: 'object',
          required: true,
          properties: {
            name: { type: 'string', description: '中文名' },
            latinName: { type: 'string', description: '拉丁学名' },
            image: {
              type: 'string',
              format: 'uri',
              description: '动物图片 URL',
            },
            habitat: { type: 'string', description: '栖息地' },
            diet: { type: 'string', description: '食性' },
            behavior: { type: 'string', description: '习性/特征' },
            conservationStatus: { type: 'string', description: '保护等级' },
            description: { type: 'string', description: '简要介绍' },
            lastUpdated: {
              type: 'string',
              format: 'date',
              description: '信息更新时间',
            },
          },
          default: {
            name: '大熊猫',
            latinName: 'Ailuropoda melanoleuca',
            image: 'https://example.com/giant_panda.jpg',
            habitat: '中国四川、陕西、甘肃的高山竹林',
            diet: '主要以竹子为食，偶尔也会吃小型动物和果实',
            behavior: '性情温顺，多为独居，活动区域广泛，嗅觉灵敏',
            conservationStatus: '易危（IUCN Red List）',
            description:
              '大熊猫是中国特有的哺乳动物，以其独特的黑白毛色和憨态可掬的形象广受喜爱，被誉为“国宝”。',
            lastUpdated: '2025-04-15',
          },
        },
      },
      type: 'mustache',
      schema:
        "<div style='background: linear-gradient(135deg, #2c3e50, #4ca1af); padding: 2rem; border-radius: 16px; color: white; max-width: 800px; margin: auto;'><div style='display: flex; flex-direction: column; align-items: center;'><img src='{{animal.image}}' alt='{{animal.name}}' style='width: 180px; height: 180px; object-fit: cover; border-radius: 12px; border: 3px solid white;'><h2 style='margin-top: 1rem;'>{{animal.name}} <span style='font-size: 1rem; font-weight: normal;'>({{animal.latinName}})</span></h2></div><hr style='margin: 1rem 0; border-color: rgba(255,255,255,0.2);'><div><strong>📍 栖息地：</strong> {{animal.habitat}}</div><div><strong>🍽️ 食性：</strong> {{animal.diet}}</div><div><strong>🧠 习性：</strong> {{animal.behavior}}</div><div><strong>🛡️ 保护状态：</strong> {{animal.conservationStatus}}</div><div style='margin-top: 1rem;'><strong>📋 简介：</strong><p style='margin-top: 0.5rem; opacity: 0.9;'>{{animal.description}}</p></div><div style='margin-top: 1rem; text-align: right; font-size: 0.85rem; opacity: 0.6;'>🕒 更新时间：{{animal.lastUpdated}}</div></div>",
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
        <div>
          <h2>预览效果</h2>
          <SchemaRenderer schema={schema} values={formValues} />
        </div>
      </div>
    </div>
  );
};
export default CompleteExample;
```

这个示例展示了：

1. 如何定义不同类型的文本输入字段（普通文本、密码、邮箱、文本域、URL等）
2. 如何为文本字段设置验证规则（必填、长度限制、正则表达式等）
3. 如何添加辅助信息（占位符、描述等）
4. 如何将输入值渲染到预览界面
5. 如何处理特殊格式的输入（如标签字符串转换为数组）

## 调试技巧

1. 使用浏览器开发者工具查看生成的 DOM 结构
2. 在 validator 验证失败时查看详细的错误信息
3. 使用 React DevTools 查看组件的 props 和 state
4. 在 onValuesChange 回调中添加 console.log 查看数据变化
