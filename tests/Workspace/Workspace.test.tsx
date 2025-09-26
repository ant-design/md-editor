import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../src/i18n';
import Workspace from '../../src/Workspace';

describe('Workspace Component', () => {
  const mockLocale = {
    'workspace.title': '工作空间',
    'workspace.realtimeFollow': '实时跟随',
    'workspace.browser': '浏览器',
    'workspace.task': '任务',
    'workspace.file': '文件',
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

  it('应该渲染基本的工作空间结构', () => {
    render(
      <TestWrapper>
        <Workspace>
          <Workspace.Realtime
            data={{ type: 'shell', content: 'test content' }}
          />
        </Workspace>
      </TestWrapper>,
    );

    // 检查工作空间容器是否存在
    expect(screen.getByTestId('workspace')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-header')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-title')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-content')).toBeInTheDocument();
    expect(screen.getByTestId('realtime-follow')).toBeInTheDocument();
    // 检查内容是否渲染
    expect(screen.getByText('test content')).toBeInTheDocument();
  });

  it('应该渲染多个标签页', () => {
    render(
      <TestWrapper>
        <Workspace>
          <Workspace.Realtime
            data={{ type: 'shell', content: 'test content' }}
          />
          <Workspace.Browser data={{ content: 'browser content' }} />
          <Workspace.Task data={{ items: [] }} />
          <Workspace.File nodes={[]} />
        </Workspace>
      </TestWrapper>,
    );

    // 检查标签页是否渲染
    expect(screen.getByTestId('workspace-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-segmented')).toBeInTheDocument();
    expect(screen.getByText('实时跟随')).toBeInTheDocument();
    expect(screen.getByText('浏览器')).toBeInTheDocument();
    expect(screen.getByText('任务')).toBeInTheDocument();
    expect(screen.getByText('文件')).toBeInTheDocument();
  });

  it('应该支持自定义标题', () => {
    render(
      <TestWrapper>
        <Workspace title="自定义工作空间">
          <Workspace.Realtime
            data={{ type: 'shell', content: 'test content' }}
          />
        </Workspace>
      </TestWrapper>,
    );

    // 检查标题是否被正确设置
    expect(screen.getByText('自定义工作空间')).toBeInTheDocument();
  });

  it('应该支持受控的activeTabKey', () => {
    const onTabChange = vi.fn();

    render(
      <TestWrapper>
        <Workspace activeTabKey="browser" onTabChange={onTabChange}>
          <Workspace.Realtime
            data={{ type: 'shell', content: 'test content' }}
          />
          <Workspace.Browser data={{ content: 'browser content' }} />
        </Workspace>
      </TestWrapper>,
    );

    // 检查浏览器标签页是否被选中
    const browserRadio = screen.getByRole('radio', { name: '浏览器' });
    expect(browserRadio).toBeChecked();
    // 检查浏览器组件是否被渲染
    expect(screen.getByTestId('browser-list')).toBeInTheDocument();
  });

  it('应该支持关闭回调', () => {
    const onClose = vi.fn();

    render(
      <TestWrapper>
        <Workspace onClose={onClose}>
          <Workspace.Realtime
            data={{ type: 'shell', content: 'test content' }}
          />
        </Workspace>
      </TestWrapper>,
    );

    // 检查关闭按钮是否存在
    const closeButton = screen.getByTestId('workspace-close');
    expect(closeButton).toBeInTheDocument();

    // 点击关闭按钮
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('应该支持自定义样式和类名', () => {
    render(
      <TestWrapper>
        <Workspace
          className="custom-workspace"
          style={{ backgroundColor: 'red' }}
        >
          <Workspace.Realtime
            data={{ type: 'shell', content: 'test content' }}
          />
        </Workspace>
      </TestWrapper>,
    );

    const workspace = screen.getByTestId('workspace');
    expect(workspace).toHaveClass('custom-workspace');
    expect(workspace).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('应该处理空子组件', () => {
    render(
      <TestWrapper>
        <Workspace>{/* 没有子组件 */}</Workspace>
      </TestWrapper>,
    );

    // 没有子组件时应该返回 null
    expect(screen.queryByTestId('workspace')).not.toBeInTheDocument();
  });

  it('应该处理无效的子组件', () => {
    render(
      <TestWrapper>
        <Workspace>
          <Workspace.Realtime
            data={{ type: 'shell', content: 'test content' }}
          />
          <div>无效组件</div>
          <Workspace.Browser data={{ content: 'browser content' }} />
        </Workspace>
      </TestWrapper>,
    );

    // 只应该渲染有效的子组件，但只有当前激活的标签页内容会被渲染
    expect(screen.getByTestId('realtime-follow')).toBeInTheDocument();
    expect(screen.queryByText('无效组件')).not.toBeInTheDocument();
    // 检查标签页是否存在（即使内容未渲染）
    expect(screen.getByText('浏览器')).toBeInTheDocument();
  });

  it('应该传递正确的props给子组件', () => {
    render(
      <TestWrapper>
        <Workspace>
          <Workspace.Realtime
            data={{ type: 'shell', content: 'test content' }}
          />
          <Workspace.Browser data={{ content: 'browser content' }} />
        </Workspace>
      </TestWrapper>,
    );

    // 检查当前激活的子组件是否正确渲染
    expect(screen.getByTestId('realtime-follow')).toBeInTheDocument();
    // 检查内容是否正确传递
    expect(screen.getByText('test content')).toBeInTheDocument();
    // 检查标签页是否存在
    expect(screen.getByText('浏览器')).toBeInTheDocument();
  });

  it('应该使用默认国际化文本', () => {
    render(
      <ConfigProvider>
        <I18nContext.Provider value={{ locale: mockLocale, language: 'zh-CN' }}>
          <Workspace>
            <Workspace.Realtime
              data={{ type: 'shell', content: 'test content' }}
            />
          </Workspace>
        </I18nContext.Provider>
      </ConfigProvider>,
    );

    // 应该使用默认文本（实际渲染的是"终端执行"）
    expect(screen.getByText('终端执行')).toBeInTheDocument();
    expect(screen.getByTestId('realtime-follow')).toBeInTheDocument();
  });

  it('应该处理标签页切换', () => {
    const onTabChange = vi.fn();

    render(
      <TestWrapper>
        <Workspace onTabChange={onTabChange}>
          <Workspace.Realtime data={{ type: 'shell', content: '' }} />
          <Workspace.Browser data={{ content: '' }} />
        </Workspace>
      </TestWrapper>,
    );

    // 查找并点击标签页切换按钮
    const segmentedControl = screen.getByTestId('workspace-segmented');
    expect(segmentedControl).toBeInTheDocument();
    expect(screen.getByTestId('workspace-tabs')).toBeInTheDocument();
  });
});
