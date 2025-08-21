import {
  TASK_RUNNING_STATUS,
  TASK_STATUS,
  TaskRunning,
} from '@ant-design/md-editor';
import React, { useEffect, useState } from 'react';

export default () => {
  const [minutes, setMinutes] = useState('0');
  const [taskStatus, setTaskStatus] = useState<TASK_STATUS>(
    TASK_STATUS.RUNNING,
  );
  const [taskRunningStatus, setTaskRunningStatus] =
    useState<TASK_RUNNING_STATUS>(TASK_RUNNING_STATUS.RUNNING);

  // 模拟任务运行时间
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (taskRunningStatus === TASK_RUNNING_STATUS.RUNNING) {
      let count = 0;
      timer = setInterval(() => {
        count++;
        setMinutes((count / 60).toFixed(1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [taskRunningStatus]);

  const handlePause = () => {
    setTaskRunningStatus(TASK_RUNNING_STATUS.PAUSE);
  };

  const handleCreateNewTask = () => {
    setTaskStatus(TASK_STATUS.RUNNING);
    setTaskRunningStatus(TASK_RUNNING_STATUS.RUNNING);
    setMinutes('0');
  };

  const handleReplay = () => {
    setTaskStatus(TASK_STATUS.RUNNING);
    setTaskRunningStatus(TASK_RUNNING_STATUS.RUNNING);
    setMinutes('0');
  };

  const handleViewResult = () => {
    console.log('查看结果');
  };

  return (
    <div style={{ padding: 24 }}>
      <h3>基础用法</h3>
      <TaskRunning
        minutes={minutes}
        taskStatus={taskStatus}
        taskRunningStatus={taskRunningStatus}
        onPause={handlePause}
        onCreateNewTask={handleCreateNewTask}
        onReplay={handleReplay}
        onViewResult={handleViewResult}
      />

      <h3 style={{ marginTop: 24 }}>不同状态展示</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TaskRunning
          minutes="1.5"
          taskStatus={TASK_STATUS.SUCCESS}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
          onPause={handlePause}
          onCreateNewTask={handleCreateNewTask}
          onReplay={handleReplay}
          onViewResult={handleViewResult}
        />

        <TaskRunning
          minutes="0.5"
          taskStatus={TASK_STATUS.ERROR}
          taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
          onPause={handlePause}
          onCreateNewTask={handleCreateNewTask}
          onReplay={handleReplay}
          onViewResult={handleViewResult}
        />

        <TaskRunning
          minutes="2.0"
          taskStatus={TASK_STATUS.PAUSE}
          taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
          onPause={handlePause}
          onCreateNewTask={handleCreateNewTask}
          onReplay={handleReplay}
          onViewResult={handleViewResult}
        />
      </div>

      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>minutes</strong>: 任务运行时间（分钟），字符串格式
          </li>
          <li>
            <strong>taskStatus</strong>: 任务状态，支持 TASK_STATUS.RUNNING |
            SUCCESS | ERROR | PAUSE
          </li>
          <li>
            <strong>taskRunningStatus</strong>: 任务运行状态，支持
            TASK_RUNNING_STATUS.RUNNING | COMPLETE | PAUSE
          </li>
          <li>
            <strong>onPause</strong>: 暂停任务时的回调函数
          </li>
          <li>
            <strong>onCreateNewTask</strong>: 创建新任务时的回调函数
          </li>
          <li>
            <strong>onReplay</strong>: 重新播放任务时的回调函数
          </li>
          <li>
            <strong>onViewResult</strong>: 查看结果时的回调函数
          </li>
        </ul>
      </div>
    </div>
  );
};
