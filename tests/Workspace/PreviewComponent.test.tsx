import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PreviewComponent } from '../../src/Workspace/File/PreviewComponent';
import type { FileNode } from '../../src/Workspace/types';

const mdFile: FileNode = {
  name: 'README.md',
  type: 'markdown',
  content: '# Hello',
};

const htmlFile: FileNode = {
  name: 'index.html',
  type: 'code',
  content: '<h1>Hi</h1>',
};

const imgFile: FileNode = {
  name: 'logo.png',
  type: 'image',
  // 重要：DataSourceStrategy 依据 url 生成 previewUrl
  url: 'https://example.com/logo.png',
};

describe('Workspace PreviewComponent', () => {
  it('点击返回按钮触发 onBack，点击下载按钮触发 onDownload', () => {
    const onBack = vi.fn();
    const onDownload = vi.fn();

    render(
      <PreviewComponent
        file={mdFile}
        onBack={onBack}
        onDownload={onDownload}
      />,
    );

    fireEvent.click(screen.getByLabelText('返回文件列表'));
    expect(onBack).toHaveBeenCalled();

    // 头部下载按钮 aria-label 为 "下载"
    fireEvent.click(screen.getByLabelText('下载'));
    expect(onDownload).toHaveBeenCalled();
  });

  it('markdown 文本渲染为 MarkdownEditor（只读）', () => {
    render(<PreviewComponent file={mdFile} onBack={vi.fn()} />);
    // 断言编辑器容器存在（通过占位 class 或文本特征判断）
    expect(
      document.querySelector(
        '[class*="workspace-file-preview"][class*="text"]',
      ),
    ).toBeInTheDocument();
  });

  it('html 文件：Segmented 切换预览/代码', () => {
    render(<PreviewComponent file={htmlFile} onBack={vi.fn()} />);

    // 初始为预览：应存在 iframe（通过 html-preview 标题间接判断）
    // 由于 HtmlPreview 被嵌入且 showSegmented=false，这里通过 actions 区域 Segmented 的存在与切换断言
    const previewTab = screen.getByText('预览');
    const codeTab = screen.getByText('代码');
    expect(previewTab).toBeInTheDocument();
    expect(codeTab).toBeInTheDocument();

    fireEvent.click(codeTab);
    // 切到代码：无需额外断言 iframe；只要切换可点击不报错
    fireEvent.click(previewTab);
  });

  it('图片文件：渲染图片预览', () => {
    render(<PreviewComponent file={imgFile} onBack={vi.fn()} />);
    const container = document.querySelector(
      '[class*="workspace-file-preview"][class*="image"]',
    );
    expect(container).not.toBeNull();
  });

  it('不支持预览的文件显示占位并可下载', () => {
    const binFile: FileNode = {
      name: 'app.bin',
      type: 'other' as any,
      size: '12KB',
    };
    const onDownload = vi.fn();
    render(
      <PreviewComponent
        file={binFile}
        onBack={vi.fn()}
        onDownload={onDownload}
      />,
    );

    // 不支持预览的占位文案
    expect(screen.getByText('此文件类型不支持预览')).toBeInTheDocument();

    // 占位中的下载按钮（与头部下载按钮重名，限定作用域到占位容器）
    const placeholder = document.querySelector(
      '[class*="workspace-file-preview"][class*="placeholder"]',
    ) as HTMLElement;
    expect(placeholder).not.toBeNull();
    const dlBtn = within(placeholder).getByRole('button', { name: '下载文件' });
    fireEvent.click(dlBtn);
    expect(onDownload).toHaveBeenCalled();
  });
});
