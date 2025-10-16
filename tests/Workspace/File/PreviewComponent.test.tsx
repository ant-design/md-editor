import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvide } from '../../../src/i18n';
import { PreviewComponent } from '../../../src/Workspace/File/PreviewComponent';
import type { FileNode } from '../../../src/Workspace/types';

// Mock fetch
global.fetch = vi.fn();

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ConfigProvider>
    <I18nProvide>{children}</I18nProvide>
  </ConfigProvider>
);

describe('PreviewComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockReset();
  });

  describe('基础渲染', () => {
    it('应该渲染预览头部', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello World',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} onBack={vi.fn()} />
        </TestWrapper>,
      );

      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    it('应该显示返回按钮', () => {
      const handleBack = vi.fn();
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} onBack={handleBack} />
        </TestWrapper>,
      );

      const backBtn = screen.getByLabelText('返回文件列表');
      expect(backBtn).toBeInTheDocument();

      fireEvent.click(backBtn);
      expect(handleBack).toHaveBeenCalled();
    });

    it('应该显示下载按钮', () => {
      const handleDownload = vi.fn();
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} onDownload={handleDownload} />
        </TestWrapper>,
      );

      const downloadBtn = screen.getByLabelText('下载');
      expect(downloadBtn).toBeInTheDocument();

      fireEvent.click(downloadBtn);
      expect(handleDownload).toHaveBeenCalledWith(file);
    });

    it('应该显示分享按钮', () => {
      const handleShare = vi.fn();
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
        canShare: true,
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} onShare={handleShare} />
        </TestWrapper>,
      );

      const shareBtn = screen.getByLabelText('分享');
      expect(shareBtn).toBeInTheDocument();

      fireEvent.click(shareBtn);
      expect(handleShare).toHaveBeenCalledWith(
        file,
        expect.objectContaining({ origin: 'preview' }),
      );
    });

    it('应该显示文件生成时间', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
        lastModified: new Date('2023-12-21 10:30:56'),
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText(/生成时间/)).toBeInTheDocument();
    });

    it('应该支持自定义头部', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      const customHeader = <div data-testid="custom-header">Custom Header</div>;

      render(
        <TestWrapper>
          <PreviewComponent file={file} customHeader={customHeader} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    });

    it('应该支持自定义操作按钮', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      const customActions = (
        <button data-testid="custom-action">Custom Action</button>
      );

      render(
        <TestWrapper>
          <PreviewComponent file={file} customActions={customActions} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });

    it('应该支持覆盖标题文件信息', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      const headerFileOverride = {
        name: 'override.txt',
      };

      render(
        <TestWrapper>
          <PreviewComponent
            file={file}
            headerFileOverride={headerFileOverride}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('override.txt')).toBeInTheDocument();
      expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    });
  });

  describe('文本文件预览', () => {
    it('应该预览文本文件', async () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello World',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        // MarkdownEditor should be rendered
        expect(document.querySelector('.rdme-root')).toBeInTheDocument();
      });
    });

    it('应该从URL加载文本内容', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Fetched content'),
      });

      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        url: 'https://example.com/test.txt',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://example.com/test.txt',
        );
      });
    });

    it('应该处理URL加载失败', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        url: 'https://example.com/test.txt',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText(/文件处理失败/)).toBeInTheDocument();
      });
    });

    it('应该处理网络错误', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        url: 'https://example.com/test.txt',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText(/文件处理失败/)).toBeInTheDocument();
      });
    });
  });

  describe('代码文件预览', () => {
    it('应该预览JavaScript代码', async () => {
      const file: FileNode = {
        id: 'f1',
        name: 'app.js',
        content: 'const x = 1;',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(document.querySelector('.rdme-root')).toBeInTheDocument();
      });
    });

    it('应该预览Python代码', async () => {
      const file: FileNode = {
        id: 'f1',
        name: 'main.py',
        content: 'print("hello")',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(document.querySelector('.rdme-root')).toBeInTheDocument();
      });
    });
  });

  describe('HTML文件预览', () => {
    it('应该预览HTML文件', async () => {
      const file: FileNode = {
        id: 'f1',
        name: 'index.html',
        content: '<h1>Hello</h1>',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Should show HTML preview toggle
        expect(screen.getByText('预览')).toBeInTheDocument();
        expect(screen.getByText('代码')).toBeInTheDocument();
      });
    });

    it('应该切换HTML预览模式', async () => {
      const file: FileNode = {
        id: 'f1',
        name: 'index.html',
        content: '<h1>Hello</h1>',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('预览')).toBeInTheDocument();
      });

      // Click to switch to code view
      fireEvent.click(screen.getByText('代码'));

      // Should show code view
      expect(screen.getByText('代码')).toBeInTheDocument();
    });

    it('应该识别.htm扩展名', async () => {
      const file: FileNode = {
        id: 'f1',
        name: 'page.htm',
        content: '<div>Content</div>',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('预览')).toBeInTheDocument();
        expect(screen.getByText('代码')).toBeInTheDocument();
      });
    });
  });

  describe('图片预览', () => {
    it('应该预览图片', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'image.png',
        url: 'https://example.com/image.png',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      const img = document.querySelector(
        'img[src="https://example.com/image.png"]',
      );
      expect(img).toBeInTheDocument();
    });

    it('应该处理没有预览URL的图片', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'image.png',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText(/无法获取图片预览/)).toBeInTheDocument();
    });
  });

  describe('视频预览', () => {
    it('应该预览视频', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'video.mp4',
        url: 'https://example.com/video.mp4',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      const video = document.querySelector(
        'video[src="https://example.com/video.mp4"]',
      );
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('controls');
    });

    it('应该处理没有预览URL的视频', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'video.mp4',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText(/无法获取视频预览/)).toBeInTheDocument();
    });
  });

  describe('音频预览', () => {
    it('应该预览音频', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'song.mp3',
        url: 'https://example.com/song.mp3',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      const audio = document.querySelector(
        'audio[src="https://example.com/song.mp3"]',
      );
      expect(audio).toBeInTheDocument();
      expect(audio).toHaveAttribute('controls');
    });

    it('应该处理没有预览URL的音频', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'song.mp3',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText(/无法获取音频预览/)).toBeInTheDocument();
    });
  });

  describe('PDF预览', () => {
    it('应该预览PDF', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'document.pdf',
        url: 'https://example.com/document.pdf',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      const embed = document.querySelector(
        'embed[src="https://example.com/document.pdf"]',
      );
      expect(embed).toBeInTheDocument();
      expect(embed).toHaveAttribute('type', 'application/pdf');
    });

    it('应该处理没有预览URL的PDF', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'document.pdf',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText(/无法获取PDF预览/)).toBeInTheDocument();
    });
  });

  describe('不支持的文件类型', () => {
    it('应该显示不支持预览的提示', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'archive.zip',
        url: 'https://example.com/archive.zip',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} onDownload={vi.fn()} />
        </TestWrapper>,
      );

      expect(
        screen.getByText(/此文件无法预览，请下载查看/),
      ).toBeInTheDocument();
      expect(screen.getByText('下载')).toBeInTheDocument();
    });

    it('应该显示文件信息', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'data.bin',
        size: 2048,
        lastModified: new Date('2023-12-21'),
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText('data.bin')).toBeInTheDocument();
      expect(screen.getByText(/2\.00 KB/)).toBeInTheDocument();
    });
  });

  describe('自定义预览内容', () => {
    it('应该显示自定义内容', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      const customContent = (
        <div data-testid="custom-content">Custom Preview</div>
      );

      render(
        <TestWrapper>
          <PreviewComponent file={file} customContent={customContent} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('自定义内容应该覆盖默认预览', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello World',
      };

      const customContent = <div data-testid="custom">Custom</div>;

      render(
        <TestWrapper>
          <PreviewComponent file={file} customContent={customContent} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('custom')).toBeInTheDocument();
      // MarkdownEditor should not be rendered
      expect(document.querySelector('.rdme-root')).not.toBeInTheDocument();
    });
  });

  describe('加载状态', () => {
    it('应该显示文件加载状态', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Generating...',
        loading: true,
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText('正在生成')).toBeInTheDocument();
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });

    it('应该显示处理中状态', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      // Initially should show processing state
      expect(screen.getByText(/正在处理文件/)).toBeInTheDocument();
    });

    it('应该显示加载文本内容状态', async () => {
      (global.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                text: () => Promise.resolve('Content'),
              });
            }, 100);
          }),
      );

      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        url: 'https://example.com/test.txt',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText(/正在加载文件内容/)).toBeInTheDocument();
    });
  });

  describe('MarkdownEditor配置', () => {
    it('应该传递markdownEditorProps', async () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.md',
        content: '# Hello',
      };

      const markdownEditorProps = {
        theme: 'dark' as const,
      };

      render(
        <TestWrapper>
          <PreviewComponent
            file={file}
            markdownEditorProps={markdownEditorProps}
          />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(document.querySelector('.rdme-root')).toBeInTheDocument();
      });
    });
  });

  describe('边缘情况', () => {
    it('应该处理没有名称的文件', () => {
      const file: FileNode = {
        id: 'f1',
        name: '',
        content: 'Hello',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      // Should still render without errors
      expect(document.querySelector('.rdme-root')).toBeTruthy();
    });

    it('应该处理空内容', async () => {
      const file: FileNode = {
        id: 'f1',
        name: 'empty.txt',
        content: '',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(document.querySelector('.rdme-root')).toBeInTheDocument();
      });
    });

    it('应该处理文件类型变化', async () => {
      const file1: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Text',
      };

      const { rerender } = render(
        <TestWrapper>
          <PreviewComponent file={file1} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(document.querySelector('.rdme-root')).toBeInTheDocument();
      });

      const file2: FileNode = {
        id: 'f2',
        name: 'image.png',
        url: 'https://example.com/image.png',
      };

      rerender(
        <TestWrapper>
          <PreviewComponent file={file2} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(document.querySelector('img')).toBeInTheDocument();
      });
    });

    it('应该处理大文件', async () => {
      const largeContent = 'x'.repeat(10000);
      const file: FileNode = {
        id: 'f1',
        name: 'large.txt',
        content: largeContent,
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(document.querySelector('.rdme-root')).toBeInTheDocument();
      });
    });

    it('应该处理特殊字符文件名', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'file with spaces & special.txt',
        content: 'Hello',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(
        screen.getByText('file with spaces & special.txt'),
      ).toBeInTheDocument();
    });

    it('应该处理中文文件名', () => {
      const file: FileNode = {
        id: 'f1',
        name: '测试文档.txt',
        content: '你好',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      expect(screen.getByText('测试文档.txt')).toBeInTheDocument();
    });
  });

  describe('无障碍性', () => {
    it('应该为返回按钮提供aria-label', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} onBack={vi.fn()} />
        </TestWrapper>,
      );

      expect(screen.getByLabelText('返回文件列表')).toBeInTheDocument();
    });

    it('应该为下载按钮提供aria-label', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} onDownload={vi.fn()} />
        </TestWrapper>,
      );

      expect(screen.getByLabelText('下载')).toBeInTheDocument();
    });

    it('应该为分享按钮提供aria-label', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'test.txt',
        content: 'Hello',
        canShare: true,
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} onShare={vi.fn()} />
        </TestWrapper>,
      );

      expect(screen.getByLabelText('分享')).toBeInTheDocument();
    });

    it('应该为视频提供字幕轨道', () => {
      const file: FileNode = {
        id: 'f1',
        name: 'video.mp4',
        url: 'https://example.com/video.mp4',
      };

      render(
        <TestWrapper>
          <PreviewComponent file={file} />
        </TestWrapper>,
      );

      const track = document.querySelector('track[kind="captions"]');
      expect(track).toBeInTheDocument();
    });
  });
});
