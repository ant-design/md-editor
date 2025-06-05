import { validator } from '@ant-design/md-editor';
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
    </div>
  );
};

export default ValidatorExample;
