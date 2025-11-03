import { ToolUseBar } from '@ant-design/agentic-ui';
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

      <div style={{ marginTop: '20px', padding: '20px' }}>
        <h4>Props 说明：</h4>
        <ul>
          <li>
            <strong>tools</strong>: 工具列表数组，每个工具包含
            id、toolName、toolTarget、time、status、progress、type 等属性
          </li>
          <li>
            <strong>status</strong>: 工具状态，支持 &apos;success&apos; |
            &apos;loading&apos; | &apos;error&apos; | &apos;idle&apos;
          </li>
          <li>
            <strong>progress</strong>: 进度百分比，0-100 的数值
          </li>
          <li>
            <strong>type</strong>: 工具类型，如 &apos;basic&apos; |
            &apos;auto&apos;
          </li>
        </ul>
      </div>
    </div>
  );
};
