import { SchemaForm } from '@ant-design/md-editor';
import React from 'react';

const MyFormComponent: React.FC = () => {
  const schema = {
    component: {
      properties: {
        name: {
          title: '姓名',
          type: 'string' as const,
          default: '',
          required: true,
          minLength: 2,
          maxLength: 10,
        },
        age: {
          title: '年龄',
          type: 'number' as const,
          default: 18,
          minimum: 0,
          maximum: 120,
        },
        gender: {
          title: '性别',
          type: 'string' as const,
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
    <div>
      <SchemaForm
        schema={schema}
        onValuesChange={handleValuesChange}
        initialValues={{
          name: '张三',
          age: 25,
          gender: '男',
        }}
      />

      <div style={{ marginTop: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>schema</strong>: 表单配置对象，包含 component.properties
            定义
          </li>
          <li>
            <strong>onValuesChange</strong>: 表单值变化时的回调函数
          </li>
          <li>
            <strong>initialValues</strong>: 表单初始值对象
          </li>
          <li>
            <strong>properties</strong>: 表单字段定义，包含
            title、type、default、required 等属性
          </li>
          <li>
            <strong>type</strong>: 字段类型，支持 &apos;string&apos; |
            &apos;number&apos; 等
          </li>
          <li>
            <strong>enum</strong>: 枚举值数组，用于下拉选择
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyFormComponent;
