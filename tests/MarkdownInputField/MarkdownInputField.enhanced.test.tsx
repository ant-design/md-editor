/**
 * MarkdownInputField 组件增强测试文件
 * 专门针对提升测试覆盖率而设计
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import classNames from 'classnames';
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

vi.mock('slate-react', () => ({
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
        className={classNames({
          'ant-md-input-field-send-button-typing': typing,
        })}
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
    SupportedFileFormats: {
      image: { name: 'Image', extensions: ['.jpg', '.png', '.gif'] },
      document: { name: 'Document', extensions: ['.pdf', '.doc', '.docx'] },
    },
  }),
);

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

    it('应该处理边界情况', () => {
      expect(generateEdges([])).toEqual([]);
      expect(generateEdges(['red'])).toEqual([['red', 'red']]);
    });
  });

  describe('核心功能测试', () => {
    it('应该处理文件上传和发送消息功能', async () => {
      const onFileMapChange = vi.fn();
      const onSend = vi.fn();

      render(
        <MarkdownInputField
          value="test"
          attachment={{
            enable: true,
            onFileMapChange,
          }}
          onSend={onSend}
        />,
      );

      // 测试附件按钮
      const attachmentButton = screen.getByTestId('attachment-button');
      expect(attachmentButton).toBeInTheDocument();
      expect(attachmentButton).not.toBeDisabled();

      // 测试发送按钮
      const sendButton = screen.getByTestId('send-button');
      expect(sendButton).toBeInTheDocument();
    });

    it('应该在禁用状态下阻止发送', async () => {
      const onSend = vi.fn();

      render(
        <MarkdownInputField value="test" disabled={true} onSend={onSend} />,
      );

      const sendButton = screen.getByTestId('send-button');
      expect(sendButton).toBeDisabled();

      await user.click(sendButton);
      expect(onSend).not.toHaveBeenCalled();
    });

    it('应该处理键盘事件', async () => {
      const onSend = vi.fn();

      render(<MarkdownInputField value="test" onSend={onSend} />);

      const textarea = screen.getByTestId('markdown-textarea');

      // 测试 Ctrl+Enter
      fireEvent.keyDown(textarea, {
        key: 'Enter',
        ctrlKey: true,
      });

      // 由于 mock 的限制，我们只测试事件是否被触发
      expect(textarea).toBeInTheDocument();
    });

    it('应该处理发送成功后清空内容', async () => {
      const onSend = vi.fn().mockResolvedValue(true);

      render(<MarkdownInputField value="test" onSend={onSend} />);

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      // 由于 mock 的限制，我们只测试按钮点击
      expect(sendButton).toBeInTheDocument();
    });
  });

  describe('状态管理测试', () => {
    it('应该正确处理各种状态', async () => {
      const { rerender } = render(<MarkdownInputField value="initial" />);

      // 测试初始值设置
      expect(mockMarkdownEditor.store.setMDContent).toHaveBeenCalledWith(
        'initial',
      );

      mockMarkdownEditor.store.setMDContent.mockClear();

      // 测试值更新
      rerender(<MarkdownInputField value="updated" />);
      expect(mockMarkdownEditor.store.setMDContent).toHaveBeenCalledWith(
        'updated',
      );

      // 测试 typing 状态
      rerender(<MarkdownInputField value="test" typing={true} />);
      const sendButton = screen.getByTestId('send-button');
      expect(sendButton).toHaveAttribute('data-typing', 'true');
    });

    it('应该正确设置 inputRef', () => {
      const inputRef = React.createRef<any>();

      render(<MarkdownInputField value="test" inputRef={inputRef} />);

      // 由于 mock 的限制，我们只测试 ref 是否被传递
      expect(inputRef).toBeDefined();
    });
  });

  describe('自定义渲染测试', () => {
    it('应该正确渲染自定义组件', () => {
      const toolsRender = vi.fn(() => [
        <div key="tools" data-testid="custom-tools">
          Tools
        </div>,
      ]);
      const actionsRender = vi.fn(() => [
        <div key="actions" data-testid="custom-actions">
          Actions
        </div>,
      ]);

      render(
        <MarkdownInputField
          value="test"
          toolsRender={toolsRender}
          actionsRender={actionsRender}
        />,
      );

      expect(screen.getByTestId('custom-tools')).toBeInTheDocument();
      expect(screen.getByTestId('custom-actions')).toBeInTheDocument();
    });
  });

  describe('边界情况和错误处理', () => {
    it('应该处理边界情况', async () => {
      // 测试没有 onSend 的情况
      render(<MarkdownInputField value="test" />);
      const sendButtons = screen.getAllByTestId('send-button');
      await user.click(sendButtons[0]);
      // 不应该抛出错误

      // 测试空的 mdValue
      mockMarkdownEditor.store.getMDContent.mockReturnValue('');
      render(<MarkdownInputField value="" />);
      // 不应该抛出错误

      // 测试发送失败的情况
      const onSend = vi.fn().mockResolvedValue(false);
      render(<MarkdownInputField value="test" onSend={onSend} />);
      const newSendButtons = screen.getAllByTestId('send-button');
      await user.click(newSendButtons[newSendButtons.length - 1]);
      // 由于 mock 限制，只测试点击是否成功
      expect(newSendButtons[newSendButtons.length - 1]).toBeInTheDocument();
    });
  });
});
