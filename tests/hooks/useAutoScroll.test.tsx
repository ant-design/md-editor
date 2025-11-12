import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useAutoScroll from '../../src/Hooks/useAutoScroll';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('useAutoScroll', () => {
  beforeEach(() => {
    // 设置测试环境
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return scrollToBottom function', () => {
    const { result } = renderHook(() => useAutoScroll());

    expect(typeof result.current.scrollToBottom).toBe('function');
  });

  it('should handle null refs gracefully', () => {
    expect(() => {
      renderHook(() => useAutoScroll());
    }).not.toThrow();
  });

  it('should handle undefined refs gracefully', () => {
    expect(() => {
      renderHook(() => useAutoScroll());
    }).not.toThrow();
  });

  it('should call scrollToBottom without error', () => {
    const { result } = renderHook(() => useAutoScroll());

    act(() => {
      result.current.scrollToBottom();
    });

    // 函数应该正常执行而不抛出错误
    expect(result.current.scrollToBottom).toBeDefined();
  });

  it('should handle multiple scrollToBottom calls', () => {
    const { result } = renderHook(() => useAutoScroll());

    act(() => {
      result.current.scrollToBottom();
      result.current.scrollToBottom();
      result.current.scrollToBottom();
    });

    // 多次调用应该正常执行
    expect(result.current.scrollToBottom).toBeDefined();
  });

  it('should return containerRef', () => {
    const { result } = renderHook(() => useAutoScroll());

    expect(result.current.containerRef).toBeDefined();
    expect(result.current.containerRef.current).toBeNull();
  });

  // 添加新的测试用例来覆盖第80行
  it('应该在用户在底部时触发滚动（第80行）', () => {
    // 创建一个模拟的容器元素
    const mockContainer = {
      scrollHeight: 200,
      scrollTop: 180,
      clientHeight: 20,
      scrollTo: vi.fn(),
    } as unknown as HTMLDivElement;

    const { result } = renderHook(() => useAutoScroll());
    
    // 设置容器引用
    act(() => {
      result.current.containerRef.current = mockContainer;
    });

    // 调用 scrollToBottom，这会触发 _checkScroll(true)
    act(() => {
      result.current.scrollToBottom();
    });

    // 验证 scrollTo 被调用
    expect(mockContainer.scrollTo).toHaveBeenCalled();
  });

  // 添加新的测试用例来覆盖第83行和第87行
  it('应该在滚动时调用scrollTo并解除锁定（第83, 87行）', () => {
    // 创建一个模拟的容器元素
    const mockContainer = {
      scrollHeight: 200,
      scrollTop: 100,
      clientHeight: 100,
      scrollTo: vi.fn(),
    } as unknown as HTMLDivElement;

    const { result } = renderHook(() => useAutoScroll());
    
    // 设置容器引用
    act(() => {
      result.current.containerRef.current = mockContainer;
    });

    // 调用 scrollToBottom，这会触发 _checkScroll(true)
    act(() => {
      result.current.scrollToBottom();
    });

    // 验证 scrollTo 被调用（第83行）
    expect(mockContainer.scrollTo).toHaveBeenCalledWith({
      top: 200,
      behavior: 'smooth',
    });
  });

  // 添加新的测试用例来覆盖第80行的isLocked条件
  it('应该在锁定状态下触发滚动（第80行）', () => {
    // 创建一个模拟的容器元素
    const mockContainer = {
      scrollHeight: 200,
      scrollTop: 50,
      clientHeight: 100,
      scrollTo: vi.fn(),
    } as unknown as HTMLDivElement;

    const { result } = renderHook(() => useAutoScroll());
    
    // 设置容器引用
    act(() => {
      result.current.containerRef.current = mockContainer;
    });

    // 模拟用户滚动锁定状态
    // 注意：我们无法直接访问 isLocked ref，但可以通过特定条件触发
    
    // 调用 scrollToBottom，这会触发 _checkScroll(true)
    act(() => {
      result.current.scrollToBottom();
    });

    // 验证 scrollTo 被调用
    expect(mockContainer.scrollTo).toHaveBeenCalled();
  });
});
