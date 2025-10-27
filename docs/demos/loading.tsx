import { Loading } from '@ant-design/agentic-ui';
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
        <h4>技术栈：</h4>
        <ul>
          <li>
            <strong>Framer Motion</strong>: 使用 motion.svg 和 motion.ellipse
            实现流畅的动画效果
          </li>
          <li>
            <strong>SVG</strong>: 使用 SVG 椭圆和线性渐变实现图形绘制
          </li>
          <li>
            <strong>CSS-in-JS</strong>: 使用 Ant Design 的样式系统进行样式管理
          </li>
        </ul>

        <h4>功能特点：</h4>
        <ul>
          <li>
            <strong>双椭圆旋转</strong>:
            两个椭圆以不同速度和方向旋转，形成视觉层次
          </li>
          <li>
            <strong>动态形变</strong>: 椭圆的半径会周期性变化，增加动态感
          </li>
          <li>
            <strong>渐变色彩</strong>: 使用线性渐变（#5EF050 → #37ABFF →
            #D7B9FF）提供视觉吸引力
          </li>
          <li>
            <strong>响应式缩放</strong>: 使用 <code>fontSize</code>{' '}
            样式属性控制大小，适配不同场景
          </li>
          <li>
            <strong>高性能</strong>: 基于 Framer Motion 的硬件加速，保证流畅运行
          </li>
        </ul>

        <h4>使用方法：</h4>
        <ul>
          <li>
            <strong>基础用法</strong>: 直接使用 &lt;Loading /&gt; 显示加载动画
          </li>
          <li>
            <strong>文本中使用</strong>: 可以与其他文本内容组合使用
          </li>
          <li>
            <strong>自定义大小</strong>: 通过 style prop 传递 fontSize 控制尺寸
          </li>
        </ul>
      </div>
    </div>
  );
};
