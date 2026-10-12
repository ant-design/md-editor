import { QuadrantChart } from '@ant-design/agentic-ui';
import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

/**
 * 模拟流式产出表格行：象限行逐条追加，未满 4 行时其余象限自动补空占位。
 */
const allRows = [
  { 象限: '实验期', 内容: '新技术验证，原型' },
  { 象限: '推广期', 内容: '试点团队，灰度发布' },
  { 象限: '规模化', 内容: '平台化，最佳实践' },
  { 象限: '衰退/替换', 内容: '技术债偿还，迁移计划' },
];

const columns = [
  { title: '象限', dataIndex: '象限', key: '象限' },
  { title: '内容', dataIndex: '内容', key: '内容' },
];

const QuadrantStreamingDemo: React.FC = () => {
  const [count, setCount] = useState(1);
  const data = useMemo(() => allRows.slice(0, count), [count]);

  useEffect(() => {
    if (count >= allRows.length) return;
    const timer = setTimeout(() => setCount((current) => current + 1), 1100);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div style={{ padding: 16, background: '#fafafa' }}>
      <Button
        onClick={() => setCount(1)}
        disabled={count < allRows.length}
        style={{ marginBottom: 16 }}
      >
        重新播放
      </Button>
      <QuadrantChart
        title={`已加载 ${count} / ${allRows.length} 行（象限）`}
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default QuadrantStreamingDemo;
