import { ToolUseBar } from '@ant-design/agentic-ui';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

const ToolUseBarAdvancedDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [hasRun, setHasRun] = useState(false);

  const tools = [
    {
      id: '1',
      toolName: 'data_pipeline',
      toolTarget: '执行 ETL 数据清洗与转换流程',
      time: '12.5s',
      status: isRunning ? ('loading' as const) : ('success' as const),
      progress: progress,
      type: 'basic',
    },
    {
      id: '2',
      toolName: 'model_inference',
      toolTarget: '调用 GPT-4o 模型进行文本分析',
      time: '3.8s',
      status: 'idle' as const,
      progress: 0,
      type: 'auto',
    },
  ];

  // 模拟工作流程执行
  useEffect(() => {
    if (!isRunning) return;

    let nextProgress = 0;
    const interval = setInterval(() => {
      nextProgress = Math.min(nextProgress + 2, 100);
      setProgress(nextProgress);
      if (nextProgress >= 100) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Button
        onClick={() => {
          setHasRun(true);
          setProgress(0);
          setIsRunning(true);
        }}
        disabled={isRunning}
        style={{ marginBottom: 16 }}
      >
        {isRunning ? '执行中' : hasRun ? '重新播放' : '开始执行'}
      </Button>
      <ToolUseBar
        tools={tools}
        onToolClick={(id: string) => console.log('Tool clicked:', id)}
      />
    </div>
  );
};

export default ToolUseBarAdvancedDemo;
