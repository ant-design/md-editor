import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatBootDemo from '../../docs/demos/ChatBootPage';
import ChatFlowDemo from '../../docs/demos/ChatFlowContainer';
import FooterHeightDemo from '../../docs/demos/ChatFlowContainer/footer-height';
import ChatInputDemo from '../../docs/demos/ChatFlowContainer/with-input';
import ChatNoFooterDemo from '../../docs/demos/ChatFlowContainer/without-footer';

const { scrollToBottom, historyRequest } = vi.hoisted(() => ({
  scrollToBottom: vi.fn(),
  historyRequest: vi.fn(),
}));

vi.mock('@ant-design/agentic-ui', () => {
  const ChatLayout = React.forwardRef(
    (
      {
        children,
        footer,
        styles,
      }: {
        children?: React.ReactNode;
        footer?: React.ReactNode;
        styles?: { scrollable?: React.CSSProperties };
      },
      ref,
    ) => {
      React.useImperativeHandle(ref, () => ({ scrollToBottom }));
      return (
        <div data-testid="chat-scrollable" style={styles?.scrollable}>
          {children}
          {footer}
        </div>
      );
    },
  );
  const BackTo = { Top: () => null, Bottom: () => null };
  return {
    ChatLayout,
    BackTo,
    History: ({
      request,
    }: {
      request: (params: { agentId: string }) => Promise<unknown>;
    }) => {
      React.useEffect(() => {
        historyRequest();
        void request({ agentId: 'test-agent' });
      }, [request]);
      return null;
    },
    BubbleList: ({
      bubbleList,
    }: {
      bubbleList: { id: string; content: string; role: string }[];
    }) => (
      <div data-testid="messages">
        {bubbleList.map((message) => (
          <div key={message.id} data-role={message.role}>
            {message.content}
          </div>
        ))}
      </div>
    ),
    MarkdownInputField: ({
      onSend,
      typing,
    }: {
      onSend: (text: string) => Promise<void>;
      typing?: boolean;
    }) => (
      <button
        type="button"
        data-typing={String(typing)}
        onClick={() => void onSend('用户输入')}
      >
        发送输入
      </button>
    ),
    TaskRunning: ({ onReplay }: { onReplay: () => void }) => (
      <button type="button" onClick={onReplay}>
        重播
      </button>
    ),
    TASK_RUNNING_STATUS: { COMPLETE: 'complete' },
    TASK_STATUS: { SUCCESS: 'success' },
    ButtonTabGroup: () => null,
    Title: () => null,
    CaseReply: ({
      description,
      onClick,
    }: {
      description: string;
      onClick: () => void;
    }) => (
      <button
        type="button"
        onClick={() => {
          onClick();
          onClick();
        }}
      >
        {description}
      </button>
    ),
  };
});

vi.mock('antd', () => ({
  Flex: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Button: ({
    children,
    onClick,
  }: {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  Input: {
    TextArea: ({
      value,
      onChange,
    }: {
      value: string;
      onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    }) => <textarea value={value} onChange={onChange} aria-label="消息" />,
  },
}));

beforeEach(() => {
  vi.useFakeTimers();
  scrollToBottom.mockClear();
  historyRequest.mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const messageCount = () => screen.getByTestId('messages').children.length;

describe('对话演示生命周期', () => {
  it.each([
    ['完整布局', ChatFlowDemo],
    ['带输入框', ChatInputDemo],
    ['无底部背景', ChatNoFooterDemo],
  ])('%s 首屏显示完整消息，不自动启动重播', (_, Demo) => {
    render(<Demo />);
    expect(messageCount()).toBe(8);
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(15000));
    expect(messageCount()).toBe(8);
  });

  it('重播互斥，并在卸载时取消后续消息', () => {
    const { unmount } = render(<ChatFlowDemo />);
    fireEvent.click(screen.getByRole('button', { name: '重播' }));
    expect(messageCount()).toBe(2);
    act(() => vi.advanceTimersByTime(2000));
    expect(messageCount()).toBe(3);
    fireEvent.click(screen.getByRole('button', { name: '重播' }));
    expect(messageCount()).toBe(3);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('带输入框演示会实际追加输入的消息', async () => {
    render(<ChatInputDemo />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '发送输入' }));
    });
    expect(messageCount()).toBe(9);
    expect(screen.getByTestId('messages').lastElementChild?.textContent).toBe(
      '用户输入',
    );
    expect(historyRequest).toHaveBeenCalledTimes(1);
  });

  it('推荐卡的重复点击只产生一次回复，等待期间忽略新的发送', async () => {
    render(<ChatBootDemo />);
    fireEvent.click(
      screen.getByRole('button', {
        name: '恒生科技指数基金近有什么相关新闻',
      }),
    );
    expect(messageCount()).toBe(1);
    const send = screen.getByRole('button', { name: '发送输入' });
    expect(send.dataset.typing).toBe('true');
    await act(async () => fireEvent.click(send));
    expect(messageCount()).toBe(1);
    act(() => vi.advanceTimersByTime(800));
    expect(messageCount()).toBe(2);
    expect(send.dataset.typing).toBe('false');
    await act(async () => fireEvent.click(send));
    expect(messageCount()).toBe(3);
    expect(historyRequest).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('欢迎页独立滚动，发送后恢复对话的自动滚动区域', async () => {
    const { container } = render(<ChatBootDemo />);
    const welcome = container.querySelector<HTMLElement>(
      '.chat-boot-demo__welcome',
    );
    expect(welcome?.style.height).toBe('100%');
    expect(welcome?.style.overflowY).toBe('auto');
    expect(screen.getByTestId('chat-scrollable').style.overflowY).toBe(
      'hidden',
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '发送输入' }));
    });
    expect(container.querySelector('.chat-boot-demo__welcome')).toBeNull();
    expect(screen.getByTestId('chat-scrollable').style.overflowY).toBe('');
  });

  it('离开欢迎页会取消尚未到达的推荐回复', () => {
    const { unmount } = render(<ChatBootDemo />);
    fireEvent.click(
      screen.getByRole('button', {
        name: '恒生科技指数基金近有什么相关新闻',
      }),
    );
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('发送多行消息后滚动，无额外延时任务', () => {
    render(<FooterHeightDemo />);
    fireEvent.change(screen.getByRole('textbox', { name: '消息' }), {
      target: { value: '新的消息' },
    });
    fireEvent.click(screen.getByRole('button', { name: '发送', exact: true }));
    expect(messageCount()).toBe(7);
    expect(scrollToBottom).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
