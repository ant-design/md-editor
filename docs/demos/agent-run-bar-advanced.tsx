import {
  TASK_RUNNING_STATUS,
  TASK_STATUS,
  TaskRunning,
} from '@ant-design/md-editor';
import React, { useState, useEffect } from 'react';

export default () => {
  const [currentTask, setCurrentTask] = useState({
    id: 1,
    status: TASK_STATUS.RUNNING,
    runningStatus: TASK_RUNNING_STATUS.RUNNING,
    startTime: Date.now(),
    elapsedTime: 0,
    progress: 0,
    totalSteps: 6,
    currentStep: 1,
    stepName: '模型训练',
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      status: TASK_STATUS.RUNNING,
      runningStatus: TASK_RUNNING_STATUS.RUNNING,
      startTime: Date.now(),
      elapsedTime: 0,
      progress: 0,
      totalSteps: 6,
      currentStep: 1,
      stepName: '模型训练',
    },
    {
      id: 2,
      status: TASK_STATUS.PAUSE,
      runningStatus: TASK_RUNNING_STATUS.PAUSE,
      startTime: Date.now() - 3600000, // 1小时前
      elapsedTime: 3600000,
      progress: 50,
      totalSteps: 4,
      currentStep: 2,
      stepName: '数据预处理',
    },
    {
      id: 3,
      status: TASK_STATUS.SUCCESS,
      runningStatus: TASK_RUNNING_STATUS.COMPLETE,
      startTime: Date.now() - 7200000, // 2小时前
      elapsedTime: 7200000,
      progress: 100,
      totalSteps: 3,
      currentStep: 3,
      stepName: '特征工程',
    },
  ]);

  // 格式化时间
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}小时${minutes}分${seconds}秒`;
    } else if (minutes > 0) {
      return `${minutes}分${seconds}秒`;
    } else {
      return `${seconds}秒`;
    }
  };

  // 更新任务进度
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.status === TASK_STATUS.RUNNING && task.runningStatus === TASK_RUNNING_STATUS.RUNNING) {
            const newElapsedTime = Date.now() - task.startTime;
            const newProgress = Math.min(100, (task.currentStep / task.totalSteps) * 100);
            
            // 模拟步骤进展
            if (Math.random() < 0.1 && task.currentStep < task.totalSteps) {
              return {
                ...task,
                elapsedTime: newElapsedTime,
                progress: newProgress,
                currentStep: task.currentStep + 1,
              };
            }
            
            return {
              ...task,
              elapsedTime: newElapsedTime,
              progress: newProgress,
            };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePause = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: TASK_STATUS.PAUSE, runningStatus: TASK_RUNNING_STATUS.PAUSE }
          : task
      )
    );
  };

  const handleResume = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: TASK_STATUS.RUNNING, runningStatus: TASK_RUNNING_STATUS.RUNNING }
          : task
      )
    );
  };

  const handleStop = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: TASK_STATUS.CANCELLED, runningStatus: TASK_RUNNING_STATUS.COMPLETE }
          : task
      )
    );
  };

  const handleCreateNewTask = (taskId: number) => {
    const newTask = {
      id: Date.now(),
      status: TASK_STATUS.RUNNING,
      runningStatus: TASK_RUNNING_STATUS.RUNNING,
      startTime: Date.now(),
      elapsedTime: 0,
      progress: 0,
      totalSteps: Math.floor(Math.random() * 5) + 3,
      currentStep: 1,
      stepName: ['模型训练', '数据预处理', '特征工程', '模型评估', '结果分析'][Math.floor(Math.random() * 5)],
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleReplay = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: TASK_STATUS.RUNNING,
              runningStatus: TASK_RUNNING_STATUS.RUNNING,
              startTime: Date.now(),
              elapsedTime: 0,
              progress: 0,
              currentStep: 1,
            }
          : task
      )
    );
  };

  const handleViewResult = (taskId: number) => {
    console.log(`查看任务 ${taskId} 的结果`);
  };

  const handleSubmit = (taskId: number) => {
    console.log(`提交任务 ${taskId} 的结果`);
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: TASK_STATUS.SUCCESS, runningStatus: TASK_RUNNING_STATUS.COMPLETE }
          : task
      )
    );
  };

  const handleRetry = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: TASK_STATUS.RUNNING,
              runningStatus: TASK_RUNNING_STATUS.RUNNING,
              startTime: Date.now(),
              elapsedTime: 0,
              progress: 0,
              currentStep: 1,
            }
          : task
      )
    );
  };

  const getTaskTitle = (task: any) => {
    if (task.status === TASK_STATUS.RUNNING) {
      return `任务运行中, 已耗时${formatTime(task.elapsedTime)}。 ${task.currentStep}/${task.totalSteps} ${task.stepName}`;
    } else if (task.status === TASK_STATUS.PAUSE) {
      return '任务已暂停。';
    } else if (task.status === TASK_STATUS.SUCCESS) {
      return `任务已完成, 耗时${formatTime(task.elapsedTime)}, 如满意请提交, 如不满意请重试。`;
    } else if (task.status === TASK_STATUS.CANCELLED) {
      return '任务已停止, 如需继续请新建会话重新开始。';
    }
    return '任务状态未知';
  };

  const getTaskDescription = (task: any) => {
    if (task.status === TASK_STATUS.RUNNING) {
      return `${task.stepName}进行中，请耐心等待...`;
    } else if (task.status === TASK_STATUS.PAUSE) {
      return '任务执行已暂停，点击继续按钮恢复执行';
    } else if (task.status === TASK_STATUS.SUCCESS) {
      return '任务执行成功，请检查结果并选择后续操作';
    } else if (task.status === TASK_STATUS.CANCELLED) {
      return '任务执行已停止，无法恢复，请创建新会话';
    }
    return '任务描述';
  };

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      <h2>AgentRunBar 高级功能演示</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        展示AgentRunBar组件的多任务管理、实时进度更新、状态切换等高级功能
      </p>

      <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8 }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#52c41a' }}>🎯 功能特性</h4>
        <ul style={{ margin: 0, lineHeight: 1.6 }}>
          <li><strong>多任务管理</strong>: 支持同时管理多个AI任务</li>
          <li><strong>实时进度</strong>: 自动更新任务进度和耗时</li>
          <li><strong>状态切换</strong>: 支持运行、暂停、停止、完成等状态</li>
          <li><strong>动态按钮</strong>: 根据任务状态自动显示对应操作</li>
          <li><strong>进度条显示</strong>: 可视化任务执行进度</li>
        </ul>
      </div>

      <h3>多任务状态展示</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: 12,
              padding: 20,
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ margin: 0, color: getStatusColor(task.status) }}>
                任务 #{task.id} - {getStatusText(task.status)}
              </h4>
              <span style={{ fontSize: 12, color: '#999' }}>
                {task.stepName}
              </span>
            </div>

            {/* 进度条 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#666' }}>进度</span>
                <span style={{ fontSize: 12, color: '#666' }}>{task.progress.toFixed(1)}%</span>
              </div>
              <div style={{ width: '100%', height: 6, backgroundColor: '#f0f0f0', borderRadius: 3 }}>
                <div
                  style={{
                    width: `${task.progress}%`,
                    height: '100%',
                    backgroundColor: getStatusColor(task.status),
                    borderRadius: 3,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            <TaskRunning
              title={getTaskTitle(task)}
              description={getTaskDescription(task)}
              taskStatus={task.status}
              taskRunningStatus={task.runningStatus}
              onPause={() => handlePause(task.id)}
              onCreateNewTask={() => handleCreateNewTask(task.id)}
              onReplay={() => handleReplay(task.id)}
              onViewResult={() => handleViewResult(task.id)}
            />

            {/* 操作按钮说明 */}
            <div style={{ marginTop: 12, fontSize: 12, color: '#999', textAlign: 'center' }}>
              {task.status === TASK_STATUS.RUNNING && task.runningStatus === TASK_RUNNING_STATUS.RUNNING && (
                <span>可操作：暂停任务</span>
              )}
              {task.status === TASK_STATUS.PAUSE && (
                <span>可操作：继续任务</span>
              )}
              {task.status === TASK_STATUS.SUCCESS && (
                <span>可操作：重试 | 提交</span>
              )}
              {task.status === TASK_STATUS.CANCELLED && (
                <span>可操作：新建会话</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: 24, backgroundColor: '#fafafa', borderRadius: 8 }}>
        <h4>📊 任务统计</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e8f4fd' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
              {tasks.filter(t => t.status === TASK_STATUS.RUNNING).length}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>运行中</div>
          </div>
          <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, border: '1px solid #fff7e6' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
              {tasks.filter(t => t.status === TASK_STATUS.PAUSE).length}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>已暂停</div>
          </div>
          <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, border: '1px solid '#f6ffed' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
              {tasks.filter(t => t.status === TASK_STATUS.SUCCESS).length}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>已完成</div>
          </div>
          <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, border: '1px solid '#fff2f0' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
              {tasks.filter(t => t.status === TASK_STATUS.CANCELLED).length}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>已停止</div>
          </div>
        </div>

        <h4>🔧 高级功能说明</h4>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>实时进度更新</strong>: 使用useEffect和setInterval自动更新任务进度和耗时</li>
          <li><strong>多任务状态管理</strong>: 通过useState管理多个任务的复杂状态</li>
          <li><strong>动态按钮渲染</strong>: 根据任务状态自动显示对应的操作按钮</li>
          <li><strong>进度条可视化</strong>: 添加进度条显示任务执行进度</li>
          <li><strong>任务统计面板</strong>: 实时显示各种状态的任务数量</li>
          <li><strong>状态颜色区分</strong>: 不同状态使用不同颜色进行视觉区分</li>
        </ul>
      </div>
    </div>
  );
};

// 辅助函数
function getStatusColor(status: TASK_STATUS): string {
  switch (status) {
    case TASK_STATUS.RUNNING:
      return '#1890ff';
    case TASK_STATUS.SUCCESS:
      return '#52c41a';
    case TASK_STATUS.PAUSE:
      return '#faad14';
    case TASK_STATUS.CANCELLED:
      return '#ff4d4f';
    default:
      return '#666';
  }
}

function getStatusText(status: TASK_STATUS): string {
  switch (status) {
    case TASK_STATUS.RUNNING:
      return '运行中';
    case TASK_STATUS.SUCCESS:
      return '已完成';
    case TASK_STATUS.PAUSE:
      return '已暂停';
    case TASK_STATUS.CANCELLED:
      return '已停止';
    default:
      return '未知';
  }
}
