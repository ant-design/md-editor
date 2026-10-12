import { Workspace, type TaskProps } from '@ant-design/agentic-ui';
import { Button, theme } from 'antd';
import React, { useState } from 'react';

const taskSteps = [
  {
    key: 'collect',
    title: '收集需求与约束',
    content: '读取产品说明，确认用户流程和验收标准。',
  },
  {
    key: 'draft',
    title: '生成实现方案',
    content: '拆分组件结构，整理数据流和接口契约。',
  },
  {
    key: 'verify',
    title: '验证关键交互',
    content: '检查键盘操作、窄屏布局与异常反馈。',
  },
  {
    key: 'deliver',
    title: '整理交付结果',
    content: '输出变更说明、预览文件与后续建议。',
  },
];

const WorkspaceTaskDemo: React.FC = () => {
  const { token } = theme.useToken();
  const [completed, setCompleted] = useState(1);
  const done = completed === taskSteps.length;
  const items: NonNullable<TaskProps['data']>['items'] = taskSteps.map(
    (step, index) => ({
      ...step,
      status:
        index < completed
          ? 'success'
          : index === completed
            ? 'loading'
            : 'pending',
    }),
  );
  return (
    <div style={{ height: 560, minWidth: 0, fontFamily: token.fontFamily }}>
      <Workspace
        pure
        title="任务执行计划"
        headerExtra={
          <Button
            size="small"
            onClick={() =>
              setCompleted((value) =>
                value >= taskSteps.length ? 1 : value + 1,
              )
            }
          >
            {done ? '重新演示' : '完成当前步骤'}
          </Button>
        }
      >
        <Workspace.Task data={{ items }} />
      </Workspace>
    </div>
  );
};
export default WorkspaceTaskDemo;
