import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../../src/i18n';
import {
  RealtimeFollow,
  RealtimeFollowData,
  RealtimeFollowList,
} from '../../../src/Workspace/RealtimeFollow';

// Mock useRealtimeFollowStyle hook
vi.mock('../../../src/Workspace/RealtimeFollow/style', () => ({
  useRealtimeFollowStyle: vi.fn(() => ({
    wrapSSR: (node: any) => node,
    hashId: 'test-hash-id',
  })),
}));

// Mock Ant Design components
vi.mock('antd', () => ({
  ConfigProvider: {
    ConfigContext: React.createContext({
      getPrefixCls: (suffix: string) => `ant-${suffix}`,
    }),
  },
  Empty: vi.fn().mockImplementation(({ description }) => (
    <div data-testid="empty">
      <div data-testid="empty-description">{description}</div>
    </div>
  )),
  Segmented: vi.fn().mockImplementation(({ options, value, onChange }) => (
    <div data-testid="segmented">
      {options.map((option: any, index: number) => (
        <button
          key={index}
          data-testid={`segmented-option-${option.value}`}
          className={value === option.value ? 'active' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )),
  Spin: vi.fn().mockImplementation(({ children, tip }) => (
    <div data-testid="spin">
      {tip && <div data-testid="spin-tip">{tip}</div>}
      {children}
    </div>
  )),
}));

// Mock MarkdownEditor
vi.mock('../../../src/MarkdownEditor', () => ({
  MarkdownEditor: vi
    .fn()
    .mockImplementation(({ initValue, editorRef, ...props }) => {
      // 模拟 editorRef 的设置
      if (editorRef && editorRef.current === undefined) {
        editorRef.current = {
          store: {
            updateNodeList: vi.fn(),
            plugins: [],
          },
        };
      }
      return (
        <div data-testid="markdown-editor" data-init-value={initValue}>
          Markdown Editor
        </div>
      );
    }),
}));

// Mock HtmlPreview
vi.mock('../../../src/Workspace/HtmlPreview', () => ({
  HtmlPreview: vi.fn().mockImplementation(({ html, viewMode, status }) => (
    <div
      data-testid="html-preview"
      data-view-mode={viewMode}
      data-status={status}
    >
      HTML Preview: {html}
    </div>
  )),
}));

// Mock icons
vi.mock('../../../src/Workspace/icons/ShellIcon', () => ({
  default: vi
    .fn()
    .mockImplementation(() => <span data-testid="shell-icon">Shell</span>),
}));

vi.mock('../../../src/Workspace/icons/HtmlIcon', () => ({
  default: vi
    .fn()
    .mockImplementation(() => <span data-testid="html-icon">HTML</span>),
}));

vi.mock('../../../src/Workspace/icons/ThinkIcon', () => ({
  default: vi
    .fn()
    .mockImplementation(() => <span data-testid="think-icon">Think</span>),
}));

// Mock parser
vi.mock('../../../src/MarkdownEditor/editor/parser/parserMdToSchema', () => ({
  parserMdToSchema: vi.fn().mockReturnValue({
    schema: [{ type: 'paragraph', children: [{ text: 'test' }] }],
  }),
}));

// Mock style hook
vi.mock('../../../src/Workspace/RealtimeFollow/style', () => ({
  useRealtimeFollowStyle: vi.fn().mockReturnValue({
    wrapSSR: (children: React.ReactNode) => (
      <div data-testid="styled-wrapper">{children}</div>
    ),
    hashId: 'test-hash-id',
  }),
}));

describe('RealtimeFollow', () => {
  const mockI18n = {
    locale: {
      'workspace.terminalExecution': '终端执行',
      'workspace.createHtmlFile': '创建 HTML 文件',
      'workspace.markdownContent': 'Markdown 内容',
      'workspace.empty': '暂无数据',
      'htmlPreview.renderFailed': '页面渲染失败',
      'htmlPreview.preview': '预览',
      'htmlPreview.code': '代码',
    } as any,
    language: 'zh-CN' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染 shell 类型', () => {
      const data: RealtimeFollowData = {
        type: 'shell',
        content: 'echo "Hello World"',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
      expect(screen.getByTestId('markdown-editor')).toHaveAttribute(
        'data-init-value',
        'echo "Hello World"',
      );
    });

    it('应该正确渲染 html 类型', () => {
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('html-preview')).toBeInTheDocument();
      expect(screen.getByTestId('html-preview')).toHaveAttribute(
        'data-view-mode',
        'preview',
      );
    });

    it('应该正确渲染 markdown 类型', () => {
      const data: RealtimeFollowData = {
        type: 'markdown',
        content: '# Hello World',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
      expect(screen.getByTestId('markdown-editor')).toHaveAttribute(
        'data-init-value',
        '# Hello World',
      );
    });

    it('应该正确渲染 md 类型', () => {
      const data: RealtimeFollowData = {
        type: 'md',
        content: '**Bold text**',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });
  });

  describe('状态管理测试', () => {
    it('应该显示加载状态', () => {
      const data: RealtimeFollowData = {
        type: 'shell',
        content: 'echo "Hello World"',
        status: 'loading',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('spin')).toBeInTheDocument();
    });

    it('应该显示错误状态', () => {
      const data: RealtimeFollowData = {
        type: 'shell',
        content: 'echo "Hello World"',
        status: 'error',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('spin')).toBeInTheDocument();
    });

    it('应该显示空状态', () => {
      const data: RealtimeFollowData = {
        type: 'shell',
        content: '',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });
  });

  describe('自定义渲染测试', () => {
    it('应该使用自定义加载渲染', () => {
      const customLoading = <div data-testid="custom-loading">Loading...</div>;
      const data: RealtimeFollowData = {
        type: 'shell',
        content: 'echo "Hello World"',
        status: 'loading',
        loadingRender: customLoading,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
    });

    it('应该使用自定义错误渲染', () => {
      const customError = <div data-testid="custom-error">Error occurred</div>;
      const data: RealtimeFollowData = {
        type: 'shell',
        content: 'echo "Hello World"',
        status: 'error',
        errorRender: customError,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    });

    it('应该使用自定义空状态渲染', () => {
      const customEmpty = <div data-testid="custom-empty">No content</div>;
      const data: RealtimeFollowData = {
        type: 'shell',
        content: '',
        status: 'done',
        emptyRender: customEmpty,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });
  });

  describe('HTML 视图模式测试', () => {
    it('应该支持预览模式', () => {
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} htmlViewMode="preview" />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('html-preview')).toHaveAttribute(
        'data-view-mode',
        'preview',
      );
    });

    it('应该支持代码模式', () => {
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} htmlViewMode="code" />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('html-preview')).toHaveAttribute(
        'data-view-mode',
        'code',
      );
    });
  });

  describe('边界条件测试', () => {
    it('应该处理无效类型', () => {
      const data: RealtimeFollowData = {
        type: 'invalid' as any,
        content: 'test',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.queryByTestId('markdown-editor')).not.toBeInTheDocument();
      expect(screen.queryByTestId('html-preview')).not.toBeInTheDocument();
    });

    it('应该处理空内容', () => {
      const data: RealtimeFollowData = {
        type: 'shell',
        content: '',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('应该处理 null 内容', () => {
      const data: RealtimeFollowData = {
        type: 'shell',
        content: null as any,
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollow data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });
  });
});

describe('RealtimeFollowList', () => {
  const mockI18n = {
    locale: {
      'workspace.terminalExecution': '终端执行',
      'workspace.createHtmlFile': '创建 HTML 文件',
      'workspace.markdownContent': 'Markdown 内容',
      'workspace.empty': '暂无数据',
      'htmlPreview.renderFailed': '页面渲染失败',
      'htmlPreview.preview': '预览',
      'htmlPreview.code': '代码',
    } as any,
    language: 'zh-CN' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染完整组件', () => {
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('styled-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('html-preview')).toBeInTheDocument();
    });

    it('应该显示默认的视图模式切换器', () => {
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('segmented')).toBeInTheDocument();
      expect(
        screen.getByTestId('segmented-option-preview'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('segmented-option-code')).toBeInTheDocument();
    });
  });

  describe('视图模式管理测试', () => {
    it('应该支持受控模式', () => {
      const onViewModeChange = vi.fn();
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
        viewMode: 'code',
        onViewModeChange,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('html-preview')).toHaveAttribute(
        'data-view-mode',
        'code',
      );
    });

    it('应该支持非受控模式', () => {
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
        defaultViewMode: 'code',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('html-preview')).toHaveAttribute(
        'data-view-mode',
        'code',
      );
    });

    it('应该处理视图模式切换', () => {
      const onViewModeChange = vi.fn();
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
        onViewModeChange,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      const codeOption = screen.getByTestId('segmented-option-code');
      fireEvent.click(codeOption);

      expect(onViewModeChange).toHaveBeenCalledWith('code');
    });
  });

  describe('自定义内容测试', () => {
    it('应该使用自定义右侧内容', () => {
      const customRightContent = (
        <div data-testid="custom-right">Custom Right Content</div>
      );
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
        rightContent: customRightContent,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('custom-right')).toBeInTheDocument();
      expect(screen.queryByTestId('segmented')).not.toBeInTheDocument();
    });

    it('应该使用自定义分段器选项', () => {
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
        segmentedItems: [
          { label: 'View', value: 'preview' },
          { label: 'Source', value: 'code' },
        ],
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('segmented')).toBeInTheDocument();
      expect(screen.getByTestId('segmented-option-preview')).toHaveTextContent(
        'View',
      );
      expect(screen.getByTestId('segmented-option-code')).toHaveTextContent(
        'Source',
      );
    });
  });

  describe('标题和图标测试', () => {
    it('应该显示默认标题和图标', () => {
      const data: RealtimeFollowData = {
        type: 'shell',
        content: 'echo "Hello World"',
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('终端执行')).toBeInTheDocument();
      expect(screen.getByTestId('shell-icon')).toBeInTheDocument();
    });

    it('应该使用自定义标题和图标', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;
      const data: RealtimeFollowData = {
        type: 'shell',
        content: 'echo "Hello World"',
        status: 'done',
        title: 'Custom Title',
        subTitle: 'Custom Subtitle',
        icon: CustomIcon,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('样式和类名测试', () => {
    it('应该应用自定义类名和样式', () => {
      const data: RealtimeFollowData = {
        type: 'html',
        content: '<div>Hello World</div>',
        status: 'done',
        className: 'custom-class',
        style: { backgroundColor: 'red' },
      };

      const { container } = render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      const containerElement = container.querySelector('.custom-class');
      expect(containerElement).toBeInTheDocument();
      expect(containerElement).toHaveStyle('background-color: red');
    });
  });

  describe('性能测试', () => {
    it('应该处理大量内容', () => {
      const largeContent = 'x'.repeat(10000);
      const data: RealtimeFollowData = {
        type: 'shell',
        content: largeContent,
        status: 'done',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });

    it('应该处理频繁的状态变化', () => {
      const data: RealtimeFollowData = {
        type: 'shell',
        content: 'echo "Hello World"',
        status: 'loading',
      };

      const { rerender } = render(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={data} />
        </I18nContext.Provider>,
      );

      // 模拟状态变化
      const updatedData = { ...data, status: 'done' as const };
      rerender(
        <I18nContext.Provider value={mockI18n}>
          <RealtimeFollowList data={updatedData} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });
  });
});
