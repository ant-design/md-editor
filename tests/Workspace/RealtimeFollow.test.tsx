import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RealtimeFollowList } from '../../src/Workspace/RealtimeFollow';

const sampleHtml = '<h1>报告</h1>';

describe('Workspace RealtimeFollowList', () => {
  it('html 类型：非受控视图在 Segmented 切换，标题与副标题渲染', () => {
    render(
      <RealtimeFollowList
        data={{
          type: 'html',
          content: sampleHtml,
          title: '创建 HTML 文件',
          subTitle: 'report.html',
          defaultViewMode: 'preview',
          labels: { preview: '预览', code: '代码' },
        }}
      />,
    );

    // 标题&副标题
    expect(screen.getByText('创建 HTML 文件')).toBeInTheDocument();
    expect(screen.getByText('report.html')).toBeInTheDocument();

    // 预览 -> 代码
    const codeTab = screen.getByText('代码');
    fireEvent.click(codeTab);
    // 代码模式下不会展示 iframe（间接验证，通过不存在 html-preview 来判断）
    expect(screen.queryByTitle('html-preview')).not.toBeInTheDocument();
  });

  it('html 类型：segmentedItems 自定义渲染，点击选项触发 onViewModeChange', () => {
    const onChange = vi.fn();
    render(
      <RealtimeFollowList
        data={{
          type: 'html',
          content: sampleHtml,
          title: '创建 HTML 文件',
          subTitle: 'report.html',
          defaultViewMode: 'preview',
          onViewModeChange: onChange,
          segmentedItems: [
            { label: '预览视图', value: 'preview' },
            { label: '代码视图', value: 'code' },
          ],
        }}
      />,
    );

    const codeItem = screen.getByText('代码视图');
    fireEvent.click(codeItem);
    expect(onChange).toHaveBeenCalled();
  });

  it('html 类型：优先使用自定义 rightContent', () => {
    render(
      <RealtimeFollowList
        data={{
          type: 'html',
          content: sampleHtml,
          title: '创建 HTML 文件',
          rightContent: <div data-testid="custom-right">R</div>,
        }}
      />,
    );

    expect(screen.getByTestId('custom-right')).toBeInTheDocument();
  });
}); 
