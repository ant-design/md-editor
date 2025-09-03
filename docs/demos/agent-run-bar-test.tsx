import {
  TASK_RUNNING_STATUS,
  TASK_STATUS,
  TaskRunning,
} from '@ant-design/md-editor';
import { Button, Card, Col, Row } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [currentState, setCurrentState] = useState(0);

  // 预定义的状态配置
  const states = [
    {
      name: '运行中 - 完整控制',
      taskStatus: TASK_STATUS.RUNNING,
      taskRunningStatus: TASK_RUNNING_STATUS.RUNNING,
      title: '任务运行中, 已耗时1小时20分12秒。 4/6 模型训练',
      description: 'AI模型正在训练中，请耐心等待...',
      color: '#1890ff',
    },
    {
      name: '运行中 - 基础控制',
      taskStatus: TASK_STATUS.RUNNING,
      taskRunningStatus: TASK_RUNNING_STATUS.RUNNING,
      title: '任务运行中, 已耗时1小时20分12秒。 4/6 模型训练',
      description: 'AI模型正在训练中，请耐心等待...',
      color: '#1890ff',
    },
    {
      name: '已暂停',
      taskStatus: TASK_STATUS.PAUSE,
      taskRunningStatus: TASK_RUNNING_STATUS.PAUSE,
      title: '任务已暂停。',
      description: '任务执行已暂停，点击继续按钮恢复执行',
      color: '#faad14',
    },
    {
      name: '已停止',
      taskStatus: TASK_STATUS.CANCELLED,
      taskRunningStatus: TASK_RUNNING_STATUS.COMPLETE,
      title: '任务已停止, 如需继续请新建会话重新开始。',
      description: '任务执行已停止，无法恢复，请创建新会话',
      color: '#ff4d4f',
    },
    {
      name: '已完成',
      taskStatus: TASK_STATUS.SUCCESS,
      taskRunningStatus: TASK_RUNNING_STATUS.COMPLETE,
      title: '任务已完成, 耗时10小时02分10秒, 如满意请提交, 如不满意请重试。',
      description: '任务执行成功，请检查结果并选择后续操作',
      color: '#52c41a',
    },
    {
      name: '运行中 - 基础控制 (重复)',
      taskStatus: TASK_STATUS.RUNNING,
      taskRunningStatus: TASK_RUNNING_STATUS.RUNNING,
      title: '任务运行中, 已耗时1小时20分12秒。 4/6 模型训练',
      description: 'AI模型正在训练中，请耐心等待...',
      color: '#1890ff',
    },
  ];

  const currentStateConfig = states[currentState];

  const handlePause = () => {
    console.log('暂停任务');
    if (currentStateConfig.taskStatus === TASK_STATUS.RUNNING) {
      setCurrentState(2); // 切换到暂停状态
    } else if (currentStateConfig.taskStatus === TASK_STATUS.PAUSE) {
      setCurrentState(0); // 切换到运行状态
    }
  };

  const handleCreateNewTask = () => {
    console.log('创建新任务');
    setCurrentState(0); // 重置到运行状态
  };

  const handleReplay = () => {
    console.log('重试任务');
    setCurrentState(0); // 重置到运行状态
  };

  const handleViewResult = () => {
    console.log('查看结果');
    if (currentStateConfig.taskStatus === TASK_STATUS.SUCCESS) {
      setCurrentState(0); // 重置到运行状态
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <h2>AgentRunBar 组件测试</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        测试AgentRunBar组件的各种状态和交互功能
      </p>

      {/* 状态切换控制 */}
      <Card title="状态控制" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {states.map((state, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Button
                type={currentState === index ? 'primary' : 'default'}
                onClick={() => setCurrentState(index)}
                style={{ width: '100%', textAlign: 'left' }}
              >
                {state.name}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 当前状态展示 */}
      <Card
        title={`当前状态: ${currentStateConfig.name}`}
        style={{ marginBottom: 24 }}
        styles={{
          header: { borderLeft: `4px solid ${currentStateConfig.color}` },
        }}
      >
        <TaskRunning
          title={currentStateConfig.title}
          description={currentStateConfig.description}
          taskStatus={currentStateConfig.taskStatus}
          taskRunningStatus={currentStateConfig.taskRunningStatus}
          onPause={handlePause}
          onCreateNewTask={handleCreateNewTask}
          onReplay={handleReplay}
          onViewResult={handleViewResult}
        />
      </Card>

      {/* 状态信息 */}
      <Card title="状态信息" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: currentStateConfig.color,
                }}
              >
                {currentStateConfig.taskStatus}
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>任务状态</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: currentStateConfig.color,
                }}
              >
                {currentStateConfig.taskRunningStatus}
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>运行状态</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: currentStateConfig.color,
                }}
              >
                {currentState + 1}
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>当前状态</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 操作日志 */}
      <Card title="操作日志">
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: 16,
            borderRadius: 4,
            minHeight: 100,
          }}
        >
          <p style={{ margin: 0, color: '#666' }}>
            点击上方按钮切换不同状态，观察组件的变化和可用的操作按钮。
          </p>
          <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: 12 }}>
            当前状态: {currentStateConfig.name} | 任务状态:{' '}
            {currentStateConfig.taskStatus} | 运行状态:{' '}
            {currentStateConfig.taskRunningStatus}
          </p>
        </div>
      </Card>
    </div>
  );
};
