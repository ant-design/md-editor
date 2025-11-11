import { validator } from '@ant-design/agentic-ui';
import React, { useEffect, useState } from 'react';

const ValidatorExample: React.FC = () => {
  const [validationResults, setValidationResults] = useState<string[]>([]);

  useEffect(() => {
    const results: string[] = [];

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
          results.push('✅ Schema 验证通过');
        } else {
          results.push(
            `❌ Schema 验证失败：${JSON.stringify(validationResult?.errors)}`,
          );
        }
      } catch (error) {
        results.push(`❌ 验证过程出错：${error}`);
      }
    };

    // 验证单个属性值
    const validateValue = () => {
      const value = 25;

      try {
        const isValid = validator.validate(value);
        results.push(`✅ 值验证结果：${isValid ? '有效' : '无效'}`);
      } catch (error) {
        results.push(`❌ 验证过程出错：${error}`);
      }
    };

    validateSchema();
    validateValue();
    setValidationResults(results);
  }, []);

  return (
    <div>
      <h2>Validator 验证示例</h2>
      <div>
        {validationResults.map((result, index) => (
          <div key={index} style={{ margin: '8px 0' }}>
            {result}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>validator.validate(schema)</strong>: 验证 schema
            对象是否符合规范
          </li>
          <li>
            <strong>validator.validate(value)</strong>: 验证单个值是否有效
          </li>
          <li>
            <strong>validationResult.valid</strong>: 验证是否通过，返回布尔值
          </li>
          <li>
            <strong>validationResult.errors</strong>: 验证失败时的错误信息数组
          </li>
          <li>
            <strong>schema</strong>: 需要验证的 schema 对象，包含
            version、name、component 等属性
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ValidatorExample;
