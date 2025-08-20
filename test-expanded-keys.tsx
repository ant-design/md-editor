import React, { useState } from 'react';
import { ToolUseBar } from '../src/ToolUseBar';

// 简单的验证脚本来测试新的展开状态控制功能
const TestExpandedKeysDemo = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['tool1']);

  const tools = [
    {
      id: 'tool1',
      toolName: 'Tool 1',
      toolTarget: 'Target 1',
      time: '1.0s',
      content: <div>Tool 1 content</div>,
    },
    {
      id: 'tool2',
      toolName: 'Tool 2',
      toolTarget: 'Target 2',
      time: '2.0s',
      errorMessage: 'Tool 2 error',
    },
  ];

  return (
    <ToolUseBar
      tools={tools}
      expandedKeys={expandedKeys}
      onExpandedKeysChange={setExpandedKeys}
    />
  );
};

export default TestExpandedKeysDemo;
