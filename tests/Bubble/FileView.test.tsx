import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BubbleFileView } from '../../src/Bubble/FileView';
import { AttachmentFile } from '../../src/MarkdownInputField/AttachmentButton/types';

// Mock FileMapView 组件
vi.mock('../../src/MarkdownInputField/FileMapView', () => ({
  FileMapView: (props: any) => (
    <div data-testid="file-map-view">
      <div data-testid="file-map-className">{props.className || 'none'}</div>
      <div data-testid="file-map-placement">{props.placement}</div>
      <div data-testid="file-map-maxDisplayCount">
        {props.maxDisplayCount ?? 'undefined'}
      </div>
      <div data-testid="file-map-showMoreButton">
        {String(props.showMoreButton ?? '')}
      </div>
      <div data-testid="file-map-fileCount">{props.fileMap?.size || 0}</div>
      {props.onPreview && (
        <button
          type="button"
          data-testid="preview-button"
          onClick={() => {
            const file = new File([], 'test.pdf') as AttachmentFile;
            file.uuid = 'file-1';
            file.url = 'http://example.com/test.pdf';
            file.previewUrl = 'http://example.com/preview/test.pdf';
            props.onPreview(file);
          }}
        >
          Preview
        </button>
      )}
      {props.onDownload && (
        <button
          type="button"
          data-testid="download-button"
          onClick={() => {
            const file = new File([], 'test.pdf') as AttachmentFile;
            file.uuid = 'file-1';
            file.url = 'http://example.com/test.pdf';
            props.onDownload(file);
          }}
        >
          Download
        </button>
      )}
      {props.onViewAll && (
        <button
          type="button"
          data-testid="view-all-button"
          onClick={async () => {
            const files = Array.from(props.fileMap?.values() || []);
            await props.onViewAll?.(files);
          }}
        >
          View All
        </button>
      )}
      {props.renderMoreAction &&
        (() => {
          const file = new File([], 'test.pdf') as AttachmentFile;
          file.uuid = 'file-1';
          const action = props.renderMoreAction(file);
          return action ? <div data-testid="more-action">{action}</div> : null;
        })()}
      {props.customSlot && (
        <div data-testid="custom-slot">{props.customSlot}</div>
      )}
    </div>
  ),
}));

describe('BubbleFileView', () => {
  const createMockFile = (uuid: string, name: string): AttachmentFile => {
    const file = new File([], name, {
      type: 'application/pdf',
    }) as AttachmentFile;
    file.uuid = uuid;
    file.url = `http://example.com/${name}`;
    file.previewUrl = `http://example.com/preview/${name}`;
    file.status = 'done';
    return file;
  };

  const defaultProps = {
    bubble: {
      placement: 'left' as const,
      originData: {
        id: 'test-bubble-id',
        role: 'user',
        content: 'Test content',
        fileMap: new Map([
          ['file-1', createMockFile('file-1', 'document1.pdf')],
          ['file-2', createMockFile('file-2', 'document2.pdf')],
        ]),
      },
    },
    bubbleListRef: { current: null },
    placement: 'left' as const,
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本渲染', () => {
    it('应该在没有 fileMap 时返回 null', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            fileMap: undefined,
          },
        },
      };

      const { container } = render(<BubbleFileView {...props} />);
      expect(container.firstChild).toBeNull();
    });

    it('应该在 fileMap 为空时返回 null', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            fileMap: new Map(),
          },
        },
      };

      const { container } = render(<BubbleFileView {...props} />);
      expect(container.firstChild).toBeNull();
    });

    it('应该渲染 FileMapView 当有文件时', () => {
      render(<BubbleFileView {...defaultProps} />);
      expect(screen.getByTestId('file-map-view')).toBeInTheDocument();
      expect(screen.getByTestId('file-map-fileCount')).toHaveTextContent('2');
    });

    it('应该正确传递 placement 属性', () => {
      const props = { ...defaultProps, placement: 'right' as const };
      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('file-map-placement')).toHaveTextContent(
        'right',
      );
    });
  });

  describe('fileViewConfig 配置', () => {
    it('应该传递 className', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            className: 'custom-class',
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('file-map-className')).toHaveTextContent(
        'custom-class',
      );
    });

    it('应该传递 maxDisplayCount', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            maxDisplayCount: 5,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('file-map-maxDisplayCount')).toHaveTextContent(
        '5',
      );
    });

    it('应该传递 showMoreButton', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            showMoreButton: true,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('file-map-showMoreButton')).toHaveTextContent(
        'true',
      );
    });

    it('应该渲染 customSlot', () => {
      const customSlot = <div>Custom Slot Content</div>;
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            customSlot,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('custom-slot')).toHaveTextContent(
        'Custom Slot Content',
      );
    });
  });

  describe('renderFileMoreAction', () => {
    it('应该处理 ReactNode 类型的 renderFileMoreAction', () => {
      const moreAction = <div>More Action</div>;
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            renderFileMoreAction: moreAction,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('more-action')).toHaveTextContent(
        'More Action',
      );
    });

    it('应该处理函数类型的 renderFileMoreAction (接收 file 参数)', () => {
      const renderFn = (file: AttachmentFile) => (
        <div>Action for {file.name}</div>
      );
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            renderFileMoreAction: renderFn,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('more-action')).toHaveTextContent(
        'Action for test.pdf',
      );
    });

    it('应该处理无参数函数返回 ReactNode', () => {
      const renderFn = () => <div>Static Action</div>;
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            renderFileMoreAction: renderFn,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('more-action')).toHaveTextContent(
        'Static Action',
      );
    });

    it('应该处理无参数函数返回函数', () => {
      const renderFn = () => (file: AttachmentFile) => (
        <div>Dynamic for {file.name}</div>
      );
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            renderFileMoreAction: renderFn,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('more-action')).toHaveTextContent(
        'Dynamic for test.pdf',
      );
    });

    it('应该在 renderFileMoreAction 抛出异常时返回 undefined', () => {
      const renderFn = () => {
        throw new Error('Test error');
      };
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: {
            renderFileMoreAction: renderFn,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.queryByTestId('more-action')).not.toBeInTheDocument();
    });

    it('应该在 renderFileMoreAction 未定义时不渲染', () => {
      render(<BubbleFileView {...defaultProps} />);
      expect(screen.queryByTestId('more-action')).not.toBeInTheDocument();
    });
  });

  describe('fileViewEvents 事件处理', () => {
    it('应该使用自定义 onPreview 事件', () => {
      const customPreview = vi.fn();
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: () => ({
            onPreview: customPreview,
          }),
        },
      };

      render(<BubbleFileView {...props} />);
      const previewButton = screen.getByTestId('preview-button');
      fireEvent.click(previewButton);

      expect(customPreview).toHaveBeenCalled();
      expect(customPreview.mock.calls[0][0]).toMatchObject({
        name: 'test.pdf',
        url: 'http://example.com/test.pdf',
      });
    });

    it('应该使用自定义 onDownload 事件', () => {
      const customDownload = vi.fn();
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: () => ({
            onDownload: customDownload,
          }),
        },
      };

      render(<BubbleFileView {...props} />);
      const downloadButton = screen.getByTestId('download-button');
      fireEvent.click(downloadButton);

      expect(customDownload).toHaveBeenCalled();
      expect(customDownload.mock.calls[0][0]).toMatchObject({
        name: 'test.pdf',
        url: 'http://example.com/test.pdf',
      });
    });

    it('应该使用自定义 onViewAll 事件', () => {
      const customViewAll = vi.fn();
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: () => ({
            onViewAll: customViewAll,
          }),
        },
      };

      render(<BubbleFileView {...props} />);
      const viewAllButton = screen.getByTestId('view-all-button');
      fireEvent.click(viewAllButton);

      const allFiles = Array.from(
        defaultProps.bubble.originData.fileMap.values(),
      );
      expect(customViewAll).toHaveBeenCalledWith(allFiles);
    });

    it('应该在没有自定义事件时不传递事件处理器', () => {
      render(<BubbleFileView {...defaultProps} />);
      expect(screen.queryByTestId('preview-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('download-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('view-all-button')).not.toBeInTheDocument();
    });

    it('应该在 fileViewEvents 返回空对象时不传递事件处理器', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: () => ({}),
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.queryByTestId('preview-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('download-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('view-all-button')).not.toBeInTheDocument();
    });

    it('应该正确传递 defaultHandlers 给 fileViewEvents', () => {
      let capturedDefaults: any;
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: (defaults: any) => {
            capturedDefaults = defaults;
            return {};
          },
        },
      };

      render(<BubbleFileView {...props} />);

      expect(capturedDefaults).toBeDefined();
      expect(typeof capturedDefaults.onPreview).toBe('function');
      expect(typeof capturedDefaults.onDownload).toBe('function');
      expect(typeof capturedDefaults.onViewAll).toBe('function');
    });
  });

  describe('defaultHandlers 默认行为', () => {
    it('默认 onPreview 应该使用 previewUrl 打开新窗口', () => {
      const mockOpen = vi.fn();
      const spy = vi.spyOn(window, 'open').mockImplementation(mockOpen);

      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: (defaults: any) => ({
            onPreview: defaults.onPreview,
          }),
        },
      };

      render(<BubbleFileView {...props} />);
      const previewButton = screen.getByTestId('preview-button');
      fireEvent.click(previewButton);

      expect(mockOpen).toHaveBeenCalledWith(
        'http://example.com/preview/test.pdf',
        '_blank',
      );
      spy.mockRestore();
    });

    it('默认 onPreview 应该在没有 previewUrl 时使用 url', () => {
      const mockOpen = vi.fn();
      const spy = vi.spyOn(window, 'open').mockImplementation(mockOpen);

      // 触发 preview,但传入没有 previewUrl 的文件
      const mockFile = new File([], 'test.pdf') as AttachmentFile;
      mockFile.uuid = 'file-no-preview';
      mockFile.url = 'http://example.com/test.pdf';

      const capturedDefaults = vi.fn((defaults) => {
        defaults.onPreview(mockFile);
        return {};
      });

      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: capturedDefaults,
        },
      };

      render(<BubbleFileView {...props} />);
      expect(mockOpen).toHaveBeenCalledWith(
        'http://example.com/test.pdf',
        '_blank',
      );
      spy.mockRestore();
    });

    it('默认 onDownload 应该创建下载链接', () => {
      const mockFile = new File([], 'test.pdf') as AttachmentFile;
      mockFile.uuid = 'file-download';
      mockFile.url = 'http://example.com/test.pdf';

      const capturedDefaults = vi.fn((defaults) => {
        defaults.onDownload(mockFile);
        return {};
      });

      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: capturedDefaults,
        },
      };

      // 先 render 组件,再 spy document 方法
      render(<BubbleFileView {...props} />);

      // 现在 render 完成了,可以安全地 spy
      const mockClick = vi.fn();
      const mockElement = {
        href: '',
        download: '',
        click: mockClick,
        setAttribute: vi.fn(),
      } as any;
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();

      const createSpy = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockElement);
      const appendSpy = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(mockAppendChild);
      const removeSpy = vi
        .spyOn(document.body, 'removeChild')
        .mockImplementation(mockRemoveChild);

      // 再次调用 onDownload 来触发 spy
      capturedDefaults.mock.calls[0][0].onDownload(mockFile);

      expect(createSpy).toHaveBeenCalledWith('a');
      expect(mockElement.href).toBe('http://example.com/test.pdf');
      expect(mockElement.download).toBe('test.pdf');
      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalledWith(mockElement);
      expect(mockRemoveChild).toHaveBeenCalledWith(mockElement);

      createSpy.mockRestore();
      appendSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it('默认 onDownload 应该在没有 URL 时不执行', () => {
      const mockClick = vi.fn();

      const capturedDefaults = vi.fn((defaults) => {
        const file = new File([], 'test.pdf') as AttachmentFile;
        file.uuid = 'file';
        defaults.onDownload(file); // 没有 url
        return {};
      });

      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: capturedDefaults,
        },
      };

      render(<BubbleFileView {...props} />);
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('默认 onViewAll 应该是空函数', () => {
      const capturedDefaults = vi.fn((defaults) => {
        const result = defaults.onViewAll([]);
        expect(result).toBeUndefined();
        return {};
      });

      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: capturedDefaults,
        },
      };

      render(<BubbleFileView {...props} />);
      expect(capturedDefaults).toHaveBeenCalled();
    });
  });

  describe('边界情况', () => {
    it('应该处理 fileViewConfig 为 undefined', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewConfig: undefined,
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('file-map-view')).toBeInTheDocument();
      expect(screen.getByTestId('file-map-className')).toHaveTextContent(
        'none',
      );
    });

    it('应该处理 fileViewEvents 返回 null', () => {
      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          fileViewEvents: () => null,
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('file-map-view')).toBeInTheDocument();
    });

    it('应该处理多个文件', () => {
      const fileMap = new Map([
        ['file-1', createMockFile('file-1', 'doc1.pdf')],
        ['file-2', createMockFile('file-2', 'doc2.pdf')],
        ['file-3', createMockFile('file-3', 'doc3.pdf')],
      ]);

      const props = {
        ...defaultProps,
        bubble: {
          ...defaultProps.bubble,
          originData: {
            ...defaultProps.bubble.originData,
            fileMap,
          },
        },
      };

      render(<BubbleFileView {...props} />);
      expect(screen.getByTestId('file-map-fileCount')).toHaveTextContent('3');
    });
  });
});
