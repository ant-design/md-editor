import { ToolUseBar } from '@ant-design/md-editor';
import { Button } from 'antd';
import React, { useState } from 'react';

const tools = [
  {
    id: '1',
    toolName: 'Search Code',
    result: 'Found 3 files matching the search criteria.',
  },
  {
    id: '2',
    toolName: 'Read File',
    result: 'Successfully read file contents.',
  },
  {
    id: '3',
    toolName: 'Edit File',
    result: 'File edited successfully.',
  },
];

export default () => {
  const [activeId, setActiveId] = useState<string>('1');

  const handleToolChange = () => {
    // 循环切换活跃工具
    const currentIndex = tools.findIndex((tool) => tool.id === activeId);
    const nextIndex = (currentIndex + 1) % tools.length;
    setActiveId(tools[nextIndex].id);
  };

  return (
    <div>
      <Button onClick={handleToolChange} style={{ marginBottom: 16 }}>
        切换活跃工具
      </Button>
      <ToolUseBar tools={tools} activeId={activeId} />
    </div>
  );
};
