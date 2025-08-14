import { Workspace } from '@ant-design/md-editor';
import React, { useEffect, useState } from 'react';

const WorkspaceTaskDemo: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    // 模拟任务数据
    const initialTasks = [
      {
        category: 'DeepThink',
        info: '数据分析任务',
        runId: 'data-analysis-001',
        output: {
          data: '正在分析用户行为数据，预计需要 5 分钟...',
          type: 'RUNNING',
        },
      },
      {
        category: 'ToolCall',
        info: '文件处理',
        runId: 'file-process-002',
        input: {
          inputArgs: {
            params: {
              filePath: '/data/input.csv',
              outputPath: '/data/output.json',
              format: 'json',
            },
          },
        },
        output: {
          data: '文件处理完成，共处理 1000 条记录',
          type: 'END',
        },
      },
      {
        category: 'DeepThink',
        info: '模型训练',
        runId: 'model-training-003',
        output: {
          data: '模型训练进度: 75% (150/200 epochs)',
          type: 'RUNNING',
        },
      },
    ];

    setTasks(initialTasks);

    // 模拟任务状态更新
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (
            task.runId === 'data-analysis-001' &&
            task.output.type === 'RUNNING'
          ) {
            return {
              ...task,
              output: {
                data: '数据分析完成，发现 3 个异常模式',
                type: 'END',
              },
            };
          }
          if (
            task.runId === 'model-training-003' &&
            task.output.type === 'RUNNING'
          ) {
            const currentProgress = parseInt(task.output.data.match(/\d+/)[0]);
            if (currentProgress >= 200) {
              return {
                ...task,
                output: {
                  data: '模型训练完成，准确率达到 95.2%',
                  type: 'END',
                },
              };
            } else {
              return {
                ...task,
                output: {
                  data: `模型训练进度: ${Math.min(currentProgress + 5, 200)}/200 epochs`,
                  type: 'RUNNING',
                },
              };
            }
          }
          return task;
        }),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Workspace title="任务管理工作空间">
        <Workspace.Task
          tab={{
            key: 'tasks',
            title: '任务列表',
            count: tasks.filter((t) => t.output.type === 'RUNNING').length,
          }}
          data={{
            content: tasks,
            thoughtChainListProps: {
              style: { maxHeight: '500px', overflow: 'auto' },
            },
          }}
        />
      </Workspace>
    </div>
  );
};

export default WorkspaceTaskDemo;
