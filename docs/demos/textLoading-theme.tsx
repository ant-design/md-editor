import { TextLoading } from '@ant-design/agentic-ui';
import React from 'react';

export default () => {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <h4>亮色主题（白色背景）</h4>
        <TextLoading text="Loading..." theme="light" fontSize="24px" />
      </div>

      <div
        style={{
          padding: 24,
          background: '#000',
          borderRadius: 8,
        }}
      >
        <h4 style={{ color: '#fff' }}>暗色主题（黑色背景）</h4>
        <TextLoading text="Loading..." theme="dark" fontSize="24px" />
      </div>
    </div>
  );
};
