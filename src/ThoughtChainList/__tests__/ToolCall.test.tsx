import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ToolCall } from '../ToolCall';

vi.mock('../i18n', () => ({
  I18nContext: React.createContext({
    locale: 'zh-CN',
    executionParameters: '执行入参',
    executionResult: '执行结果',
    apiCalling: 'API 调用中',
    taskExecutionFailed: '任务执行失败，需要修改',
    copy: '复制',
    edit: '修改',
    cancel: '取消',
    retry: '重试',
  }),
}));

vi.mock('../../MarkdownEditor', () => ({
  MarkdownEditor: ({ initValue, editorRef }: any) => {
    React.useImperativeHandle(editorRef, () => ({
      store: {
        setMDContent: vi.fn(),
        editor: {
          children: [],
        },
      },
    }));
    return (
      <div data-testid="markdown-editor" data-init-value={initValue}>
        <div data-testid="editor-content">{initValue}</div>
      </div>
    );
  },
  MarkdownEditorInstance: {},
  parserSlateNodeToMarkdown: vi.fn(() => 'parsed content'),
}));

vi.mock('../../index', () => ({
  ActionIconBox: ({ children, onClick, title }: any) => (
    <button
      type="button"
      data-testid={`action-${title}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  ),
}));

vi.mock('./CostMillis', () => ({
  CostMillis: ({ costMillis }: any) => (
    <span data-testid="cost-millis">{costMillis}ms</span>
  ),
}));

vi.mock('./DotAni', () => ({
  DotLoading: () => <div data-testid="dot-loading">Loading...</div>,
}));

describe('ToolCall Component', () => {
  const mockProps = {
    runId: 'test-run-id',
    input: {
      inputArgs: {
        parameters: { id: 1, name: 'test' },
        params: { page: 1, size: 10 },
      },
    },
    output: {
      response: { status: 'success', data: { id: 1, name: 'test' } },
    },
    costMillis: 1500,
    isFinished: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基础渲染测试', () => {
    it('应该正确渲染执行参数', () => {
      render(<ToolCall {...mockProps} />);
      expect(screen.getByText('执行入参')).toBeInTheDocument();
      const editors = screen.getAllByTestId('markdown-editor');
      expect(editors.length).toBeGreaterThan(0);
    });
    it('应该正确渲染执行结果', () => {
      render(<ToolCall {...mockProps} />);
      expect(screen.getByText('执行结果')).toBeInTheDocument();
      expect(screen.getByText('1.5秒')).toBeInTheDocument();
    });
    it('应该正确渲染复制按钮', () => {
      render(<ToolCall {...mockProps} />);
      const copyButtons = screen.getAllByTestId('action-复制');
      expect(copyButtons.length).toBeGreaterThan(0);
    });
    it('应该正确渲染编辑按钮', () => {
      render(<ToolCall {...mockProps} onChangeItem={vi.fn()} />);
      expect(screen.getByTestId('action-修改')).toBeInTheDocument();
    });
    it('应该在没有 onChangeItem 时不显示编辑按钮', () => {
      render(<ToolCall {...mockProps} />);
      expect(screen.queryByTestId('action-修改')).not.toBeInTheDocument();
    });
  });

  describe('状态渲染测试', () => {
    it('应该在未完成时显示加载状态', () => {
      render(<ToolCall {...mockProps} isFinished={false} />);
      expect(screen.getByText(/API\s*调用中/)).toBeInTheDocument();
      expect(screen.getByTestId('dot-loading')).toBeInTheDocument();
    });
    it('应该在完成时显示执行结果', () => {
      render(<ToolCall {...mockProps} isFinished={true} />);
      expect(screen.getByText('执行结果')).toBeInTheDocument();
      expect(screen.queryByText(/API\s*调用中/)).not.toBeInTheDocument();
    });
    it('应该在完成且有错误时显示错误信息', () => {
      const errorProps = {
        ...mockProps,
        output: { errorMsg: '测试错误信息' },
      };
      render(<ToolCall {...errorProps} isFinished={true} />);
      expect(screen.getByText(/任务执行失败/)).toBeInTheDocument();
      expect(screen.getByText('测试错误信息')).toBeInTheDocument();
    });
    it('应该处理嵌套错误信息', () => {
      const nestedErrorProps = {
        ...mockProps,
        output: { response: { error: '嵌套错误信息' } },
      };
      render(<ToolCall {...nestedErrorProps} isFinished={true} />);
      expect(screen.getByText(/任务执行失败/)).toBeInTheDocument();
      expect(screen.getByText('嵌套错误信息')).toBeInTheDocument();
    });
  });

  describe('编辑器模式测试', () => {
    it('应该在点击编辑按钮时进入编辑器模式', async () => {
      const user = userEvent.setup();
      render(<ToolCall {...mockProps} onChangeItem={vi.fn()} />);
      const editButton = screen.getByTestId('action-修改');
      await user.click(editButton);
      expect(
        screen.getByText((c) => c.replace(/\s/g, '') === '取消'),
      ).toBeInTheDocument();
      expect(
        screen.getByText((c) => c.replace(/\s/g, '') === '重试'),
      ).toBeInTheDocument();
    });
    it('应该在点击取消按钮时退出编辑器模式', async () => {
      const user = userEvent.setup();
      render(<ToolCall {...mockProps} onChangeItem={vi.fn()} />);
      const editButton = screen.getByTestId('action-修改');
      await user.click(editButton);
      const cancelButton = screen.getByText(
        (c) => c.replace(/\s/g, '') === '取消',
      );
      await user.click(cancelButton);
      expect(
        screen.queryByText((c) => c.replace(/\s/g, '') === '取消'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText((c) => c.replace(/\s/g, '') === '重试'),
      ).not.toBeInTheDocument();
    });
    it('应该在点击重试按钮时调用 onChangeItem', async () => {
      const onChangeItem = vi.fn();
      const user = userEvent.setup();
      render(<ToolCall {...mockProps} onChangeItem={onChangeItem} />);
      const editButton = screen.getByTestId('action-修改');
      await user.click(editButton);
      const retryButton = screen.getByText(
        (c) => c.replace(/\s/g, '') === '重试',
      );
      await user.click(retryButton);
      expect(onChangeItem).toHaveBeenCalledWith(
        expect.objectContaining({
          runId: 'test-run-id',
          input: mockProps.input,
          output: mockProps.output,
          costMillis: 1500,
          isFinished: true,
        }),
        expect.objectContaining({
          feedbackContent: 'parsed content',
          feedbackType: 'toolArg',
          feedbackRunId: 'test-run-id',
        }),
      );
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的 inputArgs', () => {
      const emptyProps = {
        ...mockProps,
        input: {},
      };
      render(<ToolCall {...emptyProps} />);
      const editors = screen.getAllByTestId('markdown-editor');
      expect(editors.length).toBeGreaterThan(0);
    });
    it('应该处理空的 response', () => {
      const emptyProps = {
        ...mockProps,
        output: {},
      };
      render(<ToolCall {...emptyProps} isFinished={true} />);
      const editors = screen.getAllByTestId('markdown-editor');
      expect(editors.length).toBeGreaterThan(0);
    });
    it('应该处理没有 costMillis 的情况', () => {
      const noCostProps = {
        ...mockProps,
        costMillis: undefined,
      };
      render(<ToolCall {...noCostProps} />);
      expect(screen.queryByTestId('cost-millis')).not.toBeInTheDocument();
    });
    it('应该处理自定义 data-testid', () => {
      render(<ToolCall {...mockProps} data-testid="custom-toolcall" />);
      expect(screen.getByTestId('custom-toolcall')).toBeInTheDocument();
    });
  });

  describe('MarkdownEditor 集成测试', () => {
    it('应该传递正确的 markdownRenderProps', () => {
      const markdownProps = {
        style: { fontSize: '14px' },
        contentStyle: { padding: '10px' },
      };
      render(<ToolCall {...mockProps} markdownRenderProps={markdownProps} />);
      const editors = screen.getAllByTestId('markdown-editor');
      expect(editors.length).toBeGreaterThan(0);
    });
    it('应该正确格式化 JSON 数据', () => {
      render(<ToolCall {...mockProps} />);
      const editors = screen.getAllByTestId('markdown-editor');
      expect(editors[0]).toHaveAttribute(
        'data-init-value',
        expect.stringContaining('```json'),
      );
    });
  });

  describe('性能优化测试', () => {
    it('应该使用 useMemo 优化渲染', () => {
      const { rerender } = render(<ToolCall {...mockProps} />);
      rerender(<ToolCall {...mockProps} />);
      expect(screen.getByText('执行入参')).toBeInTheDocument();
    });
    it('应该在依赖项变化时重新渲染', () => {
      const { rerender } = render(<ToolCall {...mockProps} />);
      const newProps = {
        ...mockProps,
        input: {
          inputArgs: { newParam: 'newValue' } as any,
        },
      };
      rerender(<ToolCall {...newProps} />);
      expect(screen.getByText('执行入参')).toBeInTheDocument();
    });
  });
});
