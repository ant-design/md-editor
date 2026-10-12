import type { TaskItem, TaskStatus } from '@ant-design/agentic-ui';
import { TaskList, ToolUseBar } from '@ant-design/agentic-ui';
import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

const allTasks: Array<{ key: string; title: string; contentItems: string[] }> =
  [
    {
      key: '1',
      title: '收集并分析竞品产品数据',
      contentItems: [
        '获取目标竞品的用户评价数据',
        '抓取竞品官网的功能特性列表',
        '整理各竞品的定价策略信息',
        '对比产品功能矩阵',
        '汇总市场份额数据',
        '生成竞品分析摘要报告',
      ],
    },
    {
      key: '2',
      title: '调用分析工具生成可视化图表',
      contentItems: ['生成功能对比雷达图', '绘制市场份额饼图'],
    },
    {
      key: '3',
      title: '撰写竞品分析报告文档',
      contentItems: ['整合数据分析结论', '插入可视化图表'],
    },
    {
      key: '4',
      title: '审核并发布分析报告',
      contentItems: ['最终审核与发布'],
    },
  ];

/** 每步推进间隔(ms) */
const STEP_INTERVAL = 3000;
const TOTAL_STEPS = allTasks.length + 1;

export default () => {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(TOTAL_STEPS);
  const isRunning = step < TOTAL_STEPS;

  const items = useMemo((): TaskItem[] => {
    const totalSteps = TOTAL_STEPS;
    const currentLoading = step - 1;

    return allTasks
      .filter((_, idx) => idx <= currentLoading)
      .map((task, idx) => {
        let status: TaskStatus = 'pending';
        if (idx < currentLoading) {
          status = 'success';
        } else if (idx === currentLoading && step < totalSteps) {
          status = 'loading';
        } else {
          status = 'success';
        }

        const content =
          task.key === '2'
            ? [
                <ToolUseBar
                  key="tooluse"
                  activeKeys={activeKeys}
                  onActiveKeysChange={setActiveKeys}
                  tools={task.contentItems.map((name, i) => ({
                    id: String(i + 1),
                    toolName: name.includes('雷达')
                      ? 'chart_generator'
                      : 'data_visualizer',
                    toolTarget: name,
                    time: String(i + 2),
                  }))}
                />,
              ]
            : task.contentItems.map((text, i) => <div key={i}>{text}</div>);

        return {
          key: task.key,
          title: task.title,
          content,
          status,
        };
      });
  }, [activeKeys, step]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setTimeout(
      () => setStep((current) => current + 1),
      STEP_INTERVAL,
    );
    return () => clearTimeout(timer);
  }, [isRunning, step]);

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Button
        onClick={() => {
          setStep(1);
          setOpen(true);
        }}
        disabled={isRunning}
        style={{ marginBottom: 16 }}
      >
        {isRunning ? '执行中' : '重新播放'}
      </Button>
      {items.length > 0 && (
        <TaskList
          items={items}
          variant="simple"
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  );
};
