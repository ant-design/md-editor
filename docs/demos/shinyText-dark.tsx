import { ShinyText } from '@ant-design/agentic-ui';
import React from 'react';

export default () => {
  return (
    <div
      style={{
        padding: 24,
        background: '#000',
        borderRadius: 8,
      }}
    >
      <ShinyText text="Loading..." theme="dark" fontSize="24px" />
    </div>
  );
};

