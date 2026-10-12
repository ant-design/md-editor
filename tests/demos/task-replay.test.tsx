import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SimpleTaskDemo from '../../docs/demos/task-list-simple';
import AdvancedToolDemo from '../../docs/demos/tool-use-bar-advanced';

interface ToolProps {
  activeKeys?: string[];
  onActiveKeysChange?: (keys: string[]) => void;
  tools: { id: string; status?: string; progress?: number }[];
}

interface TaskProps {
  items: { key: string; status?: string; content?: React.ReactNode[] }[];
}

const demoState = vi.hoisted(() => ({
  tasks: undefined as TaskProps | undefined,
  tools: undefined as ToolProps | undefined,
}));

vi.mock('@ant-design/agentic-ui', () => ({
  TaskList: (props: TaskProps) => {
    demoState.tasks = props;
    return (
      <div data-testid="task-list">
        {props.items.map((item) => (
          <section key={item.key}>{item.content}</section>
        ))}
      </div>
    );
  },
  ToolUseBar: (props: ToolProps) => {
    demoState.tools = props;
    return (
      <div>
        <span data-testid="active-keys">{props.activeKeys?.join(',')}</span>
        <button onClick={() => props.onActiveKeysChange?.(['1'])}>
          激活第一个工具
        </button>
      </div>
    );
  },
}));

vi.mock('antd', () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
}));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  demoState.tasks = undefined;
  demoState.tools = undefined;
});

describe('task replay demos', () => {
  it('简单任务首屏完整，无空闲计时器，工具激活状态立即同步', () => {
    vi.useFakeTimers();
    render(<SimpleTaskDemo />);
    expect(demoState.tasks?.items).toHaveLength(4);
    expect(
      demoState.tasks?.items.every((item) => item.status === 'success'),
    ).toBe(true);
    expect(vi.getTimerCount()).toBe(0);

    fireEvent.click(screen.getByRole('button', { name: '激活第一个工具' }));
    expect(screen.getByTestId('active-keys')).toHaveTextContent('1');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('简单任务按需重播后完成停表，步进不覆盖工具激活状态', () => {
    vi.useFakeTimers();
    render(
      <React.StrictMode>
        <SimpleTaskDemo />
      </React.StrictMode>,
    );
    fireEvent.click(screen.getByRole('button', { name: '重新播放' }));
    expect(demoState.tasks?.items).toHaveLength(1);
    expect(screen.getByRole('button', { name: '执行中' })).toBeDisabled();
    act(() => vi.advanceTimersByTime(3000));
    fireEvent.click(screen.getByRole('button', { name: '激活第一个工具' }));
    expect(screen.getByTestId('active-keys')).toHaveTextContent('1');

    for (let step = 3; step <= 5; step += 1) {
      act(() => vi.advanceTimersByTime(3000));
      expect(screen.getByTestId('active-keys')).toHaveTextContent('1');
    }

    expect(demoState.tasks?.items).toHaveLength(4);
    expect(
      demoState.tasks?.items.every((item) => item.status === 'success'),
    ).toBe(true);
    expect(screen.getByRole('button', { name: '重新播放' })).toBeEnabled();
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(60000));
    expect(demoState.tasks?.items).toHaveLength(4);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('简单任务重播时卸载会取消步进', () => {
    vi.useFakeTimers();
    const { unmount } = render(<SimpleTaskDemo />);
    fireEvent.click(screen.getByRole('button', { name: '重新播放' }));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('高级工具可启动、完成、重播，卸载时取消进度更新', () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <React.StrictMode>
        <AdvancedToolDemo />
      </React.StrictMode>,
    );
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: '开始执行' }));
    expect(demoState.tools?.tools[0]).toMatchObject({
      status: 'loading',
      progress: 0,
    });
    expect(screen.getByRole('button', { name: '执行中' })).toBeDisabled();
    act(() => vi.advanceTimersByTime(100));
    expect(demoState.tools?.tools[0].progress).toBe(2);
    act(() => vi.advanceTimersByTime(4900));
    expect(demoState.tools?.tools[0]).toMatchObject({
      status: 'success',
      progress: 100,
    });
    expect(vi.getTimerCount()).toBe(0);

    fireEvent.click(screen.getByRole('button', { name: '重新播放' }));
    expect(demoState.tools?.tools[0]).toMatchObject({
      status: 'loading',
      progress: 0,
    });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
