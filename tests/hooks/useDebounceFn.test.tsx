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

  it('should return run and cancel functions', () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const { result } = renderHook(() => useDebounceFn(mockFn, 100));

    expect(typeof result.current.run).toBe('function');
    expect(typeof result.current.cancel).toBe('function');
  });

  it('should execute function immediately when wait is 0', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const { result } = renderHook(() => useDebounceFn(mockFn, 0));

    let promise: Promise<any>;
    act(() => {
      promise = result.current.run('arg1', 'arg2');
    });

    const resultValue = await promise!;

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(resultValue).toBe('test');
  });

  it('should execute function immediately when wait is undefined', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const { result } = renderHook(() => useDebounceFn(mockFn));

    let promise: Promise<any>;
    act(() => {
      promise = result.current.run('arg1', 'arg2');
    });

    const resultValue = await promise!;

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(resultValue).toBe('test');
  });

  it('should debounce function calls when wait is specified', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const { result } = renderHook(() => useDebounceFn(mockFn, 100));

    let promise1: Promise<any>;
    let promise2: Promise<any>;

    act(() => {
      promise1 = result.current.run('first');
    });

    act(() => {
      promise2 = result.current.run('second');
    });

    // 函数不应该立即执行
    expect(mockFn).not.toHaveBeenCalled();

    // 推进时间到等待时间的一半
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(mockFn).not.toHaveBeenCalled();

    // 推进时间到等待时间
    act(() => {
      vi.advanceTimersByTime(50);
    });

    const result1 = await promise1!;
    const result2 = await promise2!;

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('second');
    expect(result1).toBe('test');
    expect(result2).toBe('test');
  });

  it('should cancel previous execution when new call is made', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const { result } = renderHook(() => useDebounceFn(mockFn, 100));

    act(() => {
      result.current.run('first');
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    act(() => {
      result.current.run('second');
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('second');
  });

  it('should handle async functions correctly', async () => {
    const mockAsyncFn = vi.fn().mockImplementation(async (arg: string) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return `result: ${arg}`;
    });

    const { result } = renderHook(() => useDebounceFn(mockAsyncFn, 50));

    let promise: Promise<any>;
    act(() => {
      promise = result.current.run('test');
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const resultValue = await promise!;
    expect(resultValue).toBe('result: test');
  });

  it('should handle errors in async functions', async () => {
    const mockErrorFn = vi.fn().mockRejectedValue(new Error('test error'));
    const { result } = renderHook(() => useDebounceFn(mockErrorFn, 50));

    let promise: Promise<any>;
    act(() => {
      promise = result.current.run('test');
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    await expect(promise!).rejects.toThrow('test error');
  });

  it('should cancel execution when cancel is called', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const { result } = renderHook(() => useDebounceFn(mockFn, 100));

    act(() => {
      result.current.run('test');
    });

    act(() => {
      result.current.cancel();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const mockFn = vi.fn().mockResolvedValue('test');
    const { unmount } = renderHook(() => useDebounceFn(mockFn, 100));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should handle multiple rapid calls', async () => {
    const mockFn = vi.fn().mockResolvedValue('test');
    const { result } = renderHook(() => useDebounceFn(mockFn, 100));

    const promises: Promise<any>[] = [];

    act(() => {
      for (let i = 0; i < 5; i++) {
        promises.push(result.current.run(`call${i}`));
      }
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await Promise.all(promises);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call4');
  });
});
