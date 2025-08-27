import { ToolUseBar } from '@ant-design/md-editor';
import React, { useState } from 'react';

const ThinkDemo = () => {
  const [tools] = useState([
    {
      id: 'think1',
      type: 'think' as const,
      toolName: '深度思考',
      toolTarget: '分析用户需求',
      time: '2.3s',
      status: 'loading' as const,
    },
    {
      id: 'think2',
      type: 'think' as const,
      toolName: '已完成思考',
      toolTarget: '总结要点',
      time: '1.8s',
      status: 'success' as const,
      thinkContent: (
        <div style={{ padding: '12px' }}>
          <p>思考完成：</p>
          <ul>
            <li>项目进度良好</li>
            <li>需要关注性能优化</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'tool1',
      type: 'tool' as const,
      toolName: '搜索代码',
      toolTarget: 'baidu.com',
      time: '1.3s',
      status: 'success' as const,
    },
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <h3>ToolUseBar 中的 ToolUseBarThink</h3>
      <p>在 ToolUseBar 中使用 ToolUseBarThink 组件</p>

      <ToolUseBar
        tools={tools}
        expandedKeys={['think2']}
        onExpandedKeysChange={(keys) => console.log('展开的模块:', keys)}
      />
    </div>
  );
};

export default ThinkDemo;
