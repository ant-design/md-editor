import { merge } from 'lodash';
import Mustache from 'mustache';
import React, {
  Component,
  ErrorInfo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LowCodeSchema } from '../../schema/types';
import { mdDataSchemaValidator } from '../../schema/validator';
import { TemplateEngine } from './templateEngine';
export * from './templateEngine';

// Error Boundary to catch rendering errors
class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SchemaRenderer error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            padding: '10px',
            border: '1px solid #f5c2c7',
            borderRadius: '4px',
            background: '#f8d7da',
            color: '#842029',
          }}
        >
          <p>Something went wrong rendering this component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export interface SchemaRendererProps {
  schema: LowCodeSchema;
  values: Record<string, any>;
  config?: {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
  };
  fallbackContent?: React.ReactNode;
}

export const SchemaRenderer: React.FC<SchemaRendererProps> = ({
  schema,
  values,
  config,
  fallbackContent,
}) => {
  const [renderError, setRenderError] = useState<string | null>(null);

  // 安全地获取 schema 属性
  const safeSchema = schema || {};
  const safeComponent = safeSchema.component || {};

  const initialValues = safeSchema.initialValues || {};

  // 验证 schema
  const validationResult = useMemo(() => {
    try {
      return mdDataSchemaValidator.validate(safeSchema);
    } catch (error) {
      console.error('Schema validation error:', error);
      return {
        valid: false,
        errors: [{ message: 'Schema validation failed' }],
      };
    }
  }, [safeSchema]);

  // 从 schema 中提取数据和模板
  const { properties = {}, type = 'html' } = safeComponent;
  const templateHtml = safeComponent.schema || '';

  // 准备模板数据
  const templateData = useMemo(() => {
    try {
      return merge(
        Object.entries(properties || {}).reduce(
          (data, [key, value]) => {
            if (value && 'default' in value) {
              data[key] = value.default;
            }
            return data;
          },
          {} as Record<string, any>,
        ),
        initialValues || {},
        values || {},
      );
    } catch (error) {
      console.error('Error preparing template data:', error);
      return values || {};
    }
  }, [properties, values]);

  // 使用模板引擎渲染
  const renderedHtml = useMemo(() => {
    try {
      if (type === 'html') {
        return TemplateEngine.render(templateHtml, templateData, config);
      }
      if (type === 'mustache') {
        return Mustache.render(templateHtml, templateData);
      }
      return templateHtml;
    } catch (error) {
      console.error('模板渲染错误:', error);
      setRenderError(
        `Template rendering error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return '';
    }
  }, [templateHtml, templateData, type, config]);

  // 应用主题样式
  const containerStyle = useMemo(() => {
    try {
      const safeTheme = safeSchema.theme || {};
      const safeTypography = safeTheme.typography || {};
      const safeSpacing = safeTheme.spacing || {};

      return {
        fontFamily: safeTypography.fontFamily,
        fontSize: `${safeTypography.fontSizes?.[2] ?? '14'}px`,
        lineHeight: safeTypography.lineHeights?.normal ?? 1.6,
        width: safeSpacing.width ?? 'max-content',
      };
    } catch (error) {
      console.error('Error applying theme styles:', error);
      return {
        fontSize: '14px',
        lineHeight: 1.6,
        width: 'max-content',
      };
    }
  }, [safeSchema.theme]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !renderedHtml) return;

    try {
      // 获取或创建Shadow DOM
      let shadowRoot = containerRef.current.shadowRoot;

      if (!shadowRoot) {
        try {
          shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
        } catch (error) {
          console.error('Failed to create shadow root:', error);
          // Fallback to direct innerHTML if shadow DOM is not supported
          containerRef.current.innerHTML = renderedHtml;
          return;
        }
      }

      // 创建一个临时容器来解析HTML
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = renderedHtml;

      // 清空shadowRoot内容
      shadowRoot.innerHTML = '';

      // 添加样式
      try {
        const style = document.createElement('style');
        const safeTheme = safeSchema.theme || {};
        const safeTypography = safeTheme.typography || {};

        style.textContent = `
          :host {
            display: block;
            font-family: ${safeTypography.fontFamily || 'inherit'};
            font-size: ${safeTypography.fontSizes?.[2] ?? '14'}px;
            line-height: ${safeTypography.lineHeights?.normal ?? 1.6};
          }
        `;
        shadowRoot.appendChild(style);
      } catch (styleError) {
        console.error('Error applying styles:', styleError);
      }

      try {
        // 提取所有的script标签
        const scripts: HTMLScriptElement[] = [];
        const scriptElements = tempContainer.querySelectorAll('script');

        scriptElements.forEach((oldScript) => {
          try {
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
          } catch (scriptError) {
            console.error('Error processing script:', scriptError);
          }
        });

        // 将其他内容添加到Shadow DOM
        Array.from(tempContainer.childNodes).forEach((node) => {
          try {
            shadowRoot?.appendChild(node.cloneNode(true));
          } catch (nodeError) {
            console.error('Error appending node:', nodeError);
          }
        });

        // 添加并执行脚本
        scripts.forEach((script) => {
          try {
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
              } catch (evalError) {
                console.error('执行脚本错误:', evalError);
              }
            } else if (script.src) {
              // 对于外部脚本，需要重新添加到DOM中
              try {
                shadowRoot?.appendChild(script);
              } catch (appendError) {
                console.error('Error appending external script:', appendError);
              }
            }
          } catch (scriptError) {
            console.error('Script execution error:', scriptError);
          }
        });
      } catch (contentError) {
        console.error('Error processing content:', contentError);
        // Fallback - at least show the HTML content
        try {
          shadowRoot.innerHTML = renderedHtml;
        } catch (fallbackError) {
          console.error('Even fallback rendering failed:', fallbackError);
        }
      }
    } catch (error) {
      console.error('Critical rendering error:', error);
      setRenderError(
        `Critical rendering error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }, [renderedHtml, safeSchema.theme]);

  // 如果渲染过程中出现错误，显示错误信息
  if (renderError) {
    return (
      fallbackContent || (
        <div
          style={{
            padding: '16px',
            border: '1px solid #f5c2c7',
            borderRadius: '8px',
            background: '#f8d7da',
            color: '#842029',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            margin: '10px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px' }}
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#842029"
                strokeWidth="2"
              />
              <path
                d="M12 8V12"
                stroke="#842029"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="#842029" />
            </svg>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              渲染错误
            </h3>
          </div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: 'rgba(255,255,255,0.5)',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '14px',
              margin: 0,
            }}
          >
            {renderError}
          </pre>
        </div>
      )
    );
  }

  // Schema 验证失败，显示错误信息
  if (!validationResult?.valid) {
    console.error('Schema validation failed:', validationResult.errors);

    return (
      fallbackContent || (
        <div
          style={{
            padding: '16px',
            border: '1px solid #f5c2c7',
            borderRadius: '8px',
            background: '#f8d7da',
            color: '#842029',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            margin: '10px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px' }}
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#842029"
                strokeWidth="2"
              />
              <path
                d="M12 8V12"
                stroke="#842029"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="#842029" />
            </svg>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              Schema 验证失败
            </h3>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.5)',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            {Array.isArray(validationResult.errors) ? (
              <ul
                style={{
                  margin: '0',
                  paddingLeft: '20px',
                  listStyleType: 'circle',
                }}
              >
                {validationResult.errors.map((error: any, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    <div style={{ fontWeight: 500 }}>
                      {error.property || error.path ? (
                        <span style={{ color: '#d63939' }}>
                          {(error.property || error.path)
                            .toString()
                            .replace('instance.', '')}
                          :
                        </span>
                      ) : null}
                      <span
                        style={{
                          marginLeft:
                            error.property || error.path ? '4px' : '0',
                        }}
                      >
                        {error.message}
                      </span>
                    </div>
                    {error.schema ? (
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#5c636a',
                          marginTop: '4px',
                          paddingLeft: '12px',
                        }}
                      >
                        预期: {JSON.stringify(error.schema)}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                {JSON.stringify(validationResult.errors, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )
    );
  }

  return (
    <ErrorBoundary fallback={fallbackContent}>
      <div ref={containerRef} style={containerStyle} />
    </ErrorBoundary>
  );
};
