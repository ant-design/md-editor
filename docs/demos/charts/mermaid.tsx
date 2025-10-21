import { Mermaid } from '@ant-design/md-editor';
import React from 'react';

const DynamicAreaChartExample: React.FC = () => {
  // 扁平化数据结构
  const data = `
    graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作]
    B -->|否| D[其他操作]
    C --> E[结束]
    D --> E
    `;

  return (
    <div style={{ padding: '20px' }}>
      <Mermaid
        element={{ type: 'code', language: 'mermaid', value: data }}
        attributes={{ 'data-slate-node': 'element', ref: null }}
      >
        <></>
      </Mermaid>
    </div>
  );
};
export default DynamicAreaChartExample;
