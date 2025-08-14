import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Workspace from '../../src/Workspace';

describe('Workspace 主组件', () => {
  it('应该渲染标题，并在点击关闭时触发 onClose', () => {
    const onClose = vi.fn();

    render(
      <Workspace title="开发工作空间" onClose={onClose}>
        <Workspace.Realtime
          tab={{ key: 'realtime', title: '实时跟随' }}
          data={{ type: 'md', content: 'Hello', title: '深度思考' } as any}
        />
        <Workspace.Task
          tab={{ key: 'tasks', title: '任务' }}
          data={{ content: [] }}
        />
      </Workspace>,
    );

    // 标题渲染
    expect(screen.getByText('开发工作空间')).toBeInTheDocument();

    // 默认第一个 Tab：应能看到实时跟随的标题内容
    expect(screen.getByText('深度思考')).toBeInTheDocument();

    // 关闭按钮
    const closeBtn = screen.getByLabelText('关闭工作空间');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('在受控模式下切换 tab 应触发 onTabChange，并展示对应内容', () => {
    const onTabChange = vi.fn();

    const { rerender } = render(
      <Workspace title="开发工作空间" activeTabKey="realtime" onTabChange={onTabChange}>
        <Workspace.Realtime
          tab={{ key: 'realtime', title: '实时跟随' }}
          data={{ type: 'md', content: 'Hello', title: '深度思考' } as any}
        />
        <Workspace.Task
          tab={{ key: 'tasks', title: '任务' }}
          data={{ content: [] }}
        />
      </Workspace>,
    );

    // 初始为 realtime
    expect(screen.getByText('深度思考')).toBeInTheDocument();

    // 点击 Segmented 切换到 任务
    const taskTab = screen.getByText('任务');
    fireEvent.click(taskTab);
    expect(onTabChange).toHaveBeenCalledWith('tasks');

    // 外部受控切换
    rerender(
      <Workspace title="开发工作空间" activeTabKey="tasks" onTabChange={onTabChange}>
        <Workspace.Realtime
          tab={{ key: 'realtime', title: '实时跟随' }}
          data={{ type: 'md', content: 'Hello', title: '深度思考' } as any}
        />
        <Workspace.Task
          tab={{ key: 'tasks', title: '任务' }}
          data={{ content: [] }}
        />
      </Workspace>,
    );

    // 切换后，不再展示实时跟随标题
    expect(screen.queryByText('深度思考')).not.toBeInTheDocument();
  });
}); 
