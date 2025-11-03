import { ShinyText } from '@ant-design/agentic-ui';
import React from 'react';

export default () => {
  return (
    <div style={{ padding: 24 }}>
      <ShinyText text="已禁用动画" disabled={true} />
    </div>
  );
};
