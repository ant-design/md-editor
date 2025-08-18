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

  return <SchemaRenderer schema={schema} values={schema.initialValues || {}} />;
};

export default MyRendererComponent;
