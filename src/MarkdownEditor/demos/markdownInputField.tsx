import React from 'react';

import { MarkdownInputField } from '@ant-design/md-editor';

export default () => {
  return (
    <div
      style={{
        padding: '20px',
      }}
    >
      <MarkdownInputField
        value=""
        onChange={() => {}}
        placeholder="请输入内容"
      />
    </div>
  );
};
