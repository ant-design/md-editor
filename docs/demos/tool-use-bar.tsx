import { ToolUseBar } from '@ant-design/md-editor';
import React from 'react';

const tools = [
  {
    id: '1',
    toolName: 'Search Code',
    toolTarget: 'baidu.com',
    time: '1.3s',
  },
  {
    id: '2',
    toolName: 'Read File',
    toolTarget: 'xxx.docx',
    time: '2.3s',
  },
  {
    id: '3',
    toolName: 'Edit File',
    toolTarget: 'xx.md',
    time: '2.3s',
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
            id、toolName、toolTarget、time 等属性
          </li>
          <li>
            <strong>id</strong>: 工具的唯一标识符
          </li>
          <li>
            <strong>toolName</strong>: 工具名称
          </li>
          <li>
            <strong>toolTarget</strong>: 工具操作的目标对象
          </li>
          <li>
            <strong>time</strong>: 工具执行时间
          </li>
        </ul>
      </div>
    </div>
  );
};
