import {
  TASK_RUNNING_STATUS,
  TASK_STATUS,
  TaskRunning,
} from '@ant-design/md-editor';
import React, { useState } from 'react';

export default () => {
  const [taskStatus, setTaskStatus] = useState<TASK_STATUS>(
    TASK_STATUS.RUNNING,
  );
  const [taskRunningStatus, setTaskRunningStatus] =
    useState<TASK_RUNNING_STATUS>(TASK_RUNNING_STATUS.RUNNING);
  const [elapsedTime, setElapsedTime] = useState('1小时20分12秒');
  const [progress, setProgress] = useState('4/6 模型训练');
  const [totalTime] = useState('10小时02分10秒');

  // 模拟任务运行时间更新
  React.useEffect(() => {
    if (
      taskStatus === TASK_STATUS.RUNNING &&
      taskRunningStatus === TASK_RUNNING_STATUS.RUNNING
    ) {
      const timer = setInterval(() => {
        // 这里可以添加实际的时间计算逻辑
        console.log('任务运行中...');
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [taskStatus, taskRunningStatus]);

  const handlePause = () => {
    setTaskRunningStatus(TASK_RUNNING_STATUS.PAUSE);
    setTaskStatus(TASK_STATUS.PAUSE);
  };

  const handleResume = () => {
    setTaskRunningStatus(TASK_RUNNING_STATUS.RUNNING);
    setTaskStatus(TASK_STATUS.RUNNING);
  };

  const handleStop = () => {
    setTaskStatus(TASK_STATUS.CANCELLED);
    setTaskRunningStatus(TASK_RUNNING_STATUS.COMPLETE);
  };

  const handleCreateNewTask = () => {
    setTaskStatus(TASK_STATUS.RUNNING);
    setTaskRunningStatus(TASK_RUNNING_STATUS.RUNNING);
    setProgress('1/6 模型训练');
    setElapsedTime('0分0秒');
  };

  const handleReplay = () => {
    setTaskStatus(TASK_STATUS.RUNNING);
    setTaskRunningStatus(TASK_RUNNING_STATUS.RUNNING);
    setProgress('1/6 模型训练');
    setElapsedTime('0分0秒');
  };

  const handleViewResult = () => {
    console.log('查看任务结果');
  };

  const handleSubmit = () => {
    console.log('提交任务结果');
    setTaskStatus(TASK_STATUS.SUCCESS);
    setTaskRunningStatus(TASK_RUNNING_STATUS.COMPLETE);
  };

  const handleRetry = () => {
    setTaskStatus(TASK_STATUS.RUNNING);
    setTaskRunningStatus(TASK_RUNNING_STATUS.RUNNING);
    setProgress('1/6 模型训练');
    setElapsedTime('0分0秒');
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <h2>AgentRunBar 任务运行状态组件</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        展示AI任务运行的各种状态和操作按钮，支持运行中、暂停、停止、完成等状态管理
      </p>

      <h3>基础用法</h3>
      <TaskRunning
        icon="https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*R2VDRJQuQd4AAAAAAAAAAAAADmuEAQ/original"
        title="正在运行中"
        description="任务执行中..."
        taskStatus={taskStatus}
        taskRunningStatus={taskRunningStatus}
        onPause={handlePause}
        onCreateNewTask={handleCreateNewTask}
        onReplay={handleReplay}
        onViewResult={handleViewResult}
      />

      <h3 style={{ marginTop: 32 }}>完整状态展示</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        以下是组件支持的所有状态展示，每种状态都有对应的操作按钮和交互逻辑
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: 16,
        }}
      >
        {/* 状态1: 任务运行中 - 完整控制 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#1890ff' }}>
            状态1: 任务运行中 (完整控制)
          </h4>
          <TaskRunning
            title={`任务运行中, 已耗时${elapsedTime}。 ${progress}`}
            description="AI模型正在训练中，请耐心等待..."
            taskStatus={TASK_STATUS.RUNNING}
            taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
            onPause={handlePause}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：暂停按钮 + 创建新任务按钮
          </div>
        </div>

        {/* 状态2: 任务运行中 - 基础控制 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#1890ff' }}>
            状态2: 任务运行中 (基础控制)
          </h4>
          <TaskRunning
            title={`任务运行中, 已耗时${elapsedTime}。 ${progress}`}
            description="AI模型正在训练中，请耐心等待..."
            taskStatus={TASK_STATUS.RUNNING}
            taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
            onPause={handlePause}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：暂停按钮 + 停止按钮
          </div>
        </div>

        {/* 状态3: 任务已暂停 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#faad14' }}>
            状态3: 任务已暂停
          </h4>
          <TaskRunning
            title="任务已暂停。"
            description="任务执行已暂停，点击继续按钮恢复执行"
            taskStatus={TASK_STATUS.PAUSE}
            taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
            onPause={handleResume}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：继续按钮 (播放图标)
          </div>
        </div>

        {/* 状态4: 任务已停止 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#ff4d4f' }}>
            状态4: 任务已停止
          </h4>
          <TaskRunning
            title="任务已停止, 如需继续请新建会话重新开始。"
            description="任务执行已停止，无法恢复，请创建新会话"
            taskStatus={TASK_STATUS.CANCELLED}
            taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
            onPause={handleStop}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：新建会话按钮 + 停止图标
          </div>
        </div>

        {/* 状态5: 任务已完成 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#52c41a' }}>
            状态5: 任务已完成
          </h4>
          <TaskRunning
            title={`任务已完成, 耗时${totalTime}, 如满意请提交, 如不满意请重试。`}
            description="任务执行成功，请检查结果并选择后续操作"
            taskStatus={TASK_STATUS.SUCCESS}
            taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
            onPause={handleStop}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleRetry}
            onViewResult={handleSubmit}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：重试按钮 + 提交按钮 + 停止图标
          </div>
        </div>

        {/* 状态6: 任务运行中 - 基础控制 (重复展示) */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#1890ff' }}>
            状态6: 任务运行中 (基础控制)
          </h4>
          <TaskRunning
            title={`任务运行中, 已耗时${elapsedTime}。 ${progress}`}
            description="AI模型正在训练中，请耐心等待..."
            taskStatus={TASK_STATUS.RUNNING}
            taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
            onPause={handlePause}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：暂停按钮 + 停止按钮
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 32,
          padding: 24,
          backgroundColor: '#fafafa',
          borderRadius: 8,
        }}
      >
        <h4>组件特性说明：</h4>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>状态管理</strong>:
            支持运行中、暂停、停止、完成等多种任务状态
          </li>
          <li>
            <strong>动态按钮</strong>: 根据任务状态自动显示对应的操作按钮
          </li>
          <li>
            <strong>进度显示</strong>: 支持显示任务进度和耗时信息
          </li>
          <li>
            <strong>机器人动画</strong>:
            内置机器人图标，支持思考、暂停、完成等状态动画
          </li>
          <li>
            <strong>响应式设计</strong>: 自适应不同屏幕尺寸，支持移动端
          </li>
          <li>
            <strong>主题定制</strong>: 支持自定义主题色和样式
          </li>
        </ul>

        <h4 style={{ marginTop: 20 }}>Props 说明：</h4>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>title</strong>: 标题文案，显示主要的任务状态信息
          </li>
          <li>
            <strong>description</strong>: 描述文案，显示任务的详细描述信息
          </li>
          <li>
            <strong>taskStatus</strong>: 任务状态，支持 TASK_STATUS.RUNNING |
            SUCCESS | ERROR | PAUSE | CANCELLED
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
          <li>
            <strong>icon</strong>: 自定义图标，支持图片URL或React组件
          </li>
        </ul>
      </div>
    </div>
  );
};
