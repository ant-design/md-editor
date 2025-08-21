import { LowCodeSchema, SchemaRenderer } from '@ant-design/md-editor';
import React from 'react';

const MyRendererComponent: React.FC = () => {
  const schema: LowCodeSchema = {
    component: {
      properties: {
        title: {
          title: '标题',
          type: 'string' as const,
          default: '我的博客',
        },
        content: {
          title: '内容',
          type: 'string' as const,
          default: '这是一篇博客文章',
        },
      },
      type: 'html' as const,
      schema: `
        <div class="blog-post">
          <h1>{{title}}</h1>
          <div class="content">{{content}}</div>
        </div>
      `,
    },
  };

  return (
    <div>
      <SchemaRenderer schema={schema} values={schema.initialValues || {}} />

      <div style={{ marginTop: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>schema</strong>: 低代码模式配置对象，包含 component 配置
          </li>
          <li>
            <strong>values</strong>: 渲染时使用的数据值对象
          </li>
          <li>
            <strong>component.properties</strong>: 组件属性定义，包含
            title、type、default 等
          </li>
          <li>
            <strong>component.type</strong>: 组件类型，如 'html'
          </li>
          <li>
            <strong>component.schema</strong>: 组件的模板字符串，支持变量插值
          </li>
        </ul>
      </div>
    </div>
  );
};
export default MyRendererComponent;
