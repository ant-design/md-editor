import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FileCategory, type FileNode } from '../../../types';
import { DataSourceType, PreviewCapability } from '../../DataSourceStrategy';
import {
  fileTypeProcessor,
  type FileProcessResult,
} from '../../FileTypeProcessor';
import { usePreviewContent } from '../usePreviewContent';

vi.mock('../../FileTypeProcessor', () => ({
  fileTypeProcessor: {
    processFile: vi.fn(),
    cleanupResult: vi.fn(),
  },
}));

const remoteFile: FileNode = {
  id: 'a',
  name: 'a.txt',
  url: 'https://example.com/a.txt',
};

const textResult = (file: FileNode): FileProcessResult => ({
  typeInference: { category: FileCategory.Text, fileType: 'plainText' },
  dataSource: {
    sourceType: DataSourceType.URL,
    previewCapability: PreviewCapability.FULL,
    previewUrl: file.url,
    content: file.content,
    needsCleanup: false,
  },
  canPreview: true,
  previewMode: 'inline',
});

const response = (text: string): Response =>
  ({ ok: true, text: async () => text }) as Response;

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('usePreviewContent request lifecycle', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(fileTypeProcessor.processFile).mockImplementation(textResult);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps a loaded preview when a parent clones the file or changes locale', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response('ready'));
    vi.stubGlobal('fetch', fetchMock);
    const { result, rerender } = renderHook(
      ({ file, locale }) => usePreviewContent(file, undefined, locale),
      { initialProps: { file: remoteFile, locale: { language: 'en' } } },
    );
    await waitFor(() =>
      expect(result.current.contentState.status).toBe('ready'),
    );

    rerender({ file: { ...remoteFile }, locale: { language: 'zh' } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fileTypeProcessor.processFile).toHaveBeenCalledTimes(1);
    expect(fileTypeProcessor.cleanupResult).not.toHaveBeenCalled();
    expect(result.current.contentState).toMatchObject({ rawContent: 'ready' });
  });

  it('reloads a changed remote revision while keeping equivalent timestamp objects stable', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response('first revision'))
      .mockResolvedValueOnce(response('next revision'));
    vi.stubGlobal('fetch', fetchMock);
    const { result, rerender } = renderHook(
      ({ file }) => usePreviewContent(file, undefined),
      {
        initialProps: { file: { ...remoteFile, lastModified: new Date(1000) } },
      },
    );
    await waitFor(() =>
      expect(result.current.contentState.status).toBe('ready'),
    );
    rerender({ file: { ...remoteFile, lastModified: new Date(1000) } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    rerender({ file: { ...remoteFile, lastModified: new Date(2000) } });
    await waitFor(() =>
      expect(result.current.contentState).toMatchObject({
        rawContent: 'next revision',
      }),
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('aborts the previous request and ignores a late response after switching files', async () => {
    const first = deferred<Response>();
    const fetchMock = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce(response('second'));
    vi.stubGlobal('fetch', fetchMock);
    const { result, rerender } = renderHook(
      ({ file }) => usePreviewContent(file, undefined),
      { initialProps: { file: remoteFile } },
    );
    const firstSignal = fetchMock.mock.calls[0][1].signal as AbortSignal;
    rerender({
      file: { id: 'b', name: 'b.txt', url: 'https://example.com/b.txt' },
    });
    expect(firstSignal.aborted).toBe(true);
    await waitFor(() =>
      expect(result.current.contentState).toMatchObject({
        rawContent: 'second',
      }),
    );

    await act(async () => first.resolve(response('stale first')));
    expect(result.current.contentState).toMatchObject({ rawContent: 'second' });
    expect(fileTypeProcessor.cleanupResult).toHaveBeenCalledTimes(1);
  });

  it('ignores an old request failure after the next file is ready', async () => {
    const first = deferred<Response>();
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(first.promise));
    const { result, rerender } = renderHook(
      ({ file }) => usePreviewContent(file, undefined),
      { initialProps: { file: remoteFile } },
    );
    rerender({ file: { id: 'b', name: 'b.txt', content: 'current' } });
    expect(result.current.contentState).toMatchObject({
      rawContent: 'current',
    });
    await act(async () => first.reject(new Error('stale failure')));
    expect(result.current.contentState).toMatchObject({
      rawContent: 'current',
    });
  });

  it('cancels requests and cleans up their owned data source on unmount', async () => {
    const request = deferred<Response>();
    const fetchMock = vi.fn().mockReturnValue(request.promise);
    vi.stubGlobal('fetch', fetchMock);
    const { unmount } = renderHook(() =>
      usePreviewContent(remoteFile, undefined),
    );
    const signal = fetchMock.mock.calls[0][1].signal as AbortSignal;
    unmount();
    expect(signal.aborted).toBe(true);
    expect(fileTypeProcessor.cleanupResult).toHaveBeenCalledTimes(1);
    await act(async () => request.resolve(response('too late')));
    expect(fileTypeProcessor.cleanupResult).toHaveBeenCalledTimes(1);
  });

  it('does not process streaming placeholder updates until generation is done', () => {
    const { result, rerender } = renderHook(
      ({ file }) => usePreviewContent(file, undefined),
      {
        initialProps: {
          file: { ...remoteFile, loading: true, content: 'one' },
        },
      },
    );
    rerender({ file: { ...remoteFile, loading: true, content: 'two' } });
    expect(fileTypeProcessor.processFile).not.toHaveBeenCalled();
    expect(result.current.processResult).toBeNull();
    rerender({ file: { ...remoteFile, loading: false, content: 'done' } });
    expect(fileTypeProcessor.processFile).toHaveBeenCalledTimes(1);
    expect(result.current.contentState).toMatchObject({ rawContent: 'done' });
  });

  it('reprocesses changed source fields even if the caller keeps the same file object', () => {
    const file = { ...remoteFile, content: 'first' };
    const { result, rerender } = renderHook(() =>
      usePreviewContent(file, undefined),
    );
    file.content = 'updated';
    rerender();
    expect(result.current.contentState).toMatchObject({
      rawContent: 'updated',
    });
    expect(fileTypeProcessor.processFile).toHaveBeenCalledTimes(2);
  });

  it('creates a fresh data source when returning from custom content', () => {
    const { result, rerender } = renderHook(
      ({ customContent }: { customContent: React.ReactNode }) =>
        usePreviewContent(
          { ...remoteFile, content: 'document' },
          customContent,
        ),
      { initialProps: { customContent: undefined } },
    );
    expect(result.current.contentState.status).toBe('ready');
    rerender({ customContent: <div>custom</div> });
    expect(result.current.processResult).toBeNull();
    expect(fileTypeProcessor.cleanupResult).toHaveBeenCalledTimes(1);
    rerender({ customContent: undefined });
    expect(fileTypeProcessor.processFile).toHaveBeenCalledTimes(2);
    expect(result.current.contentState).toMatchObject({
      rawContent: 'document',
    });
  });

  it('does not fetch text that the data source cannot preview', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.mocked(fileTypeProcessor.processFile).mockImplementation((file) => ({
      ...textResult(file),
      canPreview: false,
      previewMode: 'none',
    }));
    renderHook(() => usePreviewContent(remoteFile, undefined));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats empty inline content as a ready document without fetching a fallback URL', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() =>
      usePreviewContent({ ...remoteFile, content: '' }, undefined),
    );
    expect(result.current.contentState).toEqual({
      status: 'ready',
      rawContent: '',
      mdContent: '',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clears the previous process result when processing a new file fails', () => {
    const { result, rerender } = renderHook(
      ({ file }) => usePreviewContent(file, undefined),
      { initialProps: { file: { ...remoteFile, content: 'first' } } },
    );
    expect(result.current.contentState.status).toBe('ready');
    vi.mocked(fileTypeProcessor.processFile).mockImplementation(() => {
      throw new Error('new file failed');
    });
    rerender({ file: { ...remoteFile, content: 'second' } });
    expect(result.current.processResult).toBeNull();
    expect(result.current.contentState).toEqual({
      status: 'error',
      error: 'new file failed',
    });
  });
});
