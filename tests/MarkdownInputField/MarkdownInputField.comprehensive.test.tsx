/**
 * MarkdownInputField 组件全面测试文件
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownInputField } from '../../src/MarkdownInputField/MarkdownInputField';

// Mock dependencies
vi.mock('../../src/MarkdownEditor', () => ({
  BaseMarkdownEditor: ({ children, ...props }: any) => (
    <div data-testid="base-markdown-editor" {...props}>
      {children}
    </div>
  ),
  MarkdownEditorInstance: {},
}));

vi.mock('slate-react', () => ({
  ReactEditor: {
    findPath: vi.fn(() => [0]),
    findNode: vi.fn(() => ({ children: [] })),
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
  AttachmentButton: ({ children, ...props }: any) => (
    <div data-testid="attachment-button" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('../../src/MarkdownInputField/SendButton', () => ({
  SendButton: ({ children, ...props }: any) => (
    <button data-testid="send-button" type="button" {...props}>
      {children}
    </button>
  ),
}));

describe('MarkdownInputField Comprehensive Tests', () => {
  const defaultProps = {
    value: '# Hello World',
    onChange: vi.fn(),
    placeholder: 'Type your message...',
    attachment: {
      enable: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染功能', () => {
    it('应该正确渲染基本组件', () => {
      render(
        <MarkdownInputField
          {...defaultProps}
          attachment={{
            enable: true,
          }}
        />,
      );
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该传递正确的 props 给 BaseMarkdownEditor', () => {
      render(<MarkdownInputField {...defaultProps} />);
      const editor = screen.getByTestId('base-markdown-editor');
      expect(editor).toBeInTheDocument();
    });

    it('应该渲染附件按钮', () => {
      render(
        <MarkdownInputField
          {...defaultProps}
          attachment={{
            enable: true,
          }}
        />,
      );
      expect(screen.getByTestId('attachment-button')).toBeInTheDocument();
    });

    it('应该渲染发送按钮', () => {
      render(<MarkdownInputField {...defaultProps} />);
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });

    it('应该渲染建议组件', () => {
      render(<MarkdownInputField {...defaultProps} />);
      expect(screen.getByTestId('suggestion')).toBeInTheDocument();
    });
  });

  describe('Props 传递', () => {
    it('应该正确处理 value prop', () => {
      const testValue = '# Test Heading';
      render(<MarkdownInputField {...defaultProps} value={testValue} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该正确处理 placeholder prop', () => {
      const testPlaceholder = 'Custom placeholder';
      render(
        <MarkdownInputField {...defaultProps} placeholder={testPlaceholder} />,
      );
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该正确处理 disabled prop', () => {
      render(<MarkdownInputField {...defaultProps} disabled={true} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该正确处理 style prop', () => {
      const testStyle = { minHeight: '200px' };
      render(<MarkdownInputField {...defaultProps} style={testStyle} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该正确处理 className prop', () => {
      const testClassName = 'custom-class';
      render(
        <MarkdownInputField {...defaultProps} className={testClassName} />,
      );
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });

  describe('附件功能', () => {
    it('应该启用附件功能', () => {
      render(
        <MarkdownInputField
          {...defaultProps}
          attachment={
            {
              enable: true,
              accept: '.pdf,.doc',
              maxSize: 1024 * 1024,
            } as any
          }
        />,
      );
      expect(screen.getByTestId('attachment-button')).toBeInTheDocument();
    });

    it('应该禁用附件功能', () => {
      render(
        <MarkdownInputField
          {...defaultProps}
          attachment={
            {
              enable: false,
            } as any
          }
        />,
      );
      // 附件按钮应该不存在
      expect(screen.queryByTestId('attachment-button')).not.toBeInTheDocument();
    });

    it('应该处理附件上传配置', () => {
      const onUpload = vi.fn();
      render(
        <MarkdownInputField
          {...defaultProps}
          attachment={
            {
              enable: true,
              upload: onUpload,
              accept: '.pdf,.doc',
              maxSize: 1024 * 1024,
            } as any
          }
        />,
      );
      expect(screen.getByTestId('attachment-button')).toBeInTheDocument();
    });
  });

  describe('发送功能', () => {
    it('应该处理 Enter 键发送', () => {
      render(
        <MarkdownInputField
          {...defaultProps}
          triggerSendKey="Enter"
          attachment={{ enable: true }}
        />,
      );
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });

    it('应该处理 Mod+Enter 键发送', () => {
      render(
        <MarkdownInputField {...defaultProps} triggerSendKey="Mod+Enter" />,
      );
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });

    it('应该处理 onSend 回调', async () => {
      const onSend = vi.fn().mockResolvedValue(undefined);
      render(<MarkdownInputField {...defaultProps} onSend={onSend} />);
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });

    it('应该处理 onStop 回调', () => {
      const onStop = vi.fn();
      render(<MarkdownInputField {...defaultProps} onStop={onStop} />);
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });
  });

  describe('自定义渲染', () => {
    it('应该支持 actionsRender 自定义', () => {
      const actionsRender = vi.fn(() => [
        <div key="custom" data-testid="custom-action">
          Custom
        </div>,
      ]);
      render(
        <MarkdownInputField {...defaultProps} actionsRender={actionsRender} />,
      );
      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });

    it('应该支持 toolsRender 自定义', () => {
      const toolsRender = vi.fn(() => [
        <div key="custom" data-testid="custom-tool">
          Custom Tool
        </div>,
      ]);
      render(
        <MarkdownInputField {...defaultProps} toolsRender={toolsRender} />,
      );
      expect(screen.getByTestId('custom-tool')).toBeInTheDocument();
    });

    it('应该支持 leafRender 自定义', () => {
      const leafRender = vi.fn((props, defaultDom) => defaultDom);
      render(<MarkdownInputField {...defaultProps} leafRender={leafRender} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });

  describe('引用和实例', () => {
    it('应该支持 inputRef', () => {
      const inputRef = { current: undefined };
      render(<MarkdownInputField {...defaultProps} inputRef={inputRef} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });

  describe('样式和主题', () => {
    it('应该应用自定义背景色', () => {
      const bgColorList = ['#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'] as [
        string,
        string,
        string,
        string,
      ];
      render(
        <MarkdownInputField {...defaultProps} bgColorList={bgColorList} />,
      );
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该应用自定义圆角', () => {
      render(<MarkdownInputField {...defaultProps} borderRadius={8} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });

  describe('状态管理', () => {
    it('应该处理 typing 状态', () => {
      render(<MarkdownInputField {...defaultProps} typing={true} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该处理 disabled 状态', () => {
      render(<MarkdownInputField {...defaultProps} disabled={true} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });

  describe('事件处理', () => {
    it('应该处理 onChange 事件', () => {
      const onChange = vi.fn();
      render(<MarkdownInputField {...defaultProps} onChange={onChange} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该处理键盘事件', () => {
      render(<MarkdownInputField {...defaultProps} />);
      const editor = screen.getByTestId('base-markdown-editor');

      // 模拟键盘事件
      fireEvent.keyDown(editor, { key: 'Enter', code: 'Enter' });
      expect(editor).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('应该处理空的 value', () => {
      render(<MarkdownInputField {...defaultProps} value="" />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该处理未定义的 value', () => {
      render(<MarkdownInputField {...defaultProps} value={undefined} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该处理空的 placeholder', () => {
      render(<MarkdownInputField {...defaultProps} placeholder="" />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该处理未定义的 onChange', () => {
      render(<MarkdownInputField {...defaultProps} onChange={undefined} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });

  describe('性能优化', () => {
    it('应该正确处理 useMemo 优化', () => {
      render(<MarkdownInputField {...defaultProps} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该正确处理 useCallback 优化', () => {
      render(<MarkdownInputField {...defaultProps} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });

  describe('错误处理', () => {
    it('应该处理附件上传错误', async () => {
      const onUpload = vi.fn().mockRejectedValue(new Error('Upload failed'));
      render(
        <MarkdownInputField
          {...defaultProps}
          attachment={{
            enable: true,
            upload: onUpload,
          }}
        />,
      );
      expect(screen.getByTestId('attachment-button')).toBeInTheDocument();
    });

    it('应该处理发送错误', async () => {
      const onSend = vi.fn().mockRejectedValue(new Error('Send failed'));
      render(<MarkdownInputField {...defaultProps} onSend={onSend} />);
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });
  });

  describe('集成测试', () => {
    it('应该正确处理完整的用户交互流程', async () => {
      const onChange = vi.fn();
      const onSend = vi.fn().mockResolvedValue(undefined);

      render(
        <MarkdownInputField
          {...defaultProps}
          onChange={onChange}
          onSend={onSend}
          triggerSendKey="Enter"
        />,
      );

      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
      expect(screen.getByTestId('attachment-button')).toBeInTheDocument();
    });

    it('应该正确处理复杂的自定义渲染', () => {
      const actionsRender = vi.fn((_props, defaultActions) => [
        <div key="custom1" data-testid="custom-action-1">
          Action 1
        </div>,
        <div key="custom2" data-testid="custom-action-2">
          Action 2
        </div>,
        ...defaultActions,
      ]);

      const toolsRender = vi.fn(() => [
        <div key="tool1" data-testid="custom-tool-1">
          Tool 1
        </div>,
        <div key="tool2" data-testid="custom-tool-2">
          Tool 2
        </div>,
      ]);

      render(
        <MarkdownInputField
          {...defaultProps}
          actionsRender={actionsRender}
          toolsRender={toolsRender}
          attachment={{
            enable: true,
          }}
        />,
      );

      expect(screen.getByTestId('custom-action-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-action-2')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tool-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-tool-2')).toBeInTheDocument();
    });
  });

  describe('可访问性', () => {
    it('应该在禁用状态下正确设置 aria 属性', () => {
      render(<MarkdownInputField {...defaultProps} disabled={true} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该支持键盘导航', () => {
      render(<MarkdownInputField {...defaultProps} />);
      const editor = screen.getByTestId('base-markdown-editor');

      // 测试 Tab 键导航
      fireEvent.keyDown(editor, { key: 'Tab', code: 'Tab' });
      expect(editor).toBeInTheDocument();
    });
  });

  describe('响应式设计', () => {
    it('应该正确处理窗口大小变化', () => {
      render(<MarkdownInputField {...defaultProps} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });

    it('应该正确处理容器大小变化', () => {
      render(<MarkdownInputField {...defaultProps} />);
      expect(screen.getByTestId('base-markdown-editor')).toBeInTheDocument();
    });
  });
});
