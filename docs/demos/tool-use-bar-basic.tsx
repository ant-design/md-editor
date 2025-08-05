import React, { useState } from 'react';
import { ToolUseBar } from '../../src/ToolUseBar';

const ToolUseBarBasicDemo = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const tools = [
    {
      id: 'search',
      toolName: '文件搜索',
      toolTarget: '搜索 "react" 相关文件',
      time: '10:30',
      status: 'success' as const,
    },
    {
      id: 'analyze',
      toolName: '代码分析',
      toolTarget: '分析 src/components 目录',
      time: '10:35',
      status: 'loading' as const,
    },
    {
      id: 'format',
      toolName: '代码格式化',
      toolTarget: '格式化 TypeScript 文件',
      time: '10:40',
      status: 'error' as const,
    },
  ];

  const handleActiveKeysChange = (newActiveKeys: string[]) => {
    setActiveKeys(newActiveKeys);
    console.log('激活的工具:', newActiveKeys);
  };

  const handleToolClick = (toolId: string) => {
    console.log('点击的工具:', toolId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>ToolUseBar 基础演示</h3>
      <p>
        当前激活的工具: {activeKeys.length > 0 ? activeKeys.join(', ') : '无'}
      </p>

      <ToolUseBar
        tools={tools}
        activeKeys={activeKeys}
        onActiveKeysChange={handleActiveKeysChange}
        onToolClick={handleToolClick}
      />
    </div>
  );
};

export default ToolUseBarBasicDemo;
