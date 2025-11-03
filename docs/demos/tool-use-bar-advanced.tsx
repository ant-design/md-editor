import { ToolUseBar } from '@ant-design/agentic-ui';
import React, { useEffect, useState } from 'react';

const ToolUseBarAdvancedDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const tools = [
    {
      id: '1',
      toolName: '基础工具调用-BASE',
      toolTarget: '工具类/工具名称 操作对象',
      time: '2.3s',
      status: isRunning ? ('loading' as const) : ('success' as const),
      progress: progress,
      type: 'basic',
    },
    {
      id: '2',
      toolName: '高级工具调用-ADVANCED',
      toolTarget: '工具类/工具名称 操作对象',
      time: '1.8s',
      status: 'idle' as const,
      progress: 0,
      type: 'auto',
    },
  ];

  // 模拟工作流程执行
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          setIsRunning(false);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <ToolUseBar
        tools={tools}
        onToolClick={(id: string) => console.log('Tool clicked:', id)}
      />

      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>tools</strong>: 工具列表数组，每个工具包含
            id、toolName、toolTarget、time、status、progress、type 等属性
          </li>
          <li>
            <strong>onToolClick</strong>: 点击工具项时的回调函数
          </li>
          <li>
            <strong>status</strong>: 工具状态，支持 &apos;success&apos; |
            &apos;loading&apos; | &apos;error&apos; | &apos;idle&apos;
          </li>
          <li>
            <strong>progress</strong>: 进度百分比，0-100 的数值，动态更新
          </li>
          <li>
            <strong>type</strong>: 工具类型，如 &apos;basic&apos; |
            &apos;auto&apos;
          </li>
          <li>
            <strong>workflowStatus</strong>: 工作流状态对象，包含
            inProgress、completed、totalTime 等属性
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ToolUseBarAdvancedDemo;
