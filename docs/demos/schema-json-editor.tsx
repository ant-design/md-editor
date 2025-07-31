import { SchemaRenderer, validator } from '@ant-design/md-editor';
import { Button, Input, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

const { TextArea } = Input;

const SchemaJsonEditor: React.FC = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

export default SchemaJsonEditor;
