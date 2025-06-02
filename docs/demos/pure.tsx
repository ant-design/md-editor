import { BaseMarkdownEditor } from '@ant-design/md-editor';
import React from 'react';
import { defaultValue } from './shared/defaultValue';

export default () => {
  return (
    <BaseMarkdownEditor
      reportMode
      initValue={defaultValue}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};
