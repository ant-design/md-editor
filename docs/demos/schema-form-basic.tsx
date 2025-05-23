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
    <SchemaForm
      schema={schema}
      onValuesChange={handleValuesChange}
      initialValues={{
        name: '张三',
        age: 25,
        gender: '男',
      }}
    />
  );
};

export default MyFormComponent;
