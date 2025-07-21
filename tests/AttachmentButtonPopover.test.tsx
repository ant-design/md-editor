import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import AttachmentButtonPopover, {
  AttachmentSupportedFormatsContent,
  SupportedFileFormats,
} from '../src/MarkdownInputField/AttachmentButton/AttachmentButtonPopover';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('AttachmentButtonPopover', () => {
  describe('SupportedFileFormats', () => {
    it('should have default supported formats', () => {
      expect(SupportedFileFormats).toHaveLength(4);
      expect(SupportedFileFormats[0].type).toBe('图片');
      expect(SupportedFileFormats[1].type).toBe('文档');
      expect(SupportedFileFormats[2].type).toBe('音频');
      expect(SupportedFileFormats[3].type).toBe('视频');
    });

    it('should have correct file extensions for images', () => {
      const imageFormat = SupportedFileFormats.find(
        (format) => format.type === '图片',
      );
      expect(imageFormat?.extensions).toContain('jpg');
      expect(imageFormat?.extensions).toContain('jpeg');
      expect(imageFormat?.extensions).toContain('png');
      expect(imageFormat?.extensions).toContain('gif');
    });

    it('should have correct file extensions for documents', () => {
      const docFormat = SupportedFileFormats.find(
        (format) => format.type === '文档',
      );
      expect(docFormat?.extensions).toContain('pdf');
      expect(docFormat?.extensions).toContain('docx');
      expect(docFormat?.extensions).toContain('xlsx');
    });

    it('should have appropriate max sizes', () => {
      const imageFormat = SupportedFileFormats.find(
        (format) => format.type === '图片',
      );
      const videoFormat = SupportedFileFormats.find(
        (format) => format.type === '视频',
      );

      expect(imageFormat?.maxSize).toBe(10 * 1024);
      expect(videoFormat?.maxSize).toBe(100 * 1024);
    });
  });

  describe('AttachmentSupportedFormatsContent', () => {
    it('should render supported formats content', () => {
      render(
        <AttachmentSupportedFormatsContent
          supportedFormats={SupportedFileFormats}
        />,
      );

      expect(
        screen.getByText('支持上传的文件类型和格式：'),
      ).toBeInTheDocument();
      expect(screen.getByText('图片:')).toBeInTheDocument();
      expect(screen.getByText('文档:')).toBeInTheDocument();
      expect(screen.getByText('音频:')).toBeInTheDocument();
      expect(screen.getByText('视频:')).toBeInTheDocument();
    });

    it('should render file extensions for each format', () => {
      render(
        <AttachmentSupportedFormatsContent
          supportedFormats={SupportedFileFormats}
        />,
      );

      expect(screen.getByText('jpg, jpeg, png, gif')).toBeInTheDocument();
      expect(screen.getByText('mp3, wav')).toBeInTheDocument();
      expect(screen.getByText('mp4, avi, mov')).toBeInTheDocument();
    });

    it('should render file size limits', () => {
      render(
        <AttachmentSupportedFormatsContent
          supportedFormats={SupportedFileFormats}
        />,
      );

      // Check that size text is displayed (format may vary)
      // Look for individual size elements instead of using getAllByText
      expect(screen.getByText(/单个最大.*50.*MB/)).toBeInTheDocument();
      expect(screen.getByText(/单个最大.*100.*MB/)).toBeInTheDocument();

      // Check for 10MB text but be more flexible about multiple matches
      const tenMBElements = document.querySelectorAll('*');
      const tenMBCount = Array.from(tenMBElements).filter(
        (el) => el.textContent && /单个最大.*10.*MB/.test(el.textContent),
      ).length;
      expect(tenMBCount).toBeGreaterThanOrEqual(1);
    });

    it('should render custom content when provided', () => {
      const customFormats = [
        {
          icon: <span>Custom Icon</span>,
          type: 'Custom',
          maxSize: 1024,
          extensions: ['custom'],
          content: <div>Custom content for this format</div>,
        },
      ];

      render(
        <AttachmentSupportedFormatsContent supportedFormats={customFormats} />,
      );

      expect(
        screen.getByText('Custom content for this format'),
      ).toBeInTheDocument();
    });

    it('should return null when no supported formats provided', () => {
      const { container } = render(
        <AttachmentSupportedFormatsContent supportedFormats={[]} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should use default formats when supportedFormats is undefined', () => {
      render(<AttachmentSupportedFormatsContent />);

      expect(
        screen.getByText('支持上传的文件类型和格式：'),
      ).toBeInTheDocument();
      expect(screen.getByText('图片:')).toBeInTheDocument();
    });
  });

  describe('AttachmentButtonPopover Component', () => {
    it('should render popover with children', () => {
      render(
        <AttachmentButtonPopover supportedFormats={SupportedFileFormats}>
          <button type="button">Upload File</button>
        </AttachmentButtonPopover>,
      );

      expect(screen.getByText('Upload File')).toBeInTheDocument();
    });

    it('should not render when no supported formats provided', () => {
      const { container } = render(
        <AttachmentButtonPopover supportedFormats={[]}>
          <button type="button">Upload File</button>
        </AttachmentButtonPopover>,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render with custom supported formats', () => {
      const customFormats = [
        {
          icon: <span>📄</span>,
          type: 'Custom Document',
          maxSize: 2048,
          extensions: ['custom', 'doc'],
        },
      ];

      render(
        <AttachmentButtonPopover supportedFormats={customFormats}>
          <button type="button">Upload Custom</button>
        </AttachmentButtonPopover>,
      );

      expect(screen.getByText('Upload Custom')).toBeInTheDocument();
    });

    it('should have correct popover props', () => {
      const { container } = render(
        <AttachmentButtonPopover supportedFormats={SupportedFileFormats}>
          <button type="button">Upload File</button>
        </AttachmentButtonPopover>,
      );

      // The popover should be rendered (we can check for the presence of the trigger)
      expect(container.querySelector('.ant-popover')).toBeFalsy(); // Popover content is not visible by default
      expect(screen.getByText('Upload File')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty format extensions array', () => {
      const formatsWithEmptyExtensions = [
        {
          icon: <span>📄</span>,
          type: 'Empty Extensions',
          maxSize: 1024,
          extensions: [],
        },
      ];

      render(
        <AttachmentSupportedFormatsContent
          supportedFormats={formatsWithEmptyExtensions}
        />,
      );

      expect(screen.getByText('Empty Extensions:')).toBeInTheDocument();
    });

    it('should handle formats with zero max size', () => {
      const formatsWithZeroSize = [
        {
          icon: <span>📄</span>,
          type: 'Zero Size',
          maxSize: 0,
          extensions: ['test'],
        },
      ];

      render(
        <AttachmentSupportedFormatsContent
          supportedFormats={formatsWithZeroSize}
        />,
      );

      // The component should handle zero size (may display NaN or some fallback)
      expect(
        screen.getByText('Zero Size', { exact: false }),
      ).toBeInTheDocument();
    });

    it('should handle formats with very large max size', () => {
      const formatsWithLargeSize = [
        {
          icon: <span>📄</span>,
          type: 'Large Size',
          maxSize: 1024 * 1024 * 1024, // 1GB in KB
          extensions: ['large'],
        },
      ];

      render(
        <AttachmentSupportedFormatsContent
          supportedFormats={formatsWithLargeSize}
        />,
      );

      // Check that large size is displayed with correct unit
      expect(screen.getByText(/单个最大.*1.*TB/)).toBeInTheDocument();
    });

    it('should handle single extension', () => {
      const singleExtensionFormat = [
        {
          icon: <span>📄</span>,
          type: 'Single',
          maxSize: 1024,
          extensions: ['single'],
        },
      ];

      render(
        <AttachmentSupportedFormatsContent
          supportedFormats={singleExtensionFormat}
        />,
      );

      expect(screen.getByText('single')).toBeInTheDocument();
    });
  });
});
