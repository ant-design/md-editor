import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { message } from 'antd';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AttachmentButton,
  isImageFile,
  upLoadFileToServer,
} from '../src/MarkdownInputField/AttachmentButton';
import { AttachmentFile } from '../src/MarkdownInputField/AttachmentButton/AttachmentFileList';

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      loading: vi.fn(() => vi.fn()),
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('AttachmentButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isImageFile function', () => {
    it('should return true for image files by extension', () => {
      const svgFile = new File(['<svg></svg>'], 'test.svg', {
        type: 'image/svg+xml',
      }) as AttachmentFile;
      expect(isImageFile(svgFile)).toBe(true);
    });

    it('should return true for image files by MIME type', () => {
      const jpgFile = new File(['jpg content'], 'test.jpg', {
        type: 'image/jpeg',
      }) as AttachmentFile;
      const pngFile = new File(['png content'], 'test.png', {
        type: 'image/png',
      }) as AttachmentFile;
      const gifFile = new File(['gif content'], 'test.gif', {
        type: 'image/gif',
      }) as AttachmentFile;

      expect(isImageFile(jpgFile)).toBe(true);
      expect(isImageFile(pngFile)).toBe(true);
      expect(isImageFile(gifFile)).toBe(true);
    });

    it('should return false for non-image files', () => {
      const textFile = new File(['text content'], 'test.txt', {
        type: 'text/plain',
      }) as AttachmentFile;
      const pdfFile = new File(['pdf content'], 'test.pdf', {
        type: 'application/pdf',
      }) as AttachmentFile;

      expect(isImageFile(textFile)).toBe(false);
      expect(isImageFile(pdfFile)).toBe(false);
    });

    it('should handle files with undefined name/type', () => {
      const fileWithoutType = new File(['content'], 'test.txt', {
        type: '',
      }) as AttachmentFile;
      const fileWithoutName = new File(['content'], '', {
        type: 'text/plain',
      }) as AttachmentFile;

      expect(isImageFile(fileWithoutType)).toBe(false);
      expect(isImageFile(fileWithoutName)).toBe(false);
    });
  });

  describe('upLoadFileToServer function', () => {
    const mockUpload = vi.fn();
    const mockOnFileMapChange = vi.fn();

    beforeEach(() => {
      mockUpload.mockClear();
      mockOnFileMapChange.mockClear();
      // Mock URL.createObjectURL
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
    });

    it('should upload files successfully', async () => {
      const mockFiles = [
        new File(['test'], 'test.txt', {
          type: 'text/plain',
        }) as AttachmentFile,
      ];

      mockUpload.mockResolvedValue('uploaded-url');

      await upLoadFileToServer(mockFiles, {
        upload: mockUpload,
        onFileMapChange: mockOnFileMapChange,
      });

      expect(mockUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test.txt',
          status: 'done',
          url: 'uploaded-url',
        }),
      );
      expect(mockOnFileMapChange).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith('Upload success');
    });

    it('should handle upload errors', async () => {
      const mockFiles = [
        new File(['test'], 'test.txt', {
          type: 'text/plain',
        }) as AttachmentFile,
      ];

      mockUpload.mockRejectedValue(new Error('Upload failed'));

      await upLoadFileToServer(mockFiles, {
        upload: mockUpload,
        onFileMapChange: mockOnFileMapChange,
      });

      expect(message.error).toHaveBeenCalledWith('Upload failed');
    });

    it('should validate file count limits', async () => {
      const mockFiles = [
        new File(['test1'], 'test1.txt', {
          type: 'text/plain',
        }) as AttachmentFile,
        new File(['test2'], 'test2.txt', {
          type: 'text/plain',
        }) as AttachmentFile,
      ];

      await upLoadFileToServer(mockFiles, {
        upload: mockUpload,
        onFileMapChange: mockOnFileMapChange,
        maxFileCount: 1,
      });

      expect(message.error).toHaveBeenCalledWith('最多只能上传 1 个文件');
    });

    it('should validate minimum file count', async () => {
      const mockFiles = [
        new File(['test'], 'test.txt', {
          type: 'text/plain',
        }) as AttachmentFile,
      ];

      await upLoadFileToServer(mockFiles, {
        upload: mockUpload,
        onFileMapChange: mockOnFileMapChange,
        minFileCount: 2,
      });

      expect(message.error).toHaveBeenCalledWith('至少需要上传 2 个文件');
    });

    it('should validate file size limits', async () => {
      const mockFiles = [
        new File(['test'], 'large-file.txt', {
          type: 'text/plain',
        }) as AttachmentFile,
      ];

      // Mock file size
      Object.defineProperty(mockFiles[0], 'size', { value: 2048 });

      await upLoadFileToServer(mockFiles, {
        upload: mockUpload,
        onFileMapChange: mockOnFileMapChange,
        maxFileSize: 1024, // 1KB limit
      });

      expect(message.error).toHaveBeenCalledWith('文件大小超过 1 KB');
    });

    it('should handle image files with preview URL', async () => {
      const mockFiles = [
        new File(['test'], 'test.jpg', {
          type: 'image/jpeg',
        }) as AttachmentFile,
      ];

      mockUpload.mockResolvedValue('uploaded-url');

      await upLoadFileToServer(mockFiles, {
        upload: mockUpload,
        onFileMapChange: mockOnFileMapChange,
      });

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockFiles[0]);
    });

    it('should use existing fileMap if provided', async () => {
      const existingFile = new File(
        ['existing'],
        'existing.txt',
      ) as AttachmentFile;
      existingFile.uuid = 'existing-id';

      const existingFileMap = new Map([['existing-id', existingFile]]);

      const mockFiles = [
        new File(['test'], 'test.txt', {
          type: 'text/plain',
        }) as AttachmentFile,
      ];

      mockUpload.mockResolvedValue('uploaded-url');

      await upLoadFileToServer(mockFiles, {
        upload: mockUpload,
        onFileMapChange: mockOnFileMapChange,
        fileMap: existingFileMap,
      });

      expect(mockOnFileMapChange).toHaveBeenCalledWith(expect.any(Map));
    });
  });

  describe('AttachmentButton Component', () => {
    const mockUploadImage = vi.fn();

    it('should render attachment button', () => {
      render(<AttachmentButton uploadImage={mockUploadImage} />);

      // Look for the attachment button by class
      const attachmentButton = document.querySelector(
        '.ant-md-editor-attachment-button',
      );
      expect(attachmentButton).toBeInTheDocument();
    });

    it('should handle click when not disabled', () => {
      const { container } = render(
        <AttachmentButton uploadImage={mockUploadImage} disabled={false} />,
      );

      const attachmentButton = container.firstChild as HTMLElement;
      fireEvent.click(attachmentButton);

      expect(mockUploadImage).toHaveBeenCalled();
    });

    it('should not handle click when disabled', () => {
      const { container } = render(
        <AttachmentButton uploadImage={mockUploadImage} disabled={true} />,
      );

      const attachmentButton = container.firstChild as HTMLElement;
      fireEvent.click(attachmentButton);

      expect(mockUploadImage).not.toHaveBeenCalled();
    });

    it('should apply disabled class when disabled', () => {
      const { container } = render(
        <AttachmentButton uploadImage={mockUploadImage} disabled={true} />,
      );

      const attachmentButton = container.firstChild;
      expect(attachmentButton).toHaveClass(
        'ant-md-editor-attachment-button-disabled',
      );
    });

    it('should use custom supported formats', () => {
      const customFormats = [
        {
          icon: <span>Custom Icon</span>,
          type: 'Custom Type',
          maxSize: 5 * 1024,
          extensions: ['custom'],
        },
      ];

      render(
        <AttachmentButton
          uploadImage={mockUploadImage}
          supportedFormats={customFormats}
        />,
      );

      // The component should render without errors
      const { container } = render(
        <AttachmentButton
          uploadImage={mockUploadImage}
          supportedFormats={customFormats}
        />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle file upload with callbacks', async () => {
      const mockUpload = vi.fn().mockResolvedValue('uploaded-url');
      const mockOnFileMapChange = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnPreview = vi.fn();
      const mockOnDownload = vi.fn();

      const { container } = render(
        <AttachmentButton
          uploadImage={mockUploadImage}
          upload={mockUpload}
          onFileMapChange={mockOnFileMapChange}
          onDelete={mockOnDelete}
          onPreview={mockOnPreview}
          onDownload={mockOnDownload}
        />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle file size and count limits', () => {
      const { container } = render(
        <AttachmentButton
          uploadImage={mockUploadImage}
          maxFileSize={1024}
          maxFileCount={5}
          minFileCount={1}
        />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
