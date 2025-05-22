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
    version: '1.0.0',
    name: 'Weather Card Component',
    description: 'A beautiful weather display card component',
    author: 'Weather Team',
    createTime: '2024-03-20T10:00:00Z',
    updateTime: '2024-03-20T10:00:00Z',
    pageConfig: {
      layout: 'flex',
      router: { mode: 'hash', basePath: '/weather' },
      globalVariables: {
        colors: { sunny: '#FFB300', rainy: '#2196F3', cloudy: '#90A4AE' },
        constants: { refreshInterval: 300000 },
      },
    },
    dataSources: {
      restAPI: {
        baseURL: 'https://api.weatherapi.com/v1',
        defaultHeaders: { 'Content-Type': 'application/json' },
        timeout: 3000,
        interceptors: { request: true, response: true },
      },
      mock: {
        enable: true,
        responseDelay: 100,
        dataPath: '/mock/weather',
      },
    },
    component: {
      properties: {
        weather: {
          title: '天气',
          type: 'string',
          required: true,
          enum: ['☀️ 晴', '☁️ 多云', '☁️ 阴', '🌧️ 雨', '❄️ 雪'],
          default: '☀️ 晴',
        },
        temperature: {
          title: '温度',
          type: 'number',
          required: true,
          minimum: -50,
          maximum: 50,
          step: 0.1,
          default: 25,
        },
        humidity: {
          title: '湿度',
          type: 'number',
          required: true,
          minimum: 0,
          maximum: 100,
          step: 1,
          default: 65,
        },
        windSpeed: {
          title: '风速',
          type: 'number',
          required: true,
          minimum: 0,
          maximum: 200,
          step: 0.1,
          default: 15,
        },
        pa: {
          title: '气压',
          type: 'number',
          required: true,
          minimum: 0,
          maximum: 10,
          step: 0.1,
          default: 1,
        },
      },
      type: 'html',
      schema:
        '<div style= "min-height: 200px;display: grid;max-width: 400px;place-items: center;background: linear-gradient(160deg, #2c3e50, #3498db); "><div style= " background: linear-gradient(160deg, #2c3e50, #3498db); backdrop-filter: blur(10px); border-radius: 20px; padding: 2rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); color: white; width: 100%; position: relative; overflow: hidden; "><!--天气图标--><div style= "  font-size: 4rem;  text-align: center;  margin-bottom: 1rem;  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);  animation: float 3s ease-in-out infinite;  ">{{weather}}</div><!--温度显示--><div style= "  font-size: 3rem;  font-weight: bold;  text-align: center;  margin-bottom: 1.5rem;  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);  ">{{temperature}}°C</div><!--数据网格--><div style= "  display: grid;  grid-template-columns: repeat(2, 1fr);  gap: 1rem;  "><div style= " background: rgba(255, 255, 255, 0.1);padding: 1rem;border-radius: 12px;text-align: center;"><div style= "font-size: 1.5rem ">💧</div><div style= "font-size: 0.9rem; opacity: 0.8 ">湿度</div><div style= "font-size: 1.2rem; font-weight: bold ">{{humidity}}%</div></div><div style= "background: rgba(255, 255, 255, 0.1);padding: 1rem;border-radius: 12px;text-align: center;"><div style= "font-size: 1.5rem ">🌪️</div><div style= "font-size: 0.9rem; opacity: 0.8 ">风速</div><div style= "font-size: 1.2rem; font-weight: bold ">{{windSpeed}}m/s</div></div><div style= "background: rgba(255, 255, 255, 0.1);padding: 1rem;border-radius: 12px;text-align: center;"><div style= "font-size: 1.5rem ">🧭</div><div style= "font-size: 0.9rem; opacity: 0.8 ">风向</div><div style= "font-size: 1.2rem; font-weight: bold ">{{windSpeed}}</div></div><div style= "background: rgba(255, 255, 255, 0.1);padding: 1rem;border-radius: 12px;text-align: center;"><div style= "font-size: 1.5rem ">📉</div><div style= "font-size: 0.9rem; opacity: 0.8 ">气压</div><div style= "font-size: 1.2rem; font-weight: bold ">{{pa}}hPa</div></div></div><!--装饰元素--><div style= "  position: absolute;  width: 150px;  height: 150px;  background: rgba(255,255,255,0.05);  border-radius: 50%;  top: -50px;  right: -50px;  "></div><style>@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}</style></div></div>',
    },
    theme: { spacing: { base: 0, multiplier: 0, width: 400 } },
    previewSettings: {
      viewport: {
        defaultDevice: 'desktop',
        responsive: true,
        customSizes: [
          { name: 'Mobile Portrait', width: 375, height: 667 },
          { name: 'Mobile Landscape', width: 667, height: 375 },
        ],
      },
      environment: {
        mockData: true,
        networkThrottle: 'fast-3g',
        debugMode: true,
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
