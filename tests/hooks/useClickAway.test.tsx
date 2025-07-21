import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import useClickAway from '../../src/hooks/useClickAway';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('useClickAway', () => {
  let mockCallback: ReturnType<typeof vi.fn>;
  let ref: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    mockCallback = vi.fn();
    ref = { current: document.createElement('div') };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call callback when clicking outside the ref element', () => {
    renderHook(() => useClickAway(mockCallback, ref));

    // 模拟点击外部元素
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalledWith(event);
  });

  it('should not call callback when clicking inside the ref element', () => {
    renderHook(() => useClickAway(mockCallback, ref));

    // 模拟点击内部元素
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'target', {
      value: ref.current,
      writable: false,
    });
    document.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not call callback when clicking on parent node', () => {
    const parentNode = document.createElement('div');
    ref.current!.parentNode = parentNode;
    
    renderHook(() => useClickAway(mockCallback, ref));

    // 模拟点击父节点
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'target', {
      value: parentNode,
      writable: false,
    });
    document.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not call callback when ref is null', () => {
    const nullRef = { current: null };
    renderHook(() => useClickAway(mockCallback, nullRef));

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not call callback when ref.current is null', () => {
    const nullCurrentRef = { current: null };
    renderHook(() => useClickAway(mockCallback, nullCurrentRef));

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() => useClickAway(mockCallback, ref));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
}); 