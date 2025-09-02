import { SchemaEditor } from '@ant-design/md-editor';
import React, { useState } from 'react';
import { LowCodeSchema } from '../../src/schema/types';

const MyComponent = () => {
  const [schema, setSchema] = useState<LowCodeSchema>({
    version: '1.0.0',
    name: '用户卡片组件',
    description: '显示用户信息的卡片组件',
    component: {
      type: 'html',
      schema: `
        <div class="user-card">
          <h2>{{name}}</h2>
          <p>{{email}}</p>
          <button onclick="alert('{{name}}')">点击</button>
        </div>
      `,
      properties: {
        name: {
          title: '姓名',
          type: 'string',
          default: '张三',
        },
        email: {
          title: '邮箱',
          type: 'string',
          default: 'zhangsan@example.com',
        },
      },
    },
    initialValues: {
      name: '张三',
      email: 'zhangsan@example.com',
    },
  });

  const [values, setValues] = useState<Record<string, any>>({
    name: '张三',
    email: 'zhangsan@example.com',
  });

  const handleChange = (
    newSchema: LowCodeSchema,
    newValues: Record<string, any>,
  ) => {
    setSchema(newSchema);
    setValues(newValues);
  };

  return (
    <SchemaEditor
      initialSchema={schema}
      initialValues={values}
      height={600}
      onChange={handleChange}
      showPreview={true}
    />
  );
};

export default MyComponent;
