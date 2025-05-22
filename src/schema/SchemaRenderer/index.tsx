import { merge } from 'lodash';
import React, { useEffect, useRef } from 'react';
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
    fontFamily: schema.theme?.typography?.fontFamily,
    fontSize: `${schema.theme?.typography?.fontSizes?.[2] ?? '14'}px`, // 使用中等大小的字体
    lineHeight: schema.theme?.typography?.lineHeights?.normal ?? 1.6,
    width: schema.theme?.spacing?.width ?? 'max-content',
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // 清空容器
      if (containerRef.current.shadowRoot) {
        containerRef.current.attachShadow({ mode: 'open' });
      }

      // 获取或创建Shadow DOM
      const shadowRoot =
        containerRef.current.shadowRoot ||
        containerRef.current.attachShadow({ mode: 'open' });

      // 创建一个临时容器来解析HTML
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = renderedHtml;

      // 清空shadowRoot内容
      shadowRoot.innerHTML = '';

      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
          font-family: ${schema.theme?.typography?.fontFamily || 'inherit'};
          font-size: ${schema.theme?.typography?.fontSizes?.[2] ?? '14'}px;
          line-height: ${schema.theme?.typography?.lineHeights?.normal ?? 1.6};
        }
      `;
      shadowRoot.appendChild(style);

      // 提取所有的script标签
      const scripts: HTMLScriptElement[] = [];
      const scriptElements = tempContainer.querySelectorAll('script');
      scriptElements.forEach((oldScript) => {
        // 移除原始script标签
        oldScript.parentNode?.removeChild(oldScript);

        // 创建新的script标签
        const newScript = document.createElement('script');

        // 复制属性
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // 复制内容
        newScript.textContent = oldScript.textContent;
        scripts.push(newScript);
      });

      // 将其他内容添加到Shadow DOM
      Array.from(tempContainer.childNodes).forEach((node) => {
        shadowRoot.appendChild(node.cloneNode(true));
      });

      // 添加并执行脚本
      scripts.forEach((script) => {
        // 通过eval执行内联脚本
        if (!script.src && script.textContent) {
          const scriptFn = new Function(
            'shadowRoot',
            'window',
            script.textContent,
          );
          try {
            scriptFn(shadowRoot, {
              devicePixelRatio: window.devicePixelRatio,
            });
          } catch (error) {
            console.error('执行脚本错误:', error);
          }
        } else if (script.src) {
          // 对于外部脚本，需要重新添加到DOM中
          shadowRoot.appendChild(script);
        }
      });
    }
  }, [renderedHtml, schema.theme]);

  if (!validationResult?.valid) {
    console.error('Schema validation failed:', validationResult.errors);
    return (
      <div style={{ color: 'red' }}>
        Schema 验证失败：
        <pre>{JSON.stringify(validationResult.errors, null, 2)}</pre>
      </div>
    );
  }

  return <div ref={containerRef} style={containerStyle} />;
};
