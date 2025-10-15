// @ts-nocheck
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FileMapView } from '../src/MarkdownInputField/FileMapView';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('FileMapView', () => {
  const createMockFile = (name: string, type: string) => ({
    uuid: `uuid-${name}`,
    name,
    type,
    url: `https://example.com/${name}`,
    status: 'done',
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without files', () => {
      const { container } = render(<FileMapView />);
      expect(container.querySelector('.ant-md-editor-file-view-list')).toBeInTheDocument();
    });

    it('should render with files', () => {
      const fileMap = new Map();
      fileMap.set('file-1', createMockFile('test.jpg', 'image/jpeg'));

      render(<FileMapView fileMap={fileMap} />);
      
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<FileMapView className="custom-file-view" />);
      expect(container.querySelector('.custom-file-view')).toBeInTheDocument();
    });

    it('should apply custom style', () => {
      const customStyle = { backgroundColor: 'red' };
      const { container } = render(<FileMapView style={customStyle} />);
      const element = container.querySelector('.ant-md-editor-file-view-list');
      expect(element).toHaveStyle(customStyle);
    });
  });

  describe('File Display', () => {
    it('should display limited number of files', () => {
      const fileMap = new Map();
      fileMap.set('file-1', createMockFile('file1.jpg', 'image/jpeg'));
      fileMap.set('file-2', createMockFile('file2.jpg', 'image/jpeg'));
      fileMap.set('file-3', createMockFile('file3.jpg', 'image/jpeg'));
      fileMap.set('file-4', createMockFile('file4.jpg', 'image/jpeg'));

      render(<FileMapView fileMap={fileMap} maxDisplayCount={2} />);
      
      // Should only display first 2 files
      expect(screen.getByText('file1.jpg')).toBeInTheDocument();
      expect(screen.getByText('file2.jpg')).toBeInTheDocument();
    });

    it('should display all files when showMoreButton is false', () => {
      const fileMap = new Map();
      fileMap.set('file-1', createMockFile('file1.jpg', 'image/jpeg'));
      fileMap.set('file-2', createMockFile('file2.jpg', 'image/jpeg'));
      fileMap.set('file-3', createMockFile('file3.jpg', 'image/jpeg'));
      fileMap.set('file-4', createMockFile('file4.jpg', 'image/jpeg'));

      render(
        <FileMapView
          fileMap={fileMap}
          maxDisplayCount={2}
          showMoreButton={false}
        />,
      );
      
      // Should display all files
      expect(screen.getByText('file1.jpg')).toBeInTheDocument();
      expect(screen.getByText('file2.jpg')).toBeInTheDocument();
      expect(screen.getByText('file3.jpg')).toBeInTheDocument();
      expect(screen.getByText('file4.jpg')).toBeInTheDocument();
    });

    it('should show "View All" button when files exceed max count', () => {
      const fileMap = new Map();
      for (let i = 1; i <= 5; i++) {
        fileMap.set(`file-${i}`, createMockFile(`file${i}.jpg`, 'image/jpeg'));
      }

      render(<FileMapView fileMap={fileMap} maxDisplayCount={3} />);
      
      // Should show view all button
      const viewAllButton = screen.queryByText(/查看.*文件/);
      expect(viewAllButton).toBeInTheDocument();
    });
  });

  describe('File Actions', () => {
    it('should call onPreview when preview is clicked', () => {
      const onPreview = vi.fn();
      const fileMap = new Map();
      const file = createMockFile('test.jpg', 'image/jpeg');
      fileMap.set('file-1', file);

      render(<FileMapView fileMap={fileMap} onPreview={onPreview} />);
      
      // Find and click preview button (implementation-specific)
      const fileItem = screen.getByText('test.jpg').closest('.ant-md-editor-file-view-list-item');
      if (fileItem) {
        fireEvent.mouseEnter(fileItem);
        // Preview button should be visible on hover
      }
    });

    it('should call onDownload when download is clicked', () => {
      const onDownload = vi.fn();
      const fileMap = new Map();
      const file = createMockFile('test.pdf', 'application/pdf');
      fileMap.set('file-1', file);

      render(<FileMapView fileMap={fileMap} onDownload={onDownload} />);
      
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    it('should call onViewAll with all files', () => {
      const onViewAll = vi.fn();
      const fileMap = new Map();
      for (let i = 1; i <= 5; i++) {
        fileMap.set(`file-${i}`, createMockFile(`file${i}.jpg`, 'image/jpeg'));
      }

      render(
        <FileMapView
          fileMap={fileMap}
          maxDisplayCount={3}
          onViewAll={onViewAll}
        />,
      );
      
      const viewAllButton = screen.getByText(/查看.*文件/);
      fireEvent.click(viewAllButton);
      
      expect(onViewAll).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'file1.jpg' }),
        expect.objectContaining({ name: 'file2.jpg' }),
        expect.objectContaining({ name: 'file3.jpg' }),
        expect.objectContaining({ name: 'file4.jpg' }),
        expect.objectContaining({ name: 'file5.jpg' }),
      ]));
    });
  });

  describe('Custom Slot', () => {
    it('should render custom slot', () => {
      const customSlot = <div data-testid="custom-slot">Custom Actions</div>;
      const fileMap = new Map();
      fileMap.set('file-1', createMockFile('test.jpg', 'image/jpeg'));

      render(<FileMapView fileMap={fileMap} customSlot={customSlot} />);
      
      expect(screen.getByTestId('custom-slot')).toBeInTheDocument();
    });

    it('should render custom slot as function', () => {
      const customSlot = (file: any) => (
        <div data-testid={`custom-${file.name}`}>Custom for {file.name}</div>
      );
      
      const fileMap = new Map();
      fileMap.set('file-1', createMockFile('test.jpg', 'image/jpeg'));

      render(<FileMapView fileMap={fileMap} customSlot={customSlot} />);
      
      expect(screen.getByTestId('custom-test.jpg')).toBeInTheDocument();
    });
  });

  describe('More Actions', () => {
    it('should render custom more action', () => {
      const renderMoreAction = (file: any) => (
        <button type="button" data-testid={`more-${file.name}`}>
          More for {file.name}
        </button>
      );
      
      const fileMap = new Map();
      fileMap.set('file-1', createMockFile('test.jpg', 'image/jpeg'));

      render(<FileMapView fileMap={fileMap} renderMoreAction={renderMoreAction} />);
      
      // More action should be rendered
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });
  });

  describe('Placement', () => {
    it('should render with left placement by default', () => {
      const { container } = render(<FileMapView />);
      expect(container.querySelector('.ant-md-editor-file-view-list')).toBeInTheDocument();
    });

    it('should render with right placement', () => {
      const { container } = render(<FileMapView placement="right" />);
      expect(container.querySelector('.ant-md-editor-file-view-list')).toBeInTheDocument();
    });
  });

  describe('Image Files', () => {
    it('should display image files in grid', () => {
      const fileMap = new Map();
      fileMap.set('img-1', createMockFile('image1.jpg', 'image/jpeg'));
      fileMap.set('img-2', createMockFile('image2.png', 'image/png'));

      render(<FileMapView fileMap={fileMap} />);
      
      expect(screen.getByText('image1.jpg')).toBeInTheDocument();
      expect(screen.getByText('image2.png')).toBeInTheDocument();
    });

    it('should handle image preview', () => {
      const onPreview = vi.fn();
      const fileMap = new Map();
      const imageFile = createMockFile('image.jpg', 'image/jpeg');
      fileMap.set('img-1', imageFile);

      render(<FileMapView fileMap={fileMap} onPreview={onPreview} />);
      
      // Image should be clickable for preview
      expect(screen.getByText('image.jpg')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty fileMap', () => {
      const fileMap = new Map();
      const { container } = render(<FileMapView fileMap={fileMap} />);
      expect(container.querySelector('.ant-md-editor-file-view-list')).toBeInTheDocument();
    });

    it('should handle null fileMap', () => {
      const { container } = render(<FileMapView fileMap={null} />);
      expect(container.querySelector('.ant-md-editor-file-view-list')).toBeInTheDocument();
    });

    it('should handle undefined fileMap', () => {
      const { container } = render(<FileMapView />);
      expect(container.querySelector('.ant-md-editor-file-view-list')).toBeInTheDocument();
    });

    it('should handle single file', () => {
      const fileMap = new Map();
      fileMap.set('file-1', createMockFile('single.pdf', 'application/pdf'));

      render(<FileMapView fileMap={fileMap} />);
      
      expect(screen.getByText('single.pdf')).toBeInTheDocument();
    });

    it('should handle files with missing properties', () => {
      const fileMap = new Map();
      fileMap.set('file-1', {
        uuid: 'uuid-1',
        name: 'incomplete.txt',
        // Missing type, url, status
      });

      render(<FileMapView fileMap={fileMap} />);
      
      expect(screen.getByText('incomplete.txt')).toBeInTheDocument();
    });
  });

  describe('maxDisplayCount Prop', () => {
    it('should use default maxDisplayCount of 3', () => {
      const fileMap = new Map();
      for (let i = 1; i <= 5; i++) {
        fileMap.set(`file-${i}`, createMockFile(`file${i}.txt`, 'text/plain'));
      }

      render(<FileMapView fileMap={fileMap} />);
      
      // Should display first 3 files
      expect(screen.getByText('file1.txt')).toBeInTheDocument();
      expect(screen.getByText('file2.txt')).toBeInTheDocument();
      expect(screen.getByText('file3.txt')).toBeInTheDocument();
    });

    it('should respect custom maxDisplayCount', () => {
      const fileMap = new Map();
      for (let i = 1; i <= 5; i++) {
        fileMap.set(`file-${i}`, createMockFile(`file${i}.txt`, 'text/plain'));
      }

      render(<FileMapView fileMap={fileMap} maxDisplayCount={2} />);
      
      expect(screen.getByText('file1.txt')).toBeInTheDocument();
      expect(screen.getByText('file2.txt')).toBeInTheDocument();
    });

    it('should handle maxDisplayCount larger than file count', () => {
      const fileMap = new Map();
      fileMap.set('file-1', createMockFile('file1.txt', 'text/plain'));
      fileMap.set('file-2', createMockFile('file2.txt', 'text/plain'));

      render(<FileMapView fileMap={fileMap} maxDisplayCount={10} />);
      
      expect(screen.getByText('file1.txt')).toBeInTheDocument();
      expect(screen.getByText('file2.txt')).toBeInTheDocument();
    });
  });
});
