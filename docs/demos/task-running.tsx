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

  // 状态循环展示逻辑
  const [statusIndex, setStatusIndex] = useState(0);
  const statusSequence = [
    {
      status: TASK_STATUS.RUNNING,
      runningStatus: TASK_RUNNING_STATUS.RUNNING,
      title: '任务运行中',
      description: 'AI模型正在训练中，请耐心等待...',
    },
    {
      status: TASK_STATUS.PAUSE,
      runningStatus: TASK_RUNNING_STATUS.PAUSE,
      title: '任务已暂停',
      description: '任务执行已暂停，点击继续按钮恢复执行',
    },
    {
      status: TASK_STATUS.RUNNING,
      runningStatus: TASK_RUNNING_STATUS.RUNNING,
      title: '任务继续运行',
      description: '任务已恢复，继续执行中...',
    },
    {
      status: TASK_STATUS.STOPPED,
      runningStatus: TASK_RUNNING_STATUS.COMPLETE,
      title: '任务已停止',
      description: '任务执行已停止，无法恢复，请创建新任务',
    },
    {
      status: TASK_STATUS.ERROR,
      runningStatus: TASK_RUNNING_STATUS.COMPLETE,
      title: '任务执行出错',
      description: '任务执行过程中发生错误，请重新执行或创建新任务',
    },
    {
      status: TASK_STATUS.SUCCESS,
      runningStatus: TASK_RUNNING_STATUS.COMPLETE,
      title: '任务已完成',
      description: '任务执行成功，请检查结果并选择后续操作',
    },
  ];

  // 倒计时逻辑
  const [, setCountdown] = useState(5);
  React.useEffect(() => {
    if (
      taskStatus === TASK_STATUS.RUNNING &&
      taskRunningStatus === TASK_RUNNING_STATUS.RUNNING
    ) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 5; // 重置倒计时
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCountdown(5); // 非运行状态时重置倒计时
    }
  }, [taskStatus, taskRunningStatus]);

  // 自动状态变化逻辑
  React.useEffect(() => {
    if (
      taskStatus === TASK_STATUS.RUNNING &&
      taskRunningStatus === TASK_RUNNING_STATUS.RUNNING
    ) {
      // 运行中状态持续5秒后自动变为完成或错误
      const timer = setTimeout(() => {
        const isSuccess = Math.random() > 0.3; // 70%概率成功，30%概率失败
        if (isSuccess) {
          setTaskStatus(TASK_STATUS.SUCCESS);
          setTaskRunningStatus(TASK_RUNNING_STATUS.COMPLETE);
        } else {
          setTaskStatus(TASK_STATUS.ERROR);
          setTaskRunningStatus(TASK_RUNNING_STATUS.COMPLETE);
        }
      }, 5000);

      return () => clearTimeout(timer);
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
    setTaskStatus(TASK_STATUS.STOPPED);
    setTaskRunningStatus(TASK_RUNNING_STATUS.COMPLETE);
  };

  const handleCreateNewTask = () => {
    // 循环展示不同状态
    const nextIndex = (statusIndex + 1) % statusSequence.length;
    setStatusIndex(nextIndex);

    const nextStatus = statusSequence[nextIndex];
    setTaskStatus(nextStatus.status);
    setTaskRunningStatus(nextStatus.runningStatus);

    // 重置进度和时间
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

  const handleRetry = () => {
    setTaskStatus(TASK_STATUS.RUNNING);
    setTaskRunningStatus(TASK_RUNNING_STATUS.RUNNING);
    setProgress('1/6 模型训练');
    setElapsedTime('0分0秒');
  };

  // 空函数，用于满足类型要求
  const noop = () => {};

  // 获取当前状态对应的标题和描述
  const currentStatusInfo = statusSequence[statusIndex];

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <h2>AgentRunBar 任务运行状态组件</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        展示AI任务运行的各种状态和操作按钮，支持运行中、暂停、停止、完成等状态管理
      </p>

      <h3>基础用法 - 状态循环展示</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        点击"新任务"按钮可以循环展示不同状态，运行中状态会在5秒后自动变为完成或错误状态
      </p>

      <TaskRunning
        icon="https://mdn.alipayobjects.com/huamei_re70wt/afts/img/A*R2VDRJQuQd4AAAAAAAAAAAAADmuEAQ/original"
        iconTooltip="AI助手图标 - 点击查看详情"
        title={currentStatusInfo.title}
        description={currentStatusInfo.description}
        taskStatus={taskStatus}
        taskRunningStatus={taskRunningStatus}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
        onCreateNewTask={handleCreateNewTask}
        onReplay={handleReplay}
        onViewResult={handleViewResult}
      />

      <h3 style={{ marginTop: 32 }}>静态状态展示</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        以下是组件支持的所有状态的静态展示，每种状态都有对应的操作按钮和交互逻辑
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: 16,
        }}
      >
        {/* 状态1: 任务运行中 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#1890ff' }}>
            状态1: 任务运行中
          </h4>
          <TaskRunning
            title={`任务运行中, 已耗时${elapsedTime}。 ${progress}`}
            description="AI模型正在训练中，请耐心等待..."
            taskStatus={TASK_STATUS.RUNNING}
            taskRunningStatus={TASK_RUNNING_STATUS.RUNNING}
            onPause={handlePause}
            onResume={noop}
            onStop={handleStop}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：暂停按钮 + 停止按钮
          </div>
        </div>

        {/* 状态2: 任务已暂停 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#faad14' }}>
            状态2: 任务已暂停
          </h4>
          <TaskRunning
            title="任务已暂停"
            description="任务执行已暂停，点击继续按钮恢复执行"
            taskStatus={TASK_STATUS.PAUSE}
            taskRunningStatus={TASK_RUNNING_STATUS.PAUSE}
            onPause={noop}
            onResume={handleResume}
            onStop={noop}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：继续按钮 + 新任务按钮
          </div>
        </div>

        {/* 状态3: 任务已停止 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#ff4d4f' }}>
            状态3: 任务已停止
          </h4>
          <TaskRunning
            title="任务已停止"
            description="任务执行已停止，无法恢复，请创建新任务"
            taskStatus={TASK_STATUS.STOPPED}
            taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
            onPause={noop}
            onResume={noop}
            onStop={noop}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：创建新任务按钮
          </div>
        </div>

        {/* 状态4: 任务已完成 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#52c41a' }}>
            状态4: 任务已完成
          </h4>
          <TaskRunning
            title={`任务已完成, 耗时${totalTime}`}
            taskStatus={TASK_STATUS.SUCCESS}
            taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
            onPause={noop}
            onResume={noop}
            onStop={noop}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleRetry}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：查看按钮 + 重新执行按钮 + 新任务按钮
          </div>
        </div>

        {/* 状态5: 任务出错 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#ff4d4f' }}>
            状态5: 任务出错
          </h4>
          <TaskRunning
            title="任务执行出错"
            description="任务执行过程中发生错误，请重新执行或创建新任务"
            taskStatus={TASK_STATUS.ERROR}
            taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
            onPause={noop}
            onResume={noop}
            onStop={noop}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleRetry}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：重新执行按钮 + 新任务按钮
          </div>
        </div>

        {/* 状态6: 任务已取消 */}
        <div
          style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#999' }}>
            状态6: 任务已取消
          </h4>
          <TaskRunning
            title="任务已取消"
            description="任务已被用户取消，请创建新任务"
            taskStatus={TASK_STATUS.CANCELLED}
            taskRunningStatus={TASK_RUNNING_STATUS.COMPLETE}
            onPause={noop}
            onResume={noop}
            onStop={noop}
            onCreateNewTask={handleCreateNewTask}
            onReplay={handleReplay}
            onViewResult={handleViewResult}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            包含：创建新任务按钮
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
            支持运行中、暂停、停止、完成、出错等多种任务状态
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
          <li>
            <strong>图标提示</strong>: 支持为图标添加tooltip提示信息
          </li>
        </ul>

        <h4 style={{ marginTop: 20 }}>状态按钮说明：</h4>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>任务运行中</strong>: 显示暂停按钮 + 停止按钮
          </li>
          <li>
            <strong>任务已暂停</strong>: 显示继续按钮 + 新任务按钮
          </li>
          <li>
            <strong>任务已停止</strong>: 显示创建新任务按钮
          </li>
          <li>
            <strong>任务已完成</strong>: 显示查看按钮 + 重新执行按钮 +
            新任务按钮
          </li>
          <li>
            <strong>任务出错</strong>: 显示重新执行按钮 + 新任务按钮
          </li>
          <li>
            <strong>任务已取消</strong>: 显示创建新任务按钮
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
            SUCCESS | ERROR | PAUSE | STOPPED | CANCELLED
          </li>
          <li>
            <strong>taskRunningStatus</strong>: 任务运行状态，支持
            TASK_RUNNING_STATUS.RUNNING | COMPLETE | PAUSE
          </li>
          <li>
            <strong>onPause</strong>: 暂停任务时的回调函数
          </li>
          <li>
            <strong>onResume</strong>: 继续任务时的回调函数
          </li>
          <li>
            <strong>onStop</strong>: 停止任务时的回调函数
          </li>
          <li>
            <strong>onCreateNewTask</strong>: 创建新任务时的回调函数
          </li>
          <li>
            <strong>onReplay</strong>: 重新执行任务时的回调函数
          </li>
          <li>
            <strong>onViewResult</strong>: 查看结果时的回调函数
          </li>
          <li>
            <strong>icon</strong>: 自定义图标，支持图片URL或React组件
          </li>
          <li>
            <strong>iconTooltip</strong>: 图标提示文案，鼠标悬停时显示
          </li>
        </ul>
      </div>
    </div>
  );
};
