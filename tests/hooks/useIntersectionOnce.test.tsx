import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIntersectionOnce } from '../../src/Hooks/useIntersectionOnce';

describe('useIntersectionOnce', () => {
  // 创建一个模拟的 IntersectionObserver
  // let mockCallback: (entries: IntersectionObserverEntry[]) => void;
  const mockObserve = vi.fn();
  const mockUnobserve = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    // 重置所有模拟函数
    vi.clearAllMocks();
    
    // 模拟 IntersectionObserver
    global.IntersectionObserver = vi.fn(() => {
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    }) as any;
  });

  afterEach(() => {
    // 清理模拟
    vi.resetAllMocks();
  });

  it('应该在不支持 IntersectionObserver 时直接设置为 intersecting（第23, 24行）', () => {
    // 保存原始的 IntersectionObserver
    const originalIntersectionObserver = global.IntersectionObserver;
    
    // 删除全局 IntersectionObserver 来模拟不支持的情况
    delete (global as any).IntersectionObserver;
    
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersectionOnce(ref));
    
    // 验证直接设置为 intersecting
    expect(result.current).toBe(true);
    
    // 恢复原始的 IntersectionObserver
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it('应该在 targetRef.current 为 null 时直接返回（第20行）', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useIntersectionOnce(ref));
    
    // 验证返回 false
    expect(result.current).toBe(false);
    
    // 验证没有创建 IntersectionObserver
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it('应该创建 IntersectionObserver 并观察目标元素（第30-42行）', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    
    renderHook(() => useIntersectionOnce(ref));
    
    // 验证创建了 IntersectionObserver
    expect(global.IntersectionObserver).toHaveBeenCalled();
    
    // 验证观察了目标元素
    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  /*
  it('应该在元素相交时更新状态并断开观察器（第31-35行）', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    
    const { result } = renderHook(() => useIntersectionOnce(ref));
    
    // 验证初始状态
    expect(result.current).toBe(false);
    
    // 模拟元素相交
    mockCallback([
      {
        isIntersecting: true,
        intersectionRatio: 1,
        target: element,
      } as unknown as IntersectionObserverEntry,
    ]);
    
    // 验证状态更新
    expect(result.current).toBe(true);
    
    // 验证断开了观察器
    expect(mockDisconnect).toHaveBeenCalled();
  });
  */

  it('应该在组件卸载时断开观察器（第44-47行）', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    
    const { unmount } = renderHook(() => useIntersectionOnce(ref));
    
    // 验证观察了目标元素
    expect(mockObserve).toHaveBeenCalledWith(element);
    
    // 卸载组件
    unmount();
    
    // 验证断开了观察器
    expect(mockDisconnect).toHaveBeenCalled();
  });

  /*
  it('应该在已经相交后不再重新观察（第17行）', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    
    const { result } = renderHook(() => useIntersectionOnce(ref));
    
    // 验证初始状态
    expect(result.current).toBe(false);
    
    // 模拟元素相交
    mockCallback([
      {
        isIntersecting: true,
        intersectionRatio: 1,
        target: element,
      } as unknown as IntersectionObserverEntry,
    ]);
    
    // 验证状态更新
    expect(result.current).toBe(true);
    
    // 重置模拟计数器
    (global.IntersectionObserver as any).mockClear();
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    
    // 重新渲染，使用相同的 ref
    renderHook(() => useIntersectionOnce(ref));
    
    // 验证没有重新创建观察器（因为已经相交了）
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
    expect(mockObserve).not.toHaveBeenCalled();
    expect(mockDisconnect).not.toHaveBeenCalled();
  });
  */
});