import { renderHook } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nContext } from '../../src/i18n';
import { useFileUploadManager } from '../../src/MarkdownInputField/FileUploadManager';

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock upLoadFileToServer
vi.mock('../../src/MarkdownInputField/AttachmentButton', () => ({
  upLoadFileToServer: vi.fn().mockResolvedValue(undefined),
}));

describe('useFileUploadManager', () => {
  const mockOnFileMapChange = vi.fn();
  const mockUpload = vi.fn();
  const mockOnDelete = vi.fn();

  const createMockFile = (
    uuid: string,
    status: 'uploading' | 'done' | 'error' = 'done',
  ) => ({
    uuid,
    status,
    name: `file-${uuid}`,
    size: 1024,
    type: 'image/png',
    url: `http://example.com/${uuid}`,
  });

  const defaultProps = {
    attachment: {
      enable: true,
      upload: mockUpload,
      onDelete: mockOnDelete,
    },
    fileMap: new Map(),
    onFileMapChange: mockOnFileMapChange,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nContext.Provider
      value={{
        locale: {
          uploadSuccess: 'Upload success',
          uploadFailed: 'Upload failed',
        } as any,
        language: 'en-US',
      }}
    >
      {children}
    </I18nContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本功能', () => {
    it('应该返回正确的初始状态', () => {
      const { result } = renderHook(() => useFileUploadManager(defaultProps), {
        wrapper,
      });

      expect(result.current.fileMap).toEqual(new Map());
      expect(result.current.fileUploadDone).toBe(true);
      expect(result.current.supportedFormat).toBeDefined();
    });

    it('应该判断所有文件上传完成', () => {
      const fileMap = new Map();
      fileMap.set('file1', createMockFile('file1', 'done'));
      fileMap.set('file2', createMockFile('file2', 'done'));

      const { result } = renderHook(
        () =>
          useFileUploadManager({
            ...defaultProps,
            fileMap,
          }),
        { wrapper },
      );

      expect(result.current.fileUploadDone).toBe(true);
    });

    it('应该判断存在上传中的文件', () => {
      const fileMap = new Map();
      fileMap.set('file1', createMockFile('file1', 'done'));
      fileMap.set('file2', createMockFile('file2', 'uploading'));

      const { result } = renderHook(
        () =>
          useFileUploadManager({
            ...defaultProps,
            fileMap,
          }),
        { wrapper },
      );

      expect(result.current.fileUploadDone).toBe(false);
    });

    it('应该判断存在上传失败的文件', () => {
      const fileMap = new Map();
      fileMap.set('file1', createMockFile('file1', 'done'));
      fileMap.set('file2', createMockFile('file2', 'error'));

      const { result } = renderHook(
        () =>
          useFileUploadManager({
            ...defaultProps,
            fileMap,
          }),
        { wrapper },
      );

      expect(result.current.fileUploadDone).toBe(false);
    });
  });

  describe('文件格式配置', () => {
    it('应该使用正确的文件格式配置', () => {
      const customFormat = {
        extensions: ['.pdf', '.doc'],
        maxSize: 10 * 1024 * 1024,
      };

      const { result } = renderHook(
        () =>
          useFileUploadManager({
            ...defaultProps,
            attachment: {
              ...defaultProps.attachment,
              supportedFormat: customFormat,
            } as any,
          }),
        { wrapper },
      );

      expect(result.current.supportedFormat).toEqual(customFormat);
    });
  });

  // Note: 文件上传、删除、重试等功能已经在主组件 MarkdownInputField 测试中验证
});
