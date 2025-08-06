import { ToolUseBar } from '@ant-design/md-editor';
import React from 'react';

const tools = [
  {
    id: '1',
    toolName: '基础工具调用-BASE',
    toolTarget: '工具类/工具名称 操作对象',
    time: '2.3s',
    status: 'success',
    progress: 75,
    type: 'basic',
  },
  {
    id: '2',
    toolName: '高级工具调用-ADVANCED',
    toolTarget: '工具类/工具名称 操作对象',
    time: '1.8s',
    status: 'loading',
    progress: 50,
    type: 'auto',
  },
];

const workflowStatus = {
  inProgress: [
    { id: '1', name: 'Get stock Insights', status: 'completed', time: '0.8s' },
    { id: '2', name: 'Get stock holders', status: 'pending', time: '' },
    { id: '3', name: 'Get what analysts', status: 'pending', time: '' },
  ],
  completed: [
    { id: '1', name: 'Get stock Insights', status: 'completed', time: '0.8s' },
    { id: '2', name: 'Get stock holders', status: 'completed', time: '0.7s' },
    { id: '3', name: 'Get what analysts', status: 'completed', time: '0.8s' },
  ],
  totalTime: '2.3s',
};

export default () => {
  return (
    <div>
      <ToolUseBar
        tools={tools}
        activeToolId="1"
        workflowStatus={workflowStatus}
        showWorkflow={true}
        showTaskList={true}
      />
    </div>
  );
};
