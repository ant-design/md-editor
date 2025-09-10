import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../../src/i18n';
import { PreviewComponent } from '../../../src/Workspace/File/PreviewComponent';
import type { FileNode } from '../../../src/Workspace/types';

// Mock Ant Design components
vi.mock('antd', () => ({
  Alert: vi.fn().mockImplementation(({ message, description, type }) => (
    <div data-testid="alert" data-type={type}>
      <div data-testid="alert-message">{message}</div>
      <div data-testid="alert-description">{description}</div>
    </div>
  )),
  Button: vi
    .fn()
    .mockImplementation(({ children, onClick, icon, ...props }) => (
      <button
        data-testid="button"
        onClick={onClick}
        data-icon={icon ? 'has-icon' : 'no-icon'}
        {...props}
      >
        {icon}
        {children}
      </button>
    )),
  ConfigProvider: {
    ConfigContext: React.createContext({
      getPrefixCls: (suffix: string) => `ant-${suffix}`,
    }),
  },
  Image: vi.fn().mockImplementation(({ src, alt }) => (
    <div data-testid="image" data-src={src} data-alt={alt}>
      Image Preview
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
  Spin: vi.fn().mockImplementation(({ children, size, tip }) => (
    <div data-testid="spin" data-size={size}>
      {tip && <div data-testid="spin-tip">{tip}</div>}
      {children}
    </div>
  )),
  Tooltip: vi.fn().mockImplementation(({ children, title }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  )),
}));

// Mock Ant Design icons
vi.mock('@ant-design/icons', () => ({
  ArrowLeftOutlined: vi
    .fn()
    .mockImplementation(() => <span data-testid="arrow-left-icon">←</span>),
  DownloadOutlined: vi
    .fn()
    .mockImplementation(() => (
      <span data-testid="download-icon">Download</span>
    )),
  ExportOutlined: vi
    .fn()
    .mockImplementation(() => <span data-testid="export-icon">Export</span>),
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
            setMDContent: vi.fn(),
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

// Mock file utilities
vi.mock('../../../src/Workspace/utils', () => ({
  formatLastModified: vi.fn().mockReturnValue('2024-01-01 12:00:00'),
}));

vi.mock('../../../src/Workspace/utils/codeLanguageUtils', () => ({
  getLanguageFromFilename: vi.fn().mockReturnValue('javascript'),
  wrapContentInCodeBlock: vi
    .fn()
    .mockImplementation(
      (content, language) => `\`\`\`${language}\n${content}\n\`\`\``,
    ),
}));

vi.mock('../../../src/Workspace/File/FileTypeProcessor', () => ({
  fileTypeProcessor: {
    processFile: vi.fn().mockReturnValue({
      typeInference: {
        category: 'text',
        fileType: 'text',
      },
      dataSource: {
        content: 'Hello World',
        mimeType: 'text/plain',
      },
      canPreview: true,
      previewMode: 'markdown',
    }),
    inferFileType: vi.fn().mockReturnValue({
      fileType: 'text',
    }),
    cleanupResult: vi.fn(),
  },
}));

vi.mock('../../../src/Workspace/File/utils', () => ({
  getFileTypeIcon: vi
    .fn()
    .mockReturnValue(<span data-testid="file-icon">File</span>),
}));

vi.mock('../../../src/Workspace/File/style', () => ({
  useFileStyle: vi.fn().mockReturnValue({
    wrapSSR: (children: React.ReactNode) => (
      <div data-testid="styled-wrapper">{children}</div>
    ),
    hashId: 'test-hash-id',
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe('PreviewComponent', () => {
  const mockI18n = {
    locale: {
      'workspace.file.backToFileList': '返回文件列表',
      'workspace.file.download': '下载',
      'workspace.file.share': '分享',
      'workspace.file.fileName': '文件名：',
      'workspace.file.fileSize': '文件大小：',
      'workspace.file.clickToDownload': '点击下载',
      'workspace.file.cannotGetImagePreview': '无法获取图片预览',
      'workspace.file.cannotGetVideoPreview': '无法获取视频预览',
      'workspace.file.cannotGetAudioPreview': '无法获取音频预览',
      'workspace.file.cannotGetPdfPreview': '无法获取PDF预览',
      'workspace.file.unknownFileType': '未知的文件类型',
      'workspace.file.generationTime': '生成时间：',
      'htmlPreview.preview': '预览',
      'htmlPreview.code': '代码',
    } as any,
    language: 'zh-CN' as const,
  };

  const mockFile: FileNode = {
    id: 'file-1',
    name: 'test.txt',
    type: 'text',
    size: 1024,
    lastModified: new Date('2024-01-01'),
    url: 'https://example.com/test.txt',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染预览组件', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('styled-wrapper')).toBeInTheDocument();
      expect(screen.getByText('test.txt')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });

    it('应该显示文件信息', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('test.txt')).toBeInTheDocument();
      expect(
        screen.getByText('生成时间：2024-01-01 12:00:00'),
      ).toBeInTheDocument();
    });

    it('应该显示操作按钮', () => {
      const onDownload = vi.fn();
      const onShare = vi.fn();
      const fileWithShare: FileNode = {
        ...mockFile,
        canShare: true,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent
            file={fileWithShare}
            onBack={() => {}}
            onDownload={onDownload}
            onShare={onShare}
          />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('download-icon')).toBeInTheDocument();
      expect(screen.getByTestId('export-icon')).toBeInTheDocument();
    });
  });

  describe('自定义内容测试', () => {
    it('应该使用自定义内容', () => {
      const customContent = (
        <div data-testid="custom-content">Custom Content</div>
      );

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent
            file={mockFile}
            onBack={() => {}}
            customContent={customContent}
          />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('应该使用自定义头部', () => {
      const customHeader = <div data-testid="custom-header">Custom Header</div>;

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent
            file={mockFile}
            onBack={() => {}}
            customHeader={customHeader}
          />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow-left-icon')).not.toBeInTheDocument();
    });
  });

  describe('文件类型预览测试', () => {
    it('应该预览文本文件', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });

    it('应该预览HTML文件', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'text',
          fileType: 'html',
        },
        dataSource: {
          content: '<div>Hello World</div>',
          mimeType: 'text/html',
        },
        canPreview: true,
        previewMode: 'html',
      });

      const htmlFile: FileNode = {
        ...mockFile,
        name: 'test.html',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={htmlFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('html-preview')).toBeInTheDocument();
      expect(screen.getByTestId('segmented')).toBeInTheDocument();
    });

    it('应该预览图片文件', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'image',
          fileType: 'image',
        },
        dataSource: {
          previewUrl: 'https://example.com/image.jpg',
          mimeType: 'image/jpeg',
        },
        canPreview: true,
        previewMode: 'image',
      });

      const imageFile: FileNode = {
        ...mockFile,
        name: 'test.jpg',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={imageFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('image')).toBeInTheDocument();
    });

    it('应该预览视频文件', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'video',
          fileType: 'video',
        },
        dataSource: {
          previewUrl: 'https://example.com/video.mp4',
          mimeType: 'video/mp4',
        },
        canPreview: true,
        previewMode: 'video',
      });

      const videoFile: FileNode = {
        ...mockFile,
        name: 'test.mp4',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={videoFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      const video = screen.getByRole('generic');
      expect(video).toHaveClass('ant-workspace-file-preview-video');
    });

    it('应该预览音频文件', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'audio',
          fileType: 'audio',
        },
        dataSource: {
          previewUrl: 'https://example.com/audio.mp3',
          mimeType: 'audio/mp3',
        },
        canPreview: true,
        previewMode: 'audio',
      });

      const audioFile: FileNode = {
        ...mockFile,
        name: 'test.mp3',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={audioFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      const audio = screen.getByRole('generic');
      expect(audio).toHaveClass('ant-workspace-file-preview-audio');
    });

    it('应该预览PDF文件', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'pdf',
          fileType: 'pdf',
        },
        dataSource: {
          previewUrl: 'https://example.com/document.pdf',
          mimeType: 'application/pdf',
        },
        canPreview: true,
        previewMode: 'pdf',
      });

      const pdfFile: FileNode = {
        ...mockFile,
        name: 'test.pdf',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={pdfFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      const embed = screen.getByRole('generic');
      expect(embed).toHaveClass('ant-workspace-file-preview-pdf');
    });
  });

  describe('状态管理测试', () => {
    it('应该显示加载状态', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'text',
          fileType: 'text',
        },
        dataSource: {
          previewUrl: 'https://example.com/test.txt',
          mimeType: 'text/plain',
        },
        canPreview: true,
        previewMode: 'markdown',
      });

      (global.fetch as any).mockImplementation(
        () => new Promise(() => {}), // 永远不resolve，模拟加载状态
      );

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('spin')).toBeInTheDocument();
      expect(screen.getByText('正在加载文件内容...')).toBeInTheDocument();
    });

    it('应该显示错误状态', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockImplementation(() => {
        throw new Error('File processing failed');
      });

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByText('文件处理失败')).toBeInTheDocument();
    });

    it('应该显示不支持预览的文件', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'binary',
          fileType: 'binary',
        },
        dataSource: {
          mimeType: 'application/octet-stream',
        },
        canPreview: false,
        previewMode: 'none',
      });

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('此文件类型不支持预览')).toBeInTheDocument();
      expect(screen.getByText('文件类型：binary')).toBeInTheDocument();
    });
  });

  describe('交互功能测试', () => {
    it('应该处理返回按钮点击', () => {
      const onBack = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={onBack} />
        </I18nContext.Provider>,
      );

      const backButton = screen
        .getByTestId('arrow-left-icon')
        .closest('button');
      fireEvent.click(backButton!);

      expect(onBack).toHaveBeenCalled();
    });

    it('应该处理下载按钮点击', () => {
      const onDownload = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent
            file={mockFile}
            onBack={() => {}}
            onDownload={onDownload}
          />
        </I18nContext.Provider>,
      );

      const downloadButton = screen.getByTestId('button');
      fireEvent.click(downloadButton);

      expect(onDownload).toHaveBeenCalledWith(mockFile);
    });

    it('应该处理分享按钮点击', () => {
      const onShare = vi.fn();
      const fileWithShare: FileNode = {
        ...mockFile,
        canShare: true,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent
            file={fileWithShare}
            onBack={() => {}}
            onShare={onShare}
          />
        </I18nContext.Provider>,
      );

      const shareButton = screen.getByTestId('button');
      fireEvent.click(shareButton);

      expect(onShare).toHaveBeenCalledWith(mockFile, {
        anchorEl: expect.any(HTMLElement),
        origin: 'preview',
      });
    });

    it('应该处理HTML视图模式切换', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'text',
          fileType: 'html',
        },
        dataSource: {
          content: '<div>Hello World</div>',
          mimeType: 'text/html',
        },
        canPreview: true,
        previewMode: 'html',
      });

      const htmlFile: FileNode = {
        ...mockFile,
        name: 'test.html',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={htmlFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      const codeOption = screen.getByTestId('segmented-option-code');
      fireEvent.click(codeOption);

      expect(screen.getByTestId('html-preview')).toHaveAttribute(
        'data-view-mode',
        'code',
      );
    });
  });

  describe('头部文件信息覆盖测试', () => {
    it('应该使用头部文件信息覆盖', () => {
      const headerFileOverride = {
        name: 'overridden.txt',
        lastModified: new Date('2024-12-31'),
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent
            file={mockFile}
            onBack={() => {}}
            headerFileOverride={headerFileOverride}
          />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('overridden.txt')).toBeInTheDocument();
      expect(
        screen.getByText('生成时间：2024-01-01 12:00:00'),
      ).toBeInTheDocument();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理没有预览URL的图片', () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'image',
          fileType: 'image',
        },
        dataSource: {
          mimeType: 'image/jpeg',
        },
        canPreview: true,
        previewMode: 'image',
      });

      const imageFile: FileNode = {
        ...mockFile,
        name: 'test.jpg',
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={imageFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('无法获取图片预览')).toBeInTheDocument();
    });

    it('应该处理网络请求失败', async () => {
      const {
        fileTypeProcessor,
      } = require('../../../src/Workspace/File/FileTypeProcessor');
      fileTypeProcessor.processFile.mockReturnValue({
        typeInference: {
          category: 'text',
          fileType: 'text',
        },
        dataSource: {
          previewUrl: 'https://example.com/test.txt',
          mimeType: 'text/plain',
        },
        canPreview: true,
        previewMode: 'markdown',
      });

      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument();
      });
    });

    it('应该处理空文件', () => {
      const emptyFile: FileNode = {
        ...mockFile,
        name: '',
        size: 0,
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={emptyFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('应该提供正确的ARIA标签', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      const backButton = screen
        .getByTestId('arrow-left-icon')
        .closest('button');
      expect(backButton).toHaveAttribute('aria-label', '返回文件列表');
    });

    it('应该支持键盘导航', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      const backButton = screen
        .getByTestId('arrow-left-icon')
        .closest('button');
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('性能测试', () => {
    it('应该处理大文件', () => {
      const largeFile: FileNode = {
        ...mockFile,
        size: 100 * 1024 * 1024, // 100MB
      };

      render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={largeFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });

    it('应该处理频繁的文件切换', () => {
      const { rerender } = render(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={mockFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      const newFile: FileNode = {
        ...mockFile,
        name: 'new-file.txt',
      };

      rerender(
        <I18nContext.Provider value={mockI18n}>
          <PreviewComponent file={newFile} onBack={() => {}} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('new-file.txt')).toBeInTheDocument();
    });
  });
});
