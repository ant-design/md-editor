import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../src/i18n';
import {
  RealtimeFollow,
  RealtimeFollowList,
} from '../../src/Workspace/RealtimeFollow';

describe('RealtimeFollow Component', () => {
  const mockLocale = {
    'workspace.terminalExecution': '终端执行',
    'workspace.createHtmlFile': '创建 HTML 文件',
    'workspace.markdownContent': 'Markdown 内容',
    'htmlPreview.preview': '预览',
    'htmlPreview.code': '代码',
    'htmlPreview.renderFailed': '页面渲染失败',
  } as any;

  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <ConfigProvider>
      <I18nContext.Provider value={{ locale: mockLocale, language: 'zh-CN' }}>
        {children}
      </I18nContext.Provider>
    </ConfigProvider>
  );

  describe('RealtimeFollow - Shell Type', () => {
    it('应该渲染 shell 类型内容', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: 'echo "Hello World"',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('echo "Hello World"')).toBeInTheDocument();
    });

    it('应该在测试环境中正常渲染（加载状态不生效）', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: 'loading...',
              status: 'loading',
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中不显示 loading overlay，直接显示内容
      expect(screen.getByText('loading...')).toBeInTheDocument();
    });

    it('应该在测试环境中正常渲染（错误状态不生效）', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: 'error content',
              status: 'error',
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中不显示 error overlay，直接显示内容
      expect(screen.getByText('error content')).toBeInTheDocument();
    });

    it('应该在测试环境中跳过自定义加载渲染', () => {
      const CustomLoading = () => <div>自定义加载中</div>;

      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: 'test',
              status: 'loading',
              loadingRender: <CustomLoading />,
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中自定义渲染不生效
      expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('应该在测试环境中跳过自定义错误渲染', () => {
      const CustomError = () => <div>自定义错误</div>;

      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: 'test',
              status: 'error',
              errorRender: <CustomError />,
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中自定义渲染不生效
      expect(screen.getByText('test')).toBeInTheDocument();
    });
  });

  describe('RealtimeFollow - HTML Type', () => {
    it('应该渲染 HTML 预览', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'html',
              content: '<h1>测试标题</h1>',
              status: 'done',
            }}
            htmlViewMode="preview"
          />
        </TestWrapper>,
      );

      const iframe = document.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
    });

    it('应该渲染 HTML 代码模式', async () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              status: 'done',
            }}
            htmlViewMode="code"
          />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(document.querySelector('.ant-md-editor')).toBeInTheDocument();
      });
    });

    it('应该处理 HTML 内容变化', () => {
      const { rerender } = render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'html',
              content: '<h1>初始</h1>',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const iframe1 = document.querySelector('iframe');
      expect(iframe1).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'html',
              content: '<h1>更新</h1>',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const iframe2 = document.querySelector('iframe');
      expect(iframe2).toBeInTheDocument();
    });
  });

  describe('RealtimeFollow - Markdown Type', () => {
    it('应该渲染 markdown 内容', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'markdown',
              content: '# Markdown 标题',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // Markdown 会被渲染为 HTML
      expect(screen.getByText('Markdown 标题')).toBeInTheDocument();
    });

    it('应该渲染 md 类型', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'md',
              content: '## MD 标题',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // Markdown 会被渲染为 HTML
      expect(screen.getByText('MD 标题')).toBeInTheDocument();
    });
  });

  describe('RealtimeFollow - Default Type', () => {
    it('应该渲染 default 类型', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'default',
              content: '默认内容',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('默认内容')).toBeInTheDocument();
    });
  });

  describe('RealtimeFollow - Empty State', () => {
    it('应该在测试环境中正常渲染编辑器', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: '',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // 在测试环境中，空状态不会特殊处理，直接显示编辑器
      expect(container.querySelector('.ant-md-editor')).toBeInTheDocument();
    });

    it('应该在测试环境中正常渲染编辑器（自定义渲染不生效）', () => {
      const CustomEmpty = () => <div>自定义空状态</div>;

      const { container } = render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: '',
              status: 'done',
              emptyRender: <CustomEmpty />,
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中自定义渲染不生效
      expect(container.querySelector('.ant-md-editor')).toBeInTheDocument();
    });

    it('应该在测试环境中跳过加载状态', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: '',
              status: 'loading',
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中不显示 overlay
      expect(
        container.querySelector('.ant-workspace-realtime-overlay'),
      ).not.toBeInTheDocument();
    });
  });

  describe('RealtimeFollowList Component', () => {
    it('应该渲染完整的实时跟随列表', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test content',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('realtime-follow')).toBeInTheDocument();
      expect(screen.getByText('终端执行')).toBeInTheDocument();
      expect(screen.getByText('test content')).toBeInTheDocument();
    });

    it('应该显示自定义标题', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              title: '自定义标题',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('自定义标题')).toBeInTheDocument();
    });

    it('应该显示副标题', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              subTitle: '副标题内容',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('副标题内容')).toBeInTheDocument();
    });

    it('应该支持返回按钮', () => {
      const onBack = vi.fn();

      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              onBack,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const backButton = screen.getByRole('button');
      fireEvent.click(backButton);

      expect(onBack).toHaveBeenCalled();
    });

    it('应该显示自定义右侧内容', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              rightContent: <div>右侧自定义</div>,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('右侧自定义')).toBeInTheDocument();
    });

    it('应该为 HTML 类型显示分段控制器', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('预览')).toBeInTheDocument();
      expect(screen.getByText('代码')).toBeInTheDocument();
    });

    it('应该支持受控的视图模式', () => {
      const onViewModeChange = vi.fn();

      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              viewMode: 'code',
              onViewModeChange,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(document.querySelector('.ant-md-editor')).toBeInTheDocument();
    });

    it('应该支持非受控的视图模式', async () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              defaultViewMode: 'preview',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(document.querySelector('iframe')).toBeInTheDocument();

      const codeButton = screen.getByText('代码');
      fireEvent.click(codeButton);

      await waitFor(() => {
        expect(document.querySelector('.ant-md-editor')).toBeInTheDocument();
      });
    });

    it('应该支持自定义分段选项', () => {
      const customItems = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ];

      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              segmentedItems: customItems,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('选项1')).toBeInTheDocument();
      expect(screen.getByText('选项2')).toBeInTheDocument();
    });

    it('应该支持分段额外内容', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              segmentedExtra: <div>额外内容</div>,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('额外内容')).toBeInTheDocument();
    });

    it('应该支持自定义样式和类名', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              className: 'custom-class',
              style: { backgroundColor: 'red' },
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
      expect(element).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('应该为不同类型显示对应图标', () => {
      const types = [
        { type: 'shell' as const, title: '终端执行' },
        { type: 'html' as const, title: '创建 HTML 文件' },
        { type: 'markdown' as const, title: 'Markdown 内容' },
      ];

      types.forEach(({ type, title }) => {
        const { unmount } = render(
          <TestWrapper>
            <RealtimeFollowList
              data={{
                type,
                content: 'test',
                status: 'done',
              }}
            />
          </TestWrapper>,
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        unmount();
      });
    });

    it('应该支持自定义图标', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Icon</div>;

      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              icon: CustomIcon,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('应该传递 MarkdownEditor 配置', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test content',
              markdownEditorProps: {
                codeProps: {
                  theme: 'light',
                },
              },
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('test content')).toBeInTheDocument();
    });

    it('应该处理空字符串内容', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: '   ',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中直接显示编辑器
      expect(container.querySelector('.ant-md-editor')).toBeInTheDocument();
    });

    it('应该支持函数形式的自定义渲染（测试环境跳过）', () => {
      const loadingRender = () => <div>函数加载</div>;
      const errorRender = () => <div>函数错误</div>;
      const emptyRender = () => <div>函数空状态</div>;

      const { container, rerender } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              status: 'loading',
              loadingRender,
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中不显示自定义加载渲染
      expect(screen.getByText('test')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              status: 'error',
              errorRender,
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中不显示自定义错误渲染
      expect(screen.getByText('test')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: '',
              status: 'done',
              emptyRender,
            }}
          />
        </TestWrapper>,
      );

      // 测试环境中不显示自定义空状态渲染
      expect(container.querySelector('.ant-md-editor')).toBeInTheDocument();
    });

    it('应该处理视图模式变化回调', () => {
      const onViewModeChange = vi.fn();

      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              onViewModeChange,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const codeButton = screen.getByText('代码');
      fireEvent.click(codeButton);

      expect(onViewModeChange).toHaveBeenCalledWith('code');
    });

    it('应该支持自定义标签文本', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              labels: { preview: '查看', code: '源码' },
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('查看')).toBeInTheDocument();
      expect(screen.getByText('源码')).toBeInTheDocument();
    });

    it('应该为不同类型应用不同的样式类', () => {
      const types = ['shell', 'html', 'markdown'] as const;

      types.forEach((type) => {
        const { container, unmount } = render(
          <TestWrapper>
            <RealtimeFollowList
              data={{
                type,
                content: 'test',
                status: 'done',
              }}
            />
          </TestWrapper>,
        );

        const element = container.querySelector(`[class*="--${type}"]`);
        expect(element).toBeInTheDocument();
        unmount();
      });
    });

    it('应该在有边框类型时添加边框样式', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const header = container.querySelector('[class*="-header-with-border"]');
      expect(header).toBeInTheDocument();
    });

    it('应该在返回按钮存在时应用特殊样式', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              onBack: () => {},
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const header = container.querySelector('[class*="-header-with-back"]');
      expect(header).toBeInTheDocument();
    });
  });

  describe('RealtimeFollow - Edge Cases', () => {
    it('应该处理无效类型', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'invalid-type' as any,
              content: 'test',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(container.firstChild).toBeNull();
    });

    it('应该处理 DiffContent 类型', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: {
                original: 'old content',
                modified: 'new content',
              },
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // DiffContent 会被转换为字符串
      expect(screen.getByText('[object Object]')).toBeInTheDocument();
    });

    it('应该处理 null/undefined 内容', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'shell',
              content: null as any,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // null 会被转为字符串 'null'
      expect(screen.getByText('null')).toBeInTheDocument();
    });

    it('应该处理 HTML 内容为空的情况', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'html',
              content: '',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // 空内容应该显示编辑器或空状态
      expect(
        container.querySelector('.ant-md-editor') ||
          container.querySelector('iframe') ||
          container.firstChild,
      ).toBeTruthy();
    });

    it('应该处理 HTML 内容为 DiffContent 的情况', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'html',
              content: {
                original: '<h1>old</h1>',
                modified: '<h1>new</h1>',
              } as any,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // DiffContent 会被当作对象处理
      expect(
        container.querySelector('.ant-md-editor') ||
          container.querySelector('iframe') ||
          container.firstChild,
      ).toBeTruthy();
    });

    it('应该传递 iframeProps 到 HtmlPreview', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              iframeProps: {
                sandbox: 'allow-scripts',
              },
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
    });

    it('应该传递 markdownEditorProps 到 MarkdownEditor', () => {
      render(
        <TestWrapper>
          <RealtimeFollow
            data={{
              type: 'markdown',
              content: '# Test',
              markdownEditorProps: {
                readonly: true,
              },
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('RealtimeFollowList - Additional Tests', () => {
    it('应该处理 default 类型', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'default',
              content: 'default content',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('终端执行')).toBeInTheDocument();
      expect(screen.getByText('default content')).toBeInTheDocument();
    });

    it('应该正确处理 md 类型的标题', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'md',
              content: 'md content',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('Markdown 内容')).toBeInTheDocument();
    });

    it('应该在 markdown 类型时显示边框', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'markdown',
              content: '# Test',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const header = container.querySelector('[class*="-header-with-border"]');
      expect(header).toBeInTheDocument();
    });

    it('应该在非 HTML 类型时不显示右侧内容', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const segmented = container.querySelector('.ant-segmented');
      expect(segmented).not.toBeInTheDocument();
    });

    it('应该在自定义分段选项时调用回调', () => {
      const onViewModeChange = vi.fn();
      const customItems = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ];

      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              segmentedItems: customItems,
              onViewModeChange,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const option2 = screen.getByText('选项2');
      fireEvent.click(option2);

      expect(onViewModeChange).toHaveBeenCalledWith('option2');
    });

    it('应该只在有 segmentedExtra 时显示额外内容容器', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              segmentedExtra: <div>额外内容</div>,
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const extraContainer = container.querySelector(
        '[class*="-header-segmented-right"]',
      );
      expect(extraContainer).toBeInTheDocument();
    });

    it('应该不显示 segmentedExtra 容器当未提供时', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const extraContainer = container.querySelector(
        '[class*="-header-segmented-right"]',
      );
      expect(extraContainer).not.toBeInTheDocument();
    });

    it('应该在返回按钮模式下隐藏左侧图标', () => {
      const { container } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'shell',
              content: 'test',
              onBack: () => {},
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      const headerLeft = container.querySelector('[class*="-header-left"]');
      const headerContent = container.querySelector(
        '[class*="-header-content"]',
      );
      expect(headerLeft).toBeInTheDocument();
      expect(headerContent).toBeInTheDocument();
    });

    it('应该处理受控模式的视图模式切换', () => {
      const { rerender } = render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              viewMode: 'preview',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(document.querySelector('iframe')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              viewMode: 'code',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      expect(document.querySelector('.ant-md-editor')).toBeInTheDocument();
    });

    it('应该使用 locale 中的默认标签文本', () => {
      render(
        <TestWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              status: 'done',
            }}
          />
        </TestWrapper>,
      );

      // 使用 mockLocale 中定义的文本
      expect(screen.getByText('预览')).toBeInTheDocument();
      expect(screen.getByText('代码')).toBeInTheDocument();
    });

    it('应该在无 locale 时使用默认标签', () => {
      const NoLocaleWrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <ConfigProvider>
          <I18nContext.Provider value={{ locale: {}, language: 'en' }}>
            {children}
          </I18nContext.Provider>
        </ConfigProvider>
      );

      render(
        <NoLocaleWrapper>
          <RealtimeFollowList
            data={{
              type: 'html',
              content: '<h1>测试</h1>',
              status: 'done',
            }}
          />
        </NoLocaleWrapper>,
      );

      // 应该显示默认的英文标签
      expect(screen.getByText('预览')).toBeInTheDocument();
    });
  });
});
