import { Loading } from '@ant-design/md-editor';
import React from 'react';

export default () => {
  return (
    <div style={{ padding: 24 }}>
      <h3>基础用法</h3>
      <Loading
        style={{
          fontSize: 64,
        }}
      />

      <h3 style={{ marginTop: 24 }}>在文本中使用</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>加载中</span>
        <Loading />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>Loading</strong>: 加载组件，使用 GSAP 和 SVG mask 实现复杂的
            3D 旋转动画效果
          </li>
          <li>
            <strong>基础用法</strong>: 直接使用 &lt;Loading /&gt; 显示加载动画
          </li>
          <li>
            <strong>文本中使用</strong>: 可以与其他文本内容组合使用
          </li>
          <li>
            <strong>响应式缩放</strong>: 使用 <code>fontSize</code>{' '}
            样式属性控制大小
          </li>
        </ul>
      </div>
    </div>
  );
};
