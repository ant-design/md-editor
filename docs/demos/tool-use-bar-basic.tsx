import { ToolUseBar } from '@ant-design/md-editor';
import React, { useState } from 'react';

const ToolUseBarBasicDemo = () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const tools = [
    {
      id: 'search',
      toolName: '文件搜索',
      toolTarget: '搜索 "react" 相关文件',
      time: '10:30',
      status: 'success' as const,
      content: (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li>分析插件需求及目标功能</li>
          <li>设计Chrome扩展插件架构 实现核心截图和检测逻辑</li>
          <li>Manus 正在工作：开发图片输出和导出功能</li>
          <li>验证插件功能是否正常</li>
          <li>报告并将插件发送给用户</li>
        </ul>
      ),
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
        <h4>功能说明:</h4>
        <ul>
          <li>✅ 成功状态 (success) - 绿色</li>
          <li>⏳ 加载状态 (loading) - 带有旋转动画</li>
          <li>❌ 错误状态 (error) - 红色，显示错误信息</li>
          <li>⏸️ 空闲状态 (idle) - 默认样式</li>
          <li>📄 展开/收起 - 有内容或错误信息的工具项会显示展开按钮</li>
        </ul>
        <p>
          <strong>操作提示:</strong>{' '}
          点击工具项右侧的箭头图标可以展开/收起详细内容
        </p>
      </div>
    </div>
  );
};

export default ToolUseBarBasicDemo;
