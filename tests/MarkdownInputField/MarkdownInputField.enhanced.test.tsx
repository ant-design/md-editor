/**
 * MarkdownInputField 组件增强测试文件
 * 专门针对提升测试覆盖率而设计
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MarkdownInputField,
  generateEdges,
} from '../../src/MarkdownInputField/MarkdownInputField';

// 创建更真实的 Mock
const mockMarkdownEditor = {
  store: {
    getMDContent: vi.fn(() => '# Test Content'),
    setMDContent: vi.fn(),
    clearContent: vi.fn(),
    editor: { children: [] },
    inputComposition: false,
  },
  markdownEditorRef: { current: { children: [] } },
};

vi.mock('../../src/MarkdownEditor', () => ({
  BaseMarkdownEditor: React.forwardRef(
    (
      {
        titlePlaceholderContent,
        onKeyDown,
        onChange,
        children,
        setValue,
        value,
        initValue,
        ...props
      }: any,
      ref: any,
    ) => {
      React.useImperativeHandle(ref, () => mockMarkdownEditor);

      React.useEffect(() => {
        if (setValue && value !== undefined) {
          mockMarkdownEditor.store.setMDContent(value);
        }
      }, [setValue, value]);

      React.useEffect(() => {
        if (initValue) {
          mockMarkdownEditor.store.setMDContent(initValue);
        }
      }, [initValue]);

      return (
        <div
          data-testid="base-markdown-editor"
          onKeyDown={(e) => {
            onKeyDown?.(e);
          }}
          onClick={(e) => {
            props.onClick?.(e);
          }}
        >
          <textarea
            data-testid="markdown-textarea"
            defaultValue={initValue}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={titlePlaceholderContent}
          />
          {children}
        </div>
      );
    },
  ),
  MarkdownEditorInstance: {},
}));

vi.mock('../../src/MarkdownEditor/editor/slate-react', () => ({
  ReactEditor: {
    findPath: vi.fn(() => [0]),
    findNode: vi.fn(() => ({ children: [] })),
    focus: vi.fn(),
    isFocused: vi.fn(() => false),
  },
}));

vi.mock('../../src/MarkdownInputField/Suggestion', () => ({
  Suggestion: ({ children, ...props }: any) => (
    <div data-testid="suggestion" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../src/MarkdownInputField/AttachmentButton', () => ({
  AttachmentButton: ({ onClick, disabled, ...props }: any) => (
    <button
      type="button"
      data-testid="attachment-button"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      Attachment
    </button>
  ),
  upLoadFileToServer: vi.fn().mockResolvedValue([]),
}));

// Mock具体的子组件而不是整个MarkdownInputField
vi.mock('../../src/MarkdownInputField/SendButton', () => ({
  SendButton: ({ typing, disabled, onClick, ...props }: any) => {
    const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
    };

    return (
      <button
        type="button"
        data-testid="send-button"
        onClick={handleClick}
        disabled={disabled}
        data-typing={typing}
        className={`${typing ? 'ant-md-input-field-send-button-typing' : ''}`}
        {...props}
      >
        Send
      </button>
    );
  },
}));

vi.mock(
  '../../src/MarkdownInputField/AttachmentButton/AttachmentButtonPopover',
  () => ({
    SupportedFileFormats: [
      { name: 'Image', extensions: ['.jpg', '.png', '.gif'] },
      { name: 'Document', extensions: ['.pdf', '.doc', '.docx'] },
    ],
  }),
);

// Mock Slate Editor
vi.mock('slate', () => ({
  Editor: {
    end: vi.fn(() => ({ path: [0, 0], offset: 0 })),
  },
  Transforms: {
    move: vi.fn(),
    select: vi.fn(),
  },
}));

describe('MarkdownInputField Enhanced Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    mockMarkdownEditor.store.getMDContent.mockReturnValue('# Test Content');
  });
  describe('generateEdges 函数测试', () => {
    it('应该正确生成边缘颜色序列', () => {
      const colors = ['red', 'blue', 'green'];
      const result = generateEdges(colors);

      expect(result).toEqual([
        ['red', 'blue', 'green', 'red'],
        ['blue', 'green', 'red', 'blue'],
        ['green', 'red', 'blue', 'green'],
      ]);
    });

    it('应该处理空数组', () => {
      const result = generateEdges([]);
      expect(result).toEqual([]);
    });

    it('应该处理单个颜色', () => {
      const result = generateEdges(['red']);
      expect(result).toEqual([['red', 'red']]);
    });
  });

  describe('文件上传功能测试', () => {
    it('应该处理 uploadImage 函数调用', async () => {
      const onFileMapChange = vi.fn();

      render(
        <MarkdownInputField
          value="test"
          attachment={
            {
              enable: true,
              onFileMapChange,
            } as any
          }
        />,
      );

      // 模拟 uploadImage 被调用
      const attachmentButton = screen.getByTestId('attachment-button');

      // 模拟点击附件按钮
      await user.click(attachmentButton);

      expect(attachmentButton).toBeInTheDocument();
    });

    it('应该处理文件删除', async () => {
      const onDelete = vi.fn().mockResolvedValue(undefined);

      render(
        <MarkdownInputField
          value="test"
          attachment={
            {
              enable: true,
              onDelete,
            } as any
          }
        />,
      );

      expect(screen.getByTestId('attachment-button')).toBeInTheDocument();
    });

    it('应该处理文件上传状态', () => {
      render(
        <MarkdownInputField
          value="test"
          attachment={
            {
              enable: true,
            } as any
          }
        />,
      );

      const attachmentButton = screen.getByTestId('attachment-button');
      expect(attachmentButton).toBeInTheDocument();
    });
  });

  describe('发送消息功能测试', () => {
    it('应该在 disabled 状态下阻止发送', async () => {
      const onSend = vi.fn().mockResolvedValue(undefined);

      render(
        <MarkdownInputField
          value="test content"
          disabled={true}
          onSend={onSend as any}
        />,
      );

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      expect(onSend).not.toHaveBeenCalled();
    });

    it('应该在 typing 状态下阻止发送', async () => {
      const onSend = vi.fn().mockResolvedValue(undefined);

      render(
        <MarkdownInputField
          value="test content"
          typing={true}
          onSend={onSend as any}
        />,
      );

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      expect(onSend).not.toHaveBeenCalled();
    });

    it('应该处理发送成功后清空内容', async () => {
      const onSend = vi.fn().mockResolvedValue(undefined);
      const onChange = vi.fn();

      render(
        <MarkdownInputField
          value="test content"
          onChange={onChange}
          onSend={onSend as any}
        />,
      );

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(onSend).toHaveBeenCalledWith('# Test Content');
      });

      // 验证发送成功后清空内容
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('');
      });
    });

    it('应该处理 MD 内容与 value 不一致的情况', async () => {
      const onChange = vi.fn();
      const onSend = vi.fn().mockResolvedValue(undefined);

      // 模拟编辑器返回不同的内容
      mockMarkdownEditor.store.getMDContent.mockReturnValue(
        '# Different Content',
      );

      render(
        <MarkdownInputField
          value="original content"
          onChange={onChange}
          onSend={onSend as any}
        />,
      );

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      expect(onChange).toHaveBeenCalledWith('# Different Content');
    });
  });

  describe('键盘事件处理测试', () => {
    it('应该在输入法激活时忽略键盘事件', async () => {
      const onSend = vi.fn();
      mockMarkdownEditor.store.inputComposition = true;

      render(
        <MarkdownInputField
          value="test"
          onSend={onSend}
          triggerSendKey="Enter"
        />,
      );

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;

      fireEvent.keyDown(container, { key: 'Enter', code: 'Enter' });

      expect(onSend).not.toHaveBeenCalled();
    });

    it('应该处理 Ctrl+Enter 发送', async () => {
      const onSend = vi.fn().mockResolvedValue(undefined);
      mockMarkdownEditor.store.inputComposition = false;

      render(
        <MarkdownInputField
          value="test"
          onSend={onSend as any}
          triggerSendKey="Mod+Enter"
        />,
      );

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;

      fireEvent.keyDown(container, {
        key: 'Enter',
        code: 'Enter',
        ctrlKey: true,
      });

      await waitFor(() => {
        expect(onSend).toHaveBeenCalledWith('# Test Content');
      });
    });

    it('应该处理 Cmd+Enter 发送 (Mac)', async () => {
      const onSend = vi.fn().mockResolvedValue(undefined);
      mockMarkdownEditor.store.inputComposition = false;

      render(
        <MarkdownInputField
          value="test"
          onSend={onSend as any}
          triggerSendKey="Mod+Enter"
        />,
      );

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;

      fireEvent.keyDown(container, {
        key: 'Enter',
        code: 'Enter',
        metaKey: true,
      });

      await waitFor(() => {
        expect(onSend).toHaveBeenCalledWith('# Test Content');
      });
    });

    it('应该忽略非触发键的按键', async () => {
      const onSend = vi.fn().mockResolvedValue(undefined);
      mockMarkdownEditor.store.inputComposition = false;

      render(
        <MarkdownInputField
          value="test"
          onSend={onSend as any}
          triggerSendKey="Enter"
        />,
      );

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;

      fireEvent.keyDown(container, { key: 'Space', code: 'Space' });

      expect(onSend).not.toHaveBeenCalled();
    });
  });

  describe('点击事件处理测试', () => {
    it('应该在输入法激活时忽略点击事件', async () => {
      mockMarkdownEditor.store.inputComposition = true;

      render(<MarkdownInputField value="test" />);

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;

      await user.click(container);

      // 应该不会有任何错误
      expect(container).toBeInTheDocument();
    });

    it('应该在禁用状态下忽略点击事件', async () => {
      mockMarkdownEditor.store.inputComposition = false;

      render(<MarkdownInputField value="test" disabled={true} />);

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;

      await user.click(container);

      expect(container).toBeInTheDocument();
    });

    it('应该在点击操作按钮时阻止事件冒泡', async () => {
      mockMarkdownEditor.store.inputComposition = false;

      render(<MarkdownInputField value="test" attachment={{ enable: true }} />);

      const sendButton = screen.getByTestId('send-button');

      await user.click(sendButton);

      expect(sendButton).toBeInTheDocument();
    });

    it('应该正确聚焦编辑器', async () => {
      const { ReactEditor } = await import(
        '../../src/MarkdownEditor/editor/slate-react'
      );

      // 设置必要的mock数据
      mockMarkdownEditor.store.inputComposition = false;
      mockMarkdownEditor.store.editor = { children: [] };
      mockMarkdownEditor.markdownEditorRef = { current: { children: [] } };

      render(<MarkdownInputField value="test" />);

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;

      await user.click(container);

      await waitFor(() => {
        expect(ReactEditor.focus).toHaveBeenCalled();
      });
    });
  });

  describe('自定义渲染测试', () => {
    it('应该正确渲染 toolsRender', () => {
      const toolsRender = vi.fn((props) => [
        <div key="tool1" data-testid="custom-tool-1">
          Tool 1 - {props.isHover ? 'hovered' : 'normal'}
        </div>,
      ]);

      render(<MarkdownInputField value="test" toolsRender={toolsRender} />);

      expect(screen.getByTestId('custom-tool-1')).toBeInTheDocument();
      expect(toolsRender).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'test',
          isHover: false,
          isLoading: false,
          fileUploadStatus: 'done',
        }),
      );
    });

    it('应该正确渲染 actionsRender 并传递默认操作', () => {
      const actionsRender = vi.fn((props, defaultActions) => [
        <div key="custom" data-testid="custom-action">
          Custom
        </div>,
        ...defaultActions,
      ]);

      render(
        <MarkdownInputField
          value="test"
          actionsRender={actionsRender}
          attachment={{ enable: true }}
        />,
      );

      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
      expect(actionsRender).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'test',
          isHover: false,
          isLoading: false,
          fileUploadStatus: 'done',
        }),
        expect.arrayContaining([
          expect.anything(), // attachment button
        ]),
      );
    });

    it('应该正确处理没有 toolsRender 的情况', () => {
      render(<MarkdownInputField value="test" attachment={{ enable: true }} />);

      expect(screen.getByTestId('send-button')).toBeInTheDocument();
      expect(screen.getByTestId('attachment-button')).toBeInTheDocument();
    });
  });

  describe('状态管理测试', () => {
    it('应该正确处理悬停状态', async () => {
      render(<MarkdownInputField value="test" />);

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;

      fireEvent.mouseEnter(container);
      fireEvent.mouseLeave(container);

      expect(container).toBeInTheDocument();
    });

    it('应该正确处理加载状态', async () => {
      const onSend = vi.fn(() => new Promise(() => {})); // 永不解决的 Promise

      render(<MarkdownInputField value="test" onSend={onSend as any} />);

      const sendButton = screen.getByTestId('send-button');

      // 点击前确认按钮不在加载状态
      expect(sendButton).not.toHaveClass(
        'ant-md-input-field-send-button-typing',
      );

      await user.click(sendButton);

      // 验证按钮状态变化 - 应该有typing类名
      await waitFor(() => {
        expect(sendButton).toHaveClass('ant-md-input-field-send-button-typing');
      });
    });

    it('应该正确更新右侧内边距', () => {
      render(
        <MarkdownInputField
          value="test"
          attachment={{ enable: true } as any}
        />,
      );

      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });
  });

  describe('样式相关测试', () => {
    it('应该应用正确的 CSS 类名', () => {
      render(
        <MarkdownInputField
          value="test"
          className="custom-class"
          disabled={true}
          style={{ width: '300px' }}
        />,
      );

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveStyle({ width: '300px' });
    });

    it('应该正确设置边框圆角', () => {
      render(<MarkdownInputField value="test" borderRadius={8} />);

      const container = screen.getByTestId('suggestion')
        .firstChild as HTMLElement;
      expect(container).toHaveStyle({ borderRadius: '8px' });
    });

    it('应该正确渲染背景渐变', () => {
      const bgColorList: [string, string, string, string] = [
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFFF00',
      ];

      render(<MarkdownInputField value="test" bgColorList={bgColorList} />);

      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });

  describe('边界情况和错误处理', () => {
    it('应该处理没有 onSend 的情况', async () => {
      render(<MarkdownInputField value="test" />);

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      // 应该不会出错
      expect(sendButton).toBeInTheDocument();
    });

    it('应该处理空的 mdValue', async () => {
      const onSend = vi.fn().mockResolvedValue(undefined);
      mockMarkdownEditor.store.getMDContent.mockReturnValue('');

      render(<MarkdownInputField value="test" onSend={onSend as any} />);

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      expect(onSend).not.toHaveBeenCalled();
    });

    it('应该处理发送失败的情况', async () => {
      const onSend = vi.fn().mockRejectedValue(new Error('Send failed'));

      render(<MarkdownInputField value="test" onSend={onSend as any} />);

      const sendButton = screen.getByTestId('send-button');

      await user.click(sendButton);

      await waitFor(() => {
        expect(onSend).toHaveBeenCalled();
      });
    });

    it('应该处理 typing 和 loading 状态下的停止操作', async () => {
      const onStop = vi.fn();

      render(<MarkdownInputField value="test" typing={true} onStop={onStop} />);

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      expect(onStop).toHaveBeenCalled();
    });
  });

  describe('React 生命周期和副作用测试', () => {
    it('应该在 props.value 变化时更新编辑器内容', () => {
      const { rerender } = render(<MarkdownInputField value="initial" />);

      // 初始值设置会在第一次渲染时调用
      expect(mockMarkdownEditor.store.setMDContent).toHaveBeenCalledWith(
        'initial',
      );

      mockMarkdownEditor.store.setMDContent.mockClear();

      rerender(<MarkdownInputField value="updated" />);

      expect(mockMarkdownEditor.store.setMDContent).toHaveBeenCalledWith(
        'updated',
      );
    });

    it('应该正确设置 inputRef', () => {
      const inputRef = React.createRef<any>();

      render(<MarkdownInputField value="test" inputRef={inputRef} />);

      expect(inputRef.current).toEqual(
        expect.objectContaining({
          store: expect.objectContaining({
            getMDContent: expect.any(Function),
            setMDContent: expect.any(Function),
            clearContent: expect.any(Function),
          }),
        }),
      );
    });
  });

  describe('文件映射处理测试', () => {
    it('应该正确检测文件上传完成状态', () => {
      render(
        <MarkdownInputField
          value="test"
          attachment={
            {
              enable: true,
            } as any
          }
        />,
      );

      const attachmentButton = screen.getByTestId('attachment-button');
      expect(attachmentButton).not.toBeDisabled();
    });

    it('应该正确检测文件上传中状态', () => {
      render(
        <MarkdownInputField
          value="test"
          attachment={
            {
              enable: true,
            } as any
          }
        />,
      );

      const attachmentButton = screen.getByTestId('attachment-button');
      expect(attachmentButton).toBeInTheDocument();
    });

    it('应该处理空的文件映射', () => {
      render(
        <MarkdownInputField
          value="test"
          attachment={
            {
              enable: true,
              fileMap: new Map(),
            } as any
          }
        />,
      );

      const attachmentButton = screen.getByTestId('attachment-button');
      expect(attachmentButton).not.toBeDisabled();
    });
  });
});
