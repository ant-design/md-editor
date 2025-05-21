import { merge } from 'lodash';
import React from 'react';
import { LowCodeSchema } from '../../schema/types';
import { validator } from '../../schema/validator';
import { TemplateEngine } from './templateEngine';

export * from './templateEngine';

export interface SchemaRendererProps {
  schema: LowCodeSchema;
  values: Record<string, any>;
  config?: {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
  };
}

export const SchemaRenderer: React.FC<SchemaRendererProps> = ({
  schema,
  values,
  config,
}) => {
  // 验证 schema
  const validationResult = validator.validate(schema);
  if (!validationResult?.valid) {
    console.error('Schema validation failed:', validationResult.errors);
    return (
      <div style={{ color: 'red' }}>
        Schema 验证失败：
        <pre>{JSON.stringify(validationResult.errors, null, 2)}</pre>
      </div>
    );
  }

  // 从 schema 中提取数据和模板
  const { properties } = schema.component;
  const templateHtml = schema.component.schema;

  // 准备模板数据
  const templateData = merge(
    Object.entries(properties).reduce(
      (data, [key, value]) => {
        data[key] = value.default;
        return data;
      },
      {} as Record<string, string | number | boolean>,
    ),
    values,
  );

  // 使用模板引擎渲染
  const renderedHtml = TemplateEngine.render(
    templateHtml,
    templateData,
    config,
  );

  // 应用主题样式
  const containerStyle = {
    padding: `${schema.theme?.spacing?.base ?? 16}px`,
    color: undefined,
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontFamily: schema.theme?.typography?.fontFamily,
    fontSize: `${schema.theme?.typography?.fontSizes?.[2] ?? '14'}px`, // 使用中等大小的字体
    lineHeight: schema.theme?.typography?.lineHeights?.normal ?? 1.6,
    width: schema.theme?.spacing?.width ?? 'max-content',
  };

  return (
    <div
      style={containerStyle}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
