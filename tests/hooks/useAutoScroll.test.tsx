import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAutoScroll } from '../../src/hooks/useAutoScroll.tsx';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('useAutoScroll', () => {
  let mockRef: React.RefObject<HTMLDivElement>;
  let mockContainerRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    mockRef = {
      current: document.createElement('div'),
    };
    mockContainerRef = {
      current: document.createElement('div'),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return scrollToBottom function', () => {
    const { result } = renderHook(() =>
      useAutoScroll(mockRef, mockContainerRef),
    );

    expect(typeof result.current.scrollToBottom).toBe('function');
  });

  it('should handle null refs gracefully', () => {
    const nullRef = { current: null };

    expect(() => {
      renderHook(() => useAutoScroll(nullRef, nullRef));
    }).not.toThrow();
  });

  it('should handle undefined refs gracefully', () => {
    const undefinedRef = { current: undefined };

    expect(() => {
      renderHook(() => useAutoScroll(undefinedRef, undefinedRef));
    }).not.toThrow();
  });

  it('should call scrollTo when scrollToBottom is called', () => {
    const mockScrollTo = vi.fn();
    mockContainerRef.current = {
      scrollTo: mockScrollTo,
    } as any;

    const { result } = renderHook(() =>
      useAutoScroll(mockRef, mockContainerRef),
    );

    act(() => {
      result.current.scrollToBottom();
    });

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('should handle scrollTo with smooth behavior', () => {
    const mockScrollTo = vi.fn();
    mockContainerRef.current = {
      scrollTo: mockScrollTo,
    } as any;

    const { result } = renderHook(() =>
      useAutoScroll(mockRef, mockContainerRef),
    );

    act(() => {
      result.current.scrollToBottom();
    });

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    });
  });

  it('should handle scrollTo with instant behavior', () => {
    const mockScrollTo = vi.fn();
    mockContainerRef.current = {
      scrollTo: mockScrollTo,
    } as any;

    const { result } = renderHook(() =>
      useAutoScroll(mockRef, mockContainerRef, false),
    );

    act(() => {
      result.current.scrollToBottom();
    });

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'auto',
    });
  });

  it('should handle missing scrollTo method', () => {
    mockContainerRef.current = {} as any;

    const { result } = renderHook(() =>
      useAutoScroll(mockRef, mockContainerRef),
    );

    expect(() => {
      act(() => {
        result.current.scrollToBottom();
      });
    }).not.toThrow();
  });

  it('should handle multiple scrollToBottom calls', () => {
    const mockScrollTo = vi.fn();
    mockContainerRef.current = {
      scrollTo: mockScrollTo,
    } as any;

    const { result } = renderHook(() =>
      useAutoScroll(mockRef, mockContainerRef),
    );

    act(() => {
      result.current.scrollToBottom();
      result.current.scrollToBottom();
      result.current.scrollToBottom();
    });

    expect(mockScrollTo).toHaveBeenCalledTimes(3);
  });
});
