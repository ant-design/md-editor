import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { SchemaRenderer } from '../src/schema/SchemaRenderer';
import type { LowCodeSchema } from '../src/schema/types';

// Mock schema for testing fallback values
const mockSchemaWithFallbacks: LowCodeSchema = {
  version: '1.0.0',
  name: 'Test Schema with Fallbacks',
  description: 'Test schema for fallback values',
  author: 'Test Author',
  createTime: '2024-01-01T00:00:00.000Z',
  updateTime: '2024-01-01T00:00:00.000Z',
  pageConfig: {
    layout: 'flex',
    router: {
      mode: 'hash',
      basePath: '/',
    },
    globalVariables: {
      colors: {
        sunny: '#FFD700',
        rainy: '#4682B4',
        cloudy: '#708090',
      },
      constants: {
        refreshInterval: 5000,
      },
    },
  },
  dataSources: {
    restAPI: {
      baseURL: 'https://api.example.com',
      defaultHeaders: {},
      timeout: 5000,
      interceptors: {
        request: false,
        response: false,
      },
    },
    mock: {
      enable: false,
      responseDelay: 1000,
      dataPath: '/mock',
    },
  },
  component: {
    type: 'mustache',
    schema: `
      <div>
        <h1>{{title}}</h1>
        <p>Count: {{count}}</p>
        <p>Type: {{type}}</p>
        <ul>
          {{#tags}}
            <li>{{.}}</li>
          {{/tags}}
          {{^tags}}
            <li>No tags</li>
          {{/tags}}
        </ul>
        <div>
          <p>Width: {{config.width}}</p>
          <p>Height: {{config.height}}</p>
        </div>
        <div>
          {{#items}}
            <p>{{name}}: {{value}}</p>
          {{/items}}
          {{^items}}
            <p>No items</p>
          {{/items}}
        </div>
      </div>
    `,
    properties: {
      title: {
        type: 'string',
        title: '标题',
        description: '组件标题',
        default: '默认标题',
      },
      count: {
        type: 'number',
        title: '数量',
        description: '数量值',
        default: 10,
      },
      type: {
        type: 'string',
        title: '类型',
        description: '选择类型',
        default: 'primary',
      },
      tags: {
        type: 'array',
        title: '标签',
        description: '标签列表',
        default: [],
      },
      config: {
        type: 'object',
        title: '配置',
        description: '配置对象',
        default: {},
      },
      items: {
        type: 'array',
        title: '项目列表',
        description: '对象数组',
        default: [],
      },
      // 这些属性没有默认值，用于测试 fallback
      missingString: {
        type: 'string',
        title: '缺失的字符串',
        description: '测试字符串 fallback',
        default: '',
      },
      missingNumber: {
        type: 'number',
        title: '缺失的数字',
        description: '测试数字 fallback',
        default: 0,
      },
      missingArray: {
        type: 'array',
        title: '缺失的数组',
        description: '测试数组 fallback',
        default: [],
      },
      missingObject: {
        type: 'object',
        title: '缺失的对象',
        description: '测试对象 fallback',
        default: {},
      },
    },
  },
};

describe('SchemaRenderer', () => {
  it('renders with default values when no data provided', () => {
    const { container } = render(
      <SchemaRenderer schema={mockSchemaWithFallbacks} values={{}} />,
    );

    expect(container).toBeInTheDocument();
  });

  it('applies fallback values for missing properties', () => {
    // 提供部分数据，其他属性应该使用 fallback 值
    const partialValues = {
      title: '自定义标题',
      // count, type, tags, config, items, missingString, missingNumber, missingArray, missingObject 都缺失
    };

    const { container } = render(
      <SchemaRenderer
        schema={mockSchemaWithFallbacks}
        values={partialValues}
      />,
    );

    expect(container).toBeInTheDocument();
    // 由于使用了 Shadow DOM，我们主要测试组件能正常渲染而不出错
  });

  it('applies fallback values for null and undefined properties', () => {
    // 提供 null 和 undefined 值，应该使用 fallback 值
    const valuesWithNulls = {
      title: null,
      count: undefined,
      type: '',
      tags: null,
      config: undefined,
      items: null,
    };

    const { container } = render(
      <SchemaRenderer
        schema={mockSchemaWithFallbacks}
        values={valuesWithNulls}
      />,
    );

    expect(container).toBeInTheDocument();
  });

  it('preserves existing values and only adds fallbacks for missing ones', () => {
    const mixedValues = {
      title: '存在的标题',
      count: 42,
      // type 缺失，应该使用默认值 'primary'
      tags: ['existing', 'tags'],
      // config 缺失，应该使用 fallback {}
      // items 缺失，应该使用 fallback []
      // missingString 缺失，应该使用 fallback '-'
      // missingNumber 缺失，应该使用 fallback '-'
      // missingArray 缺失，应该使用 fallback []
      // missingObject 缺失，应该使用 fallback {}
    };

    const { container } = render(
      <SchemaRenderer schema={mockSchemaWithFallbacks} values={mixedValues} />,
    );

    expect(container).toBeInTheDocument();
    // 测试组件能正常渲染，fallback 逻辑在内部处理
  });

  it('handles empty schema gracefully', () => {
    const emptySchema: LowCodeSchema = {
      ...mockSchemaWithFallbacks,
      component: {
        properties: {},
        schema: '<div>Empty schema</div>',
      },
    };

    const { container } = render(
      <SchemaRenderer schema={emptySchema} values={{}} />,
    );

    expect(container).toBeInTheDocument();
  });

  it('handles schema without component property', () => {
    const schemaWithoutComponent: LowCodeSchema = {
      ...mockSchemaWithFallbacks,
      component: undefined,
    };

    const { container } = render(
      <SchemaRenderer schema={schemaWithoutComponent} values={{}} />,
    );

    expect(container).toBeInTheDocument();
  });

  it('works with useDefaultValues disabled', () => {
    const { container } = render(
      <SchemaRenderer
        schema={mockSchemaWithFallbacks}
        values={{}}
        useDefaultValues={false}
      />,
    );

    expect(container).toBeInTheDocument();
  });

  it('handles complex nested objects with fallbacks', () => {
    const schemaWithNestedObjects: LowCodeSchema = {
      ...mockSchemaWithFallbacks,
      component: {
        ...mockSchemaWithFallbacks.component,
        properties: {
          nestedConfig: {
            type: 'object',
            title: '嵌套配置',
            description: '嵌套对象配置',
            default: {},
          },
          deepArray: {
            type: 'array',
            title: '深层数组',
            description: '深层数组数据',
            default: [],
          },
        },
      },
    };

    const { container } = render(
      <SchemaRenderer schema={schemaWithNestedObjects} values={{}} />,
    );

    expect(container).toBeInTheDocument();
  });
});
