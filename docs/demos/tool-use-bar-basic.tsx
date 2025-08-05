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
      errorMessage: '网络请求异常，工具调用失败',
      status: 'error' as const,
    },
    {
      id: 'test',
      toolName: '单元测试',
      toolTarget: '运行 Jest 测试套件',
      time: '10:45',
      status: 'idle' as const,
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

      <div style={{ marginTop: '20px' }}>
        <h4>状态说明:</h4>
        <ul>
          <li>✅ 成功状态 (success) - 绿色</li>
          <li>⏳ 加载状态 (loading) - 带有旋转动画</li>
          <li>❌ 错误状态 (error) - 红色，显示错误图标</li>
          <li>⏸️ 空闲状态 (idle) - 默认样式</li>
        </ul>
      </div>
    </div>
  );
};

export default ToolUseBarBasicDemo;
