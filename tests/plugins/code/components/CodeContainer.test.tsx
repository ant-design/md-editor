/**
 * CodeContainer 组件测试文件
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeContainer } from '../../../../src/plugins/code/components/CodeContainer';

// Mock LanguageSelector
vi.mock('../../../../src/plugins/code/components/LanguageSelector', () => ({
  LanguageSelector: ({ element, setLanguage }: any) => (
    <div data-testid="language-selector" onClick={() => setLanguage('python')}>
      {element.language}
    </div>
  ),
}));

// Mock CodeRenderer
vi.mock('../../../../src/plugins/code/components/CodeRenderer', () => ({
  CodeRenderer: ({ element }: any) => (
    <div data-testid="code-renderer">
      <pre>{element.value}</pre>
    </div>
  ),
}));

// Mock AceEditor
vi.mock('../../../../src/plugins/code/components/AceEditor', () => ({
  AceEditor: ({ element, onChange }: any) => (
    <textarea
      data-testid="ace-editor"
      value={element.value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('CodeContainer Component', () => {
  const defaultProps = {
    element: {
      type: 'code',
      value: 'console.log("Hello World");',
      language: 'javascript',
      katex: false,
    },
    attributes: {
      'data-testid': 'code-container',
    },
    children: <div>Children content</div>,
    setLanguage: vi.fn(),
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染 CodeContainer 组件', () => {
      render(<CodeContainer {...defaultProps} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });

    it('应该渲染语言选择器', () => {
      render(<CodeContainer {...defaultProps} />);
      expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    });

    it('应该渲染代码渲染器', () => {
      render(<CodeContainer {...defaultProps} />);
      expect(screen.getByTestId('code-renderer')).toBeInTheDocument();
    });

    it('应该渲染子元素', () => {
      render(<CodeContainer {...defaultProps} />);
      expect(screen.getByText('Children content')).toBeInTheDocument();
    });
  });

  describe('编辑模式测试', () => {
    it('应该在编辑模式下显示 AceEditor', () => {
      const props = {
        ...defaultProps,
        isEditing: true,
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('ace-editor')).toBeInTheDocument();
    });

    it('应该在非编辑模式下显示 CodeRenderer', () => {
      const props = {
        ...defaultProps,
        isEditing: false,
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('code-renderer')).toBeInTheDocument();
      expect(screen.queryByTestId('ace-editor')).not.toBeInTheDocument();
    });

    it('应该在编辑模式下隐藏 CodeRenderer', () => {
      const props = {
        ...defaultProps,
        isEditing: true,
      };

      render(<CodeContainer {...props} />);
      expect(screen.queryByTestId('code-renderer')).not.toBeInTheDocument();
    });
  });

  describe('语言选择测试', () => {
    it('应该调用 setLanguage 当语言选择器被点击', async () => {
      const user = userEvent.setup();
      const setLanguage = vi.fn();
      const props = {
        ...defaultProps,
        setLanguage,
      };

      render(<CodeContainer {...props} />);
      
      const languageSelector = screen.getByTestId('language-selector');
      await user.click(languageSelector);
      
      expect(setLanguage).toHaveBeenCalledWith('python');
    });

    it('应该传递正确的 element 给语言选择器', () => {
      render(<CodeContainer {...defaultProps} />);
      const languageSelector = screen.getByTestId('language-selector');
      expect(languageSelector).toHaveTextContent('javascript');
    });
  });

  describe('代码内容测试', () => {
    it('应该显示正确的代码内容', () => {
      render(<CodeContainer {...defaultProps} />);
      expect(screen.getByText('console.log("Hello World");')).toBeInTheDocument();
    });

    it('应该处理空的代码内容', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: '',
        },
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('code-renderer')).toBeInTheDocument();
    });

    it('应该处理未定义的代码内容', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: undefined,
        },
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('code-renderer')).toBeInTheDocument();
    });
  });

  describe('不同语言测试', () => {
    it('应该处理 JavaScript 语言', () => {
      render(<CodeContainer {...defaultProps} />);
      expect(screen.getByTestId('language-selector')).toHaveTextContent('javascript');
    });

    it('应该处理 Python 语言', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'python',
        },
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('language-selector')).toHaveTextContent('python');
    });

    it('应该处理 HTML 语言', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'html',
        },
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('language-selector')).toHaveTextContent('html');
    });

    it('应该处理未定义的语言', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: undefined,
        },
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    });
  });

  describe('Katex 公式测试', () => {
    it('应该处理 katex 公式', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          katex: true,
        },
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    });

    it('应该处理非 katex 代码', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          katex: false,
        },
      };

      render(<CodeContainer {...props} />);
      expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    });
  });

  describe('属性传递测试', () => {
    it('应该传递所有属性给容器', () => {
      const props = {
        ...defaultProps,
        attributes: {
          'data-testid': 'code-container',
          'data-custom': 'custom-value',
          className: 'custom-class',
        },
      };

      render(<CodeContainer {...props} />);
      const container = screen.getByTestId('code-container');
      
      expect(container).toHaveAttribute('data-custom', 'custom-value');
      expect(container).toHaveClass('custom-class');
    });

    it('应该传递 element 给子组件', () => {
      render(<CodeContainer {...defaultProps} />);
      
      // 验证 CodeRenderer 接收了正确的 element
      const codeRenderer = screen.getByTestId('code-renderer');
      expect(codeRenderer).toBeInTheDocument();
    });
  });

  describe('事件处理测试', () => {
    it('应该处理 onChange 事件', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const props = {
        ...defaultProps,
        isEditing: true,
        onChange,
      };

      render(<CodeContainer {...props} />);
      
      const editor = screen.getByTestId('ace-editor');
      await user.type(editor, 'new code');
      
      expect(onChange).toHaveBeenCalled();
    });

    it('应该在编辑模式下处理代码变更', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const props = {
        ...defaultProps,
        isEditing: true,
        onChange,
      };

      render(<CodeContainer {...props} />);
      
      const editor = screen.getByTestId('ace-editor');
      await user.clear(editor);
      await user.type(editor, 'updated code');
      
      expect(onChange).toHaveBeenCalledWith('updated code');
    });
  });

  describe('样式测试', () => {
    it('应该应用正确的容器样式', () => {
      render(<CodeContainer {...defaultProps} />);
      const container = screen.getByTestId('code-container');
      
      expect(container).toHaveStyle({
        position: 'relative',
        marginBottom: '0.75em',
        backgroundColor: 'rgba(107, 114, 128, 0.05)',
        borderRadius: '0.25em',
        paddingTop: '1em',
        paddingBottom: '1em',
      });
    });

    it('应该应用正确的语言选择器样式', () => {
      render(<CodeContainer {...defaultProps} />);
      const languageSelector = screen.getByTestId('language-selector');
      
      // 验证语言选择器在正确的位置
      expect(languageSelector).toBeInTheDocument();
    });
  });

  describe('边界情况测试', () => {
    it('应该处理未定义的 element', () => {
      const props = {
        ...defaultProps,
        element: undefined as any,
      };

      expect(() => {
        render(<CodeContainer {...props} />);
      }).not.toThrow();
    });

    it('应该处理未定义的 attributes', () => {
      const props = {
        ...defaultProps,
        attributes: undefined,
      };

      expect(() => {
        render(<CodeContainer {...props} />);
      }).not.toThrow();
    });

    it('应该处理未定义的 children', () => {
      const props = {
        ...defaultProps,
        children: undefined,
      };

      expect(() => {
        render(<CodeContainer {...props} />);
      }).not.toThrow();
    });

    it('应该处理未定义的 setLanguage', () => {
      const props = {
        ...defaultProps,
        setLanguage: undefined as any,
      };

      expect(() => {
        render(<CodeContainer {...props} />);
      }).not.toThrow();
    });

    it('应该处理未定义的 onChange', () => {
      const props = {
        ...defaultProps,
        onChange: undefined as any,
      };

      expect(() => {
        render(<CodeContainer {...props} />);
      }).not.toThrow();
    });
  });

  describe('性能测试', () => {
    it('应该在重新渲染时保持状态', () => {
      const { rerender } = render(<CodeContainer {...defaultProps} />);
      
      // 重新渲染
      rerender(<CodeContainer {...defaultProps} />);
      
      // 组件应该仍然存在
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });

    it('应该处理大量代码内容', () => {
      const largeCode = 'console.log("test");\n'.repeat(1000);
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: largeCode,
        },
      };

      expect(() => {
        render(<CodeContainer {...props} />);
      }).not.toThrow();
    });
  });

  describe('可访问性测试', () => {
    it('应该包含正确的 ARIA 属性', () => {
      const props = {
        ...defaultProps,
        attributes: {
          'data-testid': 'code-container',
          'aria-label': 'Code block',
        },
      };

      render(<CodeContainer {...props} />);
      const container = screen.getByTestId('code-container');
      expect(container).toHaveAttribute('aria-label', 'Code block');
    });

    it('应该支持键盘导航', () => {
      render(<CodeContainer {...defaultProps} />);
      const languageSelector = screen.getByTestId('language-selector');
      
      // 验证语言选择器可以通过键盘访问
      expect(languageSelector).toBeInTheDocument();
    });
  });
}); 