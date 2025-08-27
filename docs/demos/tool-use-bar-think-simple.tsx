import { ToolUseBarThink } from '@ant-design/md-editor';
import React, { useState } from 'react';

const SimpleThinkDemo = () => {
  const [expanded, setExpanded] = useState(false);
  const [floatingExpanded, setFloatingExpanded] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
      }}
    >
      <h3>ToolUseBarThink 基础用法</h3>

      {/* Loading 状态 - 展示 hover 效果 */}
      <div>
        <h4>Loading 状态（hover 显示浮动按钮）</h4>
        <ToolUseBarThink
          toolName="深度思考"
          toolTarget="分析用户需求"
          time="2.3s"
          status="loading"
          expanded={expanded}
          onExpandedChange={setExpanded}
          floatingExpanded={floatingExpanded}
          onFloatingExpandedChange={setFloatingExpanded}
          thinkContent={
            <div style={{ padding: '12px' }}>
              <p>这是思考过程的内容...</p>
              <p>在 loading 状态下，hover 容器会显示浮动展开按钮</p>
            </div>
          }
        />
      </div>

      {/* Success 状态 */}
      <div>
        <h4>Success 状态</h4>
        <ToolUseBarThink
          toolName="已完成思考"
          toolTarget="总结要点"
          time="1.8s"
          status="success"
          thinkContent={
            <div style={{ padding: '12px' }}>
              <p>思考完成：</p>
              <ul>
                <li>项目进度良好</li>
                <li>需要关注性能优化</li>
              </ul>
            </div>
          }
        />
      </div>

      {/* Error 状态 */}
      <div>
        <h4>Error 状态</h4>
        <ToolUseBarThink
          toolName="思考失败"
          toolTarget="分析数据"
          time="5.2s"
          status="error"
          thinkContent={
            <div style={{ padding: '12px', color: '#ff4d4f' }}>
              <p>思考过程中出现错误</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default SimpleThinkDemo;
