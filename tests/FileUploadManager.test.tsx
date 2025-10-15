// @ts-nocheck
import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFileUploadManager } from '../src/MarkdownInputField/FileUploadManager';

// Mock antd message
vi.mock('antd', () => ({
  message: {
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('useFileUploadManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  });

  describe('File Upload', () => {
    it('should add file to upload list', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      act(() => {
        result.current.addFile(mockFile);
      });

      expect(result.current.fileList).toHaveLength(1);
      expect(result.current.fileList[0].name).toBe('test.txt');
      expect(result.current.fileList[0].status).toBe('uploading');
    });

    it('should handle multiple file uploads', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      act(() => {
        result.current.addFile(file1);
        result.current.addFile(file2);
      });

      expect(result.current.fileList).toHaveLength(2);
    });

    it('should generate unique uuid for each file', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      act(() => {
        result.current.addFile(file1);
        result.current.addFile(file2);
      });

      const uuids = result.current.fileList.map((f) => f.uuid);
      expect(uuids[0]).not.toBe(uuids[1]);
      expect(uuids[0]).toBeTruthy();
      expect(uuids[1]).toBeTruthy();
    });
  });

  describe('File Removal', () => {
    it('should remove file by uuid', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      act(() => {
        result.current.addFile(mockFile);
      });

      const fileUuid = result.current.fileList[0].uuid;

      act(() => {
        result.current.removeFile(fileUuid);
      });

      expect(result.current.fileList).toHaveLength(0);
    });

    it('should not affect other files when removing one', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      act(() => {
        result.current.addFile(file1);
        result.current.addFile(file2);
      });

      const file1Uuid = result.current.fileList[0].uuid;

      act(() => {
        result.current.removeFile(file1Uuid);
      });

      expect(result.current.fileList).toHaveLength(1);
      expect(result.current.fileList[0].name).toBe('test2.txt');
    });
  });

  describe('File Retry', () => {
    it('should retry failed upload', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      act(() => {
        result.current.addFile(mockFile);
      });

      const fileUuid = result.current.fileList[0].uuid;

      // Simulate upload failure
      act(() => {
        result.current.updateFileStatus(fileUuid, 'error');
      });

      expect(result.current.fileList[0].status).toBe('error');

      // Retry upload
      act(() => {
        result.current.retryFile(fileUuid);
      });

      expect(result.current.fileList[0].status).toBe('uploading');
    });
  });

  describe('Upload Status', () => {
    it('should update file upload status', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      act(() => {
        result.current.addFile(mockFile);
      });

      const fileUuid = result.current.fileList[0].uuid;

      act(() => {
        result.current.updateFileStatus(fileUuid, 'done');
      });

      expect(result.current.fileList[0].status).toBe('done');
    });

    it('should track upload progress', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      act(() => {
        result.current.addFile(mockFile);
      });

      const fileUuid = result.current.fileList[0].uuid;

      act(() => {
        result.current.updateFileProgress(fileUuid, 50);
      });

      expect(result.current.fileList[0].percent).toBe(50);

      act(() => {
        result.current.updateFileProgress(fileUuid, 100);
      });

      expect(result.current.fileList[0].percent).toBe(100);
    });
  });

  describe('File Format Validation', () => {
    it('should validate file format', () => {
      const { result } = renderHook(() =>
        useFileUploadManager({ acceptedFormats: ['.txt', '.pdf'] }),
      );

      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const jpgFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      act(() => {
        result.current.addFile(txtFile);
      });

      expect(result.current.fileList).toHaveLength(1);

      act(() => {
        result.current.addFile(jpgFile);
      });

      // Should reject jpg file
      expect(result.current.fileList).toHaveLength(1);
      expect(result.current.fileList[0].name).toBe('test.txt');
    });

    it('should handle file size limits', () => {
      const { result } = renderHook(
        () => useFileUploadManager({ maxSize: 1024 }), // 1KB limit
      );

      const smallFile = new File(['small'], 'small.txt', {
        type: 'text/plain',
      });
      const largeFile = new File([new ArrayBuffer(2048)], 'large.txt', {
        type: 'text/plain',
      });

      act(() => {
        result.current.addFile(smallFile);
      });

      expect(result.current.fileList).toHaveLength(1);

      act(() => {
        result.current.addFile(largeFile);
      });

      // Should reject large file
      expect(result.current.fileList).toHaveLength(1);
    });
  });

  describe('Clear All Files', () => {
    it('should clear all files', () => {
      const { result } = renderHook(() => useFileUploadManager());

      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      act(() => {
        result.current.addFile(file1);
        result.current.addFile(file2);
      });

      expect(result.current.fileList).toHaveLength(2);

      act(() => {
        result.current.clearFiles();
      });

      expect(result.current.fileList).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle removing non-existent file', () => {
      const { result } = renderHook(() => useFileUploadManager());

      act(() => {
        result.current.removeFile('non-existent-uuid');
      });

      expect(result.current.fileList).toHaveLength(0);
    });

    it('should handle updating status of non-existent file', () => {
      const { result } = renderHook(() => useFileUploadManager());

      act(() => {
        result.current.updateFileStatus('non-existent-uuid', 'done');
      });

      expect(result.current.fileList).toHaveLength(0);
    });
  });
});
