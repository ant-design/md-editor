import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounceFn } from '../../src/hooks/useDebounceFn';

describe('useDebounceFn', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should execute function immediately when wait is 0', async () => {
    const mockFn = vi.fn().mockResolvedValue('test result');

    const { result } = renderHook(() => useDebounceFn(mockFn, 0));

    await act(async () => {
      const promise = result.current.run('arg1', 'arg2');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      const result = await promise;
      expect(result).toBe('test result');
    });
  });

  it('should execute function immediately when wait is undefined', async () => {
    const mockFn = vi.fn().mockResolvedValue('test result');

    const { result } = renderHook(() => useDebounceFn(mockFn));

    await act(async () => {
      const promise = result.current.run('arg1', 'arg2');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      const result = await promise;
      expect(result).toBe('test result');
    });
  });

  it('should debounce function execution', async () => {
    const mockFn = vi.fn().mockResolvedValue('test result');

    const { result } = renderHook(() => useDebounceFn(mockFn, 1000));

    await act(async () => {
      // 第一次调用
      result.current.run('arg1');
      expect(mockFn).not.toHaveBeenCalled();

      // 快速连续调用
      result.current.run('arg2');
      result.current.run('arg3');

      expect(mockFn).not.toHaveBeenCalled();

      // 快进时间
      vi.advanceTimersByTime(1000);

      // 等待Promise解析
      await new Promise((resolve) => setImmediate(resolve));

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });
  });

  it('should cancel previous execution when called again', async () => {
    const mockFn = vi.fn().mockResolvedValue('test result');

    const { result } = renderHook(() => useDebounceFn(mockFn, 1000));

    await act(async () => {
      // 第一次调用
      result.current.run('arg1');

      // 快进500ms
      vi.advanceTimersByTime(500);

      // 第二次调用，应该取消第一次
      result.current.run('arg2');

      // 快进1000ms
      vi.advanceTimersByTime(1000);

      await new Promise((resolve) => setImmediate(resolve));

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg2');
    });
  });

  it('should cancel execution when cancel is called', async () => {
    const mockFn = vi.fn().mockResolvedValue('test result');

    const { result } = renderHook(() => useDebounceFn(mockFn, 1000));

    await act(async () => {
      result.current.run('arg1');

      // 取消执行
      result.current.cancel();

      // 快进时间
      vi.advanceTimersByTime(1000);

      await new Promise((resolve) => setImmediate(resolve));

      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  it('should handle async function with error', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('test error'));

    const { result } = renderHook(() => useDebounceFn(mockFn, 1000));

    await act(async () => {
      const promise = result.current.run('arg1');

      vi.advanceTimersByTime(1000);

      await expect(promise).rejects.toThrow('test error');
    });
  });

  it('should cleanup timer on unmount', () => {
    const mockFn = vi.fn();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useDebounceFn(mockFn, 1000));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
