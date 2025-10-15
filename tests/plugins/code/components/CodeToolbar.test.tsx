import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeNode } from '../../../../src/MarkdownEditor/el';
import {
  CodeToolbar,
  CodeToolbarProps,
} from '../../../../src/plugins/code/components/CodeToolbar';

// Mock 依赖
vi.mock('copy-to-clipboard');
vi.mock('antd', () => ({
  message: {
    success: vi.fn(),
  },
  Segmented: ({ options, value, onChange }: any) => (
    <div data-testid="segmented">
      {options?.map((option: any, index: number) => (
        <button
          key={index}
          type="button"
          data-testid={`segmented-option-${index}`}
          onClick={() => onChange?.(option.value)}
          style={{
            backgroundColor: value === option.value ? '#1890ff' : 'transparent',
            color: value === option.value ? 'white' : 'black',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../../../src/plugins/code/components/LanguageSelector', () => ({
  LanguageSelector: ({ element, setLanguage }: any) => (
    <div data-testid="language-selector">
      <span data-testid="current-language">
        {element?.language || 'plain text'}
      </span>
      <button
        type="button"
        data-testid="change-language"
        onClick={() => setLanguage?.('javascript')}
      >
        切换语言
      </button>
    </div>
  ),
}));

vi.mock('../../../../src/components/ActionIconBox', () => ({
  ActionIconBox: ({ children, title, onClick, 'data-testid': testId }: any) => (
    <button
      type="button"
      data-testid={testId || 'action-icon'}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe('CodeToolbar', () => {
  const defaultElement: CodeNode = {
    type: 'code',
    language: 'javascript',
    value: 'console.log("Hello World");',
    children: [{ text: 'console.log("Hello World");' }],
  };

  const defaultProps: CodeToolbarProps = {
    element: defaultElement,
    readonly: false,
    onCloseClick: vi.fn(),
    languageSelectorProps: {
      element: defaultElement,
      setLanguage: vi.fn(),
    },
    isSelected: false,
    onSelectionChange: vi.fn(),
    theme: 'github',
    setTheme: vi.fn(),
    isExpanded: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染工具栏', () => {
      render(<CodeToolbar {...defaultProps} isSelected={true} />);

      expect(screen.getByTestId('code-toolbar')).toBeInTheDocument();
    });

    it('应该在非选中状态下仍然显示工具栏（常驻模式）', () => {
      render(<CodeToolbar {...defaultProps} isSelected={false} />);

      expect(screen.getByTestId('code-toolbar')).toBeInTheDocument();
    });
  });

  describe('只读模式测试', () => {
    it('应该在只读模式下显示语言信息', () => {
      render(
        <CodeToolbar {...defaultProps} readonly={true} isSelected={true} />,
      );

      expect(screen.queryByTestId('language-selector')).not.toBeInTheDocument();
      expect(screen.getByText('javascript')).toBeInTheDocument();
    });
  });

  describe('交互功能测试', () => {
    it('应该正确处理复制功能', async () => {
      const mockCopy = copy as any;
      mockCopy.mockReturnValue(true);

      render(<CodeToolbar {...defaultProps} isSelected={true} />);

      const copyButton = screen.getByTitle('复制');
      fireEvent.click(copyButton);

      expect(mockCopy).toHaveBeenCalledWith('console.log("Hello World");');
      expect(message.success).toHaveBeenCalledWith('复制成功');
    });
  });

  describe('特殊代码类型测试', () => {
    it('应该为 HTML 代码显示视图模式切换器', () => {
      const htmlElement = { ...defaultElement, language: 'html' };
      render(
        <CodeToolbar
          {...defaultProps}
          element={htmlElement}
          isSelected={true}
        />,
      );

      expect(screen.getByTestId('segmented')).toBeInTheDocument();
      expect(screen.getByText('预览')).toBeInTheDocument();
      expect(screen.getByText('代码')).toBeInTheDocument();
    });

    it('应该为 katex 公式显示关闭按钮', () => {
      const katexElement = { ...defaultElement, katex: true };
      render(
        <CodeToolbar
          {...defaultProps}
          element={katexElement}
          isSelected={true}
        />,
      );

      expect(screen.getByTitle('关闭')).toBeInTheDocument();
    });

    it('应该为 mermaid 显示关闭按钮', () => {
      const mermaidElement = { ...defaultElement, language: 'mermaid' };
      render(
        <CodeToolbar
          {...defaultProps}
          element={mermaidElement}
          isSelected={true}
        />,
      );

      expect(screen.getByTitle('关闭')).toBeInTheDocument();
    });
  });

  describe('语言显示测试', () => {
    it('应该为 katex 公式显示 Formula 标签', () => {
      const katexElement = { ...defaultElement, katex: true };
      render(
        <CodeToolbar
          {...defaultProps}
          element={katexElement}
          readonly={true}
          isSelected={true}
        />,
      );

      expect(screen.getByText('Formula')).toBeInTheDocument();
    });

    it('应该为 HTML 渲染器显示 Html Renderer 标签', () => {
      const htmlElement = { ...defaultElement, language: 'html', render: true };
      render(
        <CodeToolbar
          {...defaultProps}
          element={htmlElement}
          readonly={true}
          isSelected={true}
        />,
      );

      expect(screen.getByText('Html Renderer')).toBeInTheDocument();
    });

    it('应该为没有语言的代码显示 plain text', () => {
      const elementWithoutLanguage = { ...defaultElement, language: undefined };
      render(
        <CodeToolbar
          {...defaultProps}
          element={elementWithoutLanguage}
          readonly={true}
          isSelected={true}
        />,
      );

      expect(screen.getByText('plain text')).toBeInTheDocument();
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空的代码值', () => {
      const emptyElement = { ...defaultElement, value: '' };
      const mockCopy = copy as any;
      mockCopy.mockReturnValue(true);

      render(
        <CodeToolbar
          {...defaultProps}
          element={emptyElement}
          isSelected={true}
        />,
      );

      const copyButton = screen.getByTitle('复制');
      fireEvent.click(copyButton);

      expect(mockCopy).toHaveBeenCalledWith('');
    });

    it('应该处理未定义的代码值', () => {
      const undefinedElement = { ...defaultElement, value: undefined as any };
      const mockCopy = copy as any;
      mockCopy.mockReturnValue(true);

      render(
        <CodeToolbar
          {...defaultProps}
          element={undefinedElement}
          isSelected={true}
        />,
      );

      const copyButton = screen.getByTitle('复制');
      fireEvent.click(copyButton);

      expect(mockCopy).toHaveBeenCalledWith('');
    });
  });
});
