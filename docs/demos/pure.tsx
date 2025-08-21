import { BaseMarkdownEditor } from '@ant-design/md-editor';
import React from 'react';
import { defaultValue } from './shared/defaultValue';

export default () => {
  return (
    <div>
      <BaseMarkdownEditor
        reportMode
        initValue={defaultValue}
        style={{
          width: '100vw',
          height: '100vh',
        }}
      />

      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>reportMode</strong>: 报告模式，启用后编辑器进入只读状态
          </li>
          <li>
            <strong>initValue</strong>: 编辑器的初始内容值
          </li>
          <li>
            <strong>style</strong>: 编辑器容器的样式对象
          </li>
        </ul>
      </div>
    </div>
  );
};
