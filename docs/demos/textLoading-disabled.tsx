import { TextLoading } from '@ant-design/agentic-ui';
import React from 'react';

export default () => {
  return (
    <div style={{ padding: 24 }}>
      <TextLoading text="已禁用动画" disabled={true} />
    </div>
  );
};
