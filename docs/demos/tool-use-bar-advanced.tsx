import { ToolUseBar } from '@ant-design/md-editor';
import React, { useEffect, useState } from 'react';

const ToolUseBarAdvancedDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showWorkflow, setShowWorkflow] = useState(true);
  const [showTaskList, setShowTaskList] = useState(true);

  const tools = [
    {
      id: '1',
      toolName: '基础工具调用-BASE',
      toolTarget: '工具类/工具名称 操作对象',
      time: '2.3s',
      status: isRunning ? 'loading' : 'success',
      progress: progress,
      type: 'basic',
    },
    {
      id: '2',
      toolName: '高级工具调用-ADVANCED',
      toolTarget: '工具类/工具名称 操作对象',
      time: '1.8s',
      status: 'idle',
      progress: 0,
      type: 'auto',
    },
  ];

  const workflowStatus = {
    inProgress: [
      {
        id: '1',
        name: 'Get stock Insights',
        status: progress > 0 ? 'completed' : 'pending',
        time: '0.8s',
      },
      {
        id: '2',
        name: 'Get stock holders',
        status: progress > 33 ? 'completed' : 'pending',
        time: '0.7s',
      },
      {
        id: '3',
        name: 'Get what analysts',
        status: progress > 66 ? 'completed' : 'pending',
        time: '0.8s',
      },
    ],
    completed: [
      {
        id: '1',
        name: 'Get stock Insights',
        status: progress > 0 ? 'completed' : 'pending',
        time: '0.8s',
      },
      {
        id: '2',
        name: 'Get stock holders',
        status: progress > 33 ? 'completed' : 'pending',
        time: '0.7s',
      },
      {
        id: '3',
        name: 'Get what analysts',
        status: progress > 66 ? 'completed' : 'pending',
        time: '0.8s',
      },
    ],
    totalTime: progress >= 100 ? '2.3s' : '--',
  };

  const startWorkflow = () => {
    setIsRunning(true);
    setProgress(0);
  };

  const stopWorkflow = () => {
    setIsRunning(false);
  };

  const resetWorkflow = () => {
    setIsRunning(false);
    setProgress(0);
  };

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
        activeToolId={isRunning ? '1' : '2'}
        workflowStatus={workflowStatus}
        showWorkflow={showWorkflow}
        showTaskList={showTaskList}
        onToolClick={(id) => console.log('Tool clicked:', id)}
      />
    </div>
  );
};

export default ToolUseBarAdvancedDemo;
