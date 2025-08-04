/**
 * CodeRenderer 组件测试文件
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeRenderer } from '../../../../src/plugins/code/components/CodeRenderer';

// 最小化的 mock
const mockEditorStore = {
  store: {
    editor: {
      focus: vi.fn(),
    },
  },
  readonly: false,
  typewriter: false,
  editorProps: {
    codeProps: {
      hideToolBar: false,
    },
  },
  markdownEditorRef: {
    current: {
      focus: vi.fn(),
    },
  },
};

// Mock 核心依赖
vi.mock('../../../../src/MarkdownEditor/editor/store', () => ({
  useEditorStore: () => mockEditorStore,
}));

// Mock hooks
vi.mock('../../../../src/plugins/code/hooks', () => ({
  useCodeEditorState: () => ({
    state: {
      showBorder: false,
      htmlStr: '<div>HTML Preview Content</div>', // 添加 HTML 内容以便测试
      hide: false,
      lang: 'javascript',
    },
    update: vi.fn(),
    path: [0],
    handleCloseClick: vi.fn(),
    handleRunHtml: vi.fn(),
    handleHtmlPreviewClose: vi.fn(),
    handleShowBorderChange: vi.fn(),
    handleHideChange: vi.fn(),
  }),
  useFullScreenControl: () => ({
    handle: { node: { current: null } },
    isFullScreen: false,
    handleFullScreenToggle: vi.fn(),
  }),
  useRenderConditions: (element: any, readonly: boolean) => ({
    shouldHideConfigHtml: element.language === 'html' && element?.isConfig,
    shouldRenderAsThinkBlock: element.language === 'think' && readonly,
    shouldRenderAsCodeEditor:
      !(element.language === 'html' && element?.isConfig) &&
      !(element.language === 'think' && readonly),
  }),
  useToolbarConfig: () => ({
    toolbarProps: {
      element: {},
      readonly: false,
      isFullScreen: false,
      onCloseClick: vi.fn(),
      onRunHtml: vi.fn(),
      onFullScreenToggle: vi.fn(),
      setLanguage: vi.fn(),
      isSelected: true, // 设置为选中状态以便显示工具栏
      onSelectionChange: vi.fn(),
    },
  }),
}));

// Mock AceEditor hook
vi.mock('../../../../src/plugins/code/components/AceEditor', () => ({
  AceEditor: () => ({
    dom: { current: document.createElement('div') },
    setLanguage: vi.fn(),
    focusEditor: vi.fn(),
  }),
}));

// Mock CodeToolbar 组件
vi.mock('../../../../src/plugins/code/components/CodeToolbar', () => ({
  CodeToolbar: ({ element, readonly, isSelected }: any) => (
    <div data-testid="code-toolbar">
      <span>Code Toolbar</span>
      <span data-testid="toolbar-language">
        {element?.language || 'unknown'}
      </span>
      <span data-testid="toolbar-readonly">
        {readonly ? 'readonly' : 'editable'}
      </span>
      <span data-testid="toolbar-selected">
        {isSelected ? 'selected' : 'not-selected'}
      </span>
    </div>
  ),
}));

// Mock HtmlPreview 组件
vi.mock('../../../../src/plugins/code/components/HtmlPreview', () => ({
  HtmlPreview: ({ htmlStr }: any) => (
    <div data-testid="html-preview">
      <span>HTML Preview</span>
      <span data-testid="html-content">{htmlStr}</span>
    </div>
  ),
}));

describe('CodeRenderer Component', () => {
  const defaultProps = {
    element: {
      type: 'code' as const,
      value: 'console.log("Hello World");',
      language: 'javascript',
      children: [{ text: '' }] as [{ text: string }],
    },
    attributes: {},
    children: <span>test content</span>,
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该渲染代码编辑器', () => {
      render(<CodeRenderer {...defaultProps} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });

    it('应该渲染 Ace 编辑器容器', () => {
      render(<CodeRenderer {...defaultProps} />);
      expect(screen.getByTestId('ace-editor-container')).toBeInTheDocument();
    });

    it('应该渲染代码工具栏', () => {
      render(<CodeRenderer {...defaultProps} />);
      expect(screen.getByTestId('code-toolbar')).toBeInTheDocument();
    });

    it('应该渲染 HTML 预览组件', () => {
      render(<CodeRenderer {...defaultProps} />);
      expect(screen.getByTestId('html-preview')).toBeInTheDocument();
    });
  });

  describe('不同语言支持', () => {
    it('应该支持 JavaScript 语言', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'javascript',
        },
      };
      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });

    it('应该支持 Python 语言', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'python',
        },
      };
      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });

    it('应该支持 HTML 语言', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'html',
        },
      };
      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });
  });

  describe('特殊渲染模式', () => {
    it('应该隐藏配置型 HTML 代码块', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'html',
          isConfig: true,
        },
      };

      const { container } = render(<CodeRenderer {...props} />);
      expect(container.firstChild).toBeNull();
    });

    it('应该渲染思考块', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: 'think',
          value: '这是一个思考过程',
        },
      };

      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });
  });

  describe('不同代码内容', () => {
    it('应该处理简单代码', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: 'console.log("Hello");',
        },
      };
      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });

    it('应该处理复杂代码', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: `function complexFunction() {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push(i * 2);
  }
  return data.filter(x => x > 5);
}`,
        },
      };
      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });

    it('应该处理空代码', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: '',
        },
      };
      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('应该处理未定义的语言', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          language: undefined,
        },
      };
      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });

    it('应该处理未定义的代码值', () => {
      const props = {
        ...defaultProps,
        element: {
          ...defaultProps.element,
          value: undefined,
        },
      };
      render(<CodeRenderer {...props} />);
      expect(screen.getByTestId('code-container')).toBeInTheDocument();
    });
  });
});
