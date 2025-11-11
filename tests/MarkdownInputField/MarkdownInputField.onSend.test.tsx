/**
 * MarkdownInputField onSend 防重复触发测试
 */

import { MarkdownInputField } from '@ant-design/agentic-ui';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('MarkdownInputField - onSend 防重复触发', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该防止快速连续点击触发多次 onSend', async () => {
    const onSend = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 100); // 模拟异步操作
        }),
    );

    const { container } = render(
      <MarkdownInputField value="test content" onSend={onSend} />,
    );

    const sendButton = container.querySelector('[data-testid="send-button"]');
    expect(sendButton).toBeInTheDocument();

    // 快速连续点击 3 次
    if (sendButton) {
      fireEvent.click(sendButton);
      fireEvent.click(sendButton);
      fireEvent.click(sendButton);
    }

    // 等待异步操作完成
    await waitFor(
      () => {
        expect(onSend).toHaveBeenCalledTimes(1);
      },
      { timeout: 500 },
    );
  });

  it('应该防止键盘快捷键和点击同时触发', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    const { container } = render(
      <MarkdownInputField
        value="test content"
        onSend={onSend}
        triggerSendKey="Enter"
      />,
    );

    const editorContainer = container.querySelector(
      '.ant-agentic-md-input-field',
    );

    if (editorContainer) {
      // 模拟按下 Enter 键
      fireEvent.keyDown(editorContainer, { key: 'Enter' });

      // 立即点击发送按钮
      const sendButton = container.querySelector('[data-testid="send-button"]');
      if (sendButton) {
        fireEvent.click(sendButton);
      }
    }

    await waitFor(
      () => {
        // 应该只触发一次
        expect(onSend).toHaveBeenCalledTimes(1);
      },
      { timeout: 300 },
    );
  });

  it('应该防止在 loading 状态下再次触发', async () => {
    let resolveOnSend: any;
    const onSend = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveOnSend = resolve;
        }),
    );

    const { container } = render(
      <MarkdownInputField value="test content" onSend={onSend} />,
    );

    const sendButton = container.querySelector('[data-testid="send-button"]');

    if (sendButton) {
      // 第一次点击
      fireEvent.click(sendButton);

      // 立即再次点击（此时第一次操作还未完成）
      fireEvent.click(sendButton);
      fireEvent.click(sendButton);
    }

    // 等待一小段时间
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 应该只触发一次
    expect(onSend).toHaveBeenCalledTimes(1);

    // 完成第一次操作
    if (resolveOnSend) {
      resolveOnSend();
    }
  });

  it('应该在 typing 状态下阻止发送', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);

    const { container } = render(
      <MarkdownInputField value="test content" onSend={onSend} typing={true} />,
    );

    const sendButton = container.querySelector('[data-testid="send-button"]');

    if (sendButton) {
      fireEvent.click(sendButton);
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    // typing 状态下不应该触发
    expect(onSend).not.toHaveBeenCalled();
  });

  it('应该在 disabled 状态下阻止发送', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);

    const { container } = render(
      <MarkdownInputField
        value="test content"
        onSend={onSend}
        disabled={true}
      />,
    );

    const sendButton = container.querySelector('[data-testid="send-button"]');

    if (sendButton) {
      fireEvent.click(sendButton);
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    // disabled 状态下不应该触发
    expect(onSend).not.toHaveBeenCalled();
  });

  it('应该在第一次发送完成后允许第二次发送', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);

    const { container, rerender } = render(
      <MarkdownInputField value="first message" onSend={onSend} />,
    );

    const sendButton = container.querySelector('[data-testid="send-button"]');

    if (sendButton) {
      // 第一次发送
      fireEvent.click(sendButton);
    }

    // 等待第一次发送完成
    await waitFor(
      () => {
        expect(onSend).toHaveBeenCalledTimes(1);
      },
      { timeout: 300 },
    );

    // 重新渲染，模拟新的消息
    rerender(<MarkdownInputField value="second message" onSend={onSend} />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (sendButton) {
      // 第二次发送
      fireEvent.click(sendButton);
    }

    // 等待第二次发送
    await waitFor(
      () => {
        expect(onSend).toHaveBeenCalledTimes(2);
      },
      { timeout: 300 },
    );
  });
});
