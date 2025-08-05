import { PlayCircleOutlined } from '@ant-design/icons';
import { ToolUseBar } from '@ant-design/md-editor';
import { Badge, Button, Card, Progress, Space } from 'antd';
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
      {/* 控制面板 */}
      <Card
        title="ToolUseBar 扩展功能演示"
        size="small"
        style={{ marginBottom: 16 }}
      >
        <Space wrap>
          <Button
            type="primary"
            onClick={startWorkflow}
            disabled={isRunning}
            icon={<PlayCircleOutlined />}
          >
            开始工作流程
          </Button>
          <Button onClick={stopWorkflow} disabled={!isRunning} danger>
            停止
          </Button>
          <Button onClick={resetWorkflow} disabled={isRunning}>
            重置
          </Button>
          <Button
            type={showWorkflow ? 'primary' : 'default'}
            onClick={() => setShowWorkflow(!showWorkflow)}
          >
            {showWorkflow ? '隐藏' : '显示'}工作流
          </Button>
          <Button
            type={showTaskList ? 'primary' : 'default'}
            onClick={() => setShowTaskList(!showTaskList)}
          >
            {showTaskList ? '隐藏' : '显示'}任务列表
          </Button>
          <Badge
            count={isRunning ? '运行中' : '已停止'}
            color={isRunning ? '#52c41a' : '#d9d9d9'}
            style={{ marginLeft: 16 }}
          />
        </Space>

        <div style={{ marginTop: 16 }}>
          <Progress
            percent={progress}
            status={isRunning ? 'active' : 'normal'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      </Card>

      {/* ToolUseBar 组件 */}
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
