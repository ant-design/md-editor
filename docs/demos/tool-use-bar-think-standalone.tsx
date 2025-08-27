import { ToolUseBarThink } from '@ant-design/md-editor';
import React, { useState } from 'react';

const ToolUseBarThinkDemo = () => {
  const [expanded, setExpanded] = useState(false);
  const [floatingExpanded, setFloatingExpanded] = useState(false);

  const thinkContent = (
    <div style={{ padding: '12px' }}>
      <p>思考过程内容：</p>
      <ul>
        <li>分析用户需求</li>
        <li>制定解决方案</li>
        <li>评估可行性</li>
      </ul>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h3>ToolUseBarThink 不同状态对比</h3>

      <div style={{ display: 'flex', gap: '16px', maxWidth: '100%' }}>
        {/* Loading 状态 */}
        <div style={{ flex: 1 }}>
          <h4>Loading 状态</h4>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            hover 显示浮动按钮
          </p>
          <ToolUseBarThink
            toolName="思考中..."
            toolTarget="分析需求"
            time="2.3s"
            status="loading"
            expanded={expanded}
            onExpandedChange={setExpanded}
            floatingExpanded={floatingExpanded}
            onFloatingExpandedChange={setFloatingExpanded}
            thinkContent={thinkContent}
          />
        </div>

        {/* Success 状态 */}
        <div style={{ flex: 1 }}>
          <h4>Success 状态</h4>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            无浮动按钮
          </p>
          <ToolUseBarThink
            toolName="思考完成"
            toolTarget="分析需求"
            time="2.3s"
            status="success"
            thinkContent={thinkContent}
          />
        </div>

        {/* Error 状态 */}
        <div style={{ flex: 1 }}>
          <h4>Error 状态</h4>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            无浮动按钮
          </p>
          <ToolUseBarThink
            toolName="思考失败"
            toolTarget="分析需求"
            time="5.2s"
            status="error"
            thinkContent={thinkContent}
          />
        </div>
      </div>
    </div>
  );
};

export default ToolUseBarThinkDemo;
