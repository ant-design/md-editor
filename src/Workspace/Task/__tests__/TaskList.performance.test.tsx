import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TaskList, type TaskItem } from '../index';

const loadingEffect = vi.hoisted(() => vi.fn());
vi.mock('../../../Components/effects', () => ({
  LoadingEffect: () => {
    loadingEffect();
    return <span data-testid="loading-effect" />;
  },
}));

afterEach(() => {
  cleanup();
  loadingEffect.mockClear();
});

describe('TaskList rendering', () => {
  it('does not restart an unchanged loading row when another task advances', () => {
    const loadingTask: TaskItem = {
      key: 'first',
      title: 'Downloading',
      status: 'loading',
    };
    const nextTask: TaskItem = {
      key: 'next',
      title: 'Processing',
      status: 'pending',
    };
    const { rerender } = render(
      <TaskList data={{ items: [loadingTask, nextTask] }} />,
    );
    expect(loadingEffect).toHaveBeenCalledTimes(1);
    loadingEffect.mockClear();
    rerender(
      <TaskList
        data={{ items: [loadingTask, { ...nextTask, status: 'success' }] }}
      />,
    );
    expect(
      screen.getByText('Processing').closest('[class*="-item"]'),
    ).toHaveClass('ant-agentic-workspace-task-item-success');
    expect(loadingEffect).not.toHaveBeenCalled();
  });

  it('uses the latest callback and task content for keyboard activation', () => {
    const firstClick = vi.fn();
    const nextClick = vi.fn();
    const task: TaskItem = {
      key: 'task',
      title: 'Pending task',
      status: 'pending',
    };
    const { rerender } = render(
      <TaskList data={{ items: [task] }} onItemClick={firstClick} />,
    );
    const updated: TaskItem = {
      ...task,
      title: 'Completed task',
      status: 'success',
    };
    rerender(<TaskList data={{ items: [updated] }} onItemClick={nextClick} />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Completed task' }), {
      key: 'Enter',
    });
    expect(firstClick).not.toHaveBeenCalled();
    expect(nextClick).toHaveBeenCalledWith(updated);
  });
});
