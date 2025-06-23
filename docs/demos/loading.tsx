import React from 'react';
import { Loading } from '../../src';

export default () => {
  return (
    <div style={{ padding: 24 }}>
      <h3>基础用法</h3>
      <Loading />

      <h3 style={{ marginTop: 24 }}>在文本中使用</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>加载中</span>
        <Loading />
      </div>
    </div>
  );
};
