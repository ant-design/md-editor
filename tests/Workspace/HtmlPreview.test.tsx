import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HtmlPreview from '../../src/Workspace/HtmlPreview';

const sampleHtml = '<h1>标题</h1><p>段落</p>';

describe('Workspace HtmlPreview', () => {
  it('默认预览模式下渲染 iframe，loading/error 覆盖层按状态显示', () => {
    const { rerender } = render(
      <HtmlPreview html={sampleHtml} status="loading" />,
    );

    // 预览模式：存在 iframe
    expect(screen.getByTitle('html-preview')).toBeInTheDocument();
    // loading 覆盖层
    expect(
      document.querySelector('.workspace-html-preview__overlay--loading'),
    ).toBeInTheDocument();

    // error 覆盖层
    rerender(<HtmlPreview html={sampleHtml} status="error" />);
    expect(
      document.querySelector('.workspace-html-preview__overlay--error'),
    ).toBeInTheDocument();

    // done 不显示覆盖层
    rerender(<HtmlPreview html={sampleHtml} status="done" />);
    expect(document.querySelector('.workspace-html-preview__overlay')).toBeNull();
  });

  it('非受控模式下通过 Segmented 切换到代码视图，iframe 消失', () => {
    render(<HtmlPreview html={sampleHtml} defaultViewMode="preview" />);

    // 初始有 iframe
    expect(screen.getByTitle('html-preview')).toBeInTheDocument();

    // 切换到 代码
    const codeTab = screen.getByText('代码');
    fireEvent.click(codeTab);

    // 代码模式下，不应有 iframe
    expect(screen.queryByTitle('html-preview')).not.toBeInTheDocument();
  });

  it('受控模式下点击 Segmented 只触发回调不改变内部状态', () => {
    const onModeChange = vi.fn();
    render(
      <HtmlPreview
        html={sampleHtml}
        viewMode="code"
        onViewModeChange={onModeChange}
      />,
    );

    // 代码模式：没有 iframe
    expect(screen.queryByTitle('html-preview')).not.toBeInTheDocument();

    // 点击 预览，应触发回调
    const previewTab = screen.getByText('预览');
    fireEvent.click(previewTab);
    expect(onModeChange).toHaveBeenCalledWith('preview');

    // 仍是受控 code 模式：依旧没有 iframe
    expect(screen.queryByTitle('html-preview')).not.toBeInTheDocument();
  });

  it('支持自定义 segmentedItems 与 labels', () => {
    render(
      <HtmlPreview
        html={sampleHtml}
        segmentedItems={[
          { label: '自定义预览', value: 'preview' },
          { label: '自定义代码', value: 'code' },
        ]}
        labels={{ preview: '预览自定义', code: '代码自定义' }}
      />,
    );

    expect(screen.getByText('自定义预览')).toBeInTheDocument();
    expect(screen.getByText('自定义代码')).toBeInTheDocument();
  });
}); 
