import { ToolUseBar } from '@ant-design/md-editor';
import React from 'react';

const tools = [
  {
    id: '1',
    toolName: '基础工具调用-BASE',
    toolTarget: '工具类/工具名称 操作对象',
    time: '2.3s',
    status: 'success' as const,
    progress: 75,
    type: 'basic',
  },
  {
    id: '2',
    toolName: '高级工具调用-ADVANCED',
    toolTarget: '工具类/工具名称 操作对象',
    time: '1.8s',
    status: 'loading' as const,
    progress: 50,
    type: 'auto',
  },
];

export default () => {
  return (
    <div>
      <ToolUseBar tools={tools} />
    </div>
  );
};
