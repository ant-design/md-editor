import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownInputField } from '../MarkdownInputField';
import { CreateRecognizer } from '../VoiceInput';

describe('MarkdownInputField - toolsRender', () => {
  it('should render custom tools when toolsRender is provided', () => {
    const toolsRender = () => [
      <button key="custom-tool-1" data-testid="custom-tool-1" type="button">
        Tool 1
      </button>,
      <button key="custom-tool-2" data-testid="custom-tool-2" type="button">
        Tool 2
      </button>,
    ];

    render(<MarkdownInputField toolsRender={toolsRender} />);

    expect(screen.getByTestId('custom-tool-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-tool-2')).toBeInTheDocument();
  });

  it('should pass correct props to toolsRender function', () => {
    const toolsRender = vi.fn().mockReturnValue([
      <button key="custom-tool" type="button">
        Tool
      </button>,
    ]);

    render(
      <MarkdownInputField value="test content" toolsRender={toolsRender} />,
    );

    // 验证传递给 toolsRender 的参数
    expect(toolsRender).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'test content',
        isHover: false,
        isLoading: false,
        fileUploadStatus: 'done',
      }),
    );
  });

  it('should update tools when component state changes', async () => {
    const toolsRender = vi.fn().mockImplementation(({ isHover }) => [
      <button key="custom-tool" data-testid="custom-tool" type="button">
        {isHover ? 'Hovered' : 'Not Hovered'}
      </button>,
    ]);

    const { container } = render(
      <MarkdownInputField toolsRender={toolsRender} />,
    );

    // 触发 hover 事件
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    // 验证 toolsRender 被调用，且传入了更新后的 isHover 状态
    expect(toolsRender).toHaveBeenCalledWith(
      expect.objectContaining({
        isHover: true,
      }),
    );
  });

  it('should handle tool click events', () => {
    const onToolClick = vi.fn();
    const toolsRender = () => [
      <button
        key="custom-tool"
        data-testid="custom-tool"
        onClick={onToolClick}
        type="button"
      >
        Tool
      </button>,
    ];

    render(<MarkdownInputField toolsRender={toolsRender} />);

    const toolButton = screen.getByTestId('custom-tool');
    fireEvent.click(toolButton);

    expect(onToolClick).toHaveBeenCalled();
  });

  it('should render tools with correct styles', () => {
    const toolsRender = () => [
      <button key="custom-tool" data-testid="custom-tool" type="button">
        Tool
      </button>,
    ];

    render(<MarkdownInputField toolsRender={toolsRender} />);

    const toolsContainer = screen
      .getByTestId('custom-tool')
      .closest('.ant-md-input-field-send-tools');
    expect(toolsContainer).toHaveClass('ant-md-input-field-send-tools');
  });

  it('should not interfere with send button functionality', () => {
    const onSend = vi.fn();
    const toolsRender = () => [
      <button key="custom-tool" data-testid="custom-tool" type="button">
        Tool
      </button>,
    ];

    render(
      <MarkdownInputField
        toolsRender={toolsRender}
        onSend={onSend}
        value="test message"
      />,
    );

    // 模拟发送消息
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);

    expect(onSend).toHaveBeenCalledWith('test message');
  });

  it('should handle disabled state correctly', () => {
    const toolsRender = () => [
      <button key="custom-tool" data-testid="custom-tool" type="button">
        Tool
      </button>,
    ];

    render(<MarkdownInputField toolsRender={toolsRender} disabled={true} />);

    const wrapper = screen
      .getByTestId('custom-tool')
      .closest('.ant-md-input-field');
    expect(wrapper).toHaveClass('ant-md-input-field-disabled');
  });
});

describe('MarkdownInputField - voiceInput', () => {
  it('should render voice input button when enabled', () => {
    const createRecognizer = vi.fn().mockResolvedValue({
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn().mockResolvedValue(undefined),
    });

    render(<MarkdownInputField voiceRecognizer={createRecognizer} />);

    expect(screen.getByTestId('voice-input-button')).toBeInTheDocument();
  });

  it('should start recording on first click and stop on second click', async () => {
    const start = vi.fn().mockResolvedValue(undefined);
    const stop = vi.fn().mockResolvedValue(undefined);
    const createRecognizer = vi.fn().mockResolvedValue({ start, stop });

    render(<MarkdownInputField voiceRecognizer={createRecognizer} />);

    const voiceBtn = screen.getByTestId('voice-input-button');

    // first click -> start
    fireEvent.click(voiceBtn);
    expect(createRecognizer).toHaveBeenCalled();
    await vi.waitFor(() => {
      expect(start).toHaveBeenCalled();
    });

    // should enter recording state (aria-pressed true or recording class)
    await vi.waitFor(() => {
      expect(voiceBtn).toHaveAttribute('aria-pressed', 'true');
    });

    // second click -> stop
    fireEvent.click(voiceBtn);
    await vi.waitFor(() => {
      expect(stop).toHaveBeenCalled();
    });
  });

  it('should not respond when disabled', async () => {
    const start = vi.fn().mockResolvedValue(undefined);
    const stop = vi.fn().mockResolvedValue(undefined);
    const createRecognizer = vi.fn().mockResolvedValue({ start, stop });

    render(<MarkdownInputField disabled voiceRecognizer={createRecognizer} />);

    const voiceBtn = screen.getByTestId('voice-input-button');
    // disabled class applied
    expect(
      voiceBtn.className.includes('ant-md-input-field-voice-button-disabled'),
    ).toBeTruthy();

    fireEvent.click(voiceBtn);
    await vi.waitFor(() => {
      expect(start).not.toHaveBeenCalled();
      expect(stop).not.toHaveBeenCalled();
    });
  });

  it('should append partial text from recognizer and trigger onChange', async () => {
    let handlersRef: Parameters<CreateRecognizer>[0] | undefined;
    const start = vi.fn().mockResolvedValue(undefined);
    const stop = vi.fn().mockResolvedValue(undefined);
    const createRecognizer = vi.fn().mockImplementation(async (handlers) => {
      handlersRef = handlers;
      return { start, stop };
    });

    const handleChange = vi.fn();

    render(
      <MarkdownInputField
        value=""
        onChange={handleChange}
        voiceRecognizer={createRecognizer}
      />,
    );

    const voiceBtn = screen.getByTestId('voice-input-button');

    // start recording to initialize handlers
    fireEvent.click(voiceBtn);
    await vi.waitFor(() => {
      expect(start).toHaveBeenCalled();
    });

    // simulate partial text
    handlersRef?.onPartial('hello ');
    await vi.waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('hello ', expect.anything());
    });

    // another partial should append
    handlersRef?.onPartial('world');
    await vi.waitFor(() => {
      expect(handleChange).toHaveBeenLastCalledWith(
        'helloworld',
        expect.anything(),
      );
    });
  });

  it('should stop recording before sending when clicking send during recording', async () => {
    const events: string[] = [];
    const start = vi.fn().mockImplementation(async () => {
      events.push('start');
    });
    const stop = vi.fn().mockImplementation(async () => {
      events.push('stop');
    });

    let handlersRef: any;
    const createRecognizer = vi.fn().mockImplementation(async (handlers) => {
      handlersRef = handlers;
      return { start, stop };
    });

    const handleSend = vi.fn().mockImplementation(async () => {
      events.push('send');
    });

    const handleChange = vi.fn();

    render(
      <MarkdownInputField
        value=""
        onChange={handleChange}
        voiceRecognizer={createRecognizer}
        onSend={handleSend}
      />,
    );

    // start recording
    fireEvent.click(screen.getByTestId('voice-input-button'));
    await vi.waitFor(() => {
      expect(start).toHaveBeenCalled();
    });

    // inject some partial text so there is content to send
    handlersRef?.onPartial('msg');
    await vi.waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('msg', expect.anything());
    });

    // click send
    const sendButton = screen.getByTestId('send-button');
    fireEvent.click(sendButton);

    await vi.waitFor(() => {
      expect(stop).toHaveBeenCalled();
      expect(handleSend).toHaveBeenCalledWith('msg');
    });

    // ensure order: stop before send
    expect(events.indexOf('stop')).toBeLessThan(events.indexOf('send'));
  });

  it('should handle recognizer error and reset recording state', async () => {
    let handlersRef: Parameters<CreateRecognizer>[0] | undefined;
    const start = vi.fn().mockResolvedValue(undefined);
    const stop = vi.fn().mockResolvedValue(undefined);
    const createRecognizer = vi.fn().mockImplementation(async (handlers) => {
      handlersRef = handlers;
      return { start, stop };
    });

    render(<MarkdownInputField voiceRecognizer={createRecognizer} />);

    const voiceBtn = screen.getByTestId('voice-input-button');

    // start recording
    fireEvent.click(voiceBtn);
    await vi.waitFor(() => {
      expect(start).toHaveBeenCalled();
    });
    await vi.waitFor(() => {
      expect(voiceBtn).toHaveAttribute('aria-pressed', 'true');
    });

    // trigger recognizer error callback
    handlersRef?.onError?.(new Error('test error'));

    // recording should be reset
    await vi.waitFor(() => {
      expect(voiceBtn).toHaveAttribute('aria-pressed', 'false');
    });

    // can start again (pending/reset/refs cleared)
    fireEvent.click(voiceBtn);
    await vi.waitFor(() => {
      expect(createRecognizer).toHaveBeenCalledTimes(2);
      expect(start).toHaveBeenCalledTimes(2);
    });
  });

  it('should recover when recognizer creation fails (catch branch)', async () => {
    const start = vi.fn().mockResolvedValue(undefined);
    const stop = vi.fn().mockResolvedValue(undefined);
    const createRecognizer = vi
      .fn()
      .mockRejectedValueOnce(new Error('init fail'))
      .mockResolvedValue({ start, stop });

    render(<MarkdownInputField voiceRecognizer={createRecognizer} />);

    const voiceBtn = screen.getByTestId('voice-input-button');

    // first click -> creation fails, should not enter recording
    fireEvent.click(voiceBtn);
    await vi.waitFor(() => {
      expect(createRecognizer).toHaveBeenCalledTimes(1);
    });
    expect(voiceBtn).toHaveAttribute('aria-pressed', 'false');

    // second click -> creation succeeds, start is called
    fireEvent.click(voiceBtn);
    await vi.waitFor(() => {
      expect(createRecognizer).toHaveBeenCalledTimes(2);
      expect(start).toHaveBeenCalledTimes(1);
      expect(voiceBtn).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
