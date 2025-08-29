import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SchemaRenderer } from '../SchemaRenderer';
import { LowCodeSchema } from '../types';
import { mdDataSchemaValidator } from '../validator';
import { AceEditorWrapper } from './AceEditorWrapper';
import { useStyle } from './style';

export interface SchemaEditorProps {
  /** 初始schema数据 */
  initialSchema?: LowCodeSchema;
  /** 初始值 */
  initialValues?: Record<string, any>;
  /** 编辑器高度 */
  height?: number | string;
  /** 是否只读 */
  readonly?: boolean;
  /** 变更回调 */
  onChange?: (schema: LowCodeSchema, values: Record<string, any>) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
  /** 自定义样式 */
  className?: string;
  /** 是否显示预览 */
  showPreview?: boolean;
  /** 预览配置 */
  previewConfig?: {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
  };
}

/**
 * Schema编辑器组件
 *
 * 提供schema的实时编辑和预览功能，底层使用AceEditor编辑schema中的HTML内容
 */
export function SchemaEditor({
  initialSchema,
  initialValues = {},
  height = 600,
  readonly = false,
  onChange,
  className = '',
  showPreview = true,
  previewConfig,
}: SchemaEditorProps) {
  useStyle('schema-editor');
  const [schema, setSchema] = useState<LowCodeSchema>(() => {
    return (
      initialSchema || {
        version: '1.0.0',
        name: 'Untitled Schema',
        description: '',
        component: {
          type: 'html',
          schema: '<div>Hello World</div>',
        },
      }
    );
  });

  const [values] = useState<Record<string, any>>(initialValues);
  const [schemaString, setSchemaString] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // 将schema转换为JSON字符串
  const schemaToJson = useCallback((schemaData: LowCodeSchema): string => {
    try {
      return JSON.stringify(schemaData, null, 2);
    } catch (error) {
      console.error('Schema序列化错误:', error);
      return '{}';
    }
  }, []);

  // 将JSON字符串转换为schema对象
  const jsonToSchema = useCallback(
    (jsonString: string): LowCodeSchema | null => {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('Schema解析错误:', error);
        return null;
      }
    },
    [],
  );

  // 初始化schema字符串
  useEffect(() => {
    setSchemaString(schemaToJson(schema));
    setHtmlContent(schema.component?.schema || '');
  }, [schema, schemaToJson]);

  // 验证schema
  const validateSchema = useCallback((schemaData: LowCodeSchema): string => {
    try {
      const result = mdDataSchemaValidator.validate(schemaData);
      if (!result.valid) {
        return (
          result.errors?.map((err: any) => err.message).join(', ') || '验证失败'
        );
      }
      return '';
    } catch (error) {
      return error instanceof Error ? error.message : '验证失败';
    }
  }, []);

  // 处理schema变更
  const handleSchemaChange = useCallback(
    (newSchema: LowCodeSchema) => {
      setSchema(newSchema);
      setValidationError(validateSchema(newSchema));
      onChange?.(newSchema, values);
    },
    [values, onChange, validateSchema],
  );

  // 处理HTML内容变更
  const handleHtmlChange = useCallback(
    (newHtml: string) => {
      setHtmlContent(newHtml);
      const newSchema = {
        ...schema,
        component: {
          ...schema.component,
          schema: newHtml,
        },
      };
      handleSchemaChange(newSchema);
    },
    [schema, handleSchemaChange],
  );

  // 处理JSON编辑器变更
  const handleJsonChange = useCallback(
    (newJsonString: string) => {
      setSchemaString(newJsonString);
      const newSchema = jsonToSchema(newJsonString);
      if (newSchema) {
        handleSchemaChange(newSchema);
        setHtmlContent(newSchema.component?.schema || '');
      }
    },
    [jsonToSchema, handleSchemaChange],
  );

  // 渲染预览区域
  const renderPreview = useMemo(() => {
    if (!showPreview) return null;

    return (
      <div className="schema-editor-preview">
        <div className="schema-editor-preview-header">
          <h3>实时预览</h3>
          {validationError && (
            <div className="schema-editor-error">
              <span>⚠️ {validationError}</span>
            </div>
          )}
        </div>
        <div className="schema-editor-preview-content">
          <SchemaRenderer
            schema={schema}
            values={values}
            config={previewConfig}
            fallbackContent={
              <div className="schema-editor-fallback">
                <p>预览加载失败</p>
                <p>请检查schema格式是否正确</p>
              </div>
            }
          />
        </div>
      </div>
    );
  }, [showPreview, schema, values, validationError, previewConfig]);

  // 渲染HTML编辑器
  const renderHtmlEditor = useMemo(() => {
    return (
      <div className="schema-editor-html">
        <div className="schema-editor-html-header">
          <h3>HTML模板</h3>
        </div>
        <div className="schema-editor-html-content">
          <AceEditorWrapper
            value={htmlContent}
            language="html"
            onChange={handleHtmlChange}
            readonly={readonly}
          />
        </div>
      </div>
    );
  }, [htmlContent, handleHtmlChange, readonly]);

  // 渲染JSON编辑器
  const renderJsonEditor = useMemo(() => {
    return (
      <div className="schema-editor-json">
        <div className="schema-editor-json-header">
          <h3>Schema JSON</h3>
        </div>
        <div className="schema-editor-json-content">
          <AceEditorWrapper
            value={schemaString}
            language="json"
            onChange={handleJsonChange}
            readonly={readonly}
          />
        </div>
      </div>
    );
  }, [schemaString, handleJsonChange, readonly]);

  return (
    <div
      className={`schema-editor ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className="schema-editor-container">
        <div className="schema-editor-left">
          {renderHtmlEditor}
          {renderJsonEditor}
        </div>
        <div className="schema-editor-right">{renderPreview}</div>
      </div>
    </div>
  );
}

export default SchemaEditor;
