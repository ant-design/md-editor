import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SchemaRenderer } from '../SchemaRenderer';
import { LowCodeSchema } from '../types';
import { mdDataSchemaValidator } from '../validator';
import { AceEditorWrapper } from './AceEditorWrapper';
import { useSchemaEditorStyle } from './style';
import { RunIcon } from '../../icons/RunIcon';
import { CopyIcon } from '../../icons/CopyIcon';
import { EmptyIcon } from '../../icons/EmptyIcon';
import { Button, message } from 'antd';
import copy from 'copy-to-clipboard';

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
  const { wrapSSR, hashId } = useSchemaEditorStyle('schema-editor');
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

  const [values, setValues] = useState<Record<string, any>>(initialValues || {});
  const [schemaString, setSchemaString] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [renderedSchema, setRenderedSchema] = useState<LowCodeSchema>({} as LowCodeSchema);
  const [isSchemaRendered, setIsSchemaRendered] = useState<boolean>(false);

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

  // 处理运行按钮点击
  const handleRunClick = useCallback(() => {
    setRenderedSchema({ ...schema });

    // 更新values状态，使用schema中的initialValues
    if (schema.initialValues) {
      setValues(schema.initialValues);
    }
    setIsSchemaRendered(true);
  }, [schema, setRenderedSchema, setValues, setIsSchemaRendered]);

  // 复制函数
  const handleCopyContent = useCallback((content: string, type: 'html' | 'json') => {
    if (!content || !content.trim()) {
      message.warning('无可复制的内容');
      return;
    }

    try {
      const ok = copy(content);
      if (ok) {
        message.success(`${type === 'html' ? 'HTML' : 'JSON'}内容已复制到剪贴板`);
      } else {
        message.error('复制失败');
      }
    } catch (error) {
      message.error('复制失败');
      console.error('复制失败', error);
    }
  }, []);

  // 处理复制HTML内容
  const handleCopyHtml = useCallback(() => {
    handleCopyContent(htmlContent, 'html');
  }, [htmlContent, handleCopyContent]);

  // 处理复制JSON内容
  const handleCopyJson = useCallback(() => {
    handleCopyContent(schemaString, 'json');
  }, [schemaString, handleCopyContent]);

  // 渲染预览区域
  const renderPreview = useMemo(() => {
    if (!showPreview) return null;

    return (
      <div className={classNames('schema-editor-preview', hashId)}>
        <div className={classNames('schema-editor-preview-header', hashId)}>
          <h3>实时预览</h3>
          {validationError && (
            <div className={classNames('schema-editor-error', hashId)}>
              <span>⚠️ {validationError}</span>
            </div>
          )}
        </div>
        <div className={classNames('schema-editor-preview-content', hashId)}>
          {isSchemaRendered ?
            <SchemaRenderer
              schema={renderedSchema}
              values={values}
              config={previewConfig}
              fallbackContent={
                <div className={classNames('schema-editor-fallback', hashId)}>
                  <p>预览加载失败</p>
                  <p>请检查schema格式是否正确</p>
                </div>
              }
            /> :
            <div className={classNames('schema-editor-preview-content-empty', hashId)}>
              <EmptyIcon style={{ width: 80, height: 80 }} />
              <p>右侧输入schema后，在这里展示卡片预览</p>
            </div>
          }
        </div>
      </div>
    );
  }, [showPreview, isSchemaRendered, renderedSchema, values, validationError, previewConfig, hashId]);

  // 渲染HTML编辑器
  const renderHtmlEditor = useMemo(() => {
    return (
      <div className={classNames('schema-editor-html', hashId)}>
        <div className={classNames('schema-editor-html-header', hashId)}>
          <h3>HTML模板</h3>
          <div style={{ display: 'flex' }}>
            <Button
              type="text"
              icon={<RunIcon style={{ width: 14, height: 14 }} />}
              onClick={handleRunClick}
            >
              运行
            </Button>
            <Button
              type="text"
              icon={<CopyIcon style={{ width: 14, height: 14 }} />}
              onClick={handleCopyHtml}
            />
          </div>
        </div>
        <div className={classNames('schema-editor-html-content', hashId)}>
          <AceEditorWrapper
            value={htmlContent}
            language="html"
            onChange={handleHtmlChange}
            readonly={readonly}
          />
        </div>
      </div>
    );
  }, [htmlContent, handleHtmlChange, readonly, hashId]);

  // 渲染JSON编辑器
  const renderJsonEditor = useMemo(() => {
    return (
      <div className={classNames('schema-editor-json', hashId)}>
        <div className={classNames('schema-editor-json-header', hashId)}>
          <h3>Schema JSON</h3>
          <div style={{ display: 'flex' }}>
            <Button
              type="text"
              icon={<RunIcon style={{ width: 14, height: 14 }} />}
              onClick={handleRunClick}
            >
              运行
            </Button>
            <Button
              type="text"
              icon={<CopyIcon style={{ width: 14, height: 14 }} />}
              onClick={handleCopyJson}
            />
          </div>
        </div>
        <div className={classNames('schema-editor-json-content', hashId)}>
          <AceEditorWrapper
            value={schemaString}
            language="json"
            onChange={handleJsonChange}
            readonly={readonly}
          />
        </div>
      </div>
    );
  }, [schemaString, handleJsonChange, readonly, hashId]);

  return wrapSSR(
    <div
      className={classNames('schema-editor', className, hashId)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className={classNames('schema-editor-container', hashId)}>
        <div className={classNames('schema-editor-left', hashId)}>
          {renderPreview}
        </div>
        <div className={classNames('schema-editor-right', hashId)}>
          {renderHtmlEditor}
          {renderJsonEditor}
        </div>
      </div>
    </div>,
  );
}

export default SchemaEditor;
