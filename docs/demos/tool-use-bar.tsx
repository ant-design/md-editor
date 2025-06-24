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
    </div>
  );
};
