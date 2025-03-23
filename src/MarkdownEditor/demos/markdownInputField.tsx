import React from 'react';

import { MarkdownInputField } from '@ant-design/md-editor';

export default () => {
  return (
    <div
      style={{
        padding: '20px',
        margin: 'auto',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <MarkdownInputField
        value=""
        onChange={() => {}}
        placeholder="请输入内容"
      />
      <MarkdownInputField
        value=""
        disabled
        onChange={() => {}}
        placeholder="请输入内容"
      />
    </div>
  );
};
