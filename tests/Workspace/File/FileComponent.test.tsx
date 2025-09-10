import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../../src/i18n';
import { FileComponent } from '../../../src/Workspace/File/FileComponent';
import type { FileNode, GroupNode } from '../../../src/Workspace/types';

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
  Empty: vi.fn().mockImplementation(({ description }) => (
    <div data-testid="empty">
      <div data-testid="empty-description">{description}</div>
    </div>
  )),
  Image: vi.fn().mockImplementation(({ src, preview }) => (
    <div data-testid="image" data-src={src}>
      {preview?.visible && <div data-testid="image-preview">Image Preview</div>}
    </div>
  )),
  Input: vi
    .fn()
    .mockImplementation(({ onChange, value, placeholder, ...props }) => (
      <input
        data-testid="input"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
    )),
  Spin: vi.fn().mockImplementation(({ children, spinning, tip }) => (
    <div data-testid="spin" data-spinning={spinning}>
      {spinning && tip && <div data-testid="spin-tip">{tip}</div>}
      {children}
    </div>
  )),
  Tooltip: vi.fn().mockImplementation(({ children, title }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  )),
  Typography: {
    Text: vi.fn().mockImplementation(({ children, type, ellipsis }) => (
      <span data-testid="text" data-type={type} data-ellipsis={!!ellipsis}>
        {children}
      </span>
    )),
  },
}));

// Mock Ant Design icons
vi.mock('@ant-design/icons', () => ({
  DownloadOutlined: vi
    .fn()
    .mockImplementation(() => (
      <span data-testid="download-icon">Download</span>
    )),
  DownOutlined: vi
    .fn()
    .mockImplementation(() => <span data-testid="down-icon">Down</span>),
  ExportOutlined: vi
    .fn()
    .mockImplementation(() => <span data-testid="export-icon">Export</span>),
  EyeOutlined: vi
    .fn()
    .mockImplementation(() => <span data-testid="eye-icon">Eye</span>),
  RightOutlined: vi
    .fn()
    .mockImplementation(() => <span data-testid="right-icon">Right</span>),
  SearchOutlined: vi
    .fn()
    .mockImplementation(() => <span data-testid="search-icon">Search</span>),
}));

// Mock file utilities
vi.mock('../../../src/Workspace/File/FileTypeProcessor', () => ({
  fileTypeProcessor: {
    inferFileType: vi.fn().mockReturnValue({
      fileType: 'text',
      displayType: 'Text File',
    }),
    processFile: vi.fn().mockReturnValue({
      canPreview: true,
    }),
  },
  isImageFile: vi.fn().mockReturnValue(false),
}));

vi.mock('../../../src/Workspace/File/utils', () => ({
  formatFileSize: vi.fn().mockReturnValue('1KB'),
  formatLastModified: vi.fn().mockReturnValue('2024-01-01'),
  generateUniqueId: vi.fn().mockReturnValue('unique-id'),
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

vi.mock('../../../src/Workspace/File/PreviewComponent', () => ({
  PreviewComponent: vi
    .fn()
    .mockImplementation(({ file, onBack, onDownload }) => (
      <div data-testid="preview-component">
        <div data-testid="preview-file-name">{file.name}</div>
        <button data-testid="preview-back" onClick={onBack}>
          Back
        </button>
        <button data-testid="preview-download" onClick={() => onDownload(file)}>
          Download
        </button>
      </div>
    )),
}));

describe('FileComponent', () => {
  const mockI18n = {
    locale: {
      'workspace.file': '文件',
      'workspace.file.preview': '预览',
      'workspace.file.download': '下载',
      'workspace.file.share': '分享',
      'workspace.download': '下载',
      'workspace.expand': '展开',
      'workspace.collapse': '收起',
      'workspace.group': '分组',
      'workspace.empty': '暂无数据',
      'workspace.searchPlaceholder': '搜索文件名',
      'workspace.noResultsFor': '未找到与「{keyword}」匹配的结果',
      'workspace.loadingPreview': '正在加载预览...',
      'workspace.previewLoadFailed': '预览加载失败',
      'workspace.previewError': '获取预览内容时发生错误',
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

  const mockGroup: GroupNode = {
    id: 'group-1',
    name: 'Documents',
    type: 'text',
    collapsed: false,
    children: [mockFile],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染测试', () => {
    it('应该正确渲染文件列表', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('styled-wrapper')).toBeInTheDocument();
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    it('应该正确渲染分组', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockGroup]} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    it('应该显示空状态当没有文件时', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[]} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('empty')).toBeInTheDocument();
      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });

    it('应该显示加载状态', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[]} loading={true} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('spin')).toHaveAttribute(
        'data-spinning',
        'true',
      );
    });
  });

  describe('搜索功能测试', () => {
    it('应该显示搜索框当 showSearch 为 true 时', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} showSearch={true} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toHaveAttribute(
        'placeholder',
        '搜索文件名',
      );
    });

    it('应该处理搜索关键字变化', () => {
      const onChange = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent
            nodes={[mockFile]}
            showSearch={true}
            keyword="test"
            onChange={onChange}
          />
        </I18nContext.Provider>,
      );

      const input = screen.getByTestId('input');
      fireEvent.change(input, { target: { value: 'new search' } });

      expect(onChange).toHaveBeenCalledWith('new search');
    });

    it('应该显示无搜索结果', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[]} keyword="nonexistent" showSearch={true} />
        </I18nContext.Provider>,
      );

      expect(
        screen.getByText('未找到与「nonexistent」匹配的结果'),
      ).toBeInTheDocument();
    });
  });

  describe('文件操作测试', () => {
    it('应该处理文件点击', () => {
      const onFileClick = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onFileClick={onFileClick} />
        </I18nContext.Provider>,
      );

      const fileItem = screen.getByText('test.txt').closest('[role="button"]');
      fireEvent.click(fileItem!);

      expect(onFileClick).toHaveBeenCalledWith(mockFile);
    });

    it('应该处理文件下载', () => {
      const onDownload = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onDownload={onDownload} />
        </I18nContext.Provider>,
      );

      const downloadButton = screen.getByTestId('button');
      fireEvent.click(downloadButton);

      expect(onDownload).toHaveBeenCalledWith(mockFile);
    });

    it('应该处理文件预览', () => {
      const onPreview = vi.fn().mockResolvedValue(<div>Preview Content</div>);
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onPreview={onPreview} />
        </I18nContext.Provider>,
      );

      const previewButton = screen.getByTestId('button');
      fireEvent.click(previewButton);

      expect(onPreview).toHaveBeenCalledWith(mockFile);
    });

    it('应该处理文件分享', () => {
      const onShare = vi.fn();
      const fileWithShare: FileNode = {
        ...mockFile,
        canShare: true,
      };
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[fileWithShare]} onShare={onShare} />
        </I18nContext.Provider>,
      );

      const shareButton = screen.getByTestId('button');
      fireEvent.click(shareButton);

      expect(onShare).toHaveBeenCalledWith(fileWithShare, {
        anchorEl: expect.any(HTMLElement),
        origin: 'list',
      });
    });
  });

  describe('分组操作测试', () => {
    it('应该处理分组折叠/展开', () => {
      const onToggleGroup = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockGroup]} onToggleGroup={onToggleGroup} />
        </I18nContext.Provider>,
      );

      const groupHeader = screen
        .getByText('Documents')
        .closest('[role="button"]');
      fireEvent.click(groupHeader!);

      expect(onToggleGroup).toHaveBeenCalledWith('text', true);
    });

    it('应该处理分组下载', () => {
      const onGroupDownload = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent
            nodes={[mockGroup]}
            onGroupDownload={onGroupDownload}
          />
        </I18nContext.Provider>,
      );

      const downloadButton = screen.getByTestId('button');
      fireEvent.click(downloadButton);

      expect(onGroupDownload).toHaveBeenCalledWith([mockFile], 'text');
    });
  });

  describe('预览功能测试', () => {
    it('应该显示预览组件', async () => {
      const onPreview = vi.fn().mockResolvedValue(<div>Custom Preview</div>);
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onPreview={onPreview} />
        </I18nContext.Provider>,
      );

      const previewButton = screen.getByTestId('button');
      fireEvent.click(previewButton);

      await waitFor(() => {
        expect(screen.getByTestId('preview-component')).toBeInTheDocument();
      });
    });

    it('应该处理预览加载失败', async () => {
      const onPreview = vi.fn().mockRejectedValue(new Error('Preview failed'));
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onPreview={onPreview} />
        </I18nContext.Provider>,
      );

      const previewButton = screen.getByTestId('button');
      fireEvent.click(previewButton);

      await waitFor(() => {
        expect(screen.getByTestId('alert')).toBeInTheDocument();
        expect(screen.getByText('预览加载失败')).toBeInTheDocument();
      });
    });

    it('应该处理预览返回', async () => {
      const onPreview = vi.fn().mockResolvedValue(<div>Custom Preview</div>);
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onPreview={onPreview} />
        </I18nContext.Provider>,
      );

      const previewButton = screen.getByTestId('button');
      fireEvent.click(previewButton);

      await waitFor(() => {
        expect(screen.getByTestId('preview-component')).toBeInTheDocument();
      });

      const backButton = screen.getByTestId('preview-back');
      fireEvent.click(backButton);

      expect(screen.queryByTestId('preview-component')).not.toBeInTheDocument();
    });
  });

  describe('自定义渲染测试', () => {
    it('应该使用自定义空状态渲染', () => {
      const customEmpty = <div data-testid="custom-empty">Custom Empty</div>;
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[]} emptyRender={customEmpty} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });

    it('应该使用自定义加载渲染', () => {
      const customLoading = <div data-testid="custom-loading">Loading...</div>;
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent
            nodes={[]}
            loading={true}
            loadingRender={() => customLoading}
          />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
    });
  });

  describe('键盘事件测试', () => {
    it('应该处理键盘事件', () => {
      const onFileClick = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onFileClick={onFileClick} />
        </I18nContext.Provider>,
      );

      const fileItem = screen.getByText('test.txt').closest('[role="button"]');
      fireEvent.keyDown(fileItem!, { key: 'Enter' });

      expect(onFileClick).toHaveBeenCalledWith(mockFile);
    });

    it('应该处理空格键事件', () => {
      const onFileClick = vi.fn();
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onFileClick={onFileClick} />
        </I18nContext.Provider>,
      );

      const fileItem = screen.getByText('test.txt').closest('[role="button"]');
      fireEvent.keyDown(fileItem!, { key: ' ' });

      expect(onFileClick).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空节点数组', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={null as any} />
        </I18nContext.Provider>,
      );

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('应该处理没有ID的节点', () => {
      const fileWithoutId = { ...mockFile, id: undefined };
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[fileWithoutId]} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    it('应该处理预览返回false', async () => {
      const onPreview = vi.fn().mockResolvedValue(false);
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} onPreview={onPreview} />
        </I18nContext.Provider>,
      );

      const previewButton = screen.getByTestId('button');
      fireEvent.click(previewButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId('preview-component'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('可访问性测试', () => {
    it('应该提供正确的ARIA标签', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} />
        </I18nContext.Provider>,
      );

      const fileItem = screen.getByText('test.txt').closest('[role="button"]');
      expect(fileItem).toHaveAttribute('aria-label', '文件：test.txt');
    });

    it('应该支持键盘导航', () => {
      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={[mockFile]} />
        </I18nContext.Provider>,
      );

      const fileItem = screen.getByText('test.txt').closest('[role="button"]');
      expect(fileItem).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('性能测试', () => {
    it('应该处理大量文件', () => {
      const manyFiles = Array.from({ length: 100 }, (_, i) => ({
        ...mockFile,
        id: `file-${i}`,
        name: `file-${i}.txt`,
      }));

      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={manyFiles} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('file-0.txt')).toBeInTheDocument();
      expect(screen.getByText('file-99.txt')).toBeInTheDocument();
    });

    it('应该处理大量分组', () => {
      const manyGroups = Array.from({ length: 50 }, (_, i) => ({
        ...mockGroup,
        id: `group-${i}`,
        name: `Group ${i}`,
        children: [
          {
            ...mockFile,
            id: `file-${i}`,
            name: `file-${i}.txt`,
          },
        ],
      }));

      render(
        <I18nContext.Provider value={mockI18n}>
          <FileComponent nodes={manyGroups} />
        </I18nContext.Provider>,
      );

      expect(screen.getByText('Group 0')).toBeInTheDocument();
      expect(screen.getByText('Group 49')).toBeInTheDocument();
    });
  });
});
